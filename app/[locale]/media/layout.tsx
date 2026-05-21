"use client"

import { AuthGuard } from "@/auth/guard"
import AuthLayout from "@/layout/auth"

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <AuthLayout>{children}</AuthLayout>
    </AuthGuard>
  )
}
