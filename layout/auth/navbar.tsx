"use client"

import React from "react"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Chip,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ThemeToggle from "@/layout/common/theme-toggle"
import SignOutButton from "@/layout/common/signout-menu"
import { useSession } from "next-auth/react"
import LanguagePopover from "../common/language-popover"

type NavbarProps = {
  onMenuClick?: () => void
}

const ROLE_COLOR: Record<string, "default" | "primary" | "warning" | "error"> = {
  admin: "error",
  moderator: "warning",
  user: "default",
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data } = useSession()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const email = data?.user?.email ?? ""
  const role = data?.user?.role ?? ""
  const initials = email ? email[0].toUpperCase() : "?"

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ minHeight: 56, px: { xs: 2, md: 3 } }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: "none" }, mr: 1 }}
          size="small"
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ flexGrow: 1, letterSpacing: "-0.01em" }}
        >
          CMS
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LanguagePopover />

          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ gap: 0.75, px: 1, borderRadius: 1.5 }}
          >
            <Avatar sx={{ width: 26, height: 26, fontSize: "0.7rem", bgcolor: "grey.200", color: "text.primary" }}>
              {initials}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="caption" color="text.primary" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                {email.split("@")[0]}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, fontSize: "0.65rem" }}>
                {email}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 200 } } }}
        >
          {/* Profile info header */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {email.split("@")[0]}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              {email}
            </Typography>
            <Chip
              label={role}
              size="small"
              color={ROLE_COLOR[role] ?? "default"}
              sx={{ mt: 0.75, height: 18, fontSize: "0.65rem", fontWeight: 600 }}
            />
          </Box>
          <Divider />
          <ThemeToggle />
          <Divider />
          <SignOutButton />
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
