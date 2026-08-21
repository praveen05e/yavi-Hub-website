"""
Seeds placeholder project/service content so the site has something to
render before real YAVI photography and copy are supplied.
Run: python -m scripts.seed_content
"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal, Base, engine
from app import models


Base.metadata.create_all(bind=engine)

PROJECTS = [
    {
        "slug": "modern-villa-chennai",
        "title": "Modern Villa",
        "location": "Chennai",
        "category": "Villa",
        "size_sqft": "1,850",
        "year": "2026",
        "hero_image": "/images/projects/modern-villa/hero.jpg",
        "gallery": ["/images/projects/modern-villa/1.jpg", "/images/projects/modern-villa/2.jpg"],
        "concept": "A warm, material-led villa design built around natural light.",
        "materials": "Oak, honed marble, brushed brass.",
        "design_approach": "Open-plan living anchored by a sculptural staircase.",
        "challenges": "Integrating a double-height living space without losing warmth.",
        "result": "A calm, editorial family home.",
    },
    {
        "slug": "contemporary-apartment-3bhk",
        "title": "3BHK Apartment Transformation",
        "location": "Chennai",
        "category": "Apartment",
        "size_sqft": "1,400",
        "year": "2026",
        "hero_image": "/images/projects/apartment/hero.jpg",
        "gallery": ["/images/projects/apartment/1.jpg", "/images/projects/apartment/2.jpg"],
        "concept": "From an empty shell to a warm contemporary home.",
        "materials": "Veneer, terrazzo, linen.",
        "design_approach": "Zoned living and dining with custom modular furniture.",
        "challenges": "Maximizing storage without visual clutter.",
        "result": "A functional, light-filled family apartment.",
    },
]

SERVICES = [
    {"slug": "residential-interiors", "title": "Residential Interiors", "order_index": 1,
     "description": "Full home interiors shaped around how you live."},
    {"slug": "villa-interiors", "title": "Villa Interiors", "order_index": 2,
     "description": "Large-format spatial design for independent homes."},
    {"slug": "apartment-interiors", "title": "Apartment Interiors", "order_index": 3,
     "description": "Space-efficient, editorial apartment design."},
    {"slug": "modular-kitchens", "title": "Modular Kitchens", "order_index": 4,
     "description": "Custom kitchen systems built for daily use."},
    {"slug": "custom-furniture", "title": "Custom Furniture", "order_index": 5,
     "description": "Bespoke furniture pieces made for your space."},
    {"slug": "commercial-interiors", "title": "Commercial Interiors", "order_index": 6,
     "description": "Interiors for retail and hospitality spaces."},
    {"slug": "office-interiors", "title": "Office Interiors", "order_index": 7,
     "description": "Workspaces designed for focus and culture."},
    {"slug": "turnkey-solutions", "title": "Turnkey Interior Solutions", "order_index": 8,
     "description": "End-to-end execution from concept to handover."},
]


def main():
    db = SessionLocal()
    try:
        for p in PROJECTS:
            if not db.query(models.Project).filter_by(slug=p["slug"]).first():
                gallery = p.pop("gallery")
                db.add(models.Project(**p, gallery=json.dumps(gallery)))
        for s in SERVICES:
            if not db.query(models.Service).filter_by(slug=s["slug"]).first():
                db.add(models.Service(**s))
        db.commit()
        print("Seeded projects and services.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
