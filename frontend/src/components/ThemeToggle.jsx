/** @format */

// src/components/ThemeToggle.jsx
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="theme-toggle"
        className="text-sm text-gray-700 dark:text-gray-300">
        {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </label>
      <input
        id="theme-toggle"
        type="checkbox"
        checked={theme === "dark"}
        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="toggle toggle-md bg-gray-300 border-gray-400 dark:bg-gray-600 dark:border-gray-500"
      />
    </div>
  );
}
