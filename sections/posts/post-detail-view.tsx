"use client"

import { useTranslations } from "next-intl"
import { usePost } from "@/tanstack/query/hooks/Post/usePost"
import { useUpdatePost } from "@/tanstack/query/hooks/Post/useUpdatePost"
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
  Chip,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import PostForm from "./post-form"
import { enqueueSnackbar } from "notistack"
import { PostFormData, PostStatus } from "@/types/post"

const getStatusColor = (status: PostStatus) => {
  if (status === "published") {
    return "success"
  }

  if (status === "archived") {
    return "warning"
  }

  return "default"
}

export default function PostDetailView() {
  const { id: postId } = useParams<{ id: string }>()
  const t = useTranslations()
  const router = useRouter()
  const { data, isLoading, error } = usePost(postId)
  const {
    mutate: updatePost,
    isPending: isUpdating,
    error: updateError,
  } = useUpdatePost(postId)
  const [isEditMode, setIsEditMode] = useState(false)
  const [updateFormError, setUpdateFormError] = useState<Error | null>(null)

  const handleBack = () => {
    router.push("/posts")
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setUpdateFormError(null)
  }

  const handleSubmitUpdate = (formData: PostFormData) => {
    setUpdateFormError(null)
    updatePost(formData, {
      onSuccess: () => {
        setIsEditMode(false)
        enqueueSnackbar(t("post.updateSuccess") || "Post updated successfully", {
          variant: "success",
        })
      },
      onError: (mutationError) => {
        if (mutationError instanceof Error) {
          setUpdateFormError(mutationError)
        } else {
          setUpdateFormError(new Error("An unknown error occurred"))
        }
        enqueueSnackbar(t("post.updateError") || "Post update failed", {
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
          {t("post.detail") || "Post Detail"}
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

        {!isEditMode && data?.post && (
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            color="primary"
            onClick={handleEdit}
          >
            {t("post.edit") || "Edit Post"}
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

      {error instanceof Error && !data?.post && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : !data?.post ? (
        <Alert severity="info">{t("post.notFound") || "Post not found"}</Alert>
      ) : isEditMode ? (
        <PostForm
          initialData={data.post}
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
            {t("post.details") || "Post Details"}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("post.title") || "Title"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.post.title}
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("post.slug") || "Slug"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.post.slug}
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("post.status") || "Status"}
              </Typography>
              <Chip
                size="small"
                label={data.post.status}
                color={getStatusColor(data.post.status)}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("post.category") || "Category"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.post.category_id || "-"}
              </Typography>
            </Box>

            <Box sx={{ width: "100%", mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("post.excerpt") || "Excerpt"}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.post.excerpt || "-"}
              </Typography>
            </Box>

            <Box sx={{ width: "100%", mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t("post.content") || "Content"}
              </Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ whiteSpace: "pre-wrap" }}>
                {data.post.content || "-"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  )
}
