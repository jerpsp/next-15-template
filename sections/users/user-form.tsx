"use client"

import { useTranslations } from "next-intl"
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Divider,
  Stack,
} from "@mui/material"
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import CreateUserSchema from "@/schema/create-user"
import EditUserSchema from "@/schema/edit-user"
import { UserFormData, UserFormProps } from "@/types/user"

export default function UserForm({
  initialData,
  onSubmit,
  isLoading,
  error,
  isEditMode,
}: UserFormProps) {
  const t = useTranslations()
  const router = useRouter()

  const validationSchema = isEditMode ? EditUserSchema(t) : CreateUserSchema(t)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      email: initialData?.email || "",
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(validationSchema) as any,
  })

  const onFormSubmit: SubmitHandler<UserFormData> = (data) => {
    if (isEditMode && !data.password) {
      const { password, confirmPassword, ...dataWithoutPassword } = data
      onSubmit(dataWithoutPassword)
    } else {
      const { confirmPassword, ...submitData } = data
      onSubmit(submitData)
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 640 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEditMode ? t("user.editUser") || "Edit User" : t("user.addUser") || "New User"}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onFormSubmit as any)} noValidate>
        <Stack spacing={2}>
          <TextField
            {...register("email")}
            required
            fullWidth
            label={t("user.email") || "Email"}
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              {...register("first_name")}
              required
              fullWidth
              label={t("user.firstName") || "First Name"}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              disabled={isLoading}
            />
            <TextField
              {...register("last_name")}
              fullWidth
              label={t("user.lastName") || "Last Name"}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              disabled={isLoading}
            />
          </Box>

          {!isEditMode && (
            <>
              <TextField
                {...register("password")}
                required
                fullWidth
                type="password"
                label={t("password") || "Password"}
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isLoading}
              />
              <TextField
                {...register("confirmPassword")}
                required
                fullWidth
                type="password"
                label={t("confirmPassword") || "Confirm Password"}
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isLoading}
              />
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 1 }}>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isLoading}
              sx={{ minWidth: 100 }}
            >
              {isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : isEditMode ? (
                t("user.editUser") || "Update"
              ) : (
                t("user.addUser") || "Create"
              )}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}
