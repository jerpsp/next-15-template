"use client"

import { useTranslations } from "next-intl"
import { ThemeModeDisplay } from "../theme"
import { useUsers } from "@/tanstack/query/hooks/useUsers"
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
} from "@mui/material"

export default function UserListView() {
  const t = useTranslations()
  const { data, isLoading, error } = useUsers()

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
          <Alert severity="info">No users found</Alert>
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
                {data.users.map((user, index) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{index + 1}</TableCell>
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
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Total Users: {data.count}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  )
}
