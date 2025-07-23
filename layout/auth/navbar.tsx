"use client"

import React from "react"
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material"
import ThemeToggle from "@/layout/common/theme-toggle"
import SignOutButton from "@/layout/common/signout-menu"
import { useSession } from "next-auth/react"
import LanguagePopover from "../common/language-popover"

export default function Navbar() {
  const { data } = useSession()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Next.js 15 App
          </Typography>

          <Box>
            <LanguagePopover />
            <Button
              onClick={handleClick}
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Typography variant="h6" color="text.primary">
                {data?.user?.email}
              </Typography>
            </Button>
          </Box>
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>
          <Divider />
          <ThemeToggle />
          <SignOutButton />
        </Menu>
      </Container>
    </AppBar>
  )
}
