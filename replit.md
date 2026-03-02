# Pacific Engineering Construction — Portal Monorepo

## Architecture Overview

**Option C Monorepo** — Internal Portal + Client Portal served from a single Express+Vite application with hostname-based portal detection.

- **Internal Portal**: `internal.pacificengineeringsf.com` (dev: `/internal/*`)
- **Client Portal**: `portal.pacificengineeringsf.com` (dev: `/portal/*`)
- **Marketing Site**: `pacificengineeringsf.com` (separate Repl, calls this API)

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Backend | Express.js |
| Frontend | React 18 + react-router-dom |
| Database | PostgreSQL (Drizzle ORM) |
| State | TanStack Query v5 |
| Auth | Session-based (Argon2id + custom sessions) |
| UI | shadcn/ui + Tailwind CSS + Radix primitives |
| Forms | react-hook-form + zod validation |

## Directory Structure

```
├── client/src/
│   ├── App.tsx                    # Root with portal detection
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Tailwind + theme variables
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   └── shared/                # Shared components (StatusBadge, StatCard, EmptyState, etc.)
│   ├── hooks/
│   │   ├── use-auth.ts            # Auth context + hook
│   │   ├── use-toast.ts           # Toast notifications
│   │   └── use-mobile.tsx         # Mobile detection
│   ├── lib/
│   │   ├── queryClient.ts         # TanStack Query config + apiRequest
│   │   └── utils.ts               # cn, formatCurrency, formatDate, etc.
│   └── portals/
│       ├── internal/
│       │   ├── InternalApp.tsx     # Internal router (40+ routes)
│       │   ├── layout/InternalLayout.tsx  # Dark sidebar layout
│       │   └── pages/             # All internal portal pages
│       └── client/
│           ├── ClientApp.tsx       # Client router
│           ├── layout/ClientLayout.tsx    # Top-nav layout
│           └── pages/             # Client portal pages
├── server/
│   ├── index.ts                   # Express app + middleware (cors, helmet, cookie-parser)
│   ├── routes.ts                  # Entity CRUD factory + all API routes
│   ├── auth.ts                    # Session auth (Argon2id, cookie-based)
│   ├── storage.ts                 # IStorage interface + DatabaseStorage
│   ├── db.ts                      # Drizzle + PostgreSQL Pool
│   ├── vite.ts                    # Vite dev server integration
│   └── static.ts                  # Production static file serving
├── shared/
│   └── schema.ts                  # 31 Drizzle tables + relations + types
└── drizzle.config.ts
```

## Database Schema (31 Tables)

**Auth**: users, sessions, email_verification_codes, password_reset_tokens
**CRM**: prospects, interactions, tasks
**Projects**: projects, project_documents, project_milestones, change_orders, project_messages
**Financial**: proposals, proposal_templates, invoices
**Operations**: workflows, email_sequences, sales_outreach
**Content**: blog_posts, custom_pages
**Settings**: calendar_settings, email_settings, icp_settings, dashboard_configs
**System**: audit_logs, notifications, scheduled_reports
**Client Portal**: client_invites, project_requests
**Marketing Integration**: form_submissions, rfis

## Auth System

- Session-based with Argon2id password hashing
- Cookie: `pe_session`, httpOnly, secure in production
- Domain: `.pacificengineeringsf.com` in production (cross-subdomain)
- Session duration: 30 days with sliding window renewal
- Roles: admin, user, client
- Middleware: `requireAuth`, `requireAdmin`, `requireClient`, `optionalAuth`

## API Routes

All entity routes follow the generic CRUD pattern:
- `GET /api/{entity}` — list (with ?sort, ?limit)
- `POST /api/{entity}/filter` — filter by query object
- `GET /api/{entity}/:id` — get by ID
- `POST /api/{entity}` — create
- `POST /api/{entity}/bulk` — bulk create
- `PUT /api/{entity}/:id` — update
- `DELETE /api/{entity}/:id` — delete

**Public endpoints** (no auth required):
- `GET /api/health`
- `GET /api/blog-posts` (and slug endpoint)
- `POST /api/form-submissions`
- `GET /api/client-invites/validate/:token`

**Auth endpoints**:
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`
- `GET /api/auth/me`, `PUT /api/auth/me`, `GET /api/auth/session`

## Portal Detection

In development (Replit), uses route prefix mode:
- `/internal/*` → Internal Portal
- `/portal/*` → Client Portal
- `/` → redirects to `/internal`

In production, uses hostname detection:
- `internal.*` → Internal Portal
- `portal.*` → Client Portal

## Marketing Site Integration

The marketing site (separate Repl) calls these endpoints:
- `GET /api/blog-posts` — blog listing/detail
- `POST /api/form-submissions` — contact/SWPPP forms
- `GET /api/auth/session` — cross-domain auth validation
- `POST /api/integrations/llm` — chatbot
- `GET /api/health` — health check

## Development

Start: `npm run dev` (runs Express + Vite on port 5000)
DB Push: `npx drizzle-kit push`

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `SESSION_SECRET` — Session encryption secret
- `NODE_ENV` — development | production
