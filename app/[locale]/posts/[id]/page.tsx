import { PostDetailView } from "@/sections/posts"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit post",
}

export default function PostDetailPage() {
  return <PostDetailView />
}
