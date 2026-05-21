import { CategoryCreateView } from "@/sections/categories"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Category",
  description: "Create a new category",
}

export default function CreateCategoryPage() {
  return <CategoryCreateView />
}
