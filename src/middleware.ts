import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/settings"];

// Routes only for unauthenticated users (redirect to home if already logged in)
const AUTH_ONLY_ROUTES = ["/login", "/registration"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;
    const isAuthenticated = Boolean(accessToken);

    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const isAuthOnly = AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthOnly && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|icons|fonts).*)",
    ],
};
