"use client"

import { useTranslations } from "next-intl"
import { useUsers } from "@/tanstack/query/hooks/User/useUsers"
import { useDeleteUser } from "@/tanstack/query/hooks/User/useDeleteUser"
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
  Avatar,
  Divider,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { enqueueSnackbar } from "notistack"
import ConfirmDialog from "@/components/confirm-dialog"

function nameInitials(name: string) {
  const parts = name?.trim().split(" ") ?? []
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (parts[0]?.[0] ?? "?").toUpperCase()
}

export default function UserListView() {
  const t = useTranslations()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { data, isLoading, error } = useUsers({ page: page + 1, limit: rowsPerPage })
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

  const displayedUsers = useMemo(() => {
    const rows = data?.users ?? []
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.first_name?.toLowerCase().includes(q) ||
        u.last_name?.toLowerCase().includes(q)
    )
  }, [data?.users, search])

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteUser(deleteTarget, {
      onSuccess: () => {
        enqueueSnackbar("User deleted", { variant: "success" })
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
            {t("user.userListView") || "Users"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.total ?? "—"} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => router.push("/users/create")}
          size="small"
          sx={{ px: 2 }}
        >
          {t("user.addUser") || "New User"}
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search users…"
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
                {t("user.name") || "Name"}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                {t("user.email") || "Email"}
              </TableCell>
              <TableCell width={80} />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <TableCell key={j}><Skeleton height={20} /></TableCell>
                    ))}
                  </TableRow>
                ))
              : displayedUsers.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    {t("user.noUsersFound") || "No users found"}
                  </TableCell>
                </TableRow>
              )
              : displayedUsers.map((user) => {
                  const fullName = user.name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "—"
                  return (
                    <TableRow
                      key={user.id}
                      hover
                      onClick={() => router.push(`/users/${user.id}`)}
                      sx={{
                        cursor: "pointer",
                        "& .row-actions": { opacity: 0 },
                        "&:hover .row-actions": { opacity: 1 },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              bgcolor: "grey.200",
                              color: "text.primary",
                              flexShrink: 0,
                            }}
                          >
                            {nameInitials(fullName)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {fullName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                      <TableCell align="right">
                        <Box className="row-actions" sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); router.push(`/users/${user.id}`) }}
                            title="Edit"
                          >
                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(user.id) }}
                            title="Delete"
                            sx={{ "&:hover": { color: "error.main" } }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
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
        title="Delete user"
        description="This user will be permanently deleted."
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
