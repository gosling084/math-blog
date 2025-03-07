// src/components/pages/ProblemSetView.tsx
"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProblemSet, Problem } from "@/types/types";
import { MathContent } from '@/components/ui/MathContent';

export const ProblemSetViewSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-8">
      {/* Back button skeleton */}
      <div className="mb-4">
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Header section skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-9 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>

      {/* Problem list skeleton */}
      <Card className="bg-card">
        <CardContent className="py-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 space-y-2 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation skeleton */}
      <div className="flex justify-between mt-8">
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
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
    <div className="max-w-4xl mx-auto px-8">
      {/* Combined navigation header with consistent centering */}
      <div className="flex justify-between items-center mb-8">
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
      <div className="space-y-4 mb-8">
        <h1 className="text-2xl font-bold text-card-foreground border-b border-border pb-2">
          {problemSet.title}
        </h1>
        <p className="text-muted-foreground">
          {problemSet.description}
        </p>
      </div>
  
      {/* Problems List - Book-like Problem Set Layout */}
      <Card className="bg-card">
        <CardContent className="py-6">
          <div className="space-y-8">
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

      {/* Bottom Navigation */}
      <div className="flex justify-between mt-8">
        {previousProblemSet ? (
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => onNavigateToProblemSet(previousProblemSet)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{formatSectionTitle(previousProblemSet)}</span>
          </Button>
        ) : (
          <div /> /* Empty spacer */
        )}
        
        {nextProblemSet ? (
          <Button
            variant="outline"
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
  );
};