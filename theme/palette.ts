import { alpha } from "@mui/material/styles"

export type ColorSchema =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"

// SETUP COLORS

export const grey = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
}

export const primary = {
  light: "#5BE49B",
  main: "#00A76F",
  dark: "#007867",
  contrastText: "#FFFFFF",
}

export const secondary = {
  light: "#C684FF",
  main: "#8E33FF",
  dark: "#5119B7",
  contrastText: "#FFFFFF",
}

export const info = {
  light: "#61F3F3",
  main: "#00B8D9",
  dark: "#006C9C",
  contrastText: "#FFFFFF",
}

export const success = {
  light: "#77ED8B",
  main: "#22C55E",
  dark: "#118D57",
  contrastText: "#ffffff",
}

export const warning = {
  light: "#FFD666",
  main: "#FFAB00",
  dark: "#B76E00",
  contrastText: grey[800],
}

export const error = {
  light: "#FFAC82",
  main: "#FF5630",
  dark: "#B71D18",
  contrastText: "#FFFFFF",
}

export const common = {
  black: "#000000",
  white: "#FFFFFF",
}

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
}

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
}

export function palette(mode: "light" | "dark") {
  const light = {
    ...base,
    mode: "light",
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: "#FFFFFF",
      default: "#FFFFFF",
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  }

  const dark = {
    ...base,
    mode: "dark",
    text: {
      primary: "#FFFFFF",
      secondary: grey[500],
      disabled: grey[600],
    },
    background: {
      paper: grey[800],
      default: grey[900],
    },
    action: {
      ...base.action,
      active: grey[500],
    },
  }

  return mode === "light" ? light : dark
}
