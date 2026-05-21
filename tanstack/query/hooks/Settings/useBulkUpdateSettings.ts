import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SettingsListResponse } from "@/types/settings"

export type BulkUpdateSettingsRequest = {
  settings: Record<string, string>
}

const bulkUpdateSettings = async (
  data: BulkUpdateSettingsRequest,
  token: string | undefined
): Promise<SettingsListResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.put(`${baseUrl}/api/v1/settings`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useBulkUpdateSettings() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkUpdateSettingsRequest) => bulkUpdateSettings(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}
