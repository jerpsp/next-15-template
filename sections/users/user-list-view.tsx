"use client"

import { useTranslations } from "next-intl"
import { ThemeModeDisplay } from "../theme"
import { useUsers, UsersParams } from "@/tanstack/query/hooks/User/useUsers"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Skeleton,
  TablePagination,
  Button,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

export default function UserListView() {
  const t = useTranslations()
  const router = useRouter()
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const { data, isLoading, error, isFetching } = useUsers({
    page: page + 1,
    limit: rowsPerPage,
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleAddUser = () => {
    router.push("/users/create")
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
          {t("user.userListView") || "User List"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          {t("user.addUser") || "Add User"}
        </Button>
        {/* <ThemeModeDisplay /> */}
      </Box>

      {error instanceof Error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Paper
        sx={{ p: 2, display: "flex", flexDirection: "column" }}
        elevation={3}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !data?.users || data.users.length === 0 ? (
          <Alert severity="info">
            {t("user.noUsersFound") || "No users found"}
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">No</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{t("user.email")}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {t("user.firstName")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {t("user.lastName")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching
                  ? // Skeleton loading state
                    Array.from(new Array(rowsPerPage)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton animation="wave" />
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" />
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" />
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" />
                        </TableCell>
                      </TableRow>
                    ))
                  : data.users.map((user, index) => (
                      <TableRow
                        key={user.id}
                        hover
                        onClick={() => router.push(`/users/${user.id}`)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.first_name}</TableCell>
                        <TableCell>{user.last_name}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {data && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${t("pagination.of") || "of"} ${
                count !== -1
                  ? count
                  : `${t("pagination.moreThan") || "more than"} ${to}`
              }`
            }
            labelRowsPerPage={t("pagination.rowsPerPage") || "Rows per page:"}
          />
        )}
      </Paper>
    </Container>
  )
}
