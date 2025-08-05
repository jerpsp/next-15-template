"use client"

import { GuestGuard } from "@/auth/guard"
import GuestLayout from "@/layout/guest"
import { Metadata } from "next"

export default function ResetPasswordLayout({
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
