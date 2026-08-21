from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.services import chatbot_service
from app.services.lead_scoring import score_lead
from app.rate_limit import limiter

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])


def _get_or_create_conversation(db: Session, session_id: str) -> models.Conversation:
    convo = db.query(models.Conversation).filter(models.Conversation.session_id == session_id).first()
    if not convo:
        convo = models.Conversation(session_id=session_id)
        db.add(convo)
        db.commit()
        db.refresh(convo)
    return convo


def _known_fields_from_lead(lead: models.Lead | None) -> dict:
    if not lead:
        return {}
    return {
        f: getattr(lead, f, None)
        for f in chatbot_service.REQUIRED_FIELDS
    }


@router.post("/message", response_model=schemas.ChatMessageOut)
@limiter.limit("20/minute")
def send_message(request: Request, payload: schemas.ChatMessageIn, db: Session = Depends(get_db)):
    try:
        convo = _get_or_create_conversation(db, payload.session_id)

        history = [{"role": m.role, "content": m.content} for m in convo.messages]
        lead = convo.lead
        known_fields = _known_fields_from_lead(lead)

        # persist the incoming user message
        db.add(models.Message(conversation_id=convo.id, role="user", content=payload.message))
        db.commit()

        result = chatbot_service.run_turn(
            history=history,
            known_fields=known_fields,
            user_message=payload.message,
            context=payload.context,
        )

        db.add(models.Message(conversation_id=convo.id, role="assistant", content=result["reply"]))

        score, tier = score_lead(result["fields"])

        if not lead:
            lead = models.Lead(**{k: v for k, v in result["fields"].items() if k in chatbot_service.REQUIRED_FIELDS},
                                lead_score=score, lead_tier=tier)
            db.add(lead)
            db.flush()
            convo.lead_id = lead.id
        else:
            for k, v in result["fields"].items():
                if v and k in chatbot_service.REQUIRED_FIELDS:
                    setattr(lead, k, v)
            lead.lead_score = score
            lead.lead_tier = tier

        if result["is_complete"]:
            convo.summary = chatbot_service.generate_summary(result["fields"])

        db.commit()

        return schemas.ChatMessageOut(
            session_id=payload.session_id,
            reply=result["reply"],
            extracted_fields=result["fields"],
            is_complete=result["is_complete"],
            lead_score=score,
            lead_tier=tier,
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        # Never leak raw errors to the visitor — graceful fallback per spec.
        raise HTTPException(
            status_code=503,
            detail="The Design Concierge is temporarily unavailable. Please use the contact form instead.",
        )
