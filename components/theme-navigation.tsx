"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeNavigation() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    // Toggle dark class on html element
    document.documentElement.classList.toggle("dark");

    // Save theme preference
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="fixed top-3 right-3 z-50 flex bg-white dark:bg-gray-800 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full p-0.5 shadow-lg">
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-500" />
        ) : (
          <Moon className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}
