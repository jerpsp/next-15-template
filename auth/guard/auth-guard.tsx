import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status, data: session } = useSession()

  const isUser = session?.user?.role === "user"

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin")
    } else if (
      status === "authenticated" &&
      isUser &&
      !window.location.pathname.includes("/dashboard")
    ) {
      router.replace("/dashboard")
    }
  }, [status, router, isUser])

  if (status === "loading") return null
  if (status === "unauthenticated") return null
  if (isUser && !window.location.pathname.includes("/dashboard")) return null

  return <>{children}</>
}
