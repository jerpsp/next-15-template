import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status } = useSession()

  const [checked, setChecked] = useState(false)

  const check = useCallback(() => {
    if (status === "unauthenticated") router.replace("/signin")
    else if (status === "loading") return
    else setChecked(true)
  }, [status, router])

  useEffect(() => {
    check()
  }, [status])

  if (!checked) return null

  return <>{children}</>
}
