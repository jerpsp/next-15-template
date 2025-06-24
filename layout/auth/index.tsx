import { Box } from "@mui/material"
import Navbar from "./navbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ p: 2 }}>
        {children}
      </Box>
    </>
  )
}
