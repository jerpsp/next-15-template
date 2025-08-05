"use client"

import { AuthGuard } from "@/auth/guard"
import AuthLayout from "@/layout/auth"

export default function DashboardLayout({
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
