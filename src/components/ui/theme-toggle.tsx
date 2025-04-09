
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
      className="relative overflow-hidden transition-all duration-500 hover:bg-primary/10 rounded-full w-9 h-9 p-0"
    >
      <span className="sr-only">{theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
      
      {/* Sun icon */}
      <motion.div
        initial={{ scale: theme === "dark" ? 1 : 0 }}
        animate={{ 
          scale: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : -180
        }}
        transition={{ duration: 0.5, type: "spring" }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-yellow-400" />
      </motion.div>
      
      {/* Moon icon */}
      <motion.div
        initial={{ scale: theme === "light" ? 1 : 0 }}
        animate={{ 
          scale: theme === "light" ? 1 : 0,
          rotate: theme === "light" ? 0 : 180
        }}
        transition={{ duration: 0.5, type: "spring" }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-blue-400" />
      </motion.div>
      
      {/* Background animation */}
      <motion.div
        initial={false}
        animate={{
          backgroundColor: theme === "dark" ? "rgba(250, 204, 21, 0.2)" : "rgba(59, 130, 246, 0.2)",
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-full scale-0 animate-ping"
        style={{ animationDuration: "1s", animationIterationCount: "1" }}
      ></motion.div>
    </Button>
  );
}
