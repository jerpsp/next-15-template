import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Post, PostFormData } from "@/types/post"

export type CreatePostResponse = {
  post: Post
}

const createPost = async (
  data: PostFormData,
  token: string | undefined
): Promise<CreatePostResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.post(`${baseUrl}/api/v1/posts`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useCreatePost() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PostFormData) => createPost(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
