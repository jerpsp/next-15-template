import { Inter } from "next/font/google"

export function pxToRem(value: number) {
  return `${value / 16}rem`
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    fontWeightSemiBold: React.CSSProperties["fontWeight"]
  }
}

export const primaryFont = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["400", "500", "600", "700"],
})

export const typography = {
  fontFamily: primaryFont.style.fontFamily,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: { fontWeight: 700, fontSize: pxToRem(36), lineHeight: 1.3 },
  h2: { fontWeight: 700, fontSize: pxToRem(30), lineHeight: 1.3 },
  h3: { fontWeight: 600, fontSize: pxToRem(24), lineHeight: 1.4 },
  h4: { fontWeight: 600, fontSize: pxToRem(20), lineHeight: 1.4 },
  h5: { fontWeight: 600, fontSize: pxToRem(16), lineHeight: 1.5 },
  h6: { fontWeight: 600, fontSize: pxToRem(14), lineHeight: 1.5 },
  subtitle1: { fontWeight: 500, fontSize: pxToRem(15), lineHeight: 1.5 },
  subtitle2: { fontWeight: 500, fontSize: pxToRem(13), lineHeight: 1.5 },
  body1: { fontSize: pxToRem(14), lineHeight: 1.6 },
  body2: { fontSize: pxToRem(13), lineHeight: 1.6 },
  caption: { fontSize: pxToRem(12), lineHeight: 1.5 },
  overline: {
    fontWeight: 600,
    fontSize: pxToRem(11),
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  button: {
    fontWeight: 500,
    fontSize: pxToRem(14),
    textTransform: "none" as const,
  },
} as const

