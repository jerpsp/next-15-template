"use client"

import { Typography, Container, Box } from "@mui/material"
import { useSession } from "next-auth/react"

export default function DashboardView() {
  const { data } = useSession()
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your dashboard. This page is only accessible for users with
          the role <strong>{data?.user?.role}</strong>.
        </Typography>
      </Box>
    </Container>
  )
}
