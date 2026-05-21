import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Post, PostFormData } from "@/types/post"

export type UpdatePostRequest = Partial<PostFormData>

export type UpdatePostResponse = {
  post: Post
}

const updatePost = async (
  postId: string,
  data: UpdatePostRequest,
  token: string | undefined
): Promise<UpdatePostResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.patch(`${baseUrl}/api/v1/posts/${postId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useUpdatePost(postId: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => updatePost(postId, data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
    },
  })
}
