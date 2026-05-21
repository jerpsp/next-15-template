"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"
import SignInSchema from "@/schema/signin"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslations } from "next-intl"
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  CircularProgress,
  Link,
  Divider,
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { enqueueSnackbar } from "notistack"

export default function SignInView() {
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInSchema(t)),
  })

  const onSubmit = (values: { email: string; password: string }) => {
    setIsSubmitting(true)
    signIn("domain-signin", {
      redirect: false,
      email: values.email,
      password: values.password,
      locale: Cookies.get("NEXT_LOCALE"),
    }).then((res) => {
      if (res?.status !== 200) {
        setIsSubmitting(false)
        enqueueSnackbar(res?.error, { variant: "error" })
      }
    })
  }

  return (
    <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {t("signIn.signIn") || "Sign in"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("signIn.pleaseSignIn") || "Enter your credentials to continue."}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("email")}
          fullWidth
          id="email"
          label={t("signIn.email") || "Email"}
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
          autoComplete="email"
          autoFocus
          sx={{ mb: 2 }}
        />

        <TextField
          {...register("password")}
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
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
          sx={{ py: 1.25 }}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            t("signIn.signIn") || "Sign in"
          )}
        </Button>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
          <Link href="/forgot-password" variant="body2" underline="hover" color="text.secondary">
            {t("signIn.forgotPassword") || "Forgot password?"}
          </Link>
        </Box>
      </Box>
    </Paper>
  )
}
