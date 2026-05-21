"use client"

import { AuthGuard } from "@/auth/guard"

export default function PostDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
