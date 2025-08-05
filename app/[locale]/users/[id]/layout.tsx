"use client"

import { AuthGuard, RoleGuard } from "@/auth/guard"
import AuthLayout from "@/layout/auth"

export default function UserDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={["admin"]} redirectTo="/users">
      <AuthGuard>
        <AuthLayout>{children}</AuthLayout>
      </AuthGuard>
    </RoleGuard>
  )
}
