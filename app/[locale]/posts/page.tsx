import { PostListView } from "@/sections/posts"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Posts",
  description: "Posts",
}

export default function PostsPage() {
  return <PostListView />
}
