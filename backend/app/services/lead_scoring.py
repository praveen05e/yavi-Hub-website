"""
Lead scoring. Weights are configurable in one place (SCORING_WEIGHTS) so
sales/marketing can tune them without touching the chatbot logic.
"""

SCORING_WEIGHTS = {
    "phone": 20,
    "email": 10,
    "budget": 20,
    "timeline": 15,
    "property_type": 10,
    "project_type": 10,
    "design_style": 5,
    "requirements": 10,
}

HOT_THRESHOLD = 70
WARM_THRESHOLD = 40


def score_lead(fields: dict) -> tuple[int, str]:
    """fields: dict of lead attributes (any may be None/empty)."""
    score = 0
    for field, weight in SCORING_WEIGHTS.items():
        value = fields.get(field)
        if value:
            score += weight

    score = min(score, 100)

    if score >= HOT_THRESHOLD:
        tier = "HOT"
    elif score >= WARM_THRESHOLD:
        tier = "WARM"
    else:
        tier = "COLD"

    return score, tier
