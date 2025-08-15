"use client"

import { useTranslations } from "next-intl"
import { useUser } from "@/tanstack/query/hooks/User/useUser"
import { useUpdateUser } from "@/tanstack/query/hooks/User/useUpdateUser"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import UserForm from "./user-form"
import { enqueueSnackbar } from "notistack"
import { UserFormData } from "@/types/user"

export default function UserDetailView() {
  const { id: userID } = useParams<{ id: string }>()
  const t = useTranslations()
  const router = useRouter()
  const { data, isLoading, error } = useUser(userID)
  const {
    mutate: updateUser,
    isPending: isUpdating,
    error: updateError,
    isSuccess: updateSuccess,
  } = useUpdateUser(userID)
  const [isEditMode, setIsEditMode] = useState(false)
  const [updateFormError, setUpdateFormError] = useState<Error | null>(null)

  const handleBack = () => {
    router.push("/users")
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setUpdateFormError(null)
  }

  const handleSubmitUpdate = (formData: UserFormData) => {
    setUpdateFormError(null)
    updateUser(
      {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      },
      {
        onSuccess: () => {
          setIsEditMode(false)
          enqueueSnackbar(
            t("user.updateSuccess") || "User updated successfully",
            { variant: "success" }
          )
        },
        onError: (error) => {
          if (error instanceof Error) {
            setUpdateFormError(error)
          } else {
            setUpdateFormError(new Error("An unknown error occurred"))
          }
          enqueueSnackbar(t("user.updateError") || "User update failed", {
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
          {t("user.userDetailView") || "User Detail"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={handleBack}
        >
          {t("common.back") || "Back"}
        </Button>

        {!isEditMode && data?.user && (
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            color="primary"
            onClick={handleEdit}
          >
            {t("user.editUser") || "Edit User"}
          </Button>
        )}

        {isEditMode && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelEdit}
          >
            {t("common.cancel") || "Cancel"}
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : !data?.user ? (
        <Alert severity="info">{t("user.notFound") || "User not found"}</Alert>
      ) : isEditMode ? (
        <UserForm
          initialData={data.user}
          onSubmit={handleSubmitUpdate}
          isLoading={isUpdating}
          error={
            updateFormError ||
            (updateError instanceof Error ? updateError : null)
          }
          isEditMode={true}
        />
      ) : (
        <Paper
          sx={{ p: 3, display: "flex", flexDirection: "column" }}
          elevation={3}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {t("user.profile") || "User Profile"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("user.email") || "Email"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.user.email}
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("user.id") || "ID"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.user.id}
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("user.firstName") || "First Name"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.user.first_name || "-"}
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("user.lastName") || "Last Name"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.user.last_name || "-"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  )
}
