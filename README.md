# Linky

LinkedIn content planning tool. Plan, write, and schedule posts in a vertical timeline. One-click copy when ready to publish.

Forked from: GMtnezS Starter Template (Auth0 + Supabase + Cloudinary + Next.js 15 + TDD)

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Styling | Tailwind CSS v3 |
| Auth | @auth0/nextjs-auth0 v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Images | Cloudinary (unsigned upload) |
| Testing | Vitest + React Testing Library + MSW v2 |
| Deployment | Vercel |

---

## Setup

```bash
git clone <repo> linky
cd linky
npm install
cp .env.example .env.local
# Fill in .env.local — see Forking Checklist below
npm run dev
```

---

## Forking Checklist

- [ ] Clone, rename, push to new GitHub repo
- [ ] `npm install`
- [ ] Auth0: create Regular Web Application
- [ ] Auth0: create API, note the Identifier for `AUTH0_AUDIENCE`
- [ ] Auth0: authorize app for User Access on the API
- [ ] Auth0: set callback URL to `/auth/callback` (not `/api/auth/callback`)
- [ ] Auth0: turn JWE OFF (Advanced Settings → OAuth)
- [ ] Supabase: create new project
- [ ] Supabase: Authentication → Sign In / Providers → Third-Party Auth → Add Auth0
- [ ] Supabase: Settings → Data API → enable Data API + automatic RLS
- [ ] Supabase: run `supabase-schema.sql` in SQL editor
- [ ] Cloudinary: create unsigned upload preset (or reuse existing)
- [ ] Fill in `.env.local`
- [ ] `npm test` → confirm 0 failures
- [ ] Connect to Vercel
- [ ] Add Vercel URLs to Auth0 (callback + logout) and Supabase (allowed origins)

---

## Dev Commands

```bash
npm run dev          # local dev
npm test             # vitest watch mode
npm run test:ui      # vitest UI
npm run test:coverage
npm run build
```

---

## Project Structure

```
linky/
├── app/
│   ├── dashboard/page.tsx       # Protected timeline page (Server Component)
│   ├── globals.css
│   ├── layout.tsx               # Root layout + Auth0Provider
│   └── page.tsx                 # Auth gate → /dashboard
├── components/
│   ├── Timeline/
│   │   ├── TimelineClient.tsx   # Main interactive timeline ('use client')
│   │   ├── PostPreview.tsx      # Post card
│   │   └── PostPreview.test.jsx
│   ├── Modal/
│   │   ├── PostModal.tsx        # Create/edit modal
│   │   └── PostModal.test.jsx
│   └── ui/
│       └── SkeletonCard.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── usePosts.test.js
├── lib/
│   ├── auth0.ts
│   ├── supabase.ts
│   └── cloudinary.ts
├── services/
│   ├── posts.service.ts
│   └── posts.service.test.js
├── src/
│   ├── mocks/
│   │   ├── handlers.js          # MSW handlers (Linky-specific)
│   │   └── server.js
│   └── setupTests.js
├── middleware.ts                 # Auth0 v4 middleware
├── supabase-schema.sql           # Run once in Supabase SQL editor
└── .env.example
```

---

## V1 Definition of Done

- [ ] Auth0 login/logout works
- [ ] Timeline loads posts from Supabase in correct order
- [ ] `+` button opens empty modal
- [ ] Double-click card opens pre-filled modal
- [ ] Save creates/updates post in Supabase
- [ ] Delete removes post from Supabase
- [ ] Copy to clipboard works with "Copied!" feedback
- [ ] Image upload to Cloudinary works, URL saved to Supabase
- [ ] ▲/▼ reordering persists to Supabase
- [ ] Empty state shown when no posts
- [ ] Validation error shown on empty save
- [ ] Deployed on Vercel with live URL
- [ ] Accessible from mobile browser
- [ ] All tests passing (`npm test`)

---

## Known Gotchas (inherited from template)

| Issue | Fix |
|---|---|
| JWE token (5-part JWT) | Set `AUTH0_AUDIENCE` + authorize app for User Access on the API + turn JWE OFF |
| Auth0 v4 callback URL | `/auth/callback` not `/api/auth/callback` |
| Auth0 must be Regular Web App | Not SPA |
| `AUTH0_SECRET` is self-generated | `openssl rand -hex 32` — not from Auth0 dashboard |
| Supabase rejects token | Must add Auth0 tenant in Third-Party Auth first |
| `supabaseUrl` error in tests | Mock `@/lib/supabase` — Supabase validates URL before any HTTP call |
| Client components + Supabase | Don't — all DB access through Server Components or Route Handlers |
