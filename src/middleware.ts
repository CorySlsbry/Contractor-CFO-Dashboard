import { type NextRequest, NextResponse } from "next/server";
import { refreshSession } from "@/lib/supabase/middleware";

/**
 * Middleware — session refresh, route protection, and AAL2 (2FA) gating.
 *
 * Flow:
 *  1. Refresh Supabase session from cookies.
 *  2. Redirect authenticated users away from auth pages (login/signup).
 *  3. Redirect unauthenticated users away from /dashboard and /admin.
 *  4. If a user has a verified MFA factor but their current session is only
 *     at AAL1 (password only), force them to /mfa before any protected page
 *     or mutation API can load.
 *
 * The AAL2 check is done by reading the JWT's `aal` claim and comparing it
 * to the AAL of the user's strongest verified factor. We use Supabase's
 * helper which already encapsulates that logic.
 */
export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await refreshSession(request);

  const path = request.nextUrl.pathname;

  const isAuthRoute =
    path === "/login" ||
    path === "/signup" ||
    path === "/auth/callback";

  const isMfaRoute = path === "/mfa";
  const isDemoRoute = path === "/demo";
  const isDashboardRoute = path.startsWith("/dashboard");
  const isAdminRoute =
    path.startsWith("/admin") || path.startsWith("/api/admin");

  // Protected non-auth APIs we want to guard behind AAL2 too.
  const isSensitiveApi =
    path.startsWith("/api/stripe") ||
    path.startsWith("/api/auth/delete-account") ||
    path.startsWith("/api/auth/password") ||
    path.startsWith("/api/integrations");

  // Redirect authenticated users away from auth pages.
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow demo route for unauthenticated users.
  if (isDemoRoute) {
    return response;
  }

  // Redirect unauthenticated users trying to access protected routes.
  if ((isDashboardRoute || isAdminRoute || isSensitiveApi) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // AAL2 enforcement — only relevant when a user is signed in.
  if (user && (isDashboardRoute || isAdminRoute || isSensitiveApi)) {
    try {
      const { data: aal } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      // nextLevel === 'aal2' means the user has at least one verified factor.
      // currentLevel tells us what this session actually has.
      if (
        aal &&
        aal.nextLevel === "aal2" &&
        aal.currentLevel !== "aal2" &&
        !isMfaRoute
      ) {
        const url = new URL("/mfa", request.url);
        return NextResponse.redirect(url);
      }
    } catch {
      // If the AAL lookup fails we err on the side of letting the request
      // through — we've already confirmed the user is authenticated.
    }
  }

  // If the user is on /mfa but doesn't actually need it, bounce them out.
  if (user && isMfaRoute) {
    try {
      const { data: aal } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (
        aal &&
        (aal.nextLevel === "aal1" || aal.currentLevel === "aal2")
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      /* noop */
    }
  }

  return response;
}

/**
 * Configuration for which routes should run through middleware.
 * Excludes static assets so we don't waste compute on every .png.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
