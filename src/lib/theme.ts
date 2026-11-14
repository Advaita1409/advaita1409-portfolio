import { useEffect, useState } from "react";

export const getTheme = (): "dark" | "light" => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function setTheme(t: "dark" | "light") {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch { /* storage blocked */ }
  window.dispatchEvent(new Event("themechange"));
}
export const toggleTheme = () => setTheme(getTheme() === "dark" ? "light" : "dark");

export function useTheme() {
  const [t, setT] = useState(getTheme);
  useEffect(() => {
    const on = () => setT(getTheme());
    window.addEventListener("themechange", on);
    return () => window.removeEventListener("themechange", on);
  }, []);
  return t;
}
