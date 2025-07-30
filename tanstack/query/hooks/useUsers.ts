import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"

export type User = {
  id: string
  name: string
  email: string
  first_name: string
  last_name?: string
}

export type UsersResponse = {
  users: User[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export type UsersParams = {
  page: number
  limit: number
}

const fetchUsers = async (
  token: string | undefined,
  params: UsersParams
): Promise<UsersResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) {
    throw new Error("API endpoint is not defined")
  }
  
  if (!token) {
    throw new Error("No access token available")
  }
  
  const { data } = await axios.get(`${baseUrl}/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: params.page,
      limit: params.limit
    }    
  })
  
  return data
}

export function useUsers(params: UsersParams = { page: 1, limit: 10 }) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["users", accessToken, params.page, params.limit],
    queryFn: () => fetchUsers(accessToken, params),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes    
  })
}
