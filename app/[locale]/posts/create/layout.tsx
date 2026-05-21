"use client"

import { AuthGuard } from "@/auth/guard"

export default function PostCreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
