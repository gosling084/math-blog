// src/components/pages/ProblemView.tsx
"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, ArrowRight, Lightbulb, PenTool } from 'lucide-react';
import { Button, Card, CardContent } from "@/components/ui/shadcn";
import { cn } from "@/lib/utils";
import { Problem } from "@/types/types";
import { MathContent } from '@/components/shared/MathContent';
import { CurveSketchInteractive } from '@/components/shared/CurveSketchInteractive';
import styles from './pages.module.css';

interface ProblemViewProps {
  problem: Problem;
  onNavigateToProblemSet: () => void;
  nextProblem: Problem | null;
  previousProblem: Problem | null;
  onNavigateToProblem: (problem: Problem) => void;
}

// Skeleton component for loading state
export const ProblemViewSkeleton = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Navigation skeleton */}
      <div className="flex justify-between mb-8">
        <div className={`h-10 w-40 ${styles.skeletonPulse} rounded`} />
        <div className={`h-10 w-40 ${styles.skeletonPulse} rounded`} />
      </div>

      <Card className="bg-card text-card-foreground">
        <CardContent className={`p-6 ${styles.spacingY}`}>
          {/* Problem Header */}
          <div className="flex flex-col gap-2">
            <div className={`h-8 ${styles.skeletonPulse} rounded-lg w-48`} />
            <div className={`h-5 ${styles.skeletonPulse} rounded w-36`} />
          </div>

          {/* Problem Statement skeleton */}
          <div className={`${styles.spacingY} py-4 border-b border-t border-border`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-6 ${styles.skeletonPulse} rounded`} />
            ))}
          </div>

          {/* Buttons skeleton */}
          <div className={styles.spacingX}>
            <div className={`h-10 w-32 ${styles.skeletonPulse} rounded`} />
            <div className={`h-10 w-32 ${styles.skeletonPulse} rounded`} />
            <div className={`h-10 w-32 ${styles.skeletonPulse} rounded`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProblemView = ({
  problem,
  onNavigateToProblemSet,
  nextProblem,
  previousProblem,
  onNavigateToProblem,
}: ProblemViewProps) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);

  // Function to format the section title
  // const formatSectionTitle = (title: string) => {
  //   const sectionMatch = title.match(/^(\d+\.\d+)/);
  //   return sectionMatch ? sectionMatch[1] : title;
  // };
  
  return (
    <div className={styles.pageContainer}>
      {/* Main Problem Card */}
      <Card className="bg-card text-card-foreground mb-6 mt-8 border-primary/20">
        <CardContent className={`p-6 ${styles.spacingY}`}>
          {/* Problem Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className={styles.sectionTitle}>
                Problem {problem.number}
              </h2>
              <p className="text-sm text-muted-foreground">
                Added {new Date(problem.date).toLocaleDateString()}
              </p>
            </div>
            
            {/* Problem navigation mini-controls */}
            <div className={styles.spacingX}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => previousProblem && onNavigateToProblem(previousProblem)}
                disabled={!previousProblem}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => nextProblem && onNavigateToProblem(nextProblem)}
                disabled={!nextProblem}
                className="h-8 w-8"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Problem Statement - Styled like a textbook */}
          <div className="py-6 border-y border-border">
            <div className="math-content">
              <MathContent content={problem.content} />
            </div>
          </div>

          {/* Action Buttons - with improved icons and styling */}
          <div className="flex flex-wrap gap-3 grid grid-cols-1 sm:grid-cols-3">
            <Button 
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              disabled={problem.hint === ""}
              className={cn(
                "bg-card flex items-center gap-2",
                showHint && problem.hint !== "" && "ring-2 ring-primary/30"
              )}
            >
              <Lightbulb className="h-4 w-4" />
              <span>{showHint && problem.hint !== "" ? 'Hide Hint' : 'Show Hint'}</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowSolution(!showSolution)}
              disabled={problem.solution === ""}
              className={cn(
                "bg-card flex items-center gap-2",
                showSolution && problem.solution !== "" && "ring-2 ring-primary/30"
              )}
            >
              <PenTool className="h-4 w-4" />
              <span>{showSolution && problem.solution !== "" ? 'Hide Solution' : 'Show Solution'}</span>
            </Button>

            {problem.hasVisualization && problem.visualization && (
              <Button 
                variant="outline"
                onClick={() => setShowVisualization(!showVisualization)}
                className={cn(
                  "bg-card flex items-center gap-2",
                  showVisualization && problem.hasVisualization && "ring-2 ring-primary/30"
                )}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 15s2-3 4-3 4 3 6 3 4-3 6-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{showVisualization ? 'Hide Visualization' : 'Show Visualization'}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hint Content Panel */}
      {showHint && problem.hint !== "" && (
        <Card className="mb-6 bg-card border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-4 flex items-center text-foreground">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              Hint
            </h2>
            <div className="math-content sm:pl-7 sm:pr-7">
              <MathContent content={problem.hint} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Content Panel */}
      {showSolution && problem.solution !== "" && (
        <Card className="mb-6 bg-card border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-4 flex items-center text-foreground">
              <PenTool className="h-5 w-5 mr-2 text-primary" />
              Solution
            </h2>
            <div className="math-content sm:pl-7 sm:pr-7">
              <MathContent content={problem.solution} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualization Panel */}
      {showVisualization && problem.hasVisualization && problem.visualization && (
        <Card className="mb-6 bg-card border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-4 flex items-center text-foreground">
              <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 15s2-3 4-3 4 3 6 3 4-3 6-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Visualization
            </h2>
            <CurveSketchInteractive 
              initialCurves={problem.visualization.curves}
              initialRange={{
                xRange: problem.visualization.xRange,
                yRange: problem.visualization.yRange
              }}
              width={problem.visualization.width || 600}
              height={problem.visualization.height || 400}
            />
          </CardContent>
        </Card>
      )}

      {/* Bottom Navigation - Full width buttons for large screens, stacked for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
        {/* Previous Problem Button - including previous section's last problem if needed */}
        {previousProblem ? (
          <Button
            onClick={() => onNavigateToProblem(previousProblem)}
            className="flex items-center justify-center"
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            <span>Previous Problem</span>
          </Button>
        ) : (
          <div /> // Empty spacer
        )}

        {/* Back to Section - Center Button */}
        <Button
          variant="outline"
          onClick={onNavigateToProblemSet}
          className="flex items-center justify-center"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          <span>Problem Set</span>
        </Button>

        {/* Next Problem Button - including next section's first problem if needed */}
        {nextProblem ? (
          <Button
            onClick={() => onNavigateToProblem(nextProblem)}
            className="flex items-center justify-center"
            variant="outline"
          >
            <span>Next Problem</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div /> // Empty spacer
        )}
      </div>
    </div>
  );
};