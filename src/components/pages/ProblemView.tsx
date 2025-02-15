// src/components/ProblemView.tsx
"use client";
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Problem, ProblemSet, Chapter, Textbook } from "@/types/types";
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MathContent } from '@/components/ui/MathContent';
import { useState } from 'react';

interface ProblemViewProps {
  textbook: Textbook;
  chapter: Chapter;
  problemSet: ProblemSet;
  problem: Problem;
  onNavigateToHome: () => void;
  onNavigateToTextbook: () => void;
  onNavigateToChapter: () => void;
  onNavigateToProblemSet: () => void;
  nextProblem: Problem | null;
  previousProblem: Problem | null;
  onNavigateToProblem: (problem: Problem) => void;
}

// Skeleton component for loading state
export const ProblemViewSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 sm:mb-8 flex gap-2 items-center overflow-x-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <React.Fragment key={i}>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 flex-shrink-0" />
            {i < 5 && <div className="h-4 w-4 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <Card className="bg-card text-card-foreground">
        <CardHeader className="space-y-1">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8">
          {/* Problem Statement skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>

          {/* Hint and Solution Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="h-10 w-full sm:w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full sm:w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Navigation buttons skeleton */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
            <div className="h-10 w-full sm:w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full sm:w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProblemView = ({
  textbook,
  chapter,
  problemSet,
  problem,
  onNavigateToHome,
  onNavigateToTextbook,
  onNavigateToChapter,
  onNavigateToProblemSet,
  nextProblem,
  previousProblem,
  onNavigateToProblem
}: ProblemViewProps) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Navigation: Breadcrumb for larger screens, Back button for mobile */}
      <div className="mb-4 sm:mb-8">
        {/* Back button - visible only on mobile */}
        <button
          onClick={onNavigateToProblemSet}
          className="sm:hidden flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
          Back to problems
        </button>

        {/* Breadcrumb - hidden on mobile, visible on larger screens */}
        <div className="hidden sm:block overflow-x-auto">
          <Breadcrumb
            items={[
              { label: "Books", onClick: onNavigateToHome, type: 'home' },
              { label: textbook.title, onClick: onNavigateToTextbook, type: 'textbook' },
              { label: chapter.title, onClick: onNavigateToChapter, type: 'chapter' },
              { label: problemSet.title, onClick: onNavigateToProblemSet, type: 'problem-set' },
              { label: `Problem ${problem.number}`, onClick: () => {}, type: 'problem' }
            ]}
          />
        </div>
      </div>

      {/* Problem Set header with view toggle */}
      <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-card-foreground">
              {problemSet.title}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {problemSet.description}
          </p>
        </div>

      <Card className="bg-card text-card-foreground overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl text-foreground bg-card">
            Problem {problem.number}
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Added {new Date(problem.date).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8">
          {/* Problem Statement */}
          <div className="overflow-x-auto">
            <div className="math-content">
              <MathContent content={problem.content} />
            </div>
          </div>

          {/* Hint and Solution Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              disabled={problem.hint === ""}
              className={cn(
                "bg-card text-card-foreground w-full sm:w-auto",
                "hover:bg-transparent",
                "text-muted-foreground"
              )}
            >
              {showHint && problem.hint !== "" ? 'Hide Hint' : 'Show Hint'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowSolution(!showSolution)}
              disabled={problem.solution === ""}
              className={cn(
                "bg-card text-card-foreground w-full sm:w-auto",
                "hover:bg-transparent",
                "text-muted-foreground"
              )}
            >
              {showSolution && problem.solution !== "" ? 'Hide Solution' : 'Show Solution'}
            </Button>
          </div>

          {/* Hint Content */}
          {showHint && problem.hint !== "" && (
            <div className="overflow-x-auto">
              <h2 className="text-xl sm:text-2xl mb-4 text-foreground bg-card">
                Hint
              </h2>
              <div className="math-content">
                <MathContent content={problem.hint} />
              </div>
            </div>
          )}

          {/* Solution Content */}
          {showSolution && (
            <div className="overflow-x-auto">
              <h2 className="text-xl sm:text-2xl mb-4 text-foreground bg-card">
                Solution
              </h2>
              <div className="math-content">
                <MathContent content={problem.solution} />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
            {previousProblem ? (
              <Button
                onClick={() => onNavigateToProblem(previousProblem)}
                className={cn(
                  "flex items-center justify-center",
                  "bg-card text-card-foreground",
                  "hover:bg-transparent",
                  "text-muted-foreground",
                  "w-full sm:w-auto"
                )}
                variant="outline"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180 text-muted-foreground" />
                <span className="whitespace-nowrap">Previous Problem</span>
              </Button>
            ) : (
              <div className="sm:flex-1" />
            )}
            {nextProblem ? (
              <Button
                onClick={() => onNavigateToProblem(nextProblem)}
                className={cn(
                  "flex items-center justify-center",
                  "bg-card text-card-foreground",
                  "hover:bg-transparent",
                  "text-muted-foreground",
                  "w-full sm:w-auto"
                )}
                variant="outline"
              >
                <span className="whitespace-nowrap">Next Problem</span>
                <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
              </Button>
            ) : (
              <div className="sm:flex-1" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};