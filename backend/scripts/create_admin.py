"""
Run once after the database is migrated:
    python -m scripts.create_admin
Creates (or updates the password of) the admin user defined by
ADMIN_EMAIL / ADMIN_PASSWORD in .env.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal, Base, engine
from app import models, security
from app.config import settings


def main():
    # Dev convenience: ensure tables exist. In production, run Alembic
    # migrations before this script instead of relying on create_all.
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == settings.admin_email).first()
        if existing:
            existing.hashed_password = security.hash_password(settings.admin_password)
            print(f"Updated password for existing admin: {settings.admin_email}")
        else:
            user = models.User(
                name="YAVI Admin",
                email=settings.admin_email,
                hashed_password=security.hash_password(settings.admin_password),
                role="admin",
            )
            db.add(user)
            print(f"Created admin user: {settings.admin_email}")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()
