"use client"

import { SessionProvider, signOut, useSession } from "next-auth/react"
import { ReactNode, useEffect } from "react"

// This component will check for session errors and sign out when necessary
function SessionErrorHandler({ children }: { children: ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.error(
        "Session error detected: RefreshAccessTokenError - Signing out"
      )
      signOut({ callbackUrl: "/signin" })
    }
  }, [session])

  return <>{children}</>
}

export function NextAuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionErrorHandler>{children}</SessionErrorHandler>
    </SessionProvider>
  )
}
