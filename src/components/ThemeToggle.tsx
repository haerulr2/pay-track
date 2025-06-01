"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" iconSize="md">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      iconSize="md"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{
          rotate: theme === "dark" ? 0 : 360,
          scale: [1, 1.15, 1],
        }}
        transition={{
          rotate: {
            type: "spring",
            stiffness: 160,
            damping: 15,
          },
          scale: {
            duration: 0.3,
            times: [0, 0.5, 1],
          },
        }}
        className="relative h-5 w-5"
      >
        {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </motion.div>
    </Button>
  );
}
