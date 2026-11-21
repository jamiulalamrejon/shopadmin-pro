# ShopAdmin Pro – E-commerce Business Dashboard (Next.js)

> Developed by [www.Jamiulalamrejon.com](https://www.Jamiulalamrejon.com)

A complete, secured business dashboard for an online store, with demo data in US dollars. Clean modern design: soft-shadow cards, blue accent, gradient charts and tile icons.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · jose (JWT) · bcryptjs · zod · lucide-react. No database needed for the demo.

## Quick start

```bash
npm install
cp .env.example .env.local        # then put a secret in AUTH_SECRET
npm run gen-secret                # prints a random secret to paste into .env.local
npm run dev                       # open http://localhost:3000
```

### Demo accounts

| Email | Password | Role |
|---|---|---|
| admin@demo.com | Admin@123 | Super admin (everything) |
| manager@demo.com | Manager@123 | Manager (no staff/settings) |
| editor@demo.com | Editor@123 | Content editor (products, blog, AI) |
| support@demo.com | Support@123 | Customer support (orders, customers, SMS, AI) |

Sign in with different roles to see the menu and pages change.

## Features

**Overview**
- **Dashboard** – today's sales, visitors, new customers, monthly revenue; active-buyers chart; revenue vs profit; projects; business timeline; monthly goal ring; profit snapshot; conversion funnel; "needs attention" alerts; recent orders; AI insights; quick SMS.
- **Reports** – monthly revenue/orders, revenue by category, payment methods, sales by city, top customers.
- **Finance** – profit and loss statement, cash flow chart, expenses by category, expense tracking, accounts receivable.

**Sales**
- **Orders**, **Customers** – search, filters, add/edit/delete, CSV export.
- **Invoices** – mark as paid, printable invoice view (print or save as PDF).
- **Shipping** – parcel tracking, carrier on-time rate and average cost.

**Catalog**
- **Products** – price, unit cost, margin %, AI-written descriptions.
- **Inventory** – multi-warehouse capacity, reorder suggestions (days of stock left), stock movement history.
- **Purchasing** – suppliers (lead time, rating, balance) and purchase orders with one-click "Receive".

**Growth**
- **Marketing** – coupons, campaigns and abandoned-cart recovery.
- **SMS** – single, list and campaign sending, templates, delivery log. Providers: `demo`, `twilio`, `bulksmsbd`.
- **AI assistant** – chat plus "Write with AI" for product copy, blog posts, SMS and support replies. Providers: `demo`, `anthropic`, `openai`.
- **Blog**, **Reviews** (approve, hide, rating breakdown).

**Team**
- **Projects** – budgets, team, completion progress.
- **Support desk** – tickets by channel and priority, assign, resolve, AI reply drafts.
- **Staff and roles**, **Activity log**, **Settings** (store, security, payments, integrations).

## Security built in

| Protection | Where |
|---|---|
| Signed JWT session in an `httpOnly`, `SameSite=Strict`, `Secure` (in production) cookie, 8 h expiry | `lib/session.ts` |
| Passwords hashed with bcrypt (cost 12); constant response for wrong email/password | `app/api/auth/login/route.ts` |
| Brute-force protection: 5 attempts per account and 20 per IP per 15 min | `lib/rate-limit.ts` |
| Every page and API checked twice: proxy (route level) + server (permission level) | `proxy.ts`, `lib/auth.ts` |
| Role-based access control with 24 permissions and 4 roles | `lib/rbac.ts` |
| CSRF defence: API calls must come from the same origin | `lib/security.ts` |
| Input validation with zod and body size limits on every API | `app/api/**` |
| Per-user rate limits on SMS (20/min) and AI (15/min) | `lib/security.ts` |
| Security headers: CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy | `next.config.ts` |
| API keys stay on the server; settings page only shows "connected / demo" | `lib/sms.ts`, `lib/ai.ts` |
| Password hashes never sent to the browser | `publicStaff()` in `lib/demo-data.ts` |
| AI system prompts are fixed on the server (browser can only choose a task) | `lib/ai.ts` |
| Open-redirect protection on the login `?next=` parameter | `app/login/page.tsx` |
| No indexing by search engines (robots + `X-Robots-Tag`) | `app/robots.ts` |

## Connect real SMS and AI

In `.env.local`:

```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM=+1XXXXXXXXXX

AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

Restart `npm run dev`. The badges on the SMS and AI pages turn green. Phone numbers use international format (+14155550123); local Bangladeshi numbers (01XXXXXXXXX) also work. For BulkSMSBD or another gateway, check its docs and edit `lib/sms.ts`.

## Before going live (production checklist)

1. Replace `lib/demo-data.ts` with a database (PostgreSQL + Prisma/Drizzle). Table changes in this demo are kept in the browser only.
2. Change or delete the demo accounts. Create real hashes with `npm run hash-password -- "NewStrongPassword"`.
3. Set a strong `AUTH_SECRET` (the app refuses to start in production without one).
4. Serve over HTTPS only (Coolify, Nginx or Vercel). Keep `ALLOW_INSECURE_HTTP=false`.
5. Move rate limits and the audit log to Redis/database if you run more than one server.
6. Add real two-factor authentication (TOTP) for staff accounts.
7. Run `npm audit` regularly and keep Next.js updated.

## Project structure

```
app/
  (admin)/        all signed-in pages (dashboard, orders, products, ...)
  api/            auth, sms, ai endpoints
  login/          sign-in page
components/       UI kit, charts, table manager, shell, toasts
lib/              auth, session, rbac, security, sms, ai, audit, demo data
proxy.ts          route protection (Next.js 16 "middleware")
```

---
Developed by **Jamiul Alam Rejon** – [www.Jamiulalamrejon.com](https://www.Jamiulalamrejon.com)

## Mobile

- Bottom tab bar, slide-out menu, phone search and notification sheet.
- Tables become cards on phones; forms open as bottom sheets; inputs use 16px text so iPhone doesn't zoom.
- Wide charts can be swiped sideways on small screens.
- Installable: open the site on a phone and choose "Add to Home Screen" (`app/manifest.ts`).
- Safe-area support for iPhone notch and home bar.
