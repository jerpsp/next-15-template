export type ColorSchema =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"

export const grey = {
  0: "#FFFFFF",
  50: "#FAFAFA",
  100: "#F4F4F5",
  200: "#E4E4E7",
  300: "#D1D5DB",
  400: "#A1A1AA",
  500: "#71717A",
  600: "#52525B",
  700: "#3F3F46",
  800: "#27272A",
  900: "#18181B",
}

export const primary = {
  light: "#3F3F46",
  main: "#18181B",
  dark: "#09090B",
  contrastText: "#FFFFFF",
}

export const secondary = {
  light: "#A1A1AA",
  main: "#71717A",
  dark: "#52525B",
  contrastText: "#FFFFFF",
}

export const info = {
  light: "#93C5FD",
  main: "#3B82F6",
  dark: "#1D4ED8",
  contrastText: "#FFFFFF",
}

export const success = {
  light: "#86EFAC",
  main: "#22C55E",
  dark: "#15803D",
  contrastText: "#FFFFFF",
}

export const warning = {
  light: "#FCD34D",
  main: "#F59E0B",
  dark: "#B45309",
  contrastText: "#FFFFFF",
}

export const error = {
  light: "#FCA5A5",
  main: "#EF4444",
  dark: "#B91C1C",
  contrastText: "#FFFFFF",
}

export function palette(mode: "light" | "dark") {
  const light = {
    mode: "light" as const,
    primary,
    secondary,
    info,
    success,
    warning,
    error,
    grey,
    divider: grey[200],
    text: {
      primary: grey[900],
      secondary: grey[500],
      disabled: grey[400],
    },
    background: {
      paper: "#FFFFFF",
      default: grey[50],
    },
    action: {
      hover: grey[100],
      selected: grey[100],
      disabled: grey[400],
      disabledBackground: grey[100],
      focus: grey[200],
      hoverOpacity: 0.06,
      disabledOpacity: 0.4,
      active: grey[600],
    },
  }

  const dark = {
    mode: "dark" as const,
    primary: {
      light: "#A1A1AA",
      main: "#FAFAFA",
      dark: "#FFFFFF",
      contrastText: "#18181B",
    },
    secondary,
    info,
    success,
    warning,
    error,
    grey,
    divider: grey[700],
    text: {
      primary: grey[50],
      secondary: grey[400],
      disabled: grey[600],
    },
    background: {
      paper: grey[800],
      default: grey[900],
    },
    action: {
      hover: grey[700],
      selected: grey[700],
      disabled: grey[600],
      disabledBackground: grey[800],
      focus: grey[700],
      hoverOpacity: 0.08,
      disabledOpacity: 0.4,
      active: grey[400],
    },
  }

  return mode === "light" ? light : dark
}

