import { SignInView } from "@/sections/signin"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
}

export default function SignInPage() {
  return <SignInView />
}
