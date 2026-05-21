import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Post } from "@/types/post"

export type PostResponse = {
  post: Post
}

const fetchPost = async (
  postId: string,
  token?: string
): Promise<PostResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")

  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const { data } = await axios.get(`${baseUrl}/api/v1/posts/${postId}`, { headers })
  return data
}

export function usePost(postId: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId, accessToken),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  })
}
