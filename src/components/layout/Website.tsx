// src/components/layout/Website.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Home, Info, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ProblemSet, Problem, Textbook, Chapter} from "@/types/types";
import { TextbookTableOfContents, TextbookTableOfContentsSkeleton } from '@/components/pages/TextbookTableofContents';
import { HomePage, HomePageSkeleton } from '@/components/pages/HomePage';
import { ProblemSetView, ProblemSetViewSkeleton } from '@/components/pages/ProblemSetView';
import { ProblemView, ProblemViewSkeleton } from '@/components/pages/ProblemView';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { FontToggle } from '@/components/ui/FontToggle';
import { FontProvider } from '@/providers/font-provider';
import { About } from '@/components/pages/About';
import { Contact } from '@/components/pages/Contact';
import { Suspense } from 'react';
import { AppRouterProvider } from '@/providers/AppRouterProvider';

const Website = () => {
  // All hooks must be called before any conditional returns
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

                  {/* TextbookTableOfContents view (replaces both TextbookView and ChapterView) */}
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
                            router.activeContent.textbook!, 
                            router.activeContent.chapter!, 
                            router.activeContent.problemSet!, 
                            problem
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
                        nextProblem={getProblemNavigation(router.activeContent.problemSet!, router.activeContent.problem!, 'next')}
                        previousProblem={getProblemNavigation(router.activeContent.problemSet!, router.activeContent.problem!, 'previous')}
                        onNavigateToProblem={(problem) => {
                          // Find the containing problem set and chapter if this might be a cross-section problem
                          const { chapter, problemSet } = findContainingProblemSet(
                            router.activeContent.textbook!, 
                            problem
                          ) || {
                            chapter: router.activeContent.chapter!,
                            problemSet: router.activeContent.problemSet!
                          };
                          
                          router.actions.navigateToProblem(
                            router.activeContent.textbook!,
                            chapter,
                            problemSet,
                            problem
                          );
                        }}
                        // Cross-section navigation props
                        previousSectionLastProblem={router.activeContent.previousSectionLastProblem || null}
                        nextSectionFirstProblem={router.activeContent.nextSectionFirstProblem || null}
                        previousSectionTitle={router.activeContent.previousSectionTitle || null}
                        nextSectionTitle={router.activeContent.nextSectionTitle || null}
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

// Helper function to get next or previous problem
const getProblemNavigation = (problemSet: ProblemSet, currentProblem: Problem, direction: 'next' | 'previous'): Problem | null => {
  const index = problemSet.problems.findIndex(p => p.id === currentProblem.id);
  if (direction === 'previous') {
    return index > 0 ? problemSet.problems[index - 1] : null;
  } else {
    return index < problemSet.problems.length - 1 ? problemSet.problems[index + 1] : null;
  }
};

// Helper function to find which chapter and problem set contains a given problem
// Used for cross-section navigation
const findContainingProblemSet = (textbook: Textbook, problem: Problem): { chapter: Chapter, problemSet: ProblemSet } | null => {
  for (const chapter of textbook.chapters) {
    for (const problemSet of chapter.problemSets) {
      if (problemSet.problems.some(p => p.id === problem.id)) {
        return { chapter, problemSet };
      }
    }
  }
  return null;
};

export default Website;