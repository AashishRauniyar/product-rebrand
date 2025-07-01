"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"
import { useRouter } from "next/navigation"

export default function ThemeToggle() {
  const { theme } = useTheme()
  const router = useRouter()

  const toggleTheme = () => {
    if (theme === "dark") {
      router.push("/light")
    } else {
      router.push("/dark")
    }
  }

  return (
    <Button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 bg-[var(--toggle-bg)] text-[var(--toggle-text)] hover:bg-[var(--toggle-hover)] backdrop-blur-md border border-[var(--toggle-border)]"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  )
}
