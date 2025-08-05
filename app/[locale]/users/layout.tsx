"use client"

import { AuthGuard, RoleGuard } from "@/auth/guard"
import AuthLayout from "@/layout/auth"

export default function UserLayout({
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
