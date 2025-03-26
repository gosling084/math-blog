// src/components/ui/EditorLayout.tsx
"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { Button } from "@/components/ui/shadcn";

interface EditorLayoutProps {
  children: ReactNode;
  fileName?: string;
  showLineNumbers?: boolean;
  readOnly?: boolean;
  modified?: boolean;
  toolbar?: ReactNode;
  statusContent?: ReactNode;
}

export const EditorLayout = ({
  children,
  fileName = "unnamed.md",
  showLineNumbers = true,
  readOnly = true,
  modified = false,
  toolbar,
  statusContent
}: EditorLayoutProps) => {
  const router = useRouter();
  const [lineCount, setLineCount] = useState<number>(0);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  // Calculate line count from children if it's a string
  useEffect(() => {
    if (typeof children === 'string') {
      setLineCount(children.split('\n').length);
    }
  }, [children]);

  return (
    <div className="font-mono text-left border border-border rounded-md bg-card shadow-md overflow-hidden mb-4">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">{fileName}</div>
          {modified && <div className="w-2 h-2 rounded-full bg-primary/70"></div>}
        </div>
        {toolbar && (
          <div className="flex items-center gap-2">
            {toolbar}
          </div>
        )}
        {!toolbar && (
          <div className="text-xs text-muted-foreground">
            {modified ? "Modified" : "Saved"}: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {/* Editor content with optional line numbers */}
      <div className="flex min-h-[200px] max-h-[80vh] overflow-auto">
        {showLineNumbers && (
          <div className="py-3 px-2 text-right bg-muted/20 border-r border-border text-muted-foreground select-none min-w-[3rem]">
            {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
              <div key={i} className="text-xs leading-6">{i + 1}</div>
            ))}
          </div>
        )}
        
        {/* Code content */}
        <div className="p-3 overflow-x-auto flex-1">
          {children}
        </div>
      </div>
      
      {/* Editor status bar */}
      <div className="px-4 py-1 bg-muted/30 border-t border-border flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{readOnly ? "Read-only" : "Edit"}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 px-1 py-0 text-xs"
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          >
            <Terminal className="h-3 w-3 mr-1" />
            Terminal
          </Button>
        </div>
        <div>
          {statusContent || `Ln ${lineCount}, Col 1`}
        </div>
      </div>
      
      {/* Terminal panel (collapsed by default) */}
      {isTerminalOpen && (
        <div className="border-t border-border bg-black/90 text-green-400 p-2 h-32 overflow-auto font-terminal text-sm">
          <div className="opacity-70">$ Mathematical Immaturity Terminal v0.1</div>
          <div className="opacity-70">$ Type 'help' for available commands</div>
          <div className="flex mt-1">
            <span className="text-blue-400 mr-1">$</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      )}
    </div>
  );
};