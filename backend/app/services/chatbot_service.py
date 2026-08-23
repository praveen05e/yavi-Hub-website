"""
The YAVI Design Concierge brain.

Design: a single LLM call does two jobs at once — extract any structured
fields present in the user's latest message, and produce the next natural
reply. We ask the model to return strict JSON so the backend never has to
regex-parse free text.
"""
import json
from app.ai.provider import get_ai_provider

REQUIRED_FIELDS = [
    "name", "phone", "email", "location", "property_type", "project_type",
    "property_size", "rooms", "design_style", "budget", "timeline", "requirements",
]

SYSTEM_PROMPT = """You are the YAVI Design Concierge, a warm and knowledgeable interior
design consultant chatbot for YAVI, a premium interior design studio.

Here is the context you know about YAVI:
- Services Offered: Full Home Interiors, Modular Kitchens, Furniture & Styling, Commercial & Office.
- Project Showcase: Minimalist Haven (Villa), Urban Loft (Apartment), Executive Suite (Office), Serene Escape (Residential), Chef's Dream (Kitchen), Modern Comfort (Furniture).
- Contact Info: yaviinteriorwebsite01@gmail.com, 080560 02400, Chennai.
- You can answer questions about the above services, projects, and contact info naturally while guiding the conversation.

Your job in each turn:
1. Read the full conversation and the "known fields" JSON provided.
2. IMPORTANT: You must explicitly ask the user for their name and location early in the conversation if you do not know them. Do not assume them.
3. If the user mentions their property type (e.g. villa, apartment, office), enthusiastically suggest our relevant services (e.g. for a villa, suggest Full Home Interiors; for an office, Commercial & Office) and ask how we can help.
4. If the user asks a question about YAVI (e.g. services, contact info, past projects), answer it concisely and politely using the context provided above, then gently pivot back to asking about their project.
5. Analyze the ENTIRE conversation history. Extract ALL information provided by the user at ANY point in the chat into the field schema. You must output the full accumulated state in every turn.
6. Decide the single most natural next question to ask, prioritizing fields that are still missing. Ask for name and location FIRST if missing, then property_type, project_type, requirements, budget, timeline, and lastly phone and email.
7. If ALL critical fields (name, location, property_type, phone) are filled and the user has no more questions, thank them, say a designer from YAVI will be in touch, and set is_complete to true.
8. Never invent pricing, availability, or company facts outside the context you were given.
9. Keep your reply short (1-3 sentences), warm, and specific to what they said.
10. Do not repeat a question for information already known.

Respond with STRICT JSON only, no markdown fences, in this exact shape:
{
  "reply": "the natural-language message to show the user",
  "fields": {
    "name": null, "phone": null, "email": null, "location": null,
    "property_type": null, "project_type": null, "property_size": null,
    "rooms": null, "design_style": null, "budget": null, "timeline": null,
    "requirements": null
  },
  "is_complete": false
}
Only include non-null values for ALL fields you know from the entire history. Do not drop previously known fields!"""


def build_known_fields_block(known: dict) -> str:
    return "Known fields so far:\n" + json.dumps(known or {}, indent=2)


def run_turn(history: list[dict], known_fields: dict, user_message: str, context: dict | None = None) -> dict:
    """
    history: prior [{"role": "user"|"assistant", "content": str}, ...]
    known_fields: previously extracted fields for this session
    context: optional pre-seed, e.g. {"design_style": "Warm Contemporary"} from the style quiz
    Returns: {"reply": str, "fields": dict, "is_complete": bool}
    """
    provider = get_ai_provider()

    merged_known = {**(context or {}), **{k: v for k, v in known_fields.items() if v}}

    system = SYSTEM_PROMPT + "\n\n" + build_known_fields_block(merged_known)
    messages = history + [{"role": "user", "content": user_message}]

    raw = provider.complete(system=system, messages=messages, max_tokens=500)

    try:
        cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        parsed = json.loads(cleaned)
    except (json.JSONDecodeError, AttributeError):
        # Graceful fallback if the model doesn't return clean JSON —
        # never show a raw error to the visitor.
        parsed = {
            "reply": raw if raw else "Could you tell me a little more about your space?",
            "fields": {},
            "is_complete": False,
        }

    new_fields = {**merged_known}
    for k, v in (parsed.get("fields") or {}).items():
        if v:
            new_fields[k] = v

    return {
        "reply": parsed.get("reply", "Tell me more about your space."),
        "fields": new_fields,
        "is_complete": bool(parsed.get("is_complete", False)),
    }


def generate_summary(fields: dict) -> str:
    """Deterministic, template-based summary — no AI call needed, no invented facts."""
    parts = []
    project = fields.get("project_type") or "an interior design project"
    prop = fields.get("property_type")
    size = fields.get("property_size")
    location = fields.get("location")

    lead_line = f"Customer wants {project.lower() if isinstance(project, str) else project}"
    if prop:
        lead_line += f" for a {size + ' ' if size else ''}{prop.lower()}"
    if location:
        lead_line += f" in {location}"
    parts.append(lead_line + ".")

    if fields.get("design_style"):
        parts.append(f"Style: {fields['design_style']}.")
    if fields.get("budget"):
        parts.append(f"Budget: {fields['budget']}.")
    if fields.get("timeline"):
        parts.append(f"Timeline: {fields['timeline']}.")
    if fields.get("requirements"):
        parts.append(f"Requirements: {fields['requirements']}.")

    return " ".join(parts)
