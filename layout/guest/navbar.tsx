"use client"

import React from "react"
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material"
import ThemeToggle from "@/components/theme-mode/theme-toggle"

export default function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Next.js 15 App
          </Typography>

          <Box>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
