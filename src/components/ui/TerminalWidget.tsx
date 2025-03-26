// src/components/ui/TerminalWidget.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

interface TerminalWidgetProps {
  className?: string;
  initialCommands?: string[];
  onCommandEnter?: (command: string) => void;
}

export const TerminalWidget = ({
  className,
  initialCommands = [],
  onCommandEnter
}: TerminalWidgetProps) => {
  const [commands, setCommands] = useState<string[]>(initialCommands);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    }
  };

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
          '  open <book> [--chapter <num>] [--section <num>] - Open a textbook or section',
          '  exit - Close the terminal'
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
          setCommands(prev => [...prev, 'Usage: open <book> [--chapter <num>] [--section <num>]']);
        } else {
          const bookArg = args[0];
          setCommands(prev => [...prev, `Opening ${bookArg}...`]);
          
          // In a real implementation, parse more complex arguments and navigate accordingly
          if (bookArg.toLowerCase().includes('apostol')) {
            router.push('/?id=1');
          } else if (bookArg.toLowerCase().includes('stewart')) {
            router.push('/?id=2');
          }
        }
        break;
        
      case 'exit':
        // In a real implementation, this would close the terminal
        setCommands(prev => [...prev, 'Terminal closed']);
        break;
        
      default:
        setCommands(prev => [...prev, `Command not found: ${cmd}. Type 'help' for available commands.`]);
    }
  };

  return (
    <div className={cn(
      "border border-border rounded-md bg-black text-green-400 font-terminal p-2",
      "min-h-[150px] max-h-[300px] overflow-auto",
      className
    )}
    ref={containerRef}>
      {commands.map((cmd, index) => (
        <div key={index} className="text-sm mb-1">{cmd}</div>
      ))}
      
      <div className="flex items-center mt-1">
        <span className="text-blue-400 mr-1">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={e => setCurrentCommand(e.target.value)}
          onKeyDown={handleCommandEnter}
          className="bg-transparent border-none outline-none text-green-400 flex-1 text-sm font-terminal"
        />
      </div>
    </div>
  );
};