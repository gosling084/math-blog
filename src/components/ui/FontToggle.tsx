// src/components/ui/FontToggle.tsx
"use client";
import { useFont } from '@/providers/font-provider';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Type } from "lucide-react";

export function FontToggle() {
  const { settings, setFontFamily, setFontSize } = useFont();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Type className="h-5 w-5" />
          <span className="sr-only">Toggle font settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Font Family</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setFontFamily("default")}>
              <span className={settings.family === "default" ? "font-bold" : ""}>
                Default
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontFamily("serif")}>
              <span className={settings.family === "serif" ? "font-bold" : ""}>
                Serif
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontFamily("mono")}>
              <span className={settings.family === "mono" ? "font-bold" : ""}>
                Monospace
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontFamily("times")}>
              <span className={settings.family === "times" ? "font-bold" : ""}>
                Times New Roman
              </span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Font Size</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setFontSize("small")}>
              <span className={settings.size === "small" ? "font-bold" : ""}>
                Small
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize("default")}>
              <span className={settings.size === "default" ? "font-bold" : ""}>
                Default
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize("large")}>
              <span className={settings.size === "large" ? "font-bold" : ""}>
                Large
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize("xl")}>
              <span className={settings.size === "xl" ? "font-bold" : ""}>
                Extra Large
              </span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}