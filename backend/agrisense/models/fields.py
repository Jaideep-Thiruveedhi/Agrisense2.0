from sqlmodel import SQLModel, Field
from typing import Optional
import uuid

class Farmer(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    tenant_id: str = Field(index=True)
    email: str = Field(index=True)
    preferred_language: str = Field(default="en")

class Field(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    farmer_id: str = Field(foreign_key="farmer.id", index=True)
    tenant_id: str = Field(index=True)
    name: str
    area_ha: float
    lat: float; lon: float
    version: int = Field(default=1)

class Season(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    field_id: str = Field(foreign_key="field.id")
    tenant_id: str
    crop: str
    status: str = Field(default="active")  # planned|active|closed
    allocated_area_ha: float
    version: int = Field(default=1)

class JournalEntryModel(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    season_id: str = Field(foreign_key="season.id", index=True)
    tenant_id: str
    action: str
    occurred_at: str
    text: Optional[str] = None

class OutboxEvent(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    aggregate_id: str
    event_type: str  # field.updated, journal.confirmed, recommendation.issued, season.closed
    payload: str
    created_at: str
    claimed: bool = Field(default=False)
