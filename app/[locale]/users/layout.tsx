"use client"

import { AuthGuard, RoleGuard } from "@/auth/guard"
import AuthLayout from "@/layout/auth"

export default function UserListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={["admin", "moderator"]}>
      <AuthGuard>
        <AuthLayout>{children}</AuthLayout>
      </AuthGuard>
    </RoleGuard>
  )
}
