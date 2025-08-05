import { UserDetailView } from "@/sections/users"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Detail",
}

export default function UserDetailPage() {
  return <UserDetailView />
}
