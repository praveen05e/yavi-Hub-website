import enum
import uuid

from sqlalchemy import (
    Column, String, Integer, Text, DateTime, ForeignKey, Enum as SAEnum, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class LeadStatus(str, enum.Enum):
    ENQUIRED = "Enquired"
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    COMPLETED = "Completed"
    REJECT = "Reject"


class LeadTier(str, enum.Enum):
    HOT = "HOT"
    WARM = "WARM"
    COLD = "COLD"


class User(Base):
    """Admin/staff users — the only accounts that can log in to /admin."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name = Column(String(120))
    phone = Column(String(20))
    email = Column(String(255))
    location = Column(String(120))
    property_type = Column(String(80))
    project_type = Column(String(80))
    property_size = Column(String(80))
    rooms = Column(String(120))
    design_style = Column(String(120))
    budget = Column(String(80))
    timeline = Column(String(80))
    requirements = Column(Text)

    lead_score = Column(Integer, default=0)
    lead_status = Column(SAEnum(LeadStatus), default=LeadStatus.ENQUIRED)
    lead_tier = Column(SAEnum(LeadTier), default=LeadTier.COLD)
    source = Column(String(80), default="Design Concierge")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    conversations = relationship("Conversation", back_populates="lead", cascade="all, delete-orphan")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    lead_id = Column(UUID(as_uuid=False), ForeignKey("leads.id"), nullable=True, index=True)
    session_id = Column(String(120), unique=True, nullable=False, index=True)
    summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    lead = relationship("Lead", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    conversation_id = Column(UUID(as_uuid=False), ForeignKey("conversations.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # "user" | "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    slug = Column(String(160), unique=True, nullable=False, index=True)
    title = Column(String(160), nullable=False)
    location = Column(String(120))
    category = Column(String(80))
    size_sqft = Column(String(40))
    year = Column(String(10))
    hero_image = Column(String(500))
    gallery = Column(Text)  # JSON-encoded list of image URLs
    concept = Column(Text)
    materials = Column(Text)
    design_approach = Column(Text)
    challenges = Column(Text)
    result = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    slug = Column(String(160), unique=True, nullable=False)
    title = Column(String(160), nullable=False)
    description = Column(Text)
    image = Column(String(500))
    order_index = Column(Integer, default=0)
