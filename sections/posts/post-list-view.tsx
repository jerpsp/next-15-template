"use client"

import { useTranslations } from "next-intl"
import { usePosts } from "@/tanstack/query/hooks/Post/usePosts"
import { useDeletePost } from "@/tanstack/query/hooks/Post/useDeletePost"
import { useCategories } from "@/tanstack/query/hooks/Category/useCategories"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Skeleton,
  TablePagination,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { enqueueSnackbar } from "notistack"
import { PostStatus } from "@/types/post"
import ConfirmDialog from "@/components/confirm-dialog"

const STATUS_COLOR: Record<PostStatus, "default" | "success" | "warning" | "error"> = {
  published: "success",
  draft: "warning",
  archived: "default",
}

const STATUS_OPTIONS = ["", "published", "draft", "archived"] as const

export default function PostListView() {
  const t = useTranslations()
  const router = useRouter()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { data, isLoading, error } = usePosts({ page: page + 1, limit: rowsPerPage })
  const { data: categoriesData } = useCategories({ page: 1, limit: 100 })
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  const categoryMap = useMemo(
    () => Object.fromEntries((categoriesData?.categories ?? []).map((c) => [c.id, c.name])),
    [categoriesData]
  )

  const displayedPosts = useMemo(() => {
    let rows = data?.posts ?? []
    if (search) rows = rows.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    if (statusFilter) rows = rows.filter((p) => p.status === statusFilter)
    return rows
  }, [data?.posts, search, statusFilter])

  const handleDelete = () => {
    if (!deleteTarget) return
    deletePost(deleteTarget, {
      onSuccess: () => {
        enqueueSnackbar("Post deleted", { variant: "success" })
        setDeleteTarget(null)
      },
      onError: () => enqueueSnackbar("Delete failed", { variant: "error" }),
    })
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t("post.list") || "Posts"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.total ?? "—"} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => router.push("/posts/create")}
          size="small"
          sx={{ px: 2 }}
        >
          {t("post.add") || "New Post"}
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          sx={{ minWidth: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={statusFilter}
          onChange={(_, v) => { setStatusFilter(v ?? ""); setPage(0) }}
          sx={{ height: 40 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <ToggleButton key={s} value={s} sx={{ px: 1.5, textTransform: "none", fontSize: "0.8rem" }}>
              {s || "All"}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {error instanceof Error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>
      )}

      <Divider sx={{ mb: 0 }} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {t("post.title") || "Title"}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {t("post.status") || "Status"}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {t("post.category") || "Category"}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {t("post.createdAt") || "Created"}
              </TableCell>
              <TableCell width={80} />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}><Skeleton height={20} /></TableCell>
                    ))}
                  </TableRow>
                ))
              : displayedPosts.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    {t("post.empty") || "No posts found"}
                  </TableCell>
                </TableRow>
              )
              : displayedPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    hover
                    onClick={() => router.push(`/posts/${post.id}`)}
                    sx={{
                      cursor: "pointer",
                      "& .row-actions": { opacity: 0 },
                      "&:hover .row-actions": { opacity: 1 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{post.title}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={post.status}
                        color={STATUS_COLOR[post.status]}
                        sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {categoryMap[post.category_id ?? ""] ?? "—"}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <Box className="row-actions" sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); router.push(`/posts/${post.id}`) }}
                          title="Edit"
                        >
                          <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(post.id) }}
                          title="Delete"
                          sx={{ "&:hover": { color: "error.main" } }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data && !search && !statusFilter && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
          labelRowsPerPage={t("pagination.rowsPerPage") || "Per page:"}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete post"
        description="This post will be permanently deleted."
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
