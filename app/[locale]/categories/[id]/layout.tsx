"use client"

import { AuthGuard } from "@/auth/guard"

export default function CategoryDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
