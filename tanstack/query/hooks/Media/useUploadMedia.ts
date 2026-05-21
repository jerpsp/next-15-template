import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Media } from "@/types/media"

export type UploadMediaResponse = {
  media: Media
}

const uploadMedia = async (
  data: FormData,
  token: string | undefined
): Promise<UploadMediaResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.post(`${baseUrl}/api/v1/media`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useUploadMedia() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormData) => uploadMedia(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}
