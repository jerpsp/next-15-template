import { User } from "@/tanstack/query/hooks/User/useUsers"

export type UserFormData = {
  email: string
  first_name: string
  last_name?: string
  password?: string
  confirmPassword?: string
}

export type UserFormProps = {
  initialData?: Partial<User>
  onSubmit: (data: UserFormData) => void
  isLoading: boolean
  error?: Error | null
  isEditMode: boolean
}