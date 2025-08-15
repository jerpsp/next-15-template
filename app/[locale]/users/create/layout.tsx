"use client"

import { AuthGuard, RoleGuard } from "@/auth/guard"
import AuthLayout from "@/layout/auth"

export default function UserCreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AuthGuard>{children}</AuthGuard>
    </RoleGuard>
  )
}
