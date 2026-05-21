export interface Category {
  id: string
  name: string
  slug: string
  description: string
  created_at: string
  updated_at: string
}

export interface CategoryListResponse {
  categories: Category[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface CategoryFormData {
  name: string
  slug: string
  description: string
}

export interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>
  onSubmit: (data: CategoryFormData) => void
  isLoading?: boolean
  error?: Error | null
  isEditMode?: boolean
}
