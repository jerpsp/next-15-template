import Navbar from "@/layout/guest/navbar"
import { Box } from "@mui/material"

export default function GuestLayout({
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
