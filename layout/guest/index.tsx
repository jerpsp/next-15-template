import { Box } from "@mui/material"

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      {children}
    </Box>
  )
}
