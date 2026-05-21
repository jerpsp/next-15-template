"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  Chip,
  IconButton,
  Skeleton,
} from "@mui/material"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { enqueueSnackbar } from "notistack"
import { useMedia } from "@/tanstack/query/hooks/Media/useMedia"
import { useUploadMedia } from "@/tanstack/query/hooks/Media/useUploadMedia"
import { useDeleteMedia } from "@/tanstack/query/hooks/Media/useDeleteMedia"

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaListView() {
  const t = useTranslations()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { data, isLoading, error } = useMedia()
  const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia()
  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteMedia()

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    uploadMedia(formData, {
      onSuccess: () => enqueueSnackbar(t("media.uploadSuccess") || "Uploaded", { variant: "success" }),
      onError: () => enqueueSnackbar(t("media.uploadError") || "Upload failed", { variant: "error" }),
    })

    event.target.value = ""
  }

  const handleDelete = (mediaId: string) => {
    deleteMedia(mediaId, {
      onSuccess: () => enqueueSnackbar(t("media.deleteSuccess") || "Deleted", { variant: "success" }),
      onError: () => enqueueSnackbar(t("media.deleteError") || "Delete failed", { variant: "error" }),
    })
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t("media.list") || "Media"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.media?.length ?? "—"} files
          </Typography>
        </Box>
        <input ref={inputRef} type="file" hidden onChange={handleUpload} />
        <Button
          variant="contained"
          startIcon={<UploadFileIcon sx={{ fontSize: 16 }} />}
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          size="small"
          sx={{ px: 2 }}
        >
          {t("media.upload") || "Upload"}
        </Button>
      </Box>

      {error instanceof Error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>
      )}

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from(new Array(6)).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <Skeleton variant="rectangular" height={160} />
                <CardContent sx={{ pt: 1.5 }}>
                  <Skeleton width="70%" height={20} />
                  <Skeleton width="40%" height={16} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : !data?.media || data.media.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
          <Typography variant="body2">{t("media.empty") || "No media uploaded yet"}</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {data.media.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                {item.mime_type.startsWith("image/") ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.url}
                    alt={item.original_name}
                    sx={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 160,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "action.hover",
                    }}
                  >
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                  </Box>
                )}
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {item.original_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(item.file_size)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      sx={{ ml: 1, color: "text.secondary", "&:hover": { color: "error.main" } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ mt: 1.5, display: "flex", gap: 0.75 }}>
                    <Chip size="small" label={item.mime_type.split("/")[0]} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
