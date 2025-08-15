"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Container, Typography, Box, Button, Alert } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import UserForm from "./user-form"
import { useCreateUser } from "@/tanstack/query/hooks/User/useCreateUser"
import { UserFormData } from "@/types/user"
import { enqueueSnackbar } from "notistack"

export default function UserCreateView() {
  const t = useTranslations()
  const router = useRouter()
  const { mutate, isPending, error, isSuccess } = useCreateUser()
  const [createError, setCreateError] = useState<Error | null>(null)

  const handleBack = () => {
    router.push("/users")
  }

  const handleSubmit = (data: UserFormData) => {
    setCreateError(null)
    // Make sure password is provided for user creation
    if (!data.password) {
      setCreateError(
        new Error(
          t("required", { name: t("password") }) || "Password is required"
        )
      )
      return
    }

    mutate(
      {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            t("user.createSuccess") || "User created successfully",
            { variant: "success" }
          )
          router.push("/users")
        },
        onError: (error) => {
          if (error instanceof Error) {
            setCreateError(error)
          } else {
            setCreateError(new Error("An unknown error occurred"))
          }
          enqueueSnackbar(t("user.createError") || "User creation failed", {
            variant: "error",
          })
        },
      }
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          color="primary"
          fontWeight="bold"
        >
          {t("user.addUser") || "Add User"}
        </Typography>
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        {t("common.back") || "Back"}
      </Button>

      <UserForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        error={createError || (error instanceof Error ? error : null)}
        isEditMode={false}
      />
    </Container>
  )
}
