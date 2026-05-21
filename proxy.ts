import createMiddleware from "next-intl/middleware"
import { routing } from "./locales/routing"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request)

  const token = await getToken({ req: request })

  // Resolve current locale from cookie or default
  const locale =
    request.cookies.get("NEXT_LOCALE")?.value ||
    routing.defaultLocale

  // Check for auth errors → redirect to sign-in
  if (token?.error === "RefreshAccessTokenError") {
    const signoutResponse = NextResponse.redirect(
      new URL(`/${locale}/signin`, request.url)
    )
    signoutResponse.cookies.delete("next-auth.session-token")
    signoutResponse.cookies.delete("next-auth.callback-url")
    signoutResponse.cookies.delete("next-auth.csrf-token")
    return signoutResponse
  }

  // Restrict "user" role to /dashboard only
  if (token) {
    const userRole = (token as any).user?.role
    if (userRole === "user") {
      const path = request.nextUrl.pathname
      if (
        path.includes("/users") ||
        (!path.includes("/dashboard") &&
          !path.includes("/signin") &&
          !path.includes("/api"))
      ) {
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard`, request.url)
        )
      }
    }
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
