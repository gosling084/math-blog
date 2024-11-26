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
import { cn } from "@/lib/utils";

export function FontToggle() {
  const { settings, setFontFamily, setFontSize } = useFont();

  const fontOptions = [
    { value: 'default', label: 'System UI', className: 'font-default' },
    { value: 'arial', label: 'Arial', className: 'font-arial' },
    { value: 'serif', label: 'Georgia', className: 'font-serif' },
    { value: 'mono', label: 'Monospace', className: 'font-mono' },
    { value: 'terminal', label: 'Terminal', className: 'font-terminal' },  // using Lucida Console
    { value: 'times', label: 'Times New Roman', className: 'font-times' },
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'default', label: 'Default' },
    { value: 'large', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

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
            {fontOptions.map((font) => (
              <DropdownMenuItem 
                key={font.value}
                onClick={() => setFontFamily(font.value as any)}
              >
                <span className={cn(
                  font.className,
                  settings.family === font.value && "font-bold"
                )}>
                  {font.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Font Size</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {sizeOptions.map((size) => (
              <DropdownMenuItem 
                key={size.value}
                onClick={() => setFontSize(size.value as any)}
              >
                <span className={settings.size === size.value ? "font-bold" : ""}>
                  {size.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}