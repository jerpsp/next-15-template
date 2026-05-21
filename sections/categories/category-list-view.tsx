"use client"

import { useTranslations } from "next-intl"
import { useCategories } from "@/tanstack/query/hooks/Category/useCategories"
import { useDeleteCategory } from "@/tanstack/query/hooks/Category/useDeleteCategory"
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
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { enqueueSnackbar } from "notistack"
import ConfirmDialog from "@/components/confirm-dialog"

export default function CategoryListView() {
  const t = useTranslations()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { data, isLoading, error } = useCategories({ page: page + 1, limit: rowsPerPage })
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()

  const displayedCategories = useMemo(() => {
    const rows = data?.categories ?? []
    if (!search) return rows
    return rows.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [data?.categories, search])

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteCategory(deleteTarget, {
      onSuccess: () => {
        enqueueSnackbar("Category deleted", { variant: "success" })
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
            {t("category.list") || "Categories"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.total ?? "—"} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => router.push("/categories/create")}
          size="small"
          sx={{ px: 2 }}
        >
          {t("category.add") || "New Category"}
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search categories…"
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
                {t("category.name") || "Name"}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {t("category.slug") || "Slug"}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {t("category.description") || "Description"}
              </TableCell>
              <TableCell width={80} />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton height={20} /></TableCell>
                    ))}
                  </TableRow>
                ))
              : displayedCategories.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    {t("category.empty") || "No categories found"}
                  </TableCell>
                </TableRow>
              )
              : displayedCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    hover
                    onClick={() => router.push(`/categories/${category.id}`)}
                    sx={{
                      cursor: "pointer",
                      "& .row-actions": { opacity: 0 },
                      "&:hover .row-actions": { opacity: 1 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{category.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {category.slug}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {category.description || "—"}
                    </TableCell>
                    <TableCell align="right">
                      <Box className="row-actions" sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); router.push(`/categories/${category.id}`) }}
                          title="Edit"
                        >
                          <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(category.id) }}
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

      {data && !search && (
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
        title="Delete category"
        description="This category will be permanently deleted."
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
