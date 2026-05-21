"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Container, Typography, Box, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CategoryForm from "./category-form"
import { useCreateCategory } from "@/tanstack/query/hooks/Category/useCreateCategory"
import { CategoryFormData } from "@/types/category"
import { enqueueSnackbar } from "notistack"

export default function CategoryCreateView() {
  const t = useTranslations()
  const router = useRouter()
  const { mutate, isPending, error } = useCreateCategory()
  const [createError, setCreateError] = useState<Error | null>(null)

  const handleBack = () => {
    router.push("/categories")
  }

  const handleSubmit = (data: CategoryFormData) => {
    setCreateError(null)
    mutate(data, {
      onSuccess: () => {
        enqueueSnackbar(
          t("category.createSuccess") || "Category created successfully",
          {
            variant: "success",
          }
        )
        router.push("/categories")
      },
      onError: (mutationError) => {
        if (mutationError instanceof Error) {
          setCreateError(mutationError)
        } else {
          setCreateError(new Error("An unknown error occurred"))
        }
        enqueueSnackbar(
          t("category.createError") || "Category creation failed",
          {
            variant: "error",
          }
        )
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
          {t("category.add") || "Add Category"}
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

      <CategoryForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        error={createError || (error instanceof Error ? error : null)}
        isEditMode={false}
      />
    </Container>
  )
}
