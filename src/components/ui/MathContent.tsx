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
      window.MathJax.typesetPromise([containerRef.current])
        .then(() => {
          // After MathJax processing, ensure any overflow containers are properly sized
          if (containerRef.current) {
            const mathElements = containerRef.current.querySelectorAll('.MathJax');
            mathElements.forEach(element => {
              (element as HTMLElement).style.maxWidth = '100%';
              (element as HTMLElement).style.overflowX = 'auto';
              (element as HTMLElement).style.overflowY = 'clip'; // Fixes vertical scrolling issue for individual display equations
            });
          }
        });
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "math-content prose",
        "overflow-x-clip",
        "overflow-y-clip", // Fixes the vertical scrolling issue in MathJax containers
        className
      )}
    >
      {content}
    </div>
  );
};