// import { NextRequest, NextResponse } from "next/server";
import { NextResponse } from "next/server";
// import { jwtDecode } from "jwt-decode";

// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS FILE IS MOSTLY COMMENTED OUT
//
// Middleware runs on the server (Edge runtime). It reads cookies from the
// incoming request headers. Cross-site cookies (SameSite=None) ARE sent by
// the browser to the *same* origin — but Vercel frontend & backend are on
// different subdomains, so the browser only sends the cookie to the backend,
// NOT to the Next.js server. Middleware therefore always sees an empty cookie
// → thinks the user is unauthenticated → redirect loop.
//
// CURRENT APPROACH (Vercel staging, no custom domain):
//   Auth protection lives in <ClientAuthGuard> (client-side, post-hydration).
//   AuthInitializer at app root calls GET /auth/me on every load and populates
//   Redux. ClientAuthGuard reads Redux state and redirects if needed.
//
// RESTORE WHEN: custom domain is set up and frontend + backend share
// the same eTLD+1 (e.g. bamhs.com / api.bamhs.com). At that point:
//   1. Switch cookie sameSite back to "strict" / "lax" in auth.controller.ts
//   2. Un-comment the middleware logic below
//   3. Remove <ClientAuthGuard> wrappers (or keep both for defence-in-depth)
// ─────────────────────────────────────────────────────────────────────────────

// Routes that require authentication
// const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/settings", "/admin"];

// Routes only for unauthenticated users (redirect to home if already logged in)
// const AUTH_ONLY_ROUTES = ["/login", "/registration"];

// Routes that require ADMIN role
// const ADMIN_PREFIXES = ["/admin"];

// interface TokenPayload {
//     userId: string;
//     email: string;
//     role: string;
//     iat: number;
//     exp: number;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export function middleware(_request: NextRequest) {
export function middleware() {
    // ── DISABLED (cross-site cookie not visible to Edge middleware on Vercel) ──
    //
    // const { pathname } = request.nextUrl;
    // const accessToken = request.cookies.get("accessToken")?.value;
    // const isAuthenticated = Boolean(accessToken);
    //
    // const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    // const isAuthOnly  = AUTH_ONLY_ROUTES.some((r)  => pathname.startsWith(r));
    // const isAdminRoute = ADMIN_PREFIXES.some((p)   => pathname.startsWith(p));
    //
    // if (isProtected && !isAuthenticated) {
    //     const loginUrl = new URL("/login", request.url);
    //     loginUrl.searchParams.set("next", pathname);
    //     return NextResponse.redirect(loginUrl);
    // }
    //
    // if (isAuthOnly && isAuthenticated) {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }
    //
    // if (isAdminRoute && isAuthenticated && accessToken) {
    //     try {
    //         const decoded = jwtDecode<TokenPayload>(accessToken);
    //         if (decoded.role !== "ADMIN") {
    //             return NextResponse.redirect(new URL("/", request.url));
    //         }
    //     } catch {
    //         return NextResponse.redirect(new URL("/login", request.url));
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|icons|fonts).*)",
    ],
};

