import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { User } from "./useUsers"

export type CreateUserRequest = {
  email: string
  first_name: string
  last_name?: string
  password: string
}

export type CreateUserResponse = {
  user: User
}

const createUser = async (
  data: CreateUserRequest,
  token: string | undefined
): Promise<CreateUserResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) {
    throw new Error("API endpoint is not defined")
  }

  if (!token) {
    throw new Error("No access token available")
  }

  const response = await axios.post(`${baseUrl}/api/v1/users`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export function useCreateUser() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data, accessToken),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
