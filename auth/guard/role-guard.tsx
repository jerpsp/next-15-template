import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type RoleGuardProps = {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
}: RoleGuardProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [checked, setChecked] = useState(false)

  const check = useCallback(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
    } else if (status === "loading") {
      return
    } else if (status === "authenticated") {
      const userRole = session?.user?.role || ""
      if (!allowedRoles.includes(userRole)) {
        router.replace(redirectTo)
      } else {
        setChecked(true)
      }
    }
  }, [status, router, session, allowedRoles, redirectTo])

  useEffect(() => {
    check()
  }, [check])

  if (!checked) return null

  return <>{children}</>
}
