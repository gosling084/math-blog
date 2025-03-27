// src/components/ui/TerminalWidget.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface TerminalWidgetProps {
  className?: string;
  initialCommands?: string[];
  onCommandEnter?: (command: string) => void;
  height?: number | string;
  onQuit?: () => void; // Add onQuit prop
}

export const TerminalWidget = ({
  className,
  initialCommands = [],
  onCommandEnter,
  height = "25vh", // Default height
  onQuit // Add onQuit handler
}: TerminalWidgetProps) => {
  const [commands, setCommands] = useState<string[]>(initialCommands);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when commands change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commands]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle key events for command history and execution
  const handleCommandEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      const command = currentCommand.trim();
      
      // Add to display and history
      setCommands(prev => [...prev, `$ ${command}`]);
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      
      // Process command
      processCommand(command);
      
      // Clear input
      setCurrentCommand('');
      
      // Call external handler if provided
      if (onCommandEnter) {
        onCommandEnter(command);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      attemptAutoComplete();
    } else if (e.key === 'Escape') {
      // Close terminal on Escape key
      if (onQuit) {
        onQuit();
      }
    }
  };

  // History navigation
  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
    } else {
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setCurrentCommand(newIndex >= 0 ? commandHistory[commandHistory.length - 1 - newIndex] : '');
    }
  };

  // Basic auto-completion
  const attemptAutoComplete = () => {
    if (!currentCommand) return;
    
    // Added "quit" and "exit" to the list of base commands
    const baseCommands = ['help', 'clear', 'ls', 'cd', 'open', 'view', 'back', 'home', 'about', 'contact', 'quit', 'exit'];
    
    // Try to complete a command
    const partialCommand = currentCommand.split(' ')[0];
    
    const matchingCommands = baseCommands.filter(cmd => 
      cmd.startsWith(partialCommand) && cmd !== partialCommand
    );
    
    if (matchingCommands.length === 1) {
      // If there's exactly one match, complete the command
      setCurrentCommand(currentCommand.replace(partialCommand, matchingCommands[0]));
    } else if (matchingCommands.length > 1) {
      // Show options
      setCommands(prev => [
        ...prev, 
        `$ ${currentCommand}`,
        `Completions: ${matchingCommands.join(', ')}`
      ]);
    }
  };

  // Basic command processing
  const processCommand = (command: string) => {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        setCommands(prev => [
          ...prev,
          'Available commands:',
          '  help - Show this help message',
          '  clear - Clear the terminal',
          '  ls - List available textbooks',
          '  cd <path> - Navigate to a section',
          '  open <book> [chapter <num>] [section <num>] - Open a textbook or section',
          '  quit, exit - Close the terminal',
          '  [Esc] - Press Escape key to close the terminal'
        ]);
        break;
        
      case 'clear':
        setCommands([]);
        break;
        
      case 'ls':
        setCommands(prev => [
          ...prev,
          'Available textbooks:',
          '  1. Apostol_Calculus_Vol1/ - Calculus Vol. 1 (Apostol)',
          '  2. Stewart_Calculus/ - Calculus: Early Transcendentals (Stewart)'
        ]);
        break;
        
      case 'cd':
        if (args.length === 0) {
          setCommands(prev => [...prev, 'Usage: cd <path>']);
        } else {
          setCommands(prev => [...prev, `Navigating to ${args[0]}...`]);
          // In a full implementation, this would navigate to the specified section
        }
        break;
        
      case 'open':
        if (args.length === 0) {
          setCommands(prev => [...prev, 'Usage: open <book> [chapter <num>] [section <num>]']);
        } else {
          const bookArg = args[0];
          setCommands(prev => [...prev, `Opening ${bookArg}...`]);
          
          // In a real implementation, we would navigate to the book
          // This will be handled by the parent component through onCommandEnter
        }
        break;
        
      case 'quit':
      case 'exit':
        setCommands(prev => [...prev, 'Terminal closed']);
        // Call onQuit after a brief delay to show the "Terminal closed" message
        if (onQuit) {
          setTimeout(() => {
            onQuit();
          }, 300);
        }
        break;
        
      default:
        setCommands(prev => [...prev, `Command not found: ${cmd}. Type 'help' for available commands.`]);
    }
  };

  // Focus when clicking anywhere in the terminal
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={cn(
        "border border-border rounded-b-md bg-black text-green-400 font-mono",
        className
      )}
      style={{ height }}
      onClick={handleContainerClick}
    >
      <div 
        ref={containerRef}
        className="px-2 py-2 h-[calc(100%-28px)] overflow-y-auto"
      >
        {commands.map((cmd, index) => {
          // Fixed syntax highlighting for terminal text
          if (cmd.startsWith('$ ')) {
            // Command line with consistent coloring
            const commandString = cmd.substring(2); // Remove the "$ " prefix
            
            return (
              <div key={index} className="text-sm mb-1">
                <span className="text-blue-400">$</span>
                <span className="text-green-400"> {commandString}</span>
              </div>
            );
          }
          return <div key={index} className="text-sm mb-1">{cmd}</div>;
        })}
      </div>
      
      <div className="flex items-center px-2 py-1 border-t border-border/30 h-7">
        <span className="text-blue-400 mr-1">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={e => setCurrentCommand(e.target.value)}
          onKeyDown={handleCommandEnter}
          className="bg-transparent border-none outline-none text-green-400 flex-1 text-sm"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};