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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import kebabCase from "lodash/kebabCase"
import CreatePostSchema from "@/schema/create-post"
import EditPostSchema from "@/schema/edit-post"
import { PostFormData, PostFormProps } from "@/types/post"
import { useCategories } from "@/tanstack/query/hooks/Category/useCategories"

export default function PostForm({
  initialData,
  onSubmit,
  isLoading,
  error,
  isEditMode,
}: PostFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const previousGeneratedSlug = useRef(initialData?.slug || "")
  const validationSchema: any = isEditMode ? EditPostSchema(t) : CreatePostSchema(t)
  const { data: categoriesData } = useCategories({ page: 1, limit: 100 })

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      status: initialData?.status || "draft",
      category_id: initialData?.category_id || "",
    },
    resolver: yupResolver(validationSchema) as any,
  })

  const title = watch("title")

  useEffect(() => {
    const nextSlug = kebabCase(title || "")
    const currentSlug = getValues("slug")
    if (!currentSlug || currentSlug === previousGeneratedSlug.current) {
      setValue("slug", nextSlug, { shouldValidate: true })
      previousGeneratedSlug.current = nextSlug
    }
  }, [getValues, setValue, title])

  const onFormSubmit: SubmitHandler<PostFormData> = (data) => { onSubmit(data) }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEditMode ? t("post.edit") || "Edit Post" : t("post.add") || "New Post"}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            {...register("title")}
            required
            fullWidth
            label={t("post.title") || "Title"}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isLoading}
          />

          <TextField
            {...register("slug")}
            required
            fullWidth
            label={t("post.slug") || "Slug"}
            error={!!errors.slug}
            helperText={errors.slug?.message}
            disabled={isLoading}
          />

          <TextField
            {...register("content")}
            required
            fullWidth
            multiline
            rows={8}
            label={t("post.content") || "Content"}
            error={!!errors.content}
            helperText={errors.content?.message}
            disabled={isLoading}
          />

          <TextField
            {...register("excerpt")}
            fullWidth
            multiline
            rows={3}
            label={t("post.excerpt") || "Excerpt"}
            error={!!errors.excerpt}
            helperText={errors.excerpt?.message}
            disabled={isLoading}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth disabled={isLoading}>
                  <InputLabel>{t("post.status") || "Status"}</InputLabel>
                  <Select {...field} label={t("post.status") || "Status"}>
                    <MenuItem value="draft">{t("post.draft") || "Draft"}</MenuItem>
                    <MenuItem value="published">{t("post.published") || "Published"}</MenuItem>
                    <MenuItem value="archived">{t("post.archived") || "Archived"}</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth disabled={isLoading}>
                  <InputLabel>{t("post.category") || "Category"}</InputLabel>
                  <Select {...field} label={t("post.category") || "Category"}>
                    <MenuItem value="">{t("post.noCategory") || "None"}</MenuItem>
                    {(categoriesData?.categories || []).map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

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
                : isEditMode ? t("post.update") || "Update" : t("post.create") || "Create"
              }
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}
