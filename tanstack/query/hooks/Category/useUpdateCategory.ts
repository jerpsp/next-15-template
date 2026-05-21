import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Category, CategoryFormData } from "@/types/category"

export type UpdateCategoryRequest = Partial<CategoryFormData>

export type UpdateCategoryResponse = {
  category: Category
}

const updateCategory = async (
  categoryId: string,
  data: UpdateCategoryRequest,
  token: string | undefined
): Promise<UpdateCategoryResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.patch(`${baseUrl}/api/v1/categories/${categoryId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useUpdateCategory(categoryId: string) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(categoryId, data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] })
    },
  })
}
