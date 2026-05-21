"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Container, Typography, Box, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PostForm from "./post-form"
import { useCreatePost } from "@/tanstack/query/hooks/Post/useCreatePost"
import { PostFormData } from "@/types/post"
import { enqueueSnackbar } from "notistack"

export default function PostCreateView() {
  const t = useTranslations()
  const router = useRouter()
  const { mutate, isPending, error } = useCreatePost()
  const [createError, setCreateError] = useState<Error | null>(null)

  const handleBack = () => {
    router.push("/posts")
  }

  const handleSubmit = (data: PostFormData) => {
    setCreateError(null)
    mutate(data, {
      onSuccess: () => {
        enqueueSnackbar(t("post.createSuccess") || "Post created successfully", {
          variant: "success",
        })
        router.push("/posts")
      },
      onError: (mutationError) => {
        if (mutationError instanceof Error) {
          setCreateError(mutationError)
        } else {
          setCreateError(new Error("An unknown error occurred"))
        }
        enqueueSnackbar(t("post.createError") || "Post creation failed", {
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
          {t("post.add") || "Add Post"}
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

      <PostForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        error={createError || (error instanceof Error ? error : null)}
        isEditMode={false}
      />
    </Container>
  )
}
