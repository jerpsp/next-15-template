export type PostStatus = "draft" | "published" | "archived"

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: PostStatus
  featured_image: string
  category_id: string | null
  category?: import("@/types/category").Category
  author_id: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface PostFormData {
  title: string
  slug: string
  content: string
  excerpt: string
  status: PostStatus
  featured_image?: string
  category_id?: string | null
}

export interface PostFormProps {
  initialData?: Partial<PostFormData>
  onSubmit: (data: PostFormData) => void
  isLoading?: boolean
  error?: Error | null
  isEditMode?: boolean
}
