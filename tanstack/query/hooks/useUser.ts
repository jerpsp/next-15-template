import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { User } from "./useUsers"

export type UserResponse = {
  user: User
}

const fetchUser = async (userId: string, token: string | undefined): Promise<UserResponse> => {
  if (!token) {
    throw new Error("No access token available")
  }

  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  
  return data
}

export function useUser(userId: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["user", userId, accessToken],
    queryFn: () => fetchUser(userId, accessToken),
    enabled: !!userId && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes    
  })
}
