// src/components/ui/theme/ThemeToggle.tsx
"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/shadcn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/theme/dropdown-menu";
import { Sun, Moon, Laptop, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import styles from './theme.module.css';
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className={cn(styles.themeIcon, styles.sunIcon)} />
          <Moon className={cn(styles.themeIcon, styles.moonIcon)} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className={styles.dropdownIcon} />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("soft")}>
          <Sun className={styles.dropdownIcon} />
          <span>Soft</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className={styles.dropdownIcon} />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("midnight")}>
          <Palette className={styles.dropdownIcon} />
          <span>Midnight</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")}>
          <Palette className={styles.dropdownIcon} />
          <span>Forest</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("coffee")}>
          <Palette className={styles.dropdownIcon} />
          <span>Coffee</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className={styles.dropdownIcon} />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}