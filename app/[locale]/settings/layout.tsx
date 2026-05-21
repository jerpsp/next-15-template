"use client"

import { AuthGuard, RoleGuard } from "@/auth/guard"
import AuthLayout from "@/layout/auth"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AuthGuard>
        <AuthLayout>{children}</AuthLayout>
      </AuthGuard>
    </RoleGuard>
  )
}
