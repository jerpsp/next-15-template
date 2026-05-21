import * as yup from "yup"

const EditPostSchema = (t: Function) =>
  yup.object({
    title: yup.string().required(t("validation.required") || "Title is required"),
    slug: yup.string().optional(),
    content: yup.string().optional(),
    excerpt: yup.string().optional(),
    status: yup.string().oneOf(["draft", "published", "archived"]).optional(),
    categoryId: yup.string().optional(),
  })

export default EditPostSchema
