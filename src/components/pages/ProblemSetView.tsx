// src/components/pages/ProblemSetView.tsx
"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button, Card, CardContent } from "@/components/ui/shadcn";
import { ProblemSet, Problem } from "@/types/types";
import { MathContent } from '@/components/shared/MathContent';
import styles from './pages.module.css';

export const ProblemSetViewSkeleton = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Top navigation skeleton - fixed */}
      <div className={`flex justify-between items-center mb-4 ${styles.flexShrink}`}>
        <div className={`w-32 h-10 ${styles.skeletonPulse} rounded`} />
        <div className={`w-40 h-10 ${styles.skeletonPulse} rounded`} />
        <div className={`w-32 h-10 ${styles.skeletonPulse} rounded`} />
      </div>

      {/* Header section skeleton - fixed */}
      <div className={`${styles.spacingY} mb-4 ${styles.flexShrink}`}>
        <div className={`h-9 ${styles.skeletonPulse} rounded-lg w-1/3`} />
        <div className={`h-5 ${styles.skeletonPulse} rounded w-2/3`} />
      </div>

      {/* Problem list skeleton - scrollable */}
      <div className={styles.scrollableContent}>
        <Card className="bg-card">
          <CardContent className="py-6">
            <div className={styles.spacingY}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={`py-4 ${styles.spacingY} ${styles.skeletonPulse}`}>
                  <div className="h-6 rounded w-full" />
                  <div className="h-4 rounded w-5/6" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom navigation skeleton - fixed */}
      <div className={`flex justify-between mt-4 mb-2 ${styles.flexShrink}`}>
        <div className={`h-10 w-40 ${styles.skeletonPulse} rounded`} />
        <div className={`h-10 w-40 ${styles.skeletonPulse} rounded`} />
      </div>
    </div>
  );
};

interface ProblemSetViewProps {
  problemSet: ProblemSet;
  previousProblemSet: ProblemSet | null;
  nextProblemSet: ProblemSet | null;
  onNavigateToProblemSet: (problemSet: ProblemSet) => void;
  onSelectProblem: (problem: Problem) => void;
  onBackToContents: () => void;
}

export const ProblemSetView = ({
  problemSet,
  previousProblemSet,
  nextProblemSet,
  onNavigateToProblemSet,
  onSelectProblem,
  onBackToContents
}: ProblemSetViewProps) => {
  // Function to format section number for display
  const formatSectionTitle = (ps: ProblemSet) => {
    // Extract just the section number part of the title (e.g., "14.1" from "14.1 Exercises")
    const sectionMatch = ps.title.match(/^(\d+\.\d+)/);
    return sectionMatch ? sectionMatch[1] + ' Exercises' : ps.title;
  };
  
  return (
    <div className={`${styles.pageContainer} ${styles.flexCol}`}>
      {/* Fixed top elements */}
      <div className={styles.stickyHeader}>
        {/* Combined navigation header with consistent centering */}
        <div className={styles.navGrid}>
          {/* Left side - Previous section button or spacer */}
          <div className={styles.navLeft}>
            {previousProblemSet ? (
              <Button
                variant="link"
                className={`flex items-center gap-2 ${styles.navButton}`}
                onClick={() => onNavigateToProblemSet(previousProblemSet)}
              >
                <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{formatSectionTitle(previousProblemSet)}</span>
              </Button>
            ) : (
              <div className={styles.buttonPlaceholder}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Previous Section</span>
              </div>
            )}
          </div>
          
          {/* Center - Table of Contents button */}
          <div className={styles.navCenter}>
            <Button
              variant="link"
              className={`flex items-center gap-2 ${styles.navButton}`}
              onClick={onBackToContents}
            >
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span>Table of Contents</span>
            </Button>
          </div>
          
          {/* Right side - Next section button or spacer */}
          <div className={styles.navRight}>
            {nextProblemSet ? (
              <Button
                variant="link"
                className={`flex items-center gap-2 ${styles.navButton}`}
                onClick={() => onNavigateToProblemSet(nextProblemSet)}
              >
                <span className="truncate">{formatSectionTitle(nextProblemSet)}</span>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </Button>
            ) : (
              <div className={styles.buttonPlaceholder}>
                <span>Next Section</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Scrollable content area */}
      <div className={styles.scrollableContent}>
        {/* Add problem set description to scrollable content */}
        <p className={`${styles.sectionContent} ${styles.problemSetDescription}`}>
          {problemSet.description}
        </p>

        {/* Problems List - Book-like Problem Set Layout */}
        <Card className="bg-card">
          <CardContent className="py-6">
            <div className={styles.problemList}>
              {problemSet.problems.map((problem) => (
                <div 
                  key={problem.id}
                  className={styles.problemItem}
                >
                  <div className={styles.problemContent}>
                    <div className={styles.problemNumber}>
                      {problem.id.toString()}.
                    </div>
                    <div className={styles.problemContainer}>
                      <div 
                        className={styles.mathContentWrapper}
                        onClick={() => onSelectProblem(problem)}
                      >
                        <MathContent content={problem.content} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};