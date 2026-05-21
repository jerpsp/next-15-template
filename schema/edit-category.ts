import * as yup from "yup"

const EditCategorySchema = (t: Function) =>
  yup.object({
    name: yup.string().required(t("validation.required") || "Name is required"),
    slug: yup.string().optional(),
    description: yup.string().optional(),
  })

export default EditCategorySchema
