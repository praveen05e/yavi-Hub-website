from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, field_validator
import re

# ---------- Auth ----------

class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Leads ----------

INDIAN_PHONE_RE = re.compile(r"^(\+91[\-\s]?)?[6-9]\d{9}$")


class LeadBase(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    project_type: Optional[str] = None
    property_size: Optional[str] = None
    rooms: Optional[str] = None
    design_style: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    requirements: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v and not INDIAN_PHONE_RE.match(v.replace(" ", "")):
            raise ValueError("Enter a valid Indian phone number")
        return v


class LeadCreate(LeadBase):
    name: str
    phone: str
    source: Optional[str] = "Contact Form"


class LeadStatusUpdate(BaseModel):
    lead_status: str


class LeadOut(LeadBase):
    id: str
    lead_score: int
    lead_status: str
    lead_tier: str
    source: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LeadListOut(BaseModel):
    total: int
    items: List[LeadOut]


# ---------- Chatbot ----------

class ChatMessageIn(BaseModel):
    session_id: str
    message: str
    # Optional context pre-seeded from the "Find Your Style" quiz etc.
    context: Optional[dict] = None


class ChatMessageOut(BaseModel):
    session_id: str
    reply: str
    extracted_fields: dict
    is_complete: bool
    lead_score: Optional[int] = None
    lead_tier: Optional[str] = None


class MessageOut(BaseModel):
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationOut(BaseModel):
    id: str
    session_id: str
    summary: Optional[str]
    lead_id: Optional[str]
    created_at: datetime
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True


# ---------- Projects ----------

class ProjectOut(BaseModel):
    id: str
    slug: str
    title: str
    location: Optional[str]
    category: Optional[str]
    size_sqft: Optional[str]
    year: Optional[str]
    hero_image: Optional[str]
    gallery: Optional[List[str]] = []
    concept: Optional[str]
    materials: Optional[str]
    design_approach: Optional[str]
    challenges: Optional[str]
    result: Optional[str]

    class Config:
        from_attributes = True


# ---------- Dashboard ----------

class DashboardStats(BaseModel):
    total_leads: int
    enquired_leads: int
    pending_leads: int
    confirmed_leads: int
    completed_leads: int
    reject_leads: int
    hot_leads: int
