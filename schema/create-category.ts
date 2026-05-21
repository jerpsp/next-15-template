import * as yup from "yup"

const CreateCategorySchema = (t: Function) =>
  yup.object({
    name: yup.string().required(t("validation.required") || "Name is required"),
    slug: yup.string().required(t("validation.required") || "Slug is required"),
    description: yup.string().default(""),
  })

export default CreateCategorySchema
