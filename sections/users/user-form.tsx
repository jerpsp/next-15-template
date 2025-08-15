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
} from "@mui/material"
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
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
    // For edit mode, if password is empty, remove it from submitted data
    if (isEditMode && !data.password) {
      const { password, confirmPassword, ...dataWithoutPassword } = data
      onSubmit(dataWithoutPassword)
    } else {
      const { confirmPassword, ...submitData } = data
      onSubmit(submitData)
    }
  }

  return (
    <Paper sx={{ p: 3 }} elevation={3}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {isEditMode
          ? t("user.editUser") || "Edit User"
          : t("user.addUser") || "Add User"}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onFormSubmit as any)}
        noValidate
      >
        <TextField
          {...register("email")}
          margin="normal"
          required
          fullWidth
          id="email"
          label={t("user.email") || "Email"}
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isLoading}
        />

        <TextField
          {...register("first_name")}
          margin="normal"
          required
          fullWidth
          id="first_name"
          label={t("user.firstName") || "First Name"}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          disabled={isLoading}
        />

        <TextField
          {...register("last_name")}
          margin="normal"
          fullWidth
          id="last_name"
          label={t("user.lastName") || "Last Name"}
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          disabled={isLoading}
        />

        {!isEditMode && (
          <>
            <TextField
              {...register("password")}
              margin="normal"
              required
              fullWidth
              type="password"
              id="password"
              label={t("password") || "Password"}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />

            <TextField
              {...register("confirmPassword")}
              margin="normal"
              required
              fullWidth
              type="password"
              id="confirmPassword"
              label={t("confirmPassword") || "Confirm Password"}
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
            />
          </>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ position: "relative" }}
          >
            {isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
            {isEditMode
              ? t("user.editUser") || "Update User"
              : t("user.addUser") || "Create User"}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
