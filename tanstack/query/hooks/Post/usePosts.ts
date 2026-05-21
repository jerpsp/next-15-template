import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { PostListResponse } from "@/types/post"

export type PostsParams = {
  page: number
  limit: number
  status?: string
  category_id?: string
}

const fetchPosts = async (
  params: PostsParams,
  token?: string
): Promise<PostListResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")

  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const { data } = await axios.get(`${baseUrl}/api/v1/posts`, { headers, params })
  return data
}

export function usePosts(params: PostsParams = { page: 1, limit: 10 }) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params, accessToken),
    staleTime: 5 * 60 * 1000,
  })
}
