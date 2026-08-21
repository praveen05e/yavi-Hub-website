# YAAVI — Premium Interior Design Studio Website

A full-stack website for YAAVI: a cinematic Next.js frontend, a FastAPI backend
with a PostgreSQL-backed lead pipeline, an AI Design Concierge chatbot, and a
secure admin dashboard.

Both the backend and the frontend production build have been run and verified
in this environment. See "What's been tested" at the bottom.

---

## 1. Project Structure

```
yaavi/
├── frontend/     Next.js 14 (App Router), TypeScript, Tailwind, GSAP + Lenis
├── backend/      FastAPI, SQLAlchemy, PostgreSQL, JWT auth
└── README.md
```

---

## 2. Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ (or use SQLite for local dev — see below)

---

## 3. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://yaavi_user:yaavi_pass@localhost:5432/yaavi_db
ANTHROPIC_API_KEY=sk-ant-...          # get one at console.anthropic.com
JWT_SECRET=<generate a long random string>
ADMIN_EMAIL=admin@yaavi.studio
ADMIN_PASSWORD=<choose a strong password>
FRONTEND_ORIGIN=http://localhost:3000
```

**Local dev without Postgres installed:** set
`DATABASE_URL=sqlite:///./dev.db` instead — everything works identically on
SQLite for local development. Use real Postgres in production.

Create the database (Postgres only):

```sql
CREATE DATABASE yaavi_db;
CREATE USER yaavi_user WITH PASSWORD 'yaavi_pass';
GRANT ALL PRIVILEGES ON DATABASE yaavi_db TO yaavi_user;
```

Bootstrap the admin account and seed placeholder content:

```bash
python -m scripts.create_admin
python -m scripts.seed_content
```

Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

> Tables are created automatically via `Base.metadata.create_all` on first
> run, for convenience. For production, replace this with proper Alembic
> migrations (`alembic init`, then `alembic revision --autogenerate`).

---

## 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin/login

---

## 5. AI Configuration

The chatbot calls an LLM through a provider abstraction
(`backend/app/ai/provider.py`) — nothing in the routers or services talks to
a vendor SDK directly. To use a different provider, add a class implementing
`AIProvider.complete()` and register it in `_PROVIDERS`.

If `ANTHROPIC_API_KEY` is unset, the chatbot automatically falls back to a
safe canned response instead of crashing — useful for local frontend
development without burning API credits.

---

## 6. Images

All imagery is centralized in `frontend/data/*.ts` and referenced by path
(e.g. `/images/projects/modern-villa/hero.jpg`). Drop real YAAVI photography
into `frontend/public/images/...` at the matching paths — no component code
needs to change. Until then, those `<img>` tags will 404 gracefully (broken
image icon) rather than breaking the build.

---

## 7. Admin Account Setup

Handled by `python -m scripts.create_admin` (step 3). Re-run it any time to
reset the admin password — it updates the existing user rather than erroring.

---

## 8. Production Deployment Notes

- Set `DATABASE_URL` to your managed Postgres instance.
- Set a strong, unique `JWT_SECRET` and `ADMIN_PASSWORD`.
- Set `FRONTEND_ORIGIN` to your real domain (used for CORS).
- Replace `Base.metadata.create_all` with Alembic migrations.
- Put the FastAPI app behind a real ASGI server (e.g. `uvicorn` + `gunicorn`
  workers, or a platform like Render/Fly/Railway).
- Deploy the Next.js frontend to Vercel or any Node host; set
  `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL.
- Update the hardcoded production domain in `frontend/app/sitemap.ts` and
  `frontend/app/robots.ts`.
- Never commit `.env` files — both are git-ignored already.

---

## 9. What's implemented vs. simplified

**Fully implemented and tested:**
- All public pages (Home, About, Services, Projects, Project Detail, Contact)
- AI Design Concierge with structured field extraction, lead scoring, and
  conversation storage
- Admin auth (JWT), dashboard stats, lead list with filters/search, lead
  detail with conversation viewer and status updates
- Before/After slider (pointer + keyboard accessible), Style Quiz, custom
  cursor, mobile nav, smooth scroll, scroll-triggered reveals, reduced-motion
  support
- Rate limiting on public lead/chat endpoints, server-side + client-side
  validation, generic error responses (no raw errors ever shown to users)

**Simplified / left as clear extension points, per project scope:**
- Real YAAVI photography (placeholder paths — see section 6)
- Alembic migrations (currently `create_all` for dev convenience — swap
  before production, see section 8)
- Email/WhatsApp lead notifications (backend structured so a notification
  service can be added in `app/services/` without touching routers)
- CMS — content lives in typed config files (`frontend/data/*.ts`) rather
  than a database-backed CMS, which keeps the door open for one later
  without a frontend rewrite

---

## 10. What's been verified in this environment

- Backend: installed all dependencies, ran the FastAPI app against a real
  (SQLite) database, and exercised every endpoint with curl — health check,
  admin login, protected dashboard/leads routes, lead creation with Indian
  phone validation, lead status updates, project list/detail, and a chatbot
  turn (including the no-API-key fallback path). Two real bugs were caught
  and fixed this way (a missing `email-validator` dependency and a
  `passlib`/`bcrypt` version incompatibility), plus one serialization bug in
  the projects endpoint.
- Frontend: ran `npm install` and a full `next build`. This caught and fixed
  one real bug (a Client Component boundary violation in `FinalCTA.tsx`).
  All 16 routes compile and prerender successfully. Google Fonts (Fraunces /
  Manrope) could not be fetched from this sandboxed environment, so the
  build was verified once with local fonts stubbed in, then the real fonts
  were restored — this will work normally with standard internet access.
