// src/components/ui/EditorContent.tsx
"use client";
import React from 'react';
import { cn } from "@/lib/utils";

interface EditorContentProps {
  content: string | React.ReactNode;
  className?: string;
  type?: 'code' | 'text' | 'math';
}

export const EditorContent = ({
  content,
  className,
  type = 'text'
}: EditorContentProps) => {
  if (typeof content === 'string') {
    if (type === 'code') {
      // Format as code with syntax highlighting
      return (
        <pre className={cn("text-foreground", className)}>
          <code>{content}</code>
        </pre>
      );
    } else if (type === 'math') {
      // Math content simply passes through for MathJax processing
      return <div className={cn("math-content", className)}>{content}</div>;
    } else {
      // Text content with some basic markdown-like formatting
      const formattedContent = content
        .split('\n')
        .map((line, index) => {
          // Heading format (# Heading)
          if (line.match(/^#+\s/)) {
            const level = line.match(/^(#+)/)?.[0].length || 1;
            const text = line.replace(/^#+\s/, '');
            return (
              <div key={index} className={`leading-6 font-bold ${level === 1 ? 'text-lg' : 'text-base'}`}>
                {text}
              </div>
            );
          }
          
          // Comment format (// Comment)
          if (line.match(/^\/\//)) {
            return (
              <div key={index} className="leading-6 text-muted-foreground opacity-70">
                {line}
              </div>
            );
          }
          
          // Empty line
          if (line === '') {
            return <div key={index} className="leading-6">&nbsp;</div>;
          }
          
          // Regular line
          return <div key={index} className="leading-6">{line}</div>;
        });
      
      return <div className={cn("text-foreground", className)}>{formattedContent}</div>;
    }
  }
  
  // If content is already a React Node, just pass it through
  return <div className={className}>{content}</div>;
};