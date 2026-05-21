import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SettingResponse } from "@/types/settings"

export type UpdateSettingRequest = {
  value: string
}

const updateSetting = async (
  key: string,
  data: UpdateSettingRequest,
  token: string | undefined
): Promise<SettingResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.put(`${baseUrl}/api/v1/settings/${key}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useUpdateSetting(key: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSettingRequest) => updateSetting(key, data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}
