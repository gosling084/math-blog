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
  onBack: () => void;
  onNavigateToTextbook: () => void;
  onNavigateToChapter: () => void;
  onNavigateToProblemSet: () => void;
  nextProblem: Problem | null;
  previousProblem: Problem | null;
  onNavigateToProblem: (problem: Problem) => void;
}

export const ProblemView = ({
  textbook,
  chapter,
  problemSet,
  problem,
  onBack,
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
      {/* Breadcrumb navigation */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: "Books", onClick: onNavigateToTextbook, type: 'home' },
            { label: textbook.title, onClick: onNavigateToChapter, type: 'textbook' },
            { label: chapter.title, onClick: onNavigateToProblemSet, type: 'chapter' },
            { label: problemSet.title, onClick: onBack, type: 'problem-set' },
            { label: `Problem ${problem.number}`, onClick: () => {}, type: 'problem' }
          ]}
        />
      </div>

      {/* Problem content with hint - buttons on one line */}
      <Card className="bg-card text-card-foreground">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-foreground bg-card">
            Problem {problem.number}
          </CardTitle>
          <p className="text-muted-foreground">
            Added {new Date(problem.date).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Problem Statement */}
          <div>
            <div className="math-content">
              <MathContent content={problem.content} />
            </div>
          </div>

          {/* Hint and Solution Buttons */}
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              disabled={problem.hint === ""}
              className={cn(
                "bg-card text-card-foreground",
                "hover:bg-transparent",
                "text-muted-foreground"
              )}
            >
              {showHint && problem.hint !== "" ? 'Hide Hint' : 'Show Hint'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowSolution(!showSolution)}
              className={cn(
                "bg-card text-card-foreground",
                "hover:bg-transparent",
                "text-muted-foreground"
              )}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
          </div>

          {/* Hint Content */}
          {showHint && problem.hint !== "" && (
            <div>
              <h2 className="text-2xl mb-4 text-foreground bg-card">
                Hint
              </h2>
              <div className="math-content">
                <MathContent content={problem.hint} />
              </div>
            </div>
          )}

          {/* Solution Content */}
          {showSolution && (
            <div>
              <h2 className="text-2xl mb-4 text-foreground bg-card">
                Solution
              </h2>
              <div className="math-content">
                <MathContent content={problem.solution} />
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation buttons remain the same */}
        <div className="mt-8 flex justify-between items-center px-6 pb-6">
        {previousProblem ? (
          <Button
            onClick={() => onNavigateToProblem(previousProblem)}
            className={cn(
              "flex items-center",
              "bg-card text-card-foreground",
              "hover:bg-transparent",
              "text-muted-foreground"
            )}
            variant="outline"
          >
            <ChevronRight className={cn(
              "w-4 h-4 mr-2 rotate-180",
              "text-muted-foreground"
            )} />
            Previous Problem
          </Button>
        ) : (
          <div />
        )}
        {nextProblem ? (
          <Button
            onClick={() => onNavigateToProblem(nextProblem)}
            className={cn(
              "flex items-center",
              "bg-card text-card-foreground",
              "hover:bg-transparent",
              "text-muted-foreground"
            )}
            variant="outline"
          >
            Next Problem
            <ChevronRight className={cn(
              "w-4 h-4 ml-2",
              "text-muted-foreground"
            )} />
          </Button>
        ) : (
          <div />
        )}
        </div>
        </Card>
    </div>
  );
};