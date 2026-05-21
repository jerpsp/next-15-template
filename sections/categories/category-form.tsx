"use client"

import { useEffect, useRef } from "react"
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
import kebabCase from "lodash/kebabCase"
import CreateCategorySchema from "@/schema/create-category"
import EditCategorySchema from "@/schema/edit-category"
import { CategoryFormData, CategoryFormProps } from "@/types/category"

export default function CategoryForm({
  initialData,
  onSubmit,
  isLoading,
  error,
  isEditMode,
}: CategoryFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const previousGeneratedSlug = useRef(initialData?.slug || "")
  const validationSchema: any = isEditMode ? EditCategorySchema(t) : CreateCategorySchema(t)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
    },
    resolver: yupResolver(validationSchema) as any,
  })

  const name = watch("name")

  useEffect(() => {
    const nextSlug = kebabCase(name || "")
    const currentSlug = getValues("slug")
    if (!currentSlug || currentSlug === previousGeneratedSlug.current) {
      setValue("slug", nextSlug, { shouldValidate: true })
      previousGeneratedSlug.current = nextSlug
    }
  }, [getValues, name, setValue])

  const onFormSubmit: SubmitHandler<CategoryFormData> = (data) => { onSubmit(data) }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEditMode ? t("category.edit") || "Edit Category" : t("category.add") || "New Category"}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            {...register("name")}
            required
            fullWidth
            label={t("category.name") || "Name"}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading}
          />

          <TextField
            {...register("slug")}
            required
            fullWidth
            label={t("category.slug") || "Slug"}
            error={!!errors.slug}
            helperText={errors.slug?.message}
            disabled={isLoading}
          />

          <TextField
            {...register("description")}
            fullWidth
            multiline
            rows={4}
            label={t("category.description") || "Description"}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={isLoading}
          />

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
            <Button type="submit" variant="contained" size="small" disabled={isLoading} sx={{ minWidth: 100 }}>
              {isLoading
                ? <CircularProgress size={16} color="inherit" />
                : isEditMode ? t("category.update") || "Update" : t("category.create") || "Create"
              }
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}
