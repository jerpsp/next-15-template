import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { MediaListResponse } from "@/types/media"

export type MediaParams = {
  page: number
  limit: number
}

const fetchMedia = async (
  params: MediaParams,
  token: string | undefined
): Promise<MediaListResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const { data } = await axios.get(`${baseUrl}/api/v1/media`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  })
  return data
}

export function useMedia(params: MediaParams = { page: 1, limit: 10 }) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["media", params],
    queryFn: () => fetchMedia(params, accessToken),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}
