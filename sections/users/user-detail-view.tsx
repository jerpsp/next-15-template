"use client"

import { useTranslations } from "next-intl"
import { useUser } from "@/tanstack/query/hooks/User/useUser"
import { useRouter } from "next/navigation"
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export default function UserDetailView({ userId }: { userId: string }) {
  const t = useTranslations()
  const router = useRouter()
  const { data, isLoading, error } = useUser(userId)

  const handleBack = () => {
    router.push("/users")
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
          {t("user.userDetailView") || "User Detail"}
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

      {error instanceof Error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Paper
        sx={{ p: 3, display: "flex", flexDirection: "column" }}
        elevation={3}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !data?.user ? (
          <Alert severity="info">
            {t("user.notFound") || "User not found"}
          </Alert>
        ) : (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {t("user.profile") || "User Profile"}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
              <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {t("user.email") || "Email"}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.user.email}
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {t("user.id") || "ID"}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.user.id}
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {t("user.firstName") || "First Name"}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.user.first_name || "-"}
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {t("user.lastName") || "Last Name"}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.user.last_name || "-"}
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: "50%" }, mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {t("user.name") || "Name"}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.user.name || "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  )
}
