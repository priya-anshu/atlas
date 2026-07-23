"use client";

import { SunMoon } from "lucide-react";
import { useEffect } from "react";

const THEME_STORAGE_KEY = "atlas-theme";

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemTheme);
  }, []);

  return (
    <button
      aria-label="Toggle color theme"
      className="icon-button"
      onClick={() => {
        const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      }}
      type="button"
    >
      <SunMoon aria-hidden="true" size={19} />
    </button>
  );
}
