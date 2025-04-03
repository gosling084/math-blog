// src/components/core/Website.tsx
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Home, Info, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";
import { 
  TextbookTableOfContents, 
  TextbookTableOfContentsSkeleton,
  HomePage, 
  HomePageSkeleton,
  ProblemSetView, 
  ProblemSetViewSkeleton,
  ProblemView, 
  ProblemViewSkeleton,
  About,
  Contact
} from '@/components/pages';
import { ThemeToggle, FontToggle } from '@/components/ui';
import { FontProvider } from '@/providers/font-provider';
import { AppRouterProvider } from '@/providers/AppRouterProvider';
import styles from './core.module.css';

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
    <div className={styles.appContainer}>
      <AppRouterProvider>
        {(router) => (
          <>
            {/* Navigation - fixed height */}
            <nav className={styles.navBar}>
              <div className={styles.navContainer}>
                <div className={styles.navContent}>
                  <div className={styles.navButtonGroup}>
                    <button 
                      onClick={() => {
                        router.actions.navigateToHome();
                        router.setActiveSection('home');
                      }}
                      className={cn(
                        styles.navButton,
                        router.activeSection === 'home' ? styles.navButtonActive : styles.navButtonInactive
                      )}
                    >
                      <Home className={styles.navIcon} />
                      Home
                    </button>
                    <button 
                      onClick={() => router.setActiveSection('about')}
                      className={cn(
                        styles.navButton,
                        router.activeSection === 'about' ? styles.navButtonActive : styles.navButtonInactive
                      )}
                    >
                      <Info className={styles.navIcon} />
                      About
                    </button>
                    <button 
                      onClick={() => router.setActiveSection('contact')}
                      className={cn(
                        styles.navButton,
                        router.activeSection === 'contact' ? styles.navButtonActive : styles.navButtonInactive
                      )}
                    >
                      <Mail className={styles.navIcon} />
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
            <main className={styles.mainContent}>
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
                          nextProblem={router.getProblemNavigation(router.activeContent.textbook, router.activeContent.problem!, 'next')}
                          previousProblem={router.getProblemNavigation(router.activeContent.textbook, router.activeContent.problem!, 'previous')}
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
            <footer className={styles.footer}>
              <div className={styles.footerContainer}>
                <div className={styles.footerContent}>
                  <p className={styles.footerText}>
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

export default Website;