import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { User } from "./useUsers"

export type UpdateUserRequest = {
  email?: string
  first_name?: string
  last_name?: string
}

export type UpdateUserResponse = {
  user: User
}

const updateUser = async (
  userId: string,
  data: UpdateUserRequest,
  token: string | undefined
): Promise<UpdateUserResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) {
    throw new Error("API endpoint is not defined")
  }

  if (!token) {
    throw new Error("No access token available")
  }

  const response = await axios.patch(`${baseUrl}/api/v1/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export function useUpdateUser(userId: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(userId, data, accessToken),
    onSuccess: () => {
      // Invalidate and refetch the specific user and the users list
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
