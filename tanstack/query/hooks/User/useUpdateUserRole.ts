import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type UpdateUserRoleRequest = {
  role: "admin" | "moderator" | "user"
}

const updateUserRole = async (
  userId: string,
  data: UpdateUserRoleRequest,
  token: string | undefined
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.patch(`${baseUrl}/api/v1/users/${userId}/role`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useUpdateUserRole(userId: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRoleRequest) => updateUserRole(userId, data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
