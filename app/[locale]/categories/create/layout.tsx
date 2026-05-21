"use client"

import { AuthGuard } from "@/auth/guard"

export default function CategoryCreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
