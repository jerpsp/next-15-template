import { CategoryDetailView } from "@/sections/categories"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Category",
  description: "Edit category",
}

export default function CategoryDetailPage() {
  return <CategoryDetailView />
}
