// src/components/ui/EditorLayout.tsx
"use client";
import React, { ReactNode, useState, useEffect } from 'react';
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
  height?: string | number;
  onToggleTerminal?: () => void;
}

export const EditorLayout = ({
  children,
  fileName = "unnamed.md",
  showLineNumbers = true,
  readOnly = true,
  modified = false,
  toolbar,
  statusContent,
  height = "calc(75vh - 4rem)", // Default height: 75% of viewport minus some space for nav
  onToggleTerminal
}: EditorLayoutProps) => {
  const [lineCount, setLineCount] = useState<number>(0);

  // Calculate line count from children if it's a string
  useEffect(() => {
    if (typeof children === 'string') {
      setLineCount(children.split('\n').length);
    } else {
      // If children is a ReactNode, try to estimate line count based on content
      // This is just a rough estimate for display purposes
      const childrenArray = React.Children.toArray(children);
      setLineCount(Math.max(childrenArray.length, 10));
    }
  }, [children]);

  // Focus the editor when 'Esc' is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Focus the editor content div
        const editorContent = document.querySelector('.editor-content-area');
        if (editorContent) {
          (editorContent as HTMLElement).focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="font-mono text-left border border-border rounded-md bg-card shadow-md overflow-hidden"
      style={{ height }}
    >
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border h-9">
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
      <div className="flex h-[calc(100%-36px)]">
        {showLineNumbers && (
          <div className="py-3 px-2 text-right bg-muted/20 border-r border-border text-muted-foreground select-none min-w-[3rem] overflow-y-hidden">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="text-xs leading-6">{i + 1}</div>
            ))}
          </div>
        )}
        
        {/* Code content */}
        <div 
          className="p-3 overflow-auto flex-1 editor-content-area" 
          tabIndex={0}
        >
          {children}
        </div>
      </div>
      
      {/* Editor status bar */}
      <div className="px-4 py-1 bg-muted/30 border-t border-border flex justify-between text-xs text-muted-foreground h-6">
        <div className="flex items-center gap-3">
          <span>{readOnly ? "Read-only" : "Edit"}</span>
          {onToggleTerminal && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 px-1 py-0 text-xs"
              onClick={onToggleTerminal}
            >
              <Terminal className="h-3 w-3 mr-1" />
              Terminal
            </Button>
          )}
        </div>
        <div>
          {statusContent || `Ln ${lineCount}, Col 1`}
        </div>
      </div>
    </div>
  );
};