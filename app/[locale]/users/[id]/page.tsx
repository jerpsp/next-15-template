"use client"

import { UserDetailView } from "@/sections/users"
import { useParams } from "next/navigation"

export default function UserDetailPage() {
  const params = useParams<{ id: string }>()

  return <UserDetailView userId={params.id} />
}
