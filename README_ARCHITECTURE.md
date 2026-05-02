# Campus Flow — Architecture & Developer Handbook

> **Status:** Frontend-complete, localStorage-backed. Ready for backend integration.  
> **Stack:** React 18 + TypeScript + Vite + shadcn/ui + TailwindCSS + React Router v6

---

## Table of Contents

1. [Overview](#1-overview)
2. [Folder Structure](#2-folder-structure)
3. [Roles & Access Control](#3-roles--access-control)
4. [Key Files & Their Purpose](#4-key-files--their-purpose)
5. [Data Flow & State Management](#5-data-flow--state-management)
6. [Critical Bugs Found & Fixed](#6-critical-bugs-found--fixed)
7. [Backend API Contract](#7-backend-api-contract)
8. [Environment Variables & Dependencies](#8-environment-variables--dependencies)
9. [Developer Onboarding](#9-developer-onboarding)
10. [Known Limitations / TODO Before Production](#10-known-limitations--todo-before-production)

---

## 1. Overview

**Campus Flow** is a college management platform. Currently it handles:

| Module | Status |
|---|---|
| CPS (Credit Point System) — entry, approval workflow | ✅ Complete |
| Leave Management — apply, HOD/Principal approval | ✅ Complete |
| User Auth — register, login, role-based routing | ✅ Complete |
| Admin Panel — user directory, user & entry management | ✅ Complete |
| Circulars, Timetable, Events, Tasks, Reports | ⚠️ UI shell only |
| Notifications | ✅ Frontend (seeded, in-memory) |

All data is currently persisted in **browser `localStorage`**. The frontend is written to be **drop-in replaceable** with a REST API — see Section 7.

---

## 2. Folder Structure

```
campus-flow-1/
├── index.html                  # Vite entry point
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.app.json
└── src/
    ├── main.tsx                # React root mount
    ├── App.tsx                 # Router + all Context providers
    ├── index.css               # Global CSS + Tailwind tokens
    │
    ├── types/                  # Shared TypeScript interfaces & enums
    │   ├── auth.ts             # UserRole, User, Department, Designation, Post
    │   ├── cps.ts              # CPSEntry, CPSCategory, CPS_ACTIVITIES, labels
    │   ├── leave.ts            # LeaveEntry, LeaveType, LeaveStatus, labels
    │   ├── tasks.ts            # AdminTaskAssignment, AdminTaskType
    │   └── timetable.ts        # Timetable slot structures
    │
    ├── contexts/               # React Context — all in-memory state + localStorage sync
    │   ├── AuthContext.tsx      # Auth state, login/register/logout, role resolution
    │   ├── CPSContext.tsx       # CPS entries CRUD + approval helpers
    │   ├── LeaveContext.tsx     # Leave entries CRUD + approval helpers
    │   ├── TaskContext.tsx      # Admin task assignments CRUD
    │   ├── TimetableContext.tsx # Timetable slots state
    │   └── NotificationContext.tsx # Per-user notification feed
    │
    ├── pages/                  # Route-level page components
    │   ├── Login.tsx
    │   ├── Signup.tsx
    │   ├── Dashboard.tsx       # Role-switched dashboard (faculty/hod/principal/non_teaching)
    │   ├── CPSEntry.tsx        # Complex CPS entry form with credit calculator
    │   ├── CPSRecords.tsx      # Faculty CPS history + draft management
    │   ├── HODApprovals.tsx    # HOD approval queue
    │   ├── PrincipalApprovals.tsx
    │   ├── Leave.tsx           # Leave application + approval workflow
    │   ├── AdminPanel.tsx      # User directory + CPS entry admin
    │   ├── Reports.tsx         # Analytics
    │   ├── Circulars.tsx       # Circulars board
    │   ├── Tasks.tsx           # Task assignment module (shell)
    │   ├── Raise.tsx           # Grievance module
    │   ├── Settings.tsx        # Account settings
    │   ├── Timetable.tsx
    │   ├── Events.tsx
    │   ├── BookCall.tsx
    │   ├── LandingPage.tsx
    │   └── NotFound.tsx
    │
    ├── components/
    │   ├── DashboardLayout.tsx # Auth guard + sidebar + header shell
    │   ├── AppSidebar.tsx      # Role-filtered sidebar navigation
    │   ├── NavLink.tsx
    │   ├── EventCalendar.tsx
    │   ├── TimetableEditor.tsx
    │   ├── mode-toggle.tsx
    │   ├── theme-provider.tsx
    │   ├── cps/                # CPS-specific sub-components
    │   ├── landing/            # Landing page sections
    │   └── ui/                 # shadcn/ui generated components (do not hand-edit)
    │
    ├── hooks/
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    │
    ├── lib/
    │   └── utils.ts            # cn() tailwind class merge utility
    │
    └── utils/                  # (reserved)
```

---

## 3. Roles & Access Control

| Role | `UserRole` value | How assigned | Dashboard |
|---|---|---|---|
| Faculty | `faculty` | Post = "Faculty" | CPS tracker, leave, records |
| Head of Department | `hod` | Post = "Head of Department" | Faculty CPS approvals + own CPS |
| Principal | `principal` | Post = "Principal" | HOD leave + final CPS approvals |
| Non-Teaching Staff | `non_teaching` | Post = "Non-Teaching Staff" | Leave management only |
| Admin | `admin` | Pre-seeded only | Full user directory + CPS admin |

**Route guard:** `DashboardLayout` redirects unauthenticated users to `/login`.  
**Admin guard:** `Dashboard.tsx` detects `currentRole === 'admin'` and redirects to `/admin`.  
**Sidebar:** `AppSidebar.tsx` filters nav items by `currentRole` via the `roles[]` array on each nav item.

---

## 4. Key Files & Their Purpose

### `src/types/auth.ts`
Single source of truth for all user-related types. Any new role must be added to:
- `UserRole` union type
- `ROLE_LABELS` record
- `Post` type + `POSTS` array (drives signup dropdown)
- `Designation` type + `DESIGNATIONS_ACADEMIC` array

### `src/contexts/AuthContext.tsx`
- Session stored in `localStorage` key `cps_auth`
- All users in `localStorage` key `cps_users`
- `getPrimaryRole()` determines dashboard: `admin > principal > hod > non_teaching > faculty`
- `register()` maps `Post` → `UserRole[]` automatically
- **Demo users** (all password `password123`, admin uses `admin123`):
  - `rajesh.kumar@college.edu` (faculty)
  - `priya.sharma@college.edu` (HOD)
  - `suresh.reddy@college.edu` (principal)
  - `admin@college.edu` (admin)

### `src/contexts/CPSContext.tsx`
- Storage key: `cps_entries_v2`
- `getPendingHODApprovals(dept)` → status `pending_hod` filtered by dept
- `getPendingPrincipalApprovals()` → status `pending_principal` globally

### `src/types/cps.ts`
Contains the full `CPS_ACTIVITIES` array — 40+ activity types with `id`, `category`, `credits`, and `maxCredits`. **The backend must store or serve these.**

### `src/types/leave.ts`
Leave types follow the college's **Abstract of Leave Provisions (Revised)**:
`casual`, `special_casual`, `earned`, `maternity`, `paternity`, `extra_ordinary`, `fixed_term_contract`, `temporary`, `post_retirement`, `restricted_holiday`, `ood`, `eol_medical`

Non-teaching staff get a filtered subset (no `special_casual`, no `extra_ordinary`).

### `src/pages/Dashboard.tsx`
Renders **entirely different UIs** per role. This is where API data will first be injected when connecting the backend.

### `src/pages/CPSEntry.tsx`
Contains the credit calculation engine:
- `calculateCredits(activity)` applies involvement splits (60/40 PI vs co-investigator), consultancy per-lakh, and cumulative `maxCredits` caps.
- Evidence files stored as `file:{filename}` — not actually uploaded (no file server yet).

### `src/pages/AdminPanel.tsx`
- Admin PIN hardcoded as `"1234"` — **must be replaced with server auth**
- Plaintext passwords rendered — **critical security issue**

---

## 5. Data Flow & State Management

```
App.tsx
 └── AuthProvider
      └── CPSProvider
           └── LeaveProvider
                └── TimetableProvider
                     └── NotificationProvider (per-user scoped)
                          └── TaskProvider
                               └── <Routes> → DashboardLayout → Page
```

Every Context:
1. Reads from `localStorage` on mount (falls back to demo seed data)
2. Writes to `localStorage` on every state change
3. Exposes typed CRUD methods consumed by pages

**When connecting a backend:** Replace localStorage reads/writes in each Context with `fetch` / `useQuery` calls. The Context's public interface (method signatures) does not need to change.

---

## 6. Critical Bugs Found & Fixed

| # | File | Bug | Fix Applied |
|---|---|---|---|
| 1 | `AppSidebar.tsx` | `non_teaching` role had no nav items → blank sidebar | Added to Dashboard and Leave `roles[]` |
| 2 | `AppSidebar.tsx` | HOD Approvals link was **missing entirely** from sidebar | Added HOD Approvals nav item |
| 3 | `CPSContext.tsx` | `entries.length > 0` guard meant deleting all entries never persisted | Removed guard; always write |
| 4 | `LeaveContext.tsx` | Same persistence guard bug | Removed guard |
| 5 | `TaskContext.tsx` | Same persistence guard bug | Removed guard |
| 6 | `Signup.tsx` | Non-teaching staff blocked at validation (required designation) | Skip designation check for Non-Teaching Staff; auto-assign `'None'` |
| 7 | `Signup.tsx` | Designation dropdown shown unnecessarily to Non-Teaching Staff | Conditionally hidden when post is Non-Teaching Staff |

### Remaining Issues (Not Auto-Fixed)

| Severity | Location | Issue |
|---|---|---|
| 🔴 Critical | `AdminPanel.tsx:155` | Admin PIN hardcoded as `"1234"` |
| 🔴 Critical | `AdminPanel.tsx:413` | User plaintext passwords rendered in UI |
| 🟡 Medium | `CPSEntry.tsx:248` | Evidence files stored as name string, not uploaded |
| 🟡 Medium | `DashboardLayout.tsx:96` | Search bar is non-functional |
| 🟡 Medium | `AuthContext.tsx` | Passwords in plaintext in localStorage |
| 🟠 Low | `CPSContext.tsx:97` | IDs via `Date.now()` — use `crypto.randomUUID()` |

---

## 7. Backend API Contract

All endpoints return `application/json`. Protected endpoints require `Authorization: Bearer <token>`.

### Authentication

```
POST /api/auth/login
  Body:    { email, password }
  Returns: { token, user }

POST /api/auth/register
  Body:    { name, email, password, usn, department, post, designation }
  Returns: { token, user }

POST /api/auth/logout
  Returns: { success: true }

GET  /api/auth/me
  Returns: { ...User }

PATCH  /api/users/:id
  Body:    Partial<User>  (name, email, department, designation, usn, avatarUrl)
  Returns: { ...User }

DELETE /api/users/:id   [Admin only]
  Returns: { success: true }
```

### CPS Entries

```
GET    /api/cps?facultyId=&department=&status=&page=&limit=
Returns: { entries: [...CPSEntry], total: number }

POST   /api/cps
Body: {
  category:      "research|academics|industry|placement|administration",
  activityTypeId: string,   // id from CPS_ACTIVITIES table
  activityType:   string,   // human label
  description:    string,
  date:           "YYYY-MM-DD",
  credits:        number,
  status:         "draft|pending_hod",
  evidence:       string?
}
Returns: { ...CPSEntry }

PATCH  /api/cps/:id
Body: {
  status?:              "pending_principal|approved|rejected",
  hodRemarks?:          string,
  principalRemarks?:    string,
  hodApprovedAt?:       ISO8601,
  principalApprovedAt?: ISO8601,
  rejectedAt?:          ISO8601,
  rejectedBy?:          "hod|principal"
}
Returns: { ...CPSEntry }

DELETE /api/cps/:id               [Admin only]
DELETE /api/cps/by-faculty/:id    [Admin only]

GET /api/cps/pending/hod?department=
GET /api/cps/pending/principal
Returns: { entries: [...CPSEntry] }
```

### Leave

```
GET  /api/leave?applicantId=&department=&status=
Returns: { entries: [...LeaveEntry] }

POST /api/leave
Body: {
  leaveType: "casual|special_casual|earned|maternity|paternity|
              extra_ordinary|fixed_term_contract|temporary|
              post_retirement|restricted_holiday|ood|eol_medical",
  startDate: "YYYY-MM-DD",
  endDate:   "YYYY-MM-DD",
  reason:    string
}
Returns: { ...LeaveEntry }

PATCH /api/leave/:id
Body: {
  status:      "pending_principal|approved|rejected",
  approvedBy?: "hod|principal",
  approvedAt?: ISO8601,
  rejectedAt?: ISO8601,
  rejectedBy?: "hod|principal",
  remarks?:    string
}

GET /api/leave/pending/hod?department=
GET /api/leave/pending/principal
Returns: { entries: [...LeaveEntry] }
```

### Users (Admin)

```
GET /api/users?search=&page=&limit=
Returns: { users: [...User], total: number }

GET /api/users/:id
Returns: { ...User, cpsEntries: [...CPSEntry] }
```

### File Upload

```
POST /api/upload/evidence
Content-Type: multipart/form-data
Body: { file: File }
Returns: { url: string }
```

### Notifications

```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
DELETE /api/notifications
```

---

## 8. Environment Variables & Dependencies

### `.env` file

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_FILE_UPLOAD=false
```

> All `VITE_*` vars are client-visible. Never put secrets here.

### Key Dependencies

| Package | Purpose |
|---|---|
| `react` 18.3 | UI framework |
| `react-router-dom` 6.30 | Client-side routing |
| `@tanstack/react-query` 5.83 | API caching (installed, not yet wired) |
| `date-fns` 3.6 | Date formatting |
| `lucide-react` 0.462 | All icons |
| `sonner` 1.7 | Toast notifications |
| `recharts` 2.15 | Charts in Reports |
| `tailwindcss` 3.4 | Utility CSS |
| `shadcn/ui` (@radix-ui/*) | UI primitives |
| `framer-motion` 12.29 | Animations |
| `react-hook-form` + `zod` | Forms + validation (installed, partially used) |

---

## 9. Developer Onboarding

### Prerequisites

- Node.js ≥ 18 (or Bun ≥ 1.0)
- Git

### Steps

```bash
# 1. Enter the project
cd campus-flow-1

# 2. Install dependencies
npm install    # or: bun install

# 3. Start dev server
npm run dev    # → http://localhost:8080

# 4. Log in with demo credentials
#   Faculty:   rajesh.kumar@college.edu / password123
#   HOD:       priya.sharma@college.edu / password123
#   Principal: suresh.reddy@college.edu / password123
#   Admin:     admin@college.edu        / admin123

# 5. Lint
npm run lint

# 6. Test
npm test
```

### Resetting Demo Data

Open DevTools → Application → Local Storage → clear all `cps_*` keys.  
On next load, seed data is re-initialized automatically.

### Adding a New Page

```
1. Create src/pages/MyPage.tsx
2. Add route in src/App.tsx:
      <Route path="/my-page" element={<DashboardLayout><MyPage /></DashboardLayout>} />
3. Add nav item in src/components/AppSidebar.tsx with roles[] array
```

### Connecting the Backend

For each Context, swap the localStorage pattern for fetch:

```typescript
// BEFORE (localStorage)
const stored = localStorage.getItem(STORAGE_KEY);
setEntries(stored ? JSON.parse(stored) : DEMO_ENTRIES);

// AFTER (API — use @tanstack/react-query)
const { data } = useQuery({
  queryKey: ['cps-entries'],
  queryFn: () => fetch(`${import.meta.env.VITE_API_BASE_URL}/cps`,
    { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
});
```

---

## 10. Known Limitations / TODO Before Production

| Priority | Item |
|---|---|
| 🔴 P0 | Replace plaintext password storage with JWT tokens from backend |
| 🔴 P0 | Remove hardcoded admin PIN `"1234"` from AdminPanel.tsx |
| 🔴 P0 | Remove plaintext password display in admin user detail panel |
| 🟡 P1 | Implement file upload endpoint; replace `file:{name}` strings with real URLs |
| 🟡 P1 | Wire `@tanstack/react-query` for API data fetching |
| 🟡 P1 | Add server-side route authorization guards |
| 🟡 P1 | Implement global search in the header bar |
| 🟠 P2 | Replace `Date.now()` IDs with `crypto.randomUUID()` or server UUIDs |
| 🟠 P2 | Complete form validation with `react-hook-form` + `zod` across all forms |
| 🟠 P2 | Add pagination to admin user directory and CPS records tables |
| 🟠 P2 | Implement real-time notifications (WebSocket or SSE) |
| ⚪ P3 | Complete Circulars, Events, Tasks, Raise modules (currently UI shells) |
| ⚪ P3 | Add email notifications for leave / CPS status changes |
