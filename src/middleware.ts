// import { NextRequest, NextResponse } from "next/server";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS MIDDLEWARE DOES NOTHING
//
// Auth tokens are stored in Redux in-memory (never in cookies/localStorage).
// Next.js Edge middleware (this file) cannot read in-memory state — it only
// sees HTTP cookies. The only cookie that exists is the httpOnly refreshToken,
// and that is only sent to the backend server (different origin/port), NOT to
// the Next.js server.
//
// Route protection is handled entirely client-side by <ClientAuthGuard>:
//   • (user)/layout.tsx       → <ClientAuthGuard requireAuth>
//   • (auth)/layout.tsx       → <ClientAuthGuard requireGuest>
//   • (admin)/layout.tsx      → <ClientAuthGuard requireRole="ADMIN">
//
// Post-login redirect uses ?next=<path> — written by ClientAuthGuard,
// consumed by LoginForm.
//
// RESTORE MIDDLEWARE WHEN: frontend and backend share the same eTLD+1 so the
// refreshToken cookie is visible to the Next.js server. At that point, verify
// the refresh token here and redirect unauthenticated users server-side.
// ─────────────────────────────────────────────────────────────────────────────

export function middleware() {
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|icons|fonts).*)",
    ],
};

