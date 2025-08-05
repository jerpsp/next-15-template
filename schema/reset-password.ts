import { TranslationProps } from "@/locales/request"
import * as Yup from "yup"

export default function ResetPasswordSchema(t: TranslationProps) {
  return Yup.object({    
    password: Yup.string().required(t("required", { name: t("password") })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("passwordsMustMatch"))
      .required(t("required", { name: t("confirmPassword") })),
  })
}
