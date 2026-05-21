import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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

  const userRole = session?.user?.role || ""
  const isAllowed = allowedRoles.includes(userRole)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
    } else if (status === "authenticated" && !isAllowed) {
      router.replace(redirectTo)
    }
  }, [status, router, isAllowed, redirectTo])

  if (status === "loading") return null
  if (status === "unauthenticated") return null
  if (status === "authenticated" && !isAllowed) return null

  return <>{children}</>
}
