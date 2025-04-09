
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before accessing the theme
  // This prevents hydration mismatch errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative overflow-hidden transition-all duration-300 hover:bg-primary/10"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
      )}
      <span className="sr-only">{theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
    </Button>
  );
}
