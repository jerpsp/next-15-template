"use client"

import { ReactNode } from "react"
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material"
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined"
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined"
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const drawerWidth = 220

type SidebarProps = {
  mobileOpen: boolean
  onClose: () => void
}

type NavigationItem = {
  label: string
  href: string
  icon: ReactNode
  roles?: string[]
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Posts", href: "/posts", icon: <ArticleOutlinedIcon sx={{ fontSize: 18 }} />, roles: ["admin", "moderator"] },
  { label: "Categories", href: "/categories", icon: <CategoryOutlinedIcon sx={{ fontSize: 18 }} />, roles: ["admin", "moderator"] },
  { label: "Media", href: "/media", icon: <PermMediaOutlinedIcon sx={{ fontSize: 18 }} />, roles: ["admin", "moderator"] },
  { label: "Users", href: "/users", icon: <PeopleOutlinedIcon sx={{ fontSize: 18 }} />, roles: ["admin", "moderator"] },
  { label: "Settings", href: "/settings", icon: <SettingsOutlinedIcon sx={{ fontSize: 18 }} />, roles: ["admin"] },
]

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const items = navigationItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(session?.user?.role || "")
  })

  const isActive = (href: string) =>
    pathname === href || pathname?.endsWith(href) || pathname?.includes(`${href}/`)

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, height: 56, display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle2" fontWeight={700} letterSpacing="-0.01em">
          CMS
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 1.5, flexGrow: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.href}
            selected={isActive(item.href)}
            onClick={() => {
              router.push(item.href)
              onClose()
            }}
            sx={{ borderRadius: 1.5, mb: 0.25 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { variant: "body2", fontWeight: isActive(item.href) ? 600 : 400 } }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            position: "relative",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export { drawerWidth }
