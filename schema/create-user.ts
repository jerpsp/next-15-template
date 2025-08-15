import { TranslationProps } from "@/locales/request"
import * as Yup from "yup"

export default function CreateUserSchema(t: TranslationProps) {
  return Yup.object({
    email: Yup.string().required(t("required", { name: t("email") })).email(t("user.invalidEmail") || "Invalid email format"),
    first_name: Yup.string().required(t("required", { name: t("user.firstName") })),
    last_name: Yup.string(),
    password: Yup.string().required(t("required", { name: t("password") })),
    confirmPassword: Yup.string().required(t("required", { name: t("confirmPassword") })).oneOf([Yup.ref("password")], t("passwordsMustMatch")),
  })
}

