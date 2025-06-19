"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  ThemeOptions,
} from "@mui/material/styles"
import { palette } from "./palette"
import { typography } from "./typography"
import { CssBaseline } from "@mui/material"
import {
  ThemeContextProvider,
  useThemeContext,
} from "../components/theme-mode/theme-context"

function ThemeProviderContent({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeContext()

  const theme = createTheme({
    palette: palette(mode),
    typography,
  } as ThemeOptions)
  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  )
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeContextProvider>
      <ThemeProviderContent>{children}</ThemeProviderContent>
    </ThemeContextProvider>
  )
}
