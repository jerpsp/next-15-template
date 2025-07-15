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
  count: number
}

const fetchUsers = async (token: string | undefined): Promise<UsersResponse> => {
  if (!token) {
    throw new Error("No access token available")
  }
  
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  
  return data
}

export function useUsers() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["users", accessToken],
    queryFn: () => fetchUsers(accessToken),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes    
  })
}
