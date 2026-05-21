import { routing } from "@/locales/routing"
import ThemeProvider from "@/theme"
import { primaryFont } from "@/theme/typography"
import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { NextAuthProvider } from "@/auth/context/next-auth"
import ReactQueryProvider from "@/tanstack/query/query-provider"
import { SnackbarProvider } from "@/components/snackbar"

export const metadata: Metadata = {
  title: "CMS",
  description: "Content Management System",
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return (
    <html lang={locale} className={primaryFont.variable}>
      <body style={{ margin: 0 }}>
        <NextAuthProvider>
          <ReactQueryProvider>
            <NextIntlClientProvider>
              <ThemeProvider>
                <SnackbarProvider>{children}</SnackbarProvider>
              </ThemeProvider>
            </NextIntlClientProvider>
          </ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
