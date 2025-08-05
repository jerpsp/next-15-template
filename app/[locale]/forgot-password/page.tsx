import { ForgotPasswordView } from "@/sections/reset-password"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />
}
