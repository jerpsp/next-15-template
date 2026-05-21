import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Category, CategoryFormData } from "@/types/category"

export type CreateCategoryResponse = {
  category: Category
}

const createCategory = async (
  data: CategoryFormData,
  token: string | undefined
): Promise<CreateCategoryResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.post(`${baseUrl}/api/v1/categories`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useCreateCategory() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategoryFormData) => createCategory(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
