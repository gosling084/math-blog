// src/components/layout/Website.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Home, Info, Mail, Terminal, Code, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ProblemSet, Problem, Textbook, Chapter} from "@/types/types";
import { TextbookTableOfContents, TextbookTableOfContentsSkeleton } from '@/components/pages/TextbookTableofContents';
import { HomePage, HomePageSkeleton } from '@/components/pages/HomePage';
import { ProblemSetView, ProblemSetViewSkeleton } from '@/components/pages/ProblemSetView';
import { ProblemView, ProblemViewSkeleton } from '@/components/pages/ProblemView';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { FontToggle } from '@/components/ui/FontToggle';
import { Button } from "@/components/ui/shadcn";
import { FontProvider } from '@/providers/font-provider';
import { About } from '@/components/pages/About';
import { Contact } from '@/components/pages/Contact';
import { Suspense } from 'react';
import { AppRouterProvider } from '@/providers/AppRouterProvider';
import { TerminalWidget } from '@/components/ui/TerminalWidget';
import { textbookData } from "@/data/textbooks";

const Website = () => {
  // All hooks must be called before any conditional returns
  const [mounted, setMounted] = useState(false);
  const [globalTerminalVisible, setGlobalTerminalVisible] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Add keyboard shortcut for terminal
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+T or Ctrl+` to toggle terminal
      if ((e.altKey && e.key === 't') || (e.ctrlKey && e.key === '`')) {
        setGlobalTerminalVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mounted) {
    return null;
  }

  // Handle global terminal commands
  const handleGlobalCommand = (command: string, router: any) => {
    const parts = command.toLowerCase().split(' ');
    const cmd = parts[0];
    
    switch (cmd) {
      case 'home':
        router.actions.navigateToHome();
        router.setActiveSection('home');
        break;
      case 'about':
        router.setActiveSection('about');
        break;
      case 'contact':
        router.setActiveSection('contact');
        break;
      case 'open':
      case 'view':
        // Attempt to open a book or section
        if (parts.length > 1) {
          const bookId = parts[1];
          const bookIdNum = parseInt(bookId);
          
          if (!isNaN(bookIdNum)) {
            // Try to find book by ID
            const textbook = textbookData.find(b => b.id === bookIdNum);
            if (textbook) {
              router.actions.navigateToTextbook(textbook);
            }
          } else {
            // Try to parse more complex commands like "open apostol chapter 1 section 2"
            const bookNameIndex = parts.indexOf('book') > 0 ? parts.indexOf('book') + 1 : 1;
            const bookName = parts[bookNameIndex].toLowerCase();
            
            // Find book by partial name match
            const textbook = textbookData.find(b => 
              b.title.toLowerCase().includes(bookName) || 
              b.author.toLowerCase().includes(bookName)
            );
            
            if (textbook) {
              // Check if we need to navigate to a specific chapter or section
              const chapterIndex = parts.indexOf('chapter');
              const sectionIndex = parts.indexOf('section');
              
              if (chapterIndex > 0 && chapterIndex < parts.length - 1) {
                const chapterId = parseInt(parts[chapterIndex + 1]);
                
                if (!isNaN(chapterId)) {
                  const chapter = textbook.chapters.find(c => c.id === chapterId);
                  
                  if (chapter) {
                    if (sectionIndex > 0 && sectionIndex < parts.length - 1) {
                      const sectionId = parseInt(parts[sectionIndex + 1]);
                      
                      if (!isNaN(sectionId)) {
                        const section = chapter.problemSets.find(s => s.id === sectionId);
                        
                        if (section) {
                          router.actions.navigateToProblemSet(textbook, chapter, section);
                          return;
                        }
                      }
                    }
                    
                    // If we found chapter but not section, go to chapter
                    router.actions.navigateToChapter(textbook, chapter);
                    return;
                  }
                }
              }
              
              // If we only found the book, go to the book
              router.actions.navigateToTextbook(textbook);
            }
          }
        }
        break;
      case 'back':
        // Navigate backward in the hierarchy
        if (router.params.problemId) {
          router.actions.navigateToProblemSet(
            router.activeContent.textbook!, 
            router.activeContent.chapter!, 
            router.activeContent.problemSet!
          );
        } else if (router.params.setId) {
          router.actions.navigateToTextbook(router.activeContent.textbook!);
        } else if (router.params.bookId) {
          router.actions.navigateToHome();
        }
        break;
      case 'ls':
        // List available resources at current level
        return ['Available commands: help, ls, cd, open, view, back, home, about, contact'];
      case 'clear':
        // Just return empty array to clear the terminal
        return [];
      case 'help':
        // Return help text
        return [
          'Mathematical Immaturity Terminal v0.1',
          'Available commands:',
          '  help                   - Show this help message',
          '  ls                     - List available resources',
          '  open [book]            - Open a textbook',
          '  view [resource]        - View a resource',
          '  back                   - Navigate back one level',
          '  home                   - Go to home page',
          '  about                  - Go to about page',
          '  contact                - Go to contact page',
          '  clear                  - Clear the terminal',
          '',
          'Examples:',
          '  open apostol           - Open Apostol\'s Calculus',
          '  open book apostol chapter 1 section 2  - Open specific section',
          '  view problem 1.2.3     - View specific problem'
        ];
      default:
        return [`Command not found: ${cmd}. Type 'help' for available commands.`];
    }
  };

  // Process terminal command and update history
  const processTerminalCommand = (command: string, router: any) => {
    // Add command to history
    setTerminalHistory(prev => [...prev, `$ ${command}`]);
    
    // Process command and get response
    const response = handleGlobalCommand(command, router);
    
    // If there's a response, add it to history
    if (response && Array.isArray(response)) {
      if (response.length === 0) {
        // Clear command
        setTerminalHistory([]);
      } else {
        setTerminalHistory(prev => [...prev, ...response]);
      }
    }
  };

  // Main layout
  return (
    <FontProvider>
    <div className='min-h-screen bg-background text-foreground'>
      <AppRouterProvider>
        {(router) => (
          <>
            {/* Navigation */}
            <nav className="border-b bg-card">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                <div className="flex space-x-8">
                    <button 
                      onClick={() => {
                        router.actions.navigateToHome();
                        router.setActiveSection('home');
                      }}
                      className={cn(
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                        router.activeSection === 'home' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </button>
                    <button 
                      onClick={() => router.setActiveSection('about')}
                      className={cn(
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                        router.activeSection === 'about' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      About
                    </button>
                    <button 
                      onClick={() => router.setActiveSection('contact')}
                      className={cn(
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                        router.activeSection === 'contact' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Terminal toggle button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setGlobalTerminalVisible(!globalTerminalVisible)}
                      title="Toggle Terminal (Alt+T)"
                    >
                      <Terminal className="w-4 h-4" />
                    </Button>
                    <FontToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </nav>
            
            {/* Global terminal (when visible) */}
            {globalTerminalVisible && (
              <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-black">
                <div className="flex justify-between items-center px-2 py-1 bg-card/80 border-b border-border">
                  <div className="flex items-center">
                    <Terminal className="w-3 h-3 mr-2 text-primary" />
                    <span className="text-xs font-mono">Mathematical Immaturity Terminal</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setGlobalTerminalVisible(false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="h-40">
                  <TerminalWidget
                    initialCommands={[
                      '$ Mathematical Immaturity Terminal v0.1', 
                      '$ Type "help" for available commands'
                    ]}
                    onCommandEnter={(cmd) => processTerminalCommand(cmd, router)}
                  />
                </div>
              </div>
            )}

            {/* Main content */}
            <main className="py-10">
              {/* About section */}
              {router.activeSection === 'about' && <About />}

              {/* Contact section */}
              {router.activeSection === 'contact' && <Contact />}

              {/* Main content sections */}
              {router.activeSection === 'home' && (
                <>
                  {/* Home view */}
                  {!router.params.bookId && (
                    <Suspense fallback={<HomePageSkeleton />}>
                      <HomePage
                        onSelectTextbook={router.actions.navigateToTextbook}
                      />
                    </Suspense>
                  )}

                  {/* TextbookTableOfContents view */}
                  {router.params.bookId && !router.params.setId && router.activeContent.textbook && (
                    <Suspense fallback={<TextbookTableOfContentsSkeleton />}>
                      <TextbookTableOfContents 
                        textbook={router.activeContent.textbook}
                        onBack={router.actions.navigateToHome}
                        onSelectProblemSet={(chapter, problemSet) => 
                          router.actions.navigateFromTableOfContents(
                            router.activeContent.textbook!, 
                            chapter, 
                            problemSet
                          )}
                      />
                    </Suspense>
                  )}

                  {/* ProblemSet view */}
                  {router.params.bookId && router.params.chapterId && router.params.setId && 
                  !router.params.problemId && router.activeContent.textbook && 
                  router.activeContent.chapter && router.activeContent.problemSet && (
                    <Suspense fallback={<ProblemSetViewSkeleton />}>
                      <ProblemSetView
                        problemSet={router.activeContent.problemSet}
                        previousProblemSet={router.activeContent.previousProblemSet || null}
                        nextProblemSet={router.activeContent.nextProblemSet || null}
                        onNavigateToProblemSet={(problemSet) => {
                          // Find the chapter for this problem set
                          const chapter = router.activeContent.textbook!.chapters.find(c =>
                            c.problemSets.some(ps => ps.id === problemSet.id)
                          );
                          if (chapter) {
                            router.actions.navigateToProblemSet(
                              router.activeContent.textbook!,
                              chapter,
                              problemSet
                            );
                          }
                        }}
                        onSelectProblem={(problem) => 
                          router.actions.navigateToProblem(
                            router.activeContent.textbook!.id, 
                            router.activeContent.chapter!.id, 
                            router.activeContent.problemSet!.id, 
                            problem.id
                          )}
                        onBackToContents={() => 
                          router.actions.navigateToTextbook(router.activeContent.textbook!)
                        }
                      />
                    </Suspense>
                  )}

                  {/* Problem view */}
                  {router.params.bookId && router.params.chapterId && router.params.setId && 
                  router.params.problemId && router.activeContent.textbook && 
                  router.activeContent.chapter && router.activeContent.problemSet && 
                  router.activeContent.problem && (
                    <Suspense fallback={<ProblemViewSkeleton />}>
                      <ProblemView
                        problemSet={router.activeContent.problemSet}
                        problem={router.activeContent.problem}
                        onNavigateToProblemSet={() => 
                          router.actions.navigateToProblemSet(
                            router.activeContent.textbook!, 
                            router.activeContent.chapter!, 
                            router.activeContent.problemSet!
                          )}
                        nextProblem={getProblemNavigation(router.activeContent.textbook, router.activeContent.problem!, 'next')}
                        previousProblem={getProblemNavigation(router.activeContent.textbook, router.activeContent.problem!, 'previous')}
                        onNavigateToProblem={(problem) => {
                          // Find the containing problem set and chapter if this might be a cross-section problem
                          const [chapterNumber, problemSetNumber, problemNumber] = problem.number.split(".").map(id => Number(id));
                          
                          router.actions.navigateToProblem(
                            router.activeContent.textbook!.id,
                            chapterNumber,
                            problemSetNumber,
                            problemNumber
                          );
                        }}
                      />
                    </Suspense>
                  )}
                </>
              )}
            </main>

            {/* Footer */}
            <footer className="border-t bg-background">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-muted-foreground text-sm">
                    © 2024-{new Date().getFullYear()} Mathematical Immaturity. All rights reserved.
                  </p>
                  {/* Keyboard shortcut info */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 rounded bg-muted border border-border text-xs font-mono">Alt+T</kbd>
                      <span className="ml-1">Toggle Terminal</span>
                    </span>
                    <span className="mx-1">•</span>
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 rounded bg-muted border border-border text-xs font-mono">Esc</kbd>
                      <span className="ml-1">Focus Editor</span>
                    </span>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </AppRouterProvider>
    </div>
    </FontProvider>
  );
};

// Helper function to get next or previous problem
const getProblemNavigation = (textbook: Textbook, currentProblem: Problem, direction: 'next' | 'previous'): Problem | null => {
  const [chapter, section, problem] = currentProblem.number.split(".").map(num => Number(num));
  
  const chapterIndex = textbook.chapters.findIndex((ch: Chapter) => ch.id === chapter);
  const sectionIndex = textbook.chapters[chapterIndex].problemSets.findIndex((sec: ProblemSet) => sec.id === section);
  const problemIndex = textbook.chapters[chapterIndex].problemSets[sectionIndex].problems.findIndex((p: Problem) => p.id === problem);
  
  const problemsLength = textbook.chapters[chapterIndex].problemSets[sectionIndex].problems.length;
  const sectionsLength = textbook.chapters[chapterIndex].problemSets.length;
  const chaptersLength = textbook.chapters.length;

  if (direction === "next") {
    if (problemIndex === (problemsLength - 1)) {
      if (sectionIndex === (sectionsLength - 1)) {
        if (chapterIndex === (chaptersLength - 1)) {
          return null;
        } else {
          return textbook.chapters[chapterIndex + 1].problemSets[0].problems[0];
        }
      } else {
        return textbook.chapters[chapterIndex].problemSets[sectionIndex + 1].problems[0];
      }
    } else {
      return textbook.chapters[chapterIndex].problemSets[sectionIndex].problems[problemIndex + 1];
    }
  } else if (direction === "previous") {
    if (problemIndex === 0) {
      if (sectionIndex === 0) {
        if (chapterIndex === 0) {
          return null;
        } else {
          const prevChapterLength = textbook.chapters[chapterIndex - 1].problemSets.length;
          const prevProblemSetLength = textbook.chapters[chapterIndex - 1].problemSets[prevChapterLength - 1].problems.length;
          return textbook.chapters[chapterIndex - 1].problemSets[prevChapterLength - 1].problems[prevProblemSetLength - 1];
        }
      } else {
        const prevProblemSetLength = textbook.chapters[chapterIndex].problemSets[sectionIndex - 1].problems.length;
        return textbook.chapters[chapterIndex].problemSets[sectionIndex - 1].problems[prevProblemSetLength - 1];
      }
    } else {
      return textbook.chapters[chapterIndex].problemSets[sectionIndex].problems[problemIndex - 1];
    }
  } else {
    return null;
  }
};

export default Website;