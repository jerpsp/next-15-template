import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

export default function GuestGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { status, data } = useSession()

  const check = useCallback(() => {
    if (status === "authenticated")
      router.replace(
        data?.provider === "keycloak" ? "keycloak-users" : "/users"
      )
  }, [status, router])

  useEffect(() => {
    check()
  }, [check])

  return <>{children}</>
}
