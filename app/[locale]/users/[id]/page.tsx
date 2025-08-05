import { UserDetailView } from "@/sections/users"
import { Metadata } from "next"
import { useParams } from "next/navigation"

export const metadata: Metadata = {
  title: "User Detail",
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>()

  return <UserDetailView userId={params.id} />
}
