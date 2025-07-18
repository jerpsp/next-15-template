import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Detail",
}

export default function UserDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
