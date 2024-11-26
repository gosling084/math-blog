// src/components/ui/MathContent.tsx
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: (HTMLElement | null)[]) => Promise<void>;
      typeset?: (elements?: (HTMLElement | null)[]) => void;
      tex?: {
        inlineMath: string[][];
        displayMath: string[][];
      };
      startup?: {
        promise: Promise<void>;
      };
      hub?: {
        Queue: (callback: () => void) => void;
        Typeset: (element?: HTMLElement) => void;
      };
    };
  }
}

interface MathContentProps {
  content: string;
  className?: string;
}

export const MathContent = ({ content, className = '' }: MathContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([containerRef.current]);
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={cn("math-content prose", className)}
    >
      {content}
    </div>
  );
};