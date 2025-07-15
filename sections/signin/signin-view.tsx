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
  Container,
  Avatar,
  CircularProgress,
  Link,
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

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
        // enqueueSnackbar(res?.error, { variant: "error" })
      }
    })
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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            {t("signIn.signIn") || "Sign In"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("signIn.pleaseSignIn") || "Please sign in to continue."}
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
              sx={{ mb: 2 }}
            />

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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                mb: 2,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("signIn.signIn") || "Sign In"
              )}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Link href="#" variant="body2">
                {t("signIn.forgotPassword") || "Forgot password?"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
