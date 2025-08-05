"use client"

import ResetPasswordSchema from "@/schema/reset-password"
import { useResetPassword } from "@/tanstack/query/hooks/Auth/useResetPassword"
import { yupResolver } from "@hookform/resolvers/yup"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function ResetPassword() {
  const t = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const resetPasswordMutation = useResetPassword()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema(t)),
  })

  const onSubmit = async (values: {
    password: string
    confirmPassword: string
  }) => {
    try {
      setIsSubmitting(true)

      const response = await resetPasswordMutation.mutateAsync({
        reset_password_token: searchParams.get("token") ?? "",
        new_password: values.password,
      })
      router.push("/signin")
      if (response.status === "success") {
        enqueueSnackbar(t("resetPassword.passwordResetSuccess"), {
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
        <Typography variant="h5">{t("resetPassword.resetPassword")}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t("resetPassword.enterNewPassword")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <TextField
            {...register("password")}
            margin="normal"
            required
            fullWidth
            id="password"
            label={t("signIn.password") || "Password"}
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={errors.password?.message?.toString()}
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            {...register("confirmPassword")}
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label={t("signIn.confirmPassword") || "Confirm Password"}
            type={showConfirmPassword ? "text" : "password"}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message?.toString()}
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 3 }}
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
