"use client"

import { IconButton, MenuItem, Stack, Typography } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

export default function SignOutButton() {
  const t = useTranslations()
  return (
    <MenuItem onClick={() => signOut()} color="inherit" aria-label="sign out">
      <Stack direction="row" justifyContent="center" spacing={1}>
        <LogoutIcon />
        <Typography>{t("signOut")}</Typography>
      </Stack>
    </MenuItem>
  )
}
