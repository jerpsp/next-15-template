"use client"

import { useState } from "react"
import { Box } from "@mui/material"
import Navbar from "./navbar"
import Sidebar, { drawerWidth } from "./sidebar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar onMenuClick={() => setMobileOpen((prev) => !prev)} />
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
