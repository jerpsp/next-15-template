"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  ThemeOptions,
} from "@mui/material/styles"
import { palette, grey } from "./palette"
import { typography } from "./typography"
import { CssBaseline } from "@mui/material"
import {
  ThemeContextProvider,
  useThemeContext,
} from "../components/theme-mode/theme-context"

function ThemeProviderContent({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeContext()
  const p = palette(mode)
  const isLight = mode === "light"

  const theme = createTheme({
    palette: p,
    typography,
    shape: { borderRadius: 8 },
    shadows: [
      "none",
      "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "0 1px 3px 0 rgb(0 0 0 / 0.07)",
      "0 2px 6px 0 rgb(0 0 0 / 0.07)",
      "0 4px 12px 0 rgb(0 0 0 / 0.08)",
      "none", "none", "none", "none", "none",
      "none", "none", "none", "none", "none",
      "none", "none", "none", "none", "none",
      "none", "none", "none", "none", "none",
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*, *::before, *::after": { boxSizing: "border-box" },
          body: {
            backgroundColor: p.background.default,
            color: p.text.primary,
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: "inherit" },
        styleOverrides: {
          root: {
            backgroundColor: p.background.paper,
            borderBottom: `1px solid ${p.divider}`,
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0, variant: "outlined" },
        styleOverrides: {
          root: { backgroundImage: "none" },
          outlined: { borderColor: p.divider },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { border: `1px solid ${p.divider}`, backgroundImage: "none" },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${p.divider}`,
            boxShadow: "none",
            backgroundColor: p.background.paper,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            letterSpacing: 0,
          },
          containedPrimary: {
            backgroundColor: p.primary.main,
            "&:hover": { backgroundColor: p.primary.dark },
          },
          outlinedPrimary: {
            borderColor: p.divider,
            color: p.text.primary,
            "&:hover": { backgroundColor: p.action.hover, borderColor: p.divider },
          },
          text: {
            "&:hover": { backgroundColor: p.action.hover },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            "&:hover": { backgroundColor: p.action.hover },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small", variant: "outlined" },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: p.divider },
              "&:hover fieldset": { borderColor: p.grey[400] },
              "&.Mui-focused fieldset": { borderColor: p.primary.main, borderWidth: 1 },
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { fontSize: "0.875rem" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: { borderColor: p.divider },
        },
      },
      MuiSelect: {
        defaultProps: { size: "small" },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 4, fontWeight: 500, fontSize: "0.75rem" },
          colorSuccess: {
            backgroundColor: isLight ? "#DCFCE7" : "#14532D",
            color: isLight ? "#15803D" : "#86EFAC",
            border: "none",
          },
          colorWarning: {
            backgroundColor: isLight ? "#FEF3C7" : "#78350F",
            color: isLight ? "#B45309" : "#FCD34D",
            border: "none",
          },
          colorError: {
            backgroundColor: isLight ? "#FEE2E2" : "#7F1D1D",
            color: isLight ? "#B91C1C" : "#FCA5A5",
            border: "none",
          },
          colorDefault: {
            backgroundColor: isLight ? grey[100] : grey[700],
            color: isLight ? grey[700] : grey[300],
            border: "none",
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: { borderCollapse: "collapse" },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: { boxShadow: "none", border: `1px solid ${p.divider}`, borderRadius: 8 },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? grey[50] : grey[800],
            "& .MuiTableCell-root": {
              color: p.text.secondary,
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              borderBottom: `1px solid ${p.divider}`,
              padding: "10px 16px",
            },
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            "& .MuiTableRow-root": {
              "&:hover": { backgroundColor: p.action.hover },
              "&:last-child td": { borderBottom: 0 },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${p.divider}`,
            padding: "12px 16px",
            fontSize: "0.875rem",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            margin: "1px 0",
            padding: "7px 12px",
            "&.Mui-selected": {
              backgroundColor: isLight ? grey[100] : grey[800],
              color: p.text.primary,
              fontWeight: 600,
              "&:hover": { backgroundColor: isLight ? grey[200] : grey[700] },
            },
            "&:hover": { backgroundColor: p.action.hover },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: { minWidth: 36, color: "inherit" },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: p.divider },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isLight ? grey[800] : grey[200],
            color: isLight ? "#fff" : grey[900],
            fontSize: "0.75rem",
            borderRadius: 4,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { border: `1px solid ${p.divider}` },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 6, fontSize: "0.875rem" },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: { fontSize: "0.875rem", fontWeight: 500 },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { height: 2 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { fontWeight: 500, fontSize: "0.875rem", textTransform: "none", minHeight: 44 },
        },
      },
    },
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
