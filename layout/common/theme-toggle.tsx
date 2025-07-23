"use client"

import React from "react"
import {
  IconButton,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { useThemeContext } from "../../components/theme-mode/theme-context"
import { useTranslations } from "next-intl"

export default function ThemeToggle() {
  const { mode, toggleThemeMode } = useThemeContext()
  const t = useTranslations()

  return (
    <MenuItem
      onClick={toggleThemeMode}
      color="inherit"
      aria-label="toggle theme"
    >
      <Stack direction="row" justifyContent="center" spacing={1}>
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        {mode === "dark" ? (
          <Typography>{t("themeToggle.darkMode")}</Typography>
        ) : (
          <Typography>{t("themeToggle.lightMode")}</Typography>
        )}
      </Stack>
    </MenuItem>
  )
}
