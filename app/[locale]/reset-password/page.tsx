import { ResetPasswordView } from "@/sections/reset-password"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
}

export default function ResetPasswordPage() {
  return <ResetPasswordView />
}
