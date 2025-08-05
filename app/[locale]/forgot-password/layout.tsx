"use client"

import { GuestGuard } from "@/auth/guard"
import GuestLayout from "@/layout/guest"
import { Metadata } from "next"

export default function ForgotPasswordLayout({
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
