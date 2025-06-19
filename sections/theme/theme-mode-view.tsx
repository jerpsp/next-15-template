"use client"

import React from "react"
import { Box, Typography, Paper } from "@mui/material"
import { useThemeContext } from "@/components/theme-mode/theme-context"

export default function ThemeModeDisplay() {
  const { mode } = useThemeContext()

  return (
    <Paper sx={{ p: 2, mt: 2, mb: 2, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6">
          Current Theme Mode: <strong>{mode}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Click the theme toggle button in the navigation bar to switch between
          light and dark modes.
        </Typography>
      </Box>
    </Paper>
  )
}
