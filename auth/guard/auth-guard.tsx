import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status, data: session } = useSession()

  const [checked, setChecked] = useState(false)

  const check = useCallback(() => {
    if (status === "unauthenticated") router.replace("/signin")
    else if (status === "loading") return
    else {
      // If user role is "user", redirect to dashboard
      if (
        session?.user?.role === "user" &&
        !window.location.pathname.includes("/dashboard")
      ) {
        router.replace("/dashboard")
        return
      }
      setChecked(true)
    }
  }, [status, router, session])

  useEffect(() => {
    check()
  }, [check])

  if (!checked) return null

  return <>{children}</>
}
