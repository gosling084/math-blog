// src/components/pages/HomePage.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Textbook } from "@/types/types";
import { textbookData } from "@/data/textbooks";

export const HomePageSkeleton = () => {
  return (
    <div className="content-layout">
      {/* TeX editor skeleton */}
      <div className="font-mono text-left p-6 border border-border rounded-md bg-card">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse mb-2" />
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-10" />
        
        {/* Library skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse mb-4" />
        <div className="space-y-3 pl-4 border-l-2 border-muted mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 bg-gray-200 rounded-lg w-5/6 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

interface HomePageProps {
  onSelectTextbook: (textbook: Textbook) => void;
}

export const HomePage = ({ onSelectTextbook }: HomePageProps) => {
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Standard cursor blink rate

    return () => clearInterval(interval);
  }, []);

  // TeX document content with line numbers
  const documentLines = [
    "% Mathematical Immaturity - Source Document",
    "\\documentclass{book}",
    "\\usepackage{amsmath}",
    "\\usepackage{amssymb}",
    "\\usepackage{hyperref}",
    "",
    "\\title{Mathematical Immaturity}",
    "\\subtitle{Push it to the limit.}",
    "\\author{gosling084}",
    "",
    "% Select a textbook to begin",
    "\\begin{library}"
  ];

  // Calculate ending lines
  const endingLines = ["\\end{library}"];
  
  // Total lines for line numbering
  const totalLines = documentLines.length + textbookData.length + endingLines.length;

  return (
    <div className="content-layout">
      {/* TeX editor with integrated book list */}
      <div className="font-mono text-left border border-border rounded-md bg-card shadow-md overflow-hidden">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
          <div className="text-sm text-muted-foreground">mathematical-immaturity.tex</div>
          <div className="text-xs text-muted-foreground">Modified: {new Date().toLocaleDateString()}</div>
        </div>
        
        {/* Editor content with line numbers */}
        <div className="flex">
          {/* Line numbers column */}
          <div className="py-3 px-2 text-right bg-muted/20 border-r border-border text-muted-foreground select-none w-12">
            {Array.from({ length: totalLines }, (_, i) => (
              <div key={i} className="text-xs leading-6">{i + 1}</div>
            ))}
          </div>
          
          {/* Code content */}
          <div className="p-3 overflow-x-auto flex-1">
            {/* Document preamble */}
            {documentLines.map((line, idx) => {
              if (line.startsWith('%')) {
                // Comment line
                return (
                  <div key={`pre-${idx}`} className="leading-6 text-muted-foreground opacity-70">
                    {line}
                  </div>
                );
              } else if (line === '') {
                // Empty line
                return <div key={`pre-${idx}`} className="leading-6">&nbsp;</div>;
              } else if (line.startsWith('\\')) {
                // Command line
                const parts = line.split('{');
                const command = parts[0];
                
                // Handle different command types
                if (command === '\\title' || command === '\\subtitle') {
                  const content = parts[1].replace('}', '');
                  return (
                    <div key={`pre-${idx}`} className="leading-6">
                      <span className="text-primary">{command}</span>
                      {'{'}
                      <span className="text-foreground">{content}</span>
                      {'}'}
                    </div>
                  );
                } else if (command === '\\author') {
                  const content = parts[1].replace('}', '');
                  return (
                    <div key={`pre-${idx}`} className="leading-6">
                      <span className="text-primary">{command}</span>
                      {'{'}
                      <a href="https://github.com/gosling084" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4">
                        {content}
                      </a>
                      {'}'}
                    </div>
                  );
                } else {
                  // Standard command
                  return (
                    <div key={`pre-${idx}`} className="leading-6">
                      <span className="text-primary">{command}</span>
                      {'{' + parts[1]}
                    </div>
                  );
                }
              } else {
                // Regular line
                return <div key={`pre-${idx}`} className="leading-6">{line}</div>;
              }
            })}
            
            {/* Books as a list inside the TeX document */}
            <div className="ml-4 space-y-0">
              {textbookData.map((textbook, idx) => (
                <div 
                  key={`book-${idx}`}
                  onClick={() => onSelectTextbook(textbook)}
                  className="group cursor-pointer leading-6 flex items-start hover:bg-secondary/20 -mx-1 px-1 rounded"
                >
                  <code className="flex-1">
                    <span className="text-primary">{'  '}\\textbook</span>
                    {'{'}
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {textbook.title}
                    </span>
                    {'}'}
                    {'{'}
                    <span className="text-muted-foreground">
                      {textbook.author}
                    </span>
                    {'}'}
                    {'{'}
                    <span className="text-muted-foreground">
                      {textbook.edition}, {textbook.year}
                    </span>
                    {'}'}
                  </code>
                </div>
              ))}
            </div>
            
            {/* Ending lines */}
            {endingLines.map((line, idx) => (
              <div key={`end-${idx}`} className="leading-6">
                <span className="text-primary">{line}</span>
                {idx === endingLines.length - 1 && (
                  <span className={`ml-1 inline-block w-2 bg-primary align-text-bottom ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} style={{ height: '19px' }}></span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Editor status bar */}
        <div className="px-4 py-1 bg-muted/30 border-t border-border flex justify-between text-xs text-muted-foreground">
          <div>LaTeX</div>
          <div>UTF-8</div>
          <div>Ln {totalLines}, Col 14</div>
        </div>
      </div>
    </div>
  );
};