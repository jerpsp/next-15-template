import * as yup from "yup"

const CreatePostSchema = (t: Function) =>
  yup.object({
    title: yup.string().required(t("validation.required") || "Title is required"),
    slug: yup.string().required(t("validation.required") || "Slug is required"),
    content: yup.string().required(t("validation.required") || "Content is required"),
    excerpt: yup.string().default(""),
    status: yup.string().oneOf(["draft", "published", "archived"]).default("draft"),
    categoryId: yup.string().default(""),
  })

export default CreatePostSchema
