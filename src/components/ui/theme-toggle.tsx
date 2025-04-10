
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      className="relative overflow-hidden rounded-full w-10 h-10 p-0 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 hover:bg-white/50 dark:hover:bg-gray-900/50 border border-pink-100/50 dark:border-purple-900/30 shadow-md"
    >
      <span className="sr-only">{theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
      
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-5 w-5 text-purple-300" />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.2, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute h-8 w-8 rounded-full bg-purple-400/10"
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: 30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-5 w-5 text-amber-500" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute h-8 w-8 rounded-full bg-amber-400/20"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sparkles animation for interaction */}
      <motion.div 
        initial={false}
        animate={{ opacity: 0 }}
        whileTap={{ opacity: 1, scale: 1.5 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sparkles className="h-4 w-4 text-pink-400 dark:text-purple-400" />
      </motion.div>
    </Button>
  );
}
