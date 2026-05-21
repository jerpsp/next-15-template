export interface Media {
  id: string
  file_name: string
  original_name: string
  mime_type: string
  file_size: number
  storage_key: string
  url: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface MediaListResponse {
  media: Media[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
