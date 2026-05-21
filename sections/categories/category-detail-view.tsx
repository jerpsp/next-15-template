"use client"

import { useTranslations } from "next-intl"
import { useCategory } from "@/tanstack/query/hooks/Category/useCategory"
import { useUpdateCategory } from "@/tanstack/query/hooks/Category/useUpdateCategory"
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
import CategoryForm from "./category-form"
import { enqueueSnackbar } from "notistack"
import { CategoryFormData } from "@/types/category"

export default function CategoryDetailView() {
  const { id: categoryId } = useParams<{ id: string }>()
  const t = useTranslations()
  const router = useRouter()
  const { data, isLoading, error } = useCategory(categoryId)
  const {
    mutate: updateCategory,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateCategory(categoryId)
  const [isEditMode, setIsEditMode] = useState(false)
  const [updateFormError, setUpdateFormError] = useState<Error | null>(null)

  const handleBack = () => {
    router.push("/categories")
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setUpdateFormError(null)
  }

  const handleSubmitUpdate = (formData: CategoryFormData) => {
    setUpdateFormError(null)
    updateCategory(formData, {
      onSuccess: () => {
        setIsEditMode(false)
        enqueueSnackbar(
          t("category.updateSuccess") || "Category updated successfully",
          {
            variant: "success",
          }
        )
      },
      onError: (mutationError) => {
        if (mutationError instanceof Error) {
          setUpdateFormError(mutationError)
        } else {
          setUpdateFormError(new Error("An unknown error occurred"))
        }
        enqueueSnackbar(t("category.updateError") || "Category update failed", {
          variant: "error",
        })
      },
    })
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
          {t("category.detail") || "Category Detail"}
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

        {!isEditMode && data?.category && (
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            color="primary"
            onClick={handleEdit}
          >
            {t("category.edit") || "Edit Category"}
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

      {error instanceof Error && !data?.category && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : !data?.category ? (
        <Alert severity="info">
          {t("category.notFound") || "Category not found"}
        </Alert>
      ) : isEditMode ? (
        <CategoryForm
          initialData={data.category}
          onSubmit={handleSubmitUpdate}
          isLoading={isUpdating}
          error={updateFormError || (updateError instanceof Error ? updateError : null)}
          isEditMode={true}
        />
      ) : (
        <Paper
          sx={{ p: 3, display: "flex", flexDirection: "column" }}
          elevation={3}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {t("category.details") || "Category Details"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("category.name") || "Name"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.category.name}
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("category.slug") || "Slug"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.category.slug}
              </Typography>
            </Box>

            <Box sx={{ width: "100%", mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("category.description") || "Description"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.category.description || "-"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  )
}
