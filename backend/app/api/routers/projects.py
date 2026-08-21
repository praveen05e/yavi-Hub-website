import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/projects", tags=["projects"])


def _serialize(p: models.Project) -> schemas.ProjectOut:
    data = {
        "id": p.id, "slug": p.slug, "title": p.title, "location": p.location,
        "category": p.category, "size_sqft": p.size_sqft, "year": p.year,
        "hero_image": p.hero_image, "concept": p.concept, "materials": p.materials,
        "design_approach": p.design_approach, "challenges": p.challenges, "result": p.result,
        "gallery": json.loads(p.gallery) if p.gallery else [],
    }
    return schemas.ProjectOut(**data)


@router.get("", response_model=list[schemas.ProjectOut])
def list_projects(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Project)
    if category and category != "All":
        query = query.filter(models.Project.category == category)
    return [_serialize(p) for p in query.all()]


@router.get("/{slug}", response_model=schemas.ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    p = db.query(models.Project).filter(models.Project.slug == slug).first()
    if not p:
        raise HTTPException(404, "Project not found")
    return _serialize(p)
