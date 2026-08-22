# Vercel Environment Variables & Custom Domain Cheat Sheet

Here is the exact structure of environment variables for both projects, followed by instructions on how to link your custom domains.

---

## 1. Environment Variable Structure

### A. Backend Project (`yavi-backend` on Vercel)
Go to your **Backend Project** -> **Settings** -> **Environment Variables** and add:

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.lsccynqgxzzbjpmjohal:DYuvPHkGJjTJXNDw@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres` | Your Supabase Session Connection Pooler URI (IPv4 compatible). |
| `JWT_SECRET` | `yavi_super_secret_jwt_key_2026` | Any long random string to sign logins securely. |
| `JWT_ALGORITHM` | `HS256` | The hashing algorithm. |
| `JWT_EXPIRE_MINUTES` | `480` | Logins stay active for 8 hours. |
| `ADMIN_EMAIL` | `admin@yavi.studio` | Email to log into the `/admin` dashboard. |
| `ADMIN_PASSWORD` | `your_secure_password` | Password to log into the `/admin` dashboard. |
| `AI_PROVIDER` | `openai` | Use `openai` to activate the real AI chatbot. |
| `AI_MODEL` | `gpt-4o-mini` | Recommended lightweight model for the chatbot. |
| `OPENAI_API_KEY` | `sk-proj-xxxx...` | Your official OpenAI API Key. |
| `FRONTEND_ORIGIN` | `https://yaviinteriors.com` | **Your final custom domain** (or Vercel preview domain) for the frontend. *No trailing slash.* |

---

### B. Frontend Project (`yavi-frontend` on Vercel)
Go to your **Frontend Project** -> **Settings** -> **Environment Variables** and add:

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.yaviinteriors.com` | **Your final custom domain** (or Vercel preview domain) pointing to the backend. *No trailing slash.* |

---

## 2. Linking a Custom Domain on Vercel

If you own a custom domain (e.g. `yaviinteriors.com` or `yaviinteriors.in`), you can link it so that your frontend loads at `yaviinteriors.com` and your backend loads at `api.yaviinteriors.com`.

### A. Link Frontend (Main Website)
1. In the Vercel Dashboard, open your **`yavi-frontend`** project.
2. Go to **Settings** -> **Domains**.
3. Type in your domain: `yaviinteriors.com` and click **Add**.
4. Vercel will ask you to select whether you want to redirect `www.yaviinteriors.com` to `yaviinteriors.com` (recommended). Select **Yes**.
5. Vercel will show you the DNS settings to add to your Domain Registrar (GoDaddy, Namecheap, Google Domains, etc.):
   * **Type:** `A` | **Name:** `@` | **Value:** `76.76.21.21`
   * **Type:** `CNAME` | **Name:** `www` | **Value:** `cname.vercel-dns.com`

---

### B. Link Backend (API Subdomain)
1. In the Vercel Dashboard, open your **`yavi-backend`** project.
2. Go to **Settings** -> **Domains**.
3. Type in your subdomain: `api.yaviinteriors.com` and click **Add**.
4. Vercel will show you the CNAME record to add to your Domain Registrar:
   * **Type:** `CNAME` | **Name:** `api` | **Value:** `cname.vercel-dns.com`

---

> [!TIP]
> After you update the DNS records at your registrar, it may take 5–15 minutes for Vercel to generate the free SSL certificate and verify the configuration. Once verified, both links will work securely (`https://`)!
