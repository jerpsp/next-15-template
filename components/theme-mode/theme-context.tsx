"use client"

import React, { createContext, useContext, useState } from "react"

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
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("themeMode") as ThemeMode
      if (savedMode) return savedMode
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return "dark"
  })

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
