import createMiddleware from "next-intl/middleware"
import { routing } from "./locales/routing"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  const token = await getToken({ req: request })
  
  // Check for auth errors
  if (token?.error === "RefreshAccessTokenError") {
    const signoutResponse = NextResponse.redirect(new URL("/signin", request.url))
    
    signoutResponse.cookies.delete("next-auth.session-token")
    signoutResponse.cookies.delete("next-auth.callback-url")
    signoutResponse.cookies.delete("next-auth.csrf-token")
    
    return signoutResponse
  }

  // Redirect users with role "user" to dashboard if they try to access restricted pages
  if (token) {
    const userRole = (token as any).user?.role
    if (userRole === "user") {
      const path = request.nextUrl.pathname
      // Check if the user is trying to access restricted pages
      if (path.includes("/users") || 
          (path !== "/dashboard" && !path.includes("/dashboard") && 
           !path.includes("/signin") && !path.includes("/api"))) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
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
