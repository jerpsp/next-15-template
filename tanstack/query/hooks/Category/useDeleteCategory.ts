import axios from "axios"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteCategory = async (categoryId: string, token: string | undefined) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (!baseUrl) throw new Error("API endpoint is not defined")
  if (!token) throw new Error("No access token available")

  const response = await axios.delete(`${baseUrl}/api/v1/categories/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export function useDeleteCategory() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
