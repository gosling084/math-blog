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
      <div className={styles.flexShrink}>
        {/* Combined navigation header with consistent centering */}
        <div className="flex justify-between items-center mb-4">
          {/* Left side - Previous section button or spacer */}
          <div className="w-32 flex justify-start">
            {previousProblemSet ? (
              <Button
                variant="link"
                className="flex items-center space-x-2"
                onClick={() => onNavigateToProblemSet(previousProblemSet)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{formatSectionTitle(previousProblemSet)}</span>
              </Button>
            ) : (
              <div /> /* Empty spacer */
            )}
          </div>
          
          {/* Center - Table of Contents button */}
          <Button
            variant="link"
            size="lg"
            className="flex items-center gap-2"
            onClick={onBackToContents}
          >
            <BookOpen className="h-5 w-5" />
            <span>Table of Contents</span>
          </Button>
          
          {/* Right side - Next section button or spacer */}
          <div className="w-32 flex justify-end">
            {nextProblemSet ? (
              <Button
                variant="link"
                className="flex items-center space-x-2"
                onClick={() => onNavigateToProblemSet(nextProblemSet)}
              >
                <span>{formatSectionTitle(nextProblemSet)}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <div /> /* Empty spacer */
            )}
          </div>
        </div>

        {/* Problem Set header */}
        <div className={`${styles.spacingY} mb-4`}>
          <h1 className={`text-2xl font-bold text-card-foreground ${styles.borderBottom}`}>
            {problemSet.title}
          </h1>
          <p className={styles.sectionContent}>
            {problemSet.description}
          </p>
        </div>
      </div>
  
      {/* Scrollable content area */}
      <div className={styles.scrollableContent}>
        {/* Problems List - Book-like Problem Set Layout */}
        <Card className="bg-card">
          <CardContent className="py-6">
            <div className={styles.spacingY}>
              {problemSet.problems.map((problem) => (
                <div 
                  key={problem.id}
                  className="py-4 rounded-md px-3 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="font-medium text-foreground w-8 shrink-0">
                      {problem.id.toString()}.
                    </div>
                    <div className="problem-content-container w-full">
                      <div className="math-content cursor-pointer"
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