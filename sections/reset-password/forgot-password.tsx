"use client"

import ForgotPasswordSchema from "@/schema/forgot-password"
import { useForgotPassword } from "@/tanstack/query/hooks/Auth/useForgotPassword"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function ForgotPassword() {
  const t = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const forgotPasswordMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema(t)),
  })

  const onSubmit = async (values: { email: string }) => {
    try {
      setIsSubmitting(true)

      const response = await forgotPasswordMutation.mutateAsync({
        email: values.email,
      })
      router.push("/signin")
      if (response.status === "success") {
        enqueueSnackbar(t("resetPassword.emailSent", { email: values.email }), {
          variant: "success",
        })
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      enqueueSnackbar(
        error.response?.data?.message || "An error occurred. Please try again.",
        { variant: "error" }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          my: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">
          {t("resetPassword.forgotPassword")}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t("resetPassword.enterEmail")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <TextField
            {...register("email")}
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("signIn.email") || "Email Address"}
            error={!!errors.email}
            helperText={errors.email?.message?.toString()}
            autoComplete="email"
            autoFocus
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? "Sending..." : t("resetPassword.submit")}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
