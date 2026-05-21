import { PostCreateView } from "@/sections/posts"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create a new post",
}

export default function CreatePostPage() {
  return <PostCreateView />
}
