import createMiddleware from "next-intl/middleware"
import { routing } from "./locales/routing"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  // First, handle the intl routing
  const response = intlMiddleware(request)

  // Check for auth errors
  const token = await getToken({ req: request })
  
  // If we have a refresh token error, clear cookies to force sign out
  if (token?.error === "RefreshAccessTokenError") {
    const signoutResponse = NextResponse.redirect(new URL("/signin", request.url))
    
    // Clear the auth cookies
    signoutResponse.cookies.delete("next-auth.session-token")
    signoutResponse.cookies.delete("next-auth.callback-url")
    signoutResponse.cookies.delete("next-auth.csrf-token")
    
    return signoutResponse
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
