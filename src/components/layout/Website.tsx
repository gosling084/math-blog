// src/components/layout/Website.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Home, Info, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ProblemSet, Problem, ViewType } from "@/types/types";
import { TextbookView, TextbookViewSkeleton } from '@/components/pages/TextbookView';
import { HomePage, HomePageSkeleton } from '@/components/pages/HomePage';
import { ChapterView, ChapterViewSkeleton } from '@/components/pages/ChapterView';
import { ProblemSetView, ProblemSetViewSkeleton } from '@/components/pages/ProblemSetView';
import { ProblemView, ProblemViewSkeleton } from '@/components/pages/ProblemView';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FontToggle } from '@/components/ui/FontToggle';
import { FontProvider } from '@/providers/font-provider';
import { About } from '@/components/pages/About';
import { Contact } from '@/components/pages/Contact';
import { Suspense } from 'react';
import { AppRouterProvider } from '@/providers/AppRouterProvider';

const Website = () => {
  // All hooks must be called before any conditional returns
  const [mounted, setMounted] = useState(false);
  
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
                  <div className="flex items-center">
                    <FontToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </nav>

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

                  {/* Textbook view */}
                  {router.params.bookId && !router.params.chapterId && router.activeContent.textbook && (
                    <Suspense fallback={<TextbookViewSkeleton />}>
                      <TextbookView 
                        textbook={router.activeContent.textbook}
                        defaultView={viewPreferences.textbook}
                        onViewChange={(view) => {
                          setViewPreferences({
                            ...viewPreferences,
                            textbook: view
                          });
                        }}
                        onBack={router.actions.navigateToHome}
                        onSelectChapter={(chapter) => 
                          router.actions.navigateToChapter(router.activeContent.textbook!, chapter)}
                      />
                    </Suspense>
                  )}

                  {/* Chapter view */}
                  {router.params.bookId && router.params.chapterId && !router.params.setId && 
                  router.activeContent.textbook && router.activeContent.chapter && (
                    <Suspense fallback={<ChapterViewSkeleton />}>
                      <ChapterView
                        textbook={router.activeContent.textbook}
                        chapter={router.activeContent.chapter}
                        defaultView={viewPreferences.chapter}
                        onViewChange={(view) => {
                          setViewPreferences({
                            ...viewPreferences,
                            chapter: view
                          });
                        }}
                        onBack={() => router.actions.navigateToTextbook(router.activeContent.textbook!)}
                        onNavigateToTextbook={router.actions.navigateToHome}
                        onSelectProblemSet={(problemSet) => 
                          router.actions.navigateToProblemSet(
                            router.activeContent.textbook!, 
                            router.activeContent.chapter!, 
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
                        textbook={router.activeContent.textbook}
                        chapter={router.activeContent.chapter}
                        problemSet={router.activeContent.problemSet}
                        defaultView={viewPreferences.problemSet}
                        onViewChange={(view) => {
                          setViewPreferences({
                            ...viewPreferences,
                            problemSet: view
                          });
                        }}
                        onBack={() => router.actions.navigateToChapter(
                          router.activeContent.textbook!, 
                          router.activeContent.chapter!
                        )}
                        onNavigateToTextbook={router.actions.navigateToHome}
                        onNavigateToChapter={() => router.actions.navigateToTextbook(router.activeContent.textbook!)}
                        onSelectProblem={(problem) => 
                          router.actions.navigateToProblem(
                            router.activeContent.textbook!, 
                            router.activeContent.chapter!, 
                            router.activeContent.problemSet!, 
                            problem
                          )}
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
                        textbook={router.activeContent.textbook}
                        chapter={router.activeContent.chapter}
                        problemSet={router.activeContent.problemSet}
                        problem={router.activeContent.problem}
                        onBack={() => router.actions.navigateToProblemSet(
                          router.activeContent.textbook!, 
                          router.activeContent.chapter!, 
                          router.activeContent.problemSet!
                        )}
                        onNavigateToTextbook={router.actions.navigateToHome}
                        onNavigateToChapter={() => router.actions.navigateToChapter(
                          router.activeContent.textbook!, 
                          router.activeContent.chapter!
                        )}
                        onNavigateToProblemSet={() => 
                          router.actions.navigateToProblemSet(
                            router.activeContent.textbook!, 
                            router.activeContent.chapter!, 
                            router.activeContent.problemSet!
                          )}
                        nextProblem={getNextProblem(router.activeContent.problemSet!, router.activeContent.problem!)}
                        previousProblem={getPreviousProblem(router.activeContent.problemSet!, router.activeContent.problem!)}
                        onNavigateToProblem={(problem) => 
                          router.actions.navigateToProblem(
                            router.activeContent.textbook!, 
                            router.activeContent.chapter!, 
                            router.activeContent.problemSet!, 
                            problem
                          )}
                      />
                    </Suspense>
                  )}
                </>
              )}
            </main>
          </>
        )}
      </AppRouterProvider>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © 2024-{new Date().getFullYear()} Mathematical Immaturity. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    </FontProvider>
  );
};

export default Website;