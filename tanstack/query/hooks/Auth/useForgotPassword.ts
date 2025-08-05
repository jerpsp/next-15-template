import axios from "axios"
import { useMutation } from "@tanstack/react-query"

export type ForgotPasswordParams = {
  email: string
}

export type ForgotPasswordResponse = {
  status: string
  message: string
}

const forgotPassword = async (
  params: ForgotPasswordParams
): Promise<ForgotPasswordResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  
  if (!baseUrl) {
    throw new Error("API endpoint is not defined")
  }

  const { data } = await axios.post(
    `${baseUrl}/api/v1/users/forgot-password`,
    params
  )
  
  return data
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (params: ForgotPasswordParams) => forgotPassword(params),
  })
}
