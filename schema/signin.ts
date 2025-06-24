import { TranslationProps } from "@/locales/request"
import * as Yup from "yup"

export default function SignInSchema(t: TranslationProps) {
  return Yup.object({
    email: Yup.string()
      .max(10000)
      .required(t("required", { name: t("email") })),
    password: Yup.string().required(t("required", { name: t("password") })),
  })
}
