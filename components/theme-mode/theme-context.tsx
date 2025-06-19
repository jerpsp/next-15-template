"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type ThemeMode = "light" | "dark"

interface ThemeContextType {
  mode: ThemeMode
  toggleThemeMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize with system preference or saved preference from localStorage
  const [mode, setMode] = useState<ThemeMode>("dark")

  useEffect(() => {
    // Check if window is defined (not server-side)
    if (typeof window !== "undefined") {
      // Check for saved theme preference in localStorage
      const savedMode = localStorage.getItem("themeMode") as ThemeMode
      if (savedMode) {
        setMode(savedMode)
      } else {
        // Use system preference as fallback
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
        setMode(prefersDark ? "dark" : "light")
      }
    }
  }, [])

  const toggleThemeMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light"
      // Save to localStorage
      localStorage.setItem("themeMode", newMode)
      return newMode
    })
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider"
    )
  }
  return context
}
