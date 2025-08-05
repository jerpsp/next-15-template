import axios from "axios"
import { useMutation } from "@tanstack/react-query"

export type ResetPasswordParams = {
  reset_password_token: string
  new_password: string  
}

export type ResetPasswordResponse = {
  status: string
  message: string
}

const resetPassword = async (
  params: ResetPasswordParams
): Promise<ResetPasswordResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  
  if (!baseUrl) {
    throw new Error("API endpoint is not defined")
  }

  console.log(params)

  const { data } = await axios.patch(
    `${baseUrl}/api/v1/users/reset-password`,
    params
  )
  
  return data
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) => resetPassword(params),
  })
}
