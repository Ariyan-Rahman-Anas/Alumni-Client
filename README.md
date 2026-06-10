# BAMHS Client

Frontend for the **Battli Abdul Matin High School (BAMHS)** alumni management platform. Built with Next.js 14 App Router, TypeScript, Redux Toolkit, and a component-driven UI system powered by ShadCN and Tailwind CSS.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routing & Page Layout](#routing--page-layout)
- [Authentication Architecture](#authentication-architecture)
- [State Management](#state-management)
- [UI System](#ui-system)
- [Key Features](#key-features)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + ShadCN UI |
| State / Data Fetching | Redux Toolkit + RTK Query |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Smooth Scroll | Lenis |
| Rich Text Editor | TipTap (with Link, Underline, TextAlign, Placeholder) |
| Date Utilities | date-fns + React Day Picker |
| Carousel | Embla Carousel |
| Masonry Layout | react-masonry-css |
| Toast Notifications | Sonner |
| Icons | Lucide React + React Icons |
| Theme | next-themes (system / light / dark) |
| Image Hosting | Cloudinary (served via Next.js `remotePatterns`) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout — providers, AuthInitializer, fonts
│   ├── globals.css
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── actions.ts                # Server Actions
│   ├── (public)/                 # Public-facing pages (no auth required)
│   │   ├── page.tsx              # Home / Landing
│   │   ├── about/
│   │   ├── privacy/
│   │   └── terms/
│   ├── (auth)/                   # Unauthenticated-only pages
│   │   ├── login/
│   │   ├── registration/
│   │   └── verify-email/
│   ├── (user)/                   # Authenticated alumni pages
│   │   ├── announcements/
│   │   ├── batch-room/
│   │   ├── batches/
│   │   ├── bloodbank/
│   │   ├── events/
│   │   ├── gallery/
│   │   ├── jobs/
│   │   └── profile/
│   └── (admin)/                  # Admin-only dashboard pages
│       └── admin/
│           ├── overview/
│           ├── users/
│           ├── batches/
│           ├── events/
│           ├── gallery/
│           ├── image-categories/
│           ├── announcements/
│           ├── jobs/
│           ├── requests/
│           └── website-management/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── modules/                  # Domain-specific feature components
│   ├── pages/                    # Full page-level compositions
│   │   ├── public/
│   │   ├── auth/
│   │   ├── user/
│   │   └── admin/
│   ├── shared/                   # Reusable cross-domain components
│   └── ui/                       # ShadCN base UI primitives
├── redux/
│   ├── store.ts
│   ├── hooks.ts
│   ├── slice/                    # Auth slice, other state slices
│   ├── middleware/
│   └── apis/                     # RTK Query API slices
│       ├── baseApi.ts
│       ├── authApi.ts
│       ├── userApi.ts
│       ├── batchApi.ts
│       ├── eventApi.ts
│       ├── galleryApi.ts
│       ├── imageCategoryApi.ts
│       ├── announcementApi.ts
│       ├── jobApi.ts
│       ├── requestApi.ts
│       ├── statsApi.ts
│       ├── adminApi.ts
│       └── websiteManagementApi.ts
├── providers/
│   ├── StoreProvider.tsx         # Redux Provider wrapper
│   ├── AuthInitializer.tsx       # Silent session restore on page load
│   └── ThemeProvider.tsx         # next-themes wrapper
├── hooks/
│   ├── useDebounce.ts
│   └── useFormWithToast.ts
├── lib/
│   ├── config.ts                 # API base URL and app-level constants
│   ├── utils.ts                  # cn() and shared helpers
│   ├── form-helpers.ts
│   ├── DateFormatter.tsx
│   ├── SmoothScroller.tsx        # Lenis initialization
│   └── ThemeSwitch.tsx
├── constants/
│   └── index.ts
├── types/
├── assets/
│   └── index.ts
└── middleware.ts                 # Next.js Edge middleware (pass-through — see note)
```

---

## Routing & Page Layout

The app uses Next.js **route groups** to apply different layouts and auth guards without affecting URL paths:

| Route Group | URL Pattern | Layout / Guard |
|---|---|---|
| `(public)` | `/`, `/about`, `/privacy`, `/terms` | Public layout — no auth required |
| `(auth)` | `/login`, `/registration`, `/verify-email` | Guest-only guard — redirects authenticated users away |
| `(user)` | `/announcements`, `/jobs`, `/gallery`, etc. | Requires authenticated user |
| `(admin)` | `/admin/*` | Requires `ADMIN` or `SUPER_ADMIN` role |

Route protection is handled **entirely client-side** by `<ClientAuthGuard>` in each group's `layout.tsx`. Next.js Edge middleware cannot read in-memory Redux state or the httpOnly refresh token cookie (different origin in dev), so it acts as a pass-through. When the frontend and backend share the same domain in production, the middleware can be upgraded to server-side redirect logic.

Post-login redirect uses the `?next=<path>` query parameter — written by `ClientAuthGuard`, consumed by the login form.

---

## Authentication Architecture

The client uses a **zero-persistence token strategy** — no tokens are ever written to `localStorage`, `sessionStorage`, or any readable cookie.

```
Browser tab loads
       │
       ▼
AuthInitializer (mounts at root layout)
       │  POST /auth/refresh-token
       │  (browser auto-sends httpOnly refreshToken cookie)
       ▼
On success → dispatch setUser({ user, accessToken }) → Redux in-memory
On failure → dispatch clearUser()
       │
       ▼
All API calls attach:  Authorization: Bearer <accessToken from Redux>
```

| Token | Where it lives | Survives page refresh? | Accessible to JS? |
|---|---|---|---|
| Access Token | Redux store (in-memory) | No — restored silently via refresh | No |
| Refresh Token | httpOnly cookie (set by server) | Yes (7 days) | No |

This design provides **XSS resistance** for both tokens. The access token is never in the DOM or storage, and the refresh token cookie is flagged `HttpOnly` + `SameSite` + `Secure` in production.

---

## State Management

**Redux Toolkit** manages global client state. **RTK Query** handles all server data fetching with automatic caching, invalidation, and loading states.

```
store.ts
├── authSlice        → { user, accessToken, isLoading }
└── RTK Query APIs   → cached server data per tag
    ├── authApi      → /auth endpoints
    ├── userApi      → /users endpoints
    ├── batchApi     → /batches endpoints
    ├── eventApi     → /events endpoints
    ├── galleryApi   → /gallery + /image-categories
    ├── announcementApi
    ├── jobApi       → job posts, applications, providers
    ├── requestApi
    ├── statsApi
    ├── adminApi
    └── websiteManagementApi
```

The `baseApi` configures the shared `baseQuery` with the backend URL and injects the `Authorization: Bearer` header from the Redux auth state on every request.

---

## UI System

Built on **ShadCN UI** — an un-opinionated, copy-paste component library using Radix UI primitives and Tailwind CSS. All primitive components live in `src/components/ui/` and are customized directly in the codebase (no black-box library version to bump).

Key design decisions:
- `cn()` utility (from `clsx` + `tailwind-merge`) for conditional class merging
- `class-variance-authority` (CVA) for variant-based component APIs
- Framer Motion for page transitions and interactive UI animations
- Lenis for buttery-smooth scroll behavior
- TipTap as the rich text editor for admin content (announcements, etc.)
- Sonner for non-blocking toast notifications
- React Hook Form + Zod for type-safe, validated forms — `useFormWithToast` abstracts the standard submit + toast pattern

---

## Key Features

### Public Pages
- **Home** — dynamic hero, stats, announcements preview, events preview; all data from the Website Management API
- **About, Privacy, Terms** — static informational pages

### Auth Flow
- Multi-step registration with profile image + alumni proof document upload
- Email OTP verification (6-digit code, 10-minute expiry)
- Forgot password → email link → reset password
- Persistent login via silent session restore (no localStorage)

### Alumni Portal (Authenticated)
- **Announcements** — paginated list with rich HTML content and file attachments
- **Events** — upcoming and past events with images
- **Gallery** — masonry photo gallery grouped by image category
- **Batch Room** — filter and browse alumni by graduation batch
- **Blood Bank** — find eligible blood donors by blood group
- **Jobs** — job board with post creation, reactions, comments, replies, and applications; service provider directory with contact requests
- **Profile** — view and edit own profile with image upload

### Admin Dashboard
- **Overview** — real-time stats (users, events, jobs, announcements, requests)
- **Users** — approve/reject registrations, promote to admin, search and filter
- **Batches** — manage graduation year batches, toggle active status
- **Events** — full CRUD with image management
- **Gallery** — multi-image upload with category assignment
- **Image Categories** — create and manage gallery categories
- **Announcements** — rich text editor, draft/publish workflow, pin, feature, attachments
- **Jobs** — moderate job posts and provider registrations
- **Requests** — review alumni requests with status tracking and response messages
- **Website Management** — edit all public-facing site content (name, tagline, contact, social links, etc.)

---

## Environment Variables

Create a `.env.local` file at the root of the `client/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

In production, point this to your deployed backend URL.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app expects the backend server to be running and accessible at the URL defined in `NEXT_PUBLIC_API_URL`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
