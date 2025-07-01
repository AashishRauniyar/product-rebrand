"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light")
  const pathname = usePathname()

  useEffect(() => {
    // Check URL path to determine theme
    if (pathname?.startsWith("/dark")) {
      setTheme("dark")
      document.documentElement.classList.add("dark") // Add the 'dark' class for Tailwind
    } else {
      // Default to light theme for root path and /light path
      setTheme("light")
      document.documentElement.classList.remove("dark") // Remove the 'dark' class
    }
  }, [pathname])

  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark-theme")
      root.classList.remove("light-theme")
      root.classList.add("dark") // Add the 'dark' class for Tailwind
    } else {
      root.classList.add("light-theme")
      root.classList.remove("dark-theme")
      root.classList.remove("dark") // Remove the 'dark' class
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
