import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Category } from "@/types/category"

export type CategoryResponse = {
  category: Category
}

const fetchCategory = async (
  categoryId: string,
  token?: string
): Promise<CategoryResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")

  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const { data } = await axios.get(`${baseUrl}/api/v1/categories/${categoryId}`, { headers })
  return data
}

export function useCategory(categoryId: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategory(categoryId, accessToken),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  })
}
