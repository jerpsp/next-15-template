import { Box } from "@mui/material"

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Box component="main" sx={{ p: 2 }}>
        {children}
      </Box>
    </>
  )
}
