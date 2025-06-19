"use client"

import React from "react"
import { IconButton, useTheme } from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { useThemeContext } from "./theme-context"

export default function ThemeToggle() {
  const theme = useTheme()
  const { mode, toggleThemeMode } = useThemeContext()

  return (
    <IconButton
      onClick={toggleThemeMode}
      color="inherit"
      aria-label="toggle theme"
    >
      {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  )
}
