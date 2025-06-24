"use client"

import { GuestGuard } from "@/auth/guard"
import GuestLayout from "@/layout/guest"

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GuestGuard>
      <GuestLayout>{children}</GuestLayout>
    </GuestGuard>
  )
}
