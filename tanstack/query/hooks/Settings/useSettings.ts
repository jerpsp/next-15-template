import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { SettingsListResponse } from "@/types/settings"

const fetchSettings = async (token: string | undefined): Promise<SettingsListResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const { data } = await axios.get(`${baseUrl}/api/v1/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export function useSettings() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchSettings(accessToken),
    enabled: !!accessToken,
    staleTime: 10 * 60 * 1000,
  })
}
