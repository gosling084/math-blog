// src/components/pages/HomePage.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Textbook } from "@/types/types";
import { textbookData } from "@/data/textbooks";
import { Terminal, Maximize2, Minimize2, Code, FileCode } from 'lucide-react';
import { Button } from "@/components/ui/shadcn";
import { EditorLayout } from '@/components/ui/EditorLayout';
import { TerminalWidget } from '@/components/ui/TerminalWidget';

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
  const [terminalVisible, setTerminalVisible] = useState<boolean>(false);
  const [terminalHeight, setTerminalHeight] = useState<'small' | 'large'>('small');
  const [latestCommand, setLatestCommand] = useState<string>('');

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Standard cursor blink rate

    return () => clearInterval(interval);
  }, []);

  // TeX document content with line numbers
  const documentLines = [
    "// Mathematical Immaturity - Academic Interface",
    "// A self-study collection of mathematics solutions",
    "// Version 2.1.0 - IDE Edition",
    "",
    "import { Library, Textbook } from 'math-immaturity';",
    "",
    "/**",
    " * Mathematical Immaturity Library",
    " * Select a textbook to begin your journey through mathematics.",
    " * Solutions include detailed step-by-step explanations with visualizations.",
    " */",
    "const library = new Library({",
    "  name: 'Mathematical Immaturity',",
    "  author: 'gosling084',",
    "  description: 'Push it to the limit',",
    "  created: new Date('2023-07-15'),",
    "  lastUpdated: new Date()",
    "});",
    "",
    "// Available textbooks in the library",
    "const textbooks = ["
  ];
  
  // Handle command from terminal
  const handleTerminalCommand = (command: string) => {
    setLatestCommand(command);
    
    // Handle book opening commands
    if (command.startsWith('open') || command.startsWith('select')) {
      const parts = command.split(' ');
      if (parts.length > 1) {
        const bookRef = parts[1].toLowerCase();
        
        // Try to find a matching book
        const matchingBook = textbookData.find(book => 
          book.title.toLowerCase().includes(bookRef) || 
          book.author.toLowerCase().includes(bookRef) ||
          book.id.toString() === bookRef
        );
        
        if (matchingBook) {
          onSelectTextbook(matchingBook);
        }
      }
    }
  };

  // Generate textbook entries in code format
  const generateTextbookEntries = () => {
    return textbookData.map((textbook, idx) => (
      <div 
        key={`book-${idx}`}
        onClick={() => onSelectTextbook(textbook)}
        className="group cursor-pointer leading-6 flex items-start hover:bg-secondary/20 -mx-1 px-1 rounded"
      >
        <span className="text-muted-foreground mr-6">{idx === textbookData.length - 1 ? '  ' : '  '}</span>
        <code className="flex-1">
          {`{`}
          <span className="text-purple-500">{` id: `}</span>
          <span className="text-amber-500">{textbook.id}</span>
          <span className="text-purple-500">{`, title: `}</span>
          <span className="text-green-500 group-hover:text-primary transition-colors">
            {`"${textbook.title}"`}
          </span>
          <span className="text-purple-500">{`, author: `}</span>
          <span className="text-green-500">
            {`"${textbook.author}"`}
          </span>
          <span className="text-purple-500">{`, year: `}</span>
          <span className="text-green-500">
            {`"${textbook.year}"`}
          </span>
          {`}`}{idx < textbookData.length - 1 ? ',' : ''}
        </code>
      </div>
    ));
  };

  // Calculate ending lines
  const endingLines = [
    "];",
    "",
    "// Export library for use in the application",
    "export default library;",
    "",
    "// End of file"
  ];
  
  // Total lines for line numbering
  const totalLines = documentLines.length + textbookData.length + endingLines.length;

  return (
    <div className="content-layout">
      {/* Main Editor View */}
      <EditorLayout
        fileName="mathematical-immaturity.js"
        statusContent={`JavaScript • Line Count: ${totalLines}`}
        toolbar={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setTerminalVisible(!terminalVisible)}
            >
              <Terminal className="h-3 w-3 mr-1" />
              {terminalVisible ? 'Hide Terminal' : 'Show Terminal'}
            </Button>
            {terminalVisible && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setTerminalHeight(terminalHeight === 'small' ? 'large' : 'small')}
                title={terminalHeight === 'small' ? 'Expand Terminal' : 'Collapse Terminal'}
              >
                {terminalHeight === 'small' ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        }
      >
        {/* Document preamble */}
        {documentLines.map((line, idx) => {
          if (line.startsWith('//')) {
            // Comment line
            return (
              <div key={`pre-${idx}`} className="leading-6 text-muted-foreground opacity-70">
                {line}
              </div>
            );
          } else if (line === '') {
            // Empty line
            return <div key={`pre-${idx}`} className="leading-6">&nbsp;</div>;
          } else if (line.startsWith('import') || line.startsWith('export')) {
            // Import/export line
            return (
              <div key={`pre-${idx}`} className="leading-6">
                <span className="text-purple-500">{line.split(' ')[0]}</span>
                {line.substring(line.indexOf(' '))}
              </div>
            );
          } else if (line.startsWith('/**')) {
            // JSDoc start
            return (
              <div key={`pre-${idx}`} className="leading-6 text-green-600/70">
                {line}
              </div>
            );
          } else if (line.startsWith(' *')) {
            // JSDoc content
            return (
              <div key={`pre-${idx}`} className="leading-6 text-green-600/70">
                {line}
              </div>
            );
          } else if (line.startsWith(' */')) {
            // JSDoc end
            return (
              <div key={`pre-${idx}`} className="leading-6 text-green-600/70">
                {line}
              </div>
            );
          } else if (line.startsWith('const')) {
            // Variable declaration
            return (
              <div key={`pre-${idx}`} className="leading-6">
                <span className="text-purple-500">const</span>
                {line.substring(5)}
              </div>
            );
          } else {
            // Regular line
            return <div key={`pre-${idx}`} className="leading-6">{line}</div>;
          }
        })}
        
        {/* Textbook entries as JavaScript array items */}
        {generateTextbookEntries()}
        
        {/* Ending lines */}
        {endingLines.map((line, idx) => {
          if (line.startsWith('//')) {
            // Comment line
            return (
              <div key={`end-${idx}`} className="leading-6 text-muted-foreground opacity-70">
                {line}
              </div>
            );
          } else if (line === '') {
            // Empty line
            return <div key={`end-${idx}`} className="leading-6">&nbsp;</div>;
          } else if (line.startsWith('export')) {
            // Export line
            return (
              <div key={`end-${idx}`} className="leading-6">
                <span className="text-purple-500">export</span>
                {line.substring(6)}
              </div>
            );
          } else {
            // Regular line
            return (
              <div key={`end-${idx}`} className="leading-6">
                {line}
                {idx === endingLines.length - 1 && (
                  <span className={`ml-1 inline-block w-2 bg-primary align-text-bottom ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} style={{ height: '19px' }}></span>
                )}
              </div>
            );
          }
        })}
      </EditorLayout>

      {/* Terminal Panel (conditionally shown) */}
      {terminalVisible && (
        <div className={`mt-4 ${terminalHeight === 'large' ? 'h-64' : 'h-40'}`}>
          <TerminalWidget 
            initialCommands={[
              '$ Mathematical Immaturity Terminal v0.1',
              '$ Type "help" for available commands',
              '$ Try "open apostol" to open Apostol\'s Calculus'
            ]}
            onCommandEnter={handleTerminalCommand}
          />
        </div>
      )}
      
      {/* Help text for how to use the interface */}
      <div className="mt-6 p-4 bg-card border border-border rounded-md font-mono text-sm text-muted-foreground">
        <div className="flex items-center mb-2">
          <Code className="h-4 w-4 mr-2" />
          <span className="font-medium text-foreground">Usage Guide:</span>
        </div>
        <ul className="list-disc ml-6 space-y-1">
          <li>Click on any textbook entry to open it</li>
          <li>Use the terminal with commands like <code className="text-primary">open apostol</code> or <code className="text-primary">help</code></li>
          <li>Terminal navigation commands will be available throughout the site</li>
          <li>Press <code className="text-primary">Esc</code> to focus on the editor (coming soon)</li>
        </ul>
      </div>
    </div>
  );
};