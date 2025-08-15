import { UserCreateView } from "@/sections/users"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create User",
  description: "Create a new user",
}

export default function Page() {
  return <UserCreateView />
}
