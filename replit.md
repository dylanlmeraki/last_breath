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
| Email | Resend API + React Email templates |
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
│       │   └── pages/             # All internal portal pages (41 pages)
│       └── client/
│           ├── ClientApp.tsx       # Client router
│           ├── layout/ClientLayout.tsx    # Sidebar layout
│           └── pages/             # Client portal pages (10 pages)
├── server/
│   ├── index.ts                   # Express app + middleware (cors, helmet, cookie-parser, portal mode)
│   ├── routes.ts                  # Entity CRUD factory + all API routes
│   ├── auth.ts                    # Session auth (Argon2id, cookie-based)
│   ├── email.ts                   # Resend email + React Email rendering
│   ├── emails/                    # React Email templates (9 components)
│   │   ├── BaseLayout.tsx         # Branded wrapper (gradient header, footer)
│   │   ├── InviteEmail.tsx        # Invite template
│   │   ├── WelcomeEmail.tsx       # Welcome/onboarding
│   │   ├── PasswordResetEmail.tsx # Password reset
│   │   ├── NotificationEmail.tsx  # Generic notifications
│   │   ├── ProposalEmail.tsx      # Proposal delivery
│   │   ├── InvoiceEmail.tsx       # Invoice notification
│   │   ├── ProjectUpdateEmail.tsx # Project updates
│   │   └── DocumentApprovalEmail.tsx # Document review requests
│   ├── seed-admin.ts             # CLI: create initial admin account
│   ├── storage.ts                 # IStorage interface + DatabaseStorage
│   ├── db.ts                      # Drizzle + PostgreSQL Pool
│   ├── vite.ts                    # Vite dev server integration
│   └── static.ts                  # Production static file serving
├── shared/
│   └── schema.ts                  # 31 Drizzle tables + relations + types
└── drizzle.config.ts
```

## Database Schema (36 Tables)

**Auth**: users, sessions, email_verification_codes, password_reset_tokens
**CRM**: prospects, interactions, tasks
**Projects**: projects, project_documents, project_milestones, change_orders, project_messages
**Financial**: proposals, proposal_templates, invoices
**Operations**: workflows, email_sequences, sales_outreach
**Content**: blog_posts, custom_pages
**Settings**: calendar_settings, email_settings, icp_settings, dashboard_configs
**System**: audit_logs, notifications, scheduled_reports
**Client Portal**: client_invites, project_requests, client_team_members, document_approvals, client_feedback, notification_preferences, proposal_messages
**Marketing Integration**: form_submissions, rfis

## Auth System

- Invite-only registration (no open signups)
- Session-based with Argon2id password hashing (memoryCost:19456, timeCost:2, outputLen:32, parallelism:1)
- TOTP 2FA support via `otpauth` package
- Cookie: `pe_session`, httpOnly, secure in production
- Domain: `.pacificengineeringsf.com` in production (cross-subdomain)
- Session duration: 30 days with sliding window renewal
- Roles: admin, user, client
- Middleware: `requireAuth`, `requireAdmin`, `requireClient`, `optionalAuth`
- Admin-only routes enforced at both UI (nav hiding) and route level (AdminRoute wrapper)
- 3-tier invite system: admin→internal, internal→client, client→team

## Email System

- **Provider**: Resend (API-based, no SMTP needed in app)
- **Templates**: React Email components in `server/emails/`
- **DNS**: SPF, DKIM, DMARC configured in Resend dashboard + Namecheap
- **TLS**: Enforced
- **Click Tracking**: Enabled
- **Open Tracking**: Available (not yet enabled)
- **MX Record**: Host `internal` → Resend feedback SMTP
- **Portal URLs**: Internal invites link to `internal.pacificengineeringsf.com`, client invites to `portal.pacificengineeringsf.com`

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

**Admin endpoints**:
- `POST /api/admin/test-email` — send branded test email
- `GET /api/admin/email-status` — email provider configuration status
- `POST /api/email-templates/preview` — render template with sample data
- `POST /api/email-templates/:id/send-test` — send test email for specific template

## Portal Detection

In development (Replit), uses route prefix mode:
- `/internal/*` → Internal Portal
- `/portal/*` → Client Portal
- `/` → redirects to `/internal`

In production, uses hostname detection:
- `internal.*` → Internal Portal
- `portal.*` → Client Portal

Server-side portal mode middleware sets `req.portalMode` based on hostname.

## Marketing Site Integration

The marketing site (separate Repl) calls these endpoints:
- `GET /api/blog-posts` — blog listing/detail
- `POST /api/form-submissions` — contact/SWPPP forms
- `GET /api/auth/session` — cross-domain auth validation
- `POST /api/integrations/llm` — chatbot
- `GET /api/health` — health check

## Pages

**Internal Portal (41 pages)**: Dashboard, ProjectManager, ProjectDetail, ProjectDashboard, ProjectsManager, ProjectRequests, ContactManager, SalesDashboard, CRMSearch, ProposalDashboard, InvoiceManagement, RFIs, ClientRFIs, DocApproval, BlogEditor, ContentManager, PageBuilder, SEOAssistant, TemplateBuilder, PDFGenerator, OutreachQueue, EmailSequences, SequenceOptimization, SalesBotControl, AISalesAssistant, WorkflowBuilder, AnalyticsDashboard, Communications, ClientCommunications, EmailTemplates, UserManagement, ClientInvites, AdminConsole, FormSubmissions, AdminEmailSettings, ICPSettings, WebsiteMonitoring, QAQC, UserProfile, Auth

**Client Portal (11 pages + 2 components)**: ClientDashboard (enhanced w/ analytics, onboarding wizard), ClientProjects (list + detail w/ milestones, change orders, messages), ClientDocuments (documents + approvals center), ClientProposals (proposals + contracts + discussion threads), ClientInvoices (invoices + payment tracking + overdue alerts), ClientMessages (communications hub w/ threading), ClientReports (analytics + charts + CSV export), ClientRFIs (RFIs + detail + create), ClientSettings (5 tabs: account, team, notifications, workflow, feedback), ClientAuth (branded login), PortalRegister (invite validation + password strength)

## Shared Components

ErrorBoundary, ProtectedRoute, LoadingSkeleton, PageHeader, EmptyState, StatCard, StatusBadge, ConfirmDialog, SearchInput

## Initial Setup

1. Ensure DATABASE_URL is set (auto-provisioned)
2. Push schema: `npx drizzle-kit push`
3. Create admin: `npx tsx server/seed-admin.ts --email <email> --name "<name>" --password "<password>"`
4. Start app: `npm run dev`
5. Login at `/internal/auth`

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `SESSION_SECRET` — Session encryption secret
- `RESEND_API_KEY` — Resend email API key (production secret)
- `NODE_ENV` — development | production
- `INTERNAL_URL` — Internal portal base URL (default: https://internal.pacificengineeringsf.com)
- `PORTAL_URL` — Client portal base URL (default: https://portal.pacificengineeringsf.com)
- `FROM_EMAIL` — Sender email (default: notifications@pacificengineeringsf.com)
- `FROM_NAME` — Sender name (default: Pacific Engineering)

## Key NPM Packages

argon2, otpauth, qrcode, resend, @react-email/components, @react-email/render, cookie-parser, helmet, drizzle-orm, drizzle-zod, @tanstack/react-query, react-router-dom, react-hook-form, @hookform/resolvers, recharts, lucide-react
