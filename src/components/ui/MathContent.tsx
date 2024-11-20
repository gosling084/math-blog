// src/components/MathContent.tsx
"use client";
import React from 'react';
import katex from 'katex';

interface MathContentProps {
  content: string;
  className?: string;
}

export const MathContent = ({ content, className = '' }: MathContentProps) => {
  const renderContent = React.useMemo(() => {
    try {
      return content.split(/(\$\$.*?\$\$|\$.*?\$)/gs).map((text, index) => {
        if (text.startsWith('$')) {
          const isDisplayMode = text.startsWith('$$');
          const tex = isDisplayMode ? text.slice(2, -2) : text.slice(1, -1);
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(tex, {
                  displayMode: isDisplayMode,
                  throwOnError: false
                })
              }}
            />
          );
        }
        return <span key={index}>{text}</span>;
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      return content;
    }
  }, [content]);

  return <div className={className}>{renderContent}</div>;
};