from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app import models, schemas, security
from app.services.lead_scoring import score_lead
from app.rate_limit import limiter

router = APIRouter(prefix="/api", tags=["leads"])


@router.post("/leads", response_model=schemas.LeadOut)
@limiter.limit("10/minute")
def create_lead(request: Request, payload: schemas.LeadCreate, db: Session = Depends(get_db)):
    """Public endpoint — used by the contact form and as a chatbot fallback."""
    fields = payload.model_dump()
    score, tier = score_lead(fields)

    lead = models.Lead(**fields, lead_score=score, lead_tier=tier)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


# ---------- Admin-only below ----------

@router.get("/admin/leads", response_model=schemas.LeadListOut)
def list_leads(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(security.get_current_admin),
):
    query = db.query(models.Lead)
    if status_filter:
        query = query.filter(models.Lead.lead_status == status_filter)
    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(models.Lead.name.ilike(like), models.Lead.phone.ilike(like),
                models.Lead.email.ilike(like), models.Lead.location.ilike(like))
        )
    total = query.count()
    items = query.order_by(models.Lead.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return schemas.LeadListOut(total=total, items=items)


@router.get("/admin/leads/{lead_id}", response_model=schemas.LeadOut)
def get_lead(lead_id: str, db: Session = Depends(get_db), _admin: models.User = Depends(security.get_current_admin)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    return lead


@router.patch("/admin/leads/{lead_id}/status", response_model=schemas.LeadOut)
def update_lead_status(
    lead_id: str,
    payload: schemas.LeadStatusUpdate,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(security.get_current_admin),
):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    valid = {s.value for s in models.LeadStatus}
    if payload.lead_status not in valid:
        raise HTTPException(400, f"lead_status must be one of {sorted(valid)}")
    lead.lead_status = payload.lead_status
    db.commit()
    db.refresh(lead)
    return lead


@router.get("/admin/leads/{lead_id}/conversations", response_model=list[schemas.ConversationOut])
def get_lead_conversations(
    lead_id: str, db: Session = Depends(get_db), _admin: models.User = Depends(security.get_current_admin)
):
    return db.query(models.Conversation).filter(models.Conversation.lead_id == lead_id).all()
@router.delete("/admin/leads/{lead_id}")
def delete_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(security.get_current_admin),
):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    db.delete(lead)
    db.commit()
    return {"status": "success"}



@router.get("/admin/dashboard", response_model=schemas.DashboardStats)
def dashboard_stats(db: Session = Depends(get_db), _admin: models.User = Depends(security.get_current_admin)):
    q = db.query(models.Lead)
    return schemas.DashboardStats(
        total_leads=q.count(),
        enquired_leads=q.filter(models.Lead.lead_status == models.LeadStatus.ENQUIRED).count(),
        pending_leads=q.filter(models.Lead.lead_status == models.LeadStatus.PENDING).count(),
        confirmed_leads=q.filter(models.Lead.lead_status == models.LeadStatus.CONFIRMED).count(),
        completed_leads=q.filter(models.Lead.lead_status == models.LeadStatus.COMPLETED).count(),
        reject_leads=q.filter(models.Lead.lead_status == models.LeadStatus.REJECT).count(),
        hot_leads=q.filter(models.Lead.lead_tier == models.LeadTier.HOT).count(),
    )
