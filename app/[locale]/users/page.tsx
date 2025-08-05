import { UserListView } from "@/sections/users"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "List Users",
  description: "List of users",
}

export default function UsersPage() {
  return <UserListView />
}
