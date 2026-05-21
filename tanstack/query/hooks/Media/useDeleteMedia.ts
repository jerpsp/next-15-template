import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteMedia = async (mediaId: string, token: string | undefined) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.delete(`${baseUrl}/api/v1/media/${mediaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useDeleteMedia() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mediaId: string) => deleteMedia(mediaId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}
