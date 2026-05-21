import axios from "axios"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { CategoryListResponse } from "@/types/category"

export type CategoriesParams = {
  page: number
  limit: number
}

const fetchCategories = async (
  params: CategoriesParams,
  token?: string
): Promise<CategoryListResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")

  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const { data } = await axios.get(`${baseUrl}/api/v1/categories`, { headers, params })
  return data
}

export function useCategories(params: CategoriesParams = { page: 1, limit: 10 }) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => fetchCategories(params, accessToken),
    staleTime: 5 * 60 * 1000,
  })
}
