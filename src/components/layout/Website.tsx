// src/components/layout/Website.tsx
"use client";
import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Info, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Textbook, Chapter, ProblemSet, Problem, ViewType } from "@/types/types";
import { textbookData } from '@/data/textbooks';
import { TextbookView } from '@/components/pages/TextbookView';
import { HomePage } from '@/components/pages/HomePage';
import { ChapterView } from '@/components/pages/ChapterView';
import { ProblemSetView } from '@/components/pages/ProblemSetView';
import { ProblemView } from '@/components/pages/ProblemView';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from "next-themes";
import { useState, useEffect } from 'react';


const Website = () => {
  // All hooks must be called before any conditional returns
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Local storage hook
  const [viewPreferences, setViewPreferences] = useLocalStorage<{
    textbook: ViewType;
    chapter: ViewType;
    problemSet: ViewType;
  }>('viewPreferences', {
    textbook: 'card',
    chapter: 'card',
    problemSet: 'card'
  });

  // URL parameters
  const bookId = searchParams.get('id');
  const chapterId = searchParams.get('chapter');
  const setId = searchParams.get('set');
  const problemId = searchParams.get('p');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get active content
  const activeTextbook = bookId ? textbookData.find(t => t.id.toString() === bookId) : null;
  const activeChapter = activeTextbook && chapterId ? 
    activeTextbook.chapters.find(c => c.id.toString() === chapterId) : null;
  const activeProblemSet = activeChapter && setId ?
    activeChapter.problemSets.find(s => s.id.toString() === setId) : null;
  const activeProblem = activeProblemSet && problemId ?
    activeProblemSet.problems.find(p => p.id.toString() === problemId) : null;

  // Navigation handlers
  const navigateToHome = () => {
    router.push('/');
  };

  const navigateToTextbook = (textbook: Textbook) => {
    router.push(`/?id=${textbook.id}`);
  };

  const navigateToChapter = (textbook: Textbook, chapter: Chapter) => {
    router.push(`/?id=${textbook.id}&chapter=${chapter.id}`);
  };

  const navigateToProblemSet = (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet) => {
    router.push(`/?id=${textbook.id}&chapter=${chapter.id}&set=${problemSet.id}`);
  };

  const navigateToProblem = (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet, problem: Problem) => {
    router.push(`/?id=${textbook.id}&chapter=${chapter.id}&set=${problemSet.id}&p=${problem.id}`);
  };

  const getPreviousProblem = (problemSet: ProblemSet, currentProblem: Problem): Problem | null => {
    const index = problemSet.problems.findIndex(p => p.id === currentProblem.id);
    return index > 0 ? problemSet.problems[index - 1] : null;
  };
  
  const getNextProblem = (problemSet: ProblemSet, currentProblem: Problem): Problem | null => {
    const index = problemSet.problems.findIndex(p => p.id === currentProblem.id);
    return index < problemSet.problems.length - 1 ? problemSet.problems[index + 1] : null;
  };

  if (!mounted) {
    return null;
  }

  // Main layout
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link 
                href="/"
                className={cn(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  !searchParams.get('id') ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link 
                href="/about"  
                className={cn(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname === '/about' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Info className="w-4 h-4 mr-2" />
                About
              </Link>
              <Link 
                href="/contact"
                className={cn(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname === '/contact' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Link>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-10">
        {/* Home view */}
        {!bookId && (
          <HomePage 
            onSelectTextbook={navigateToTextbook}
          />
        )}

      {/* Textbook view */}
      {bookId && !chapterId && activeTextbook && (
        <TextbookView 
          textbook={activeTextbook}
          defaultView={viewPreferences.textbook}
          onViewChange={(view) => {
            setViewPreferences({
              ...viewPreferences,
              textbook: view
            });
          }}
          onBack={navigateToHome}
          onSelectChapter={(chapter) => navigateToChapter(activeTextbook, chapter)}
        />
      )}

      {/* Chapter view */}
      {bookId && chapterId && !setId && activeTextbook && activeChapter && (
        <ChapterView
          textbook={activeTextbook}
          chapter={activeChapter}
          defaultView={viewPreferences.chapter}
          onViewChange={(view) => {
            setViewPreferences({
              ...viewPreferences,
              chapter: view
            });
          }}
          onBack={() => navigateToTextbook(activeTextbook)}
          onNavigateToTextbook={navigateToHome}
          onSelectProblemSet={(problemSet) => 
            navigateToProblemSet(activeTextbook, activeChapter, problemSet)
          }
        />
      )}

      {/* ProblemSet view */}
      {bookId && chapterId && setId && !problemId && activeTextbook && activeChapter && activeProblemSet && (
        <ProblemSetView
          textbook={activeTextbook}
          chapter={activeChapter}
          problemSet={activeProblemSet}
          defaultView={viewPreferences.problemSet}
          onViewChange={(view) => {
            setViewPreferences({
              ...viewPreferences,
              problemSet: view
            });
          }}
          onBack={() => navigateToChapter(activeTextbook, activeChapter)}
          onNavigateToTextbook={navigateToHome}
          onNavigateToChapter={() => navigateToTextbook(activeTextbook)}
          onSelectProblem={(problem) => 
            navigateToProblem(activeTextbook, activeChapter, activeProblemSet, problem)
          }
        />
      )}

        {/* Problem view */}
        {bookId && chapterId && setId && problemId && activeTextbook && activeChapter && activeProblemSet && activeProblem && (
          <ProblemView
            textbook={activeTextbook}
            chapter={activeChapter}
            problemSet={activeProblemSet}
            problem={activeProblem}
            onBack={() => navigateToProblemSet(activeTextbook, activeChapter, activeProblemSet)}
            onNavigateToTextbook={navigateToHome}
            onNavigateToChapter={() => navigateToChapter(activeTextbook, activeChapter)}
            onNavigateToProblemSet={() => 
              navigateToProblemSet(activeTextbook, activeChapter, activeProblemSet)
            }
            nextProblem={getNextProblem(activeProblemSet, activeProblem)}
            previousProblem={getPreviousProblem(activeProblemSet, activeProblem)}
            onNavigateToProblem={(problem) => 
              navigateToProblem(activeTextbook, activeChapter, activeProblemSet, problem)
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Mathematical Immaturity. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Website;