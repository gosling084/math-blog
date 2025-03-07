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
                          const [chapterNumber, problemSetNumber, problemNumber]: number[] = problem.number.split(".").map(id => Number(id))
                          
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
const getProblemNavigation = (textbook: Textbook, currentProblem: Problem, direction: 'next' | 'previous'): Problem | null => {
  const [chapter, section, problem]: number[] = currentProblem.number.split(".").map(num => Number(num));
  
  const chapterIndex: number = textbook.chapters.findIndex((ch: Chapter) => ch.id === chapter);
  const sectionIndex: number = textbook.chapters[chapterIndex].problemSets.findIndex((sec: ProblemSet) => sec.id === section);
  const problemIndex: number = textbook.chapters[chapterIndex].problemSets[sectionIndex].problems.findIndex((p: Problem) => p.id === problem);
  
  const problemsLength: number = textbook.chapters[chapterIndex].problemSets[sectionIndex].problems.length;
  const sectionsLength: number = textbook.chapters[chapterIndex].problemSets.length;
  const chaptersLength: number = textbook.chapters.length;

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
          const prevChapterLength: number = textbook.chapters[chapterIndex - 1].problemSets.length;
          const prevProblemSetLength: number = textbook.chapters[chapterIndex - 1].problemSets[prevChapterLength - 1].problems.length;
          return textbook.chapters[chapterIndex - 1].problemSets[prevChapterLength - 1].problems[prevProblemSetLength - 1];
        }
      } else {
        const prevProblemSetLength: number = textbook.chapters[chapterIndex].problemSets[sectionIndex - 1].problems.length;
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