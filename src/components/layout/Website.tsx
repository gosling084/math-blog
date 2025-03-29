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
    <div className='min-h-screen bg-background text-foreground flex flex-col h-screen'>
      <AppRouterProvider>
        {(router) => (
          <>
            {/* Navigation - fixed height */}
            <nav className="border-b bg-card flex-shrink-0">
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

            {/* Main content - scrollable */}
            <main className="py-6 flex-grow overflow-hidden">
              {/* About section */}
              {router.activeSection === 'about' && 
                <div className="h-full overflow-auto">
                  <About />
                </div>
              }

              {/* Contact section */}
              {router.activeSection === 'contact' && 
                <div className="h-full overflow-auto">
                  <Contact />
                </div>
              }

              {/* Main content sections */}
              {router.activeSection === 'home' && (
                <div className="h-full">
                  {/* Home view */}
                  {!router.params.bookId && (
                    <Suspense fallback={<HomePageSkeleton />}>
                      <div className="h-full">
                        <HomePage
                          onSelectTextbook={router.actions.navigateToTextbook}
                        />
                      </div>
                    </Suspense>
                  )}

                  {/* TextbookTableOfContents view */}
                  {router.params.bookId && !router.params.setId && router.activeContent.textbook && (
                    <Suspense fallback={<TextbookTableOfContentsSkeleton />}>
                      <div className="h-full overflow-auto">
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
                      </div>
                    </Suspense>
                  )}

                  {/* ProblemSet view */}
                  {router.params.bookId && router.params.chapterId && router.params.setId && 
                  !router.params.problemId && router.activeContent.textbook && 
                  router.activeContent.chapter && router.activeContent.problemSet && (
                    <Suspense fallback={<ProblemSetViewSkeleton />}>
                      <div className="h-full overflow-auto">
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
                      </div>
                    </Suspense>
                  )}

                  {/* Problem view */}
                  {router.params.bookId && router.params.chapterId && router.params.setId && 
                  router.params.problemId && router.activeContent.textbook && 
                  router.activeContent.chapter && router.activeContent.problemSet && 
                  router.activeContent.problem && (
                    <Suspense fallback={<ProblemViewSkeleton />}>
                      <div className="h-full overflow-auto">
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
                      </div>
                    </Suspense>
                  )}
                </div>
              )}
            </main>

            {/* Footer - fixed height */}
            <footer className="border-t bg-card flex-shrink-0">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    © 2024-{new Date().getFullYear()} Mathematical Immaturity. All rights reserved.
                  </p>
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