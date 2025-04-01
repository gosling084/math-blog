// src/components/ui/EditorContent.tsx
"use client";
import React from 'react';
import { cn } from "@/lib/utils";

interface EditorContentProps {
  content: string | React.ReactNode;
  className?: string;
  type?: 'code' | 'text' | 'math';
  language?: 'javascript' | 'typescript' | 'html' | 'css' | 'markdown' | 'latex' | string;
}

export const EditorContent = ({
  content,
  className,
  type = 'text',
  language = 'javascript'
}: EditorContentProps) => {
  if (typeof content === 'string') {
    if (type === 'code') {
      // Format as code with syntax highlighting based on language
      return formatCodeContent(content, language, className);
    } else if (type === 'math') {
      // Math content simply passes through for MathJax processing
      return <div className={cn("math-content", className)}>{content}</div>;
    } else {
      // Text content with some basic markdown-like formatting
      return formatTextContent(content, className);
    }
  }
  
  // If content is already a React Node, just pass it through
  return <div className={className}>{content}</div>;
};

// Helper function to format text content with markdown-like styling
const formatTextContent = (content: string, className?: string) => {
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
};

// Helper function to format code with syntax highlighting
const formatCodeContent = (content: string, language: string, className?: string) => {
  // JavaScript/TypeScript syntax highlighting
  if (language === 'javascript' || language === 'typescript') {
    const lines = content.split('\n').map((line, index) => {
      // Format different parts of JS/TS syntax
      
      // Comments
      if (line.trim().startsWith('//')) {
        return (
          <div key={index} className="leading-6 text-muted-foreground">
            {line}
          </div>
        );
      }
      
      // JSDoc comments
      if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('*/')) {
        return (
          <div key={index} className="leading-6 text-green-600/70">
            {line}
          </div>
        );
      }
      
      // Handle keywords, strings, numbers, etc.
      const formattedLine = line
        // Replace keywords
        .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|class|interface|type|extends|implements)\b/g, match => `<span class="text-purple-500">${match}</span>`)
        // Replace strings
        .replace(/"([^"]*)"/g, match => `<span class="text-green-500">${match}</span>`)
        .replace(/'([^']*)'/g, match => `<span class="text-green-500">${match}</span>`)
        // Replace numbers
        .replace(/\b(\d+)\b/g, match => `<span class="text-amber-500">${match}</span>`);
      
      return (
        <div key={index} className="leading-6" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
    
    return <div className={cn("text-foreground", className)}>{lines}</div>;
  }
  
  // Default fallback for other languages
  return (
    <pre className={cn("text-foreground", className)}>
      <code>{content}</code>
    </pre>
  );
};