// src/components/ProblemSetView.tsx
"use client";
import React, { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react'; // Add these icons
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textbook, Chapter, ProblemSet, Problem, ViewType } from "@/types/types";
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MathContent } from '@/components/ui/MathContent';
import { ProblemContentView } from '@/components/ui/ProblemContentView';

export const ProblemSetViewSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex gap-2 items-center">
        {[1, 2, 3, 4].map((i) => (
          <React.Fragment key={i}>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            {i < 4 && <div className="h-4 w-4" />} {/* Space for chevron */}
          </React.Fragment>
        ))}
      </div>

      {/* Header section skeleton */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          {/* Title */}
          <div className="h-9 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
          {/* View toggle buttons */}
          <div className="flex space-x-3">
            <div className="h-9 w-9 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-9 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        {/* Description */}
        <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>

      {/* Problem card skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 space-y-4 shadow-sm">
          {/* Problem number */}
          <div className="h-7 bg-gray-200 rounded-lg w-1/4 animate-pulse" />
          {/* Math content placeholder - multiple lines */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
          </div>
          {/* Date */}
          <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse mt-2" />
          {/* Action button */}
          <div className="h-9 bg-gray-200 rounded w-32 mt-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

interface ProblemSetViewProps {
    textbook: Textbook;
    chapter: Chapter;
    problemSet: ProblemSet;
    defaultView: ViewType;
    onBack: () => void;
    onNavigateToTextbook: () => void;
    onNavigateToChapter: () => void;
    onSelectProblem: (problem: Problem) => void;
    onViewChange: (view: ViewType) => void;
  }

  export const ProblemSetView = ({
    textbook,
    chapter,
    problemSet,
    defaultView,
    onBack,
    onNavigateToChapter,
    onNavigateToTextbook,
    onSelectProblem,
    onViewChange
  }: ProblemSetViewProps) => {
    const [viewType, setViewType] = useState<ViewType>(defaultView);

    // Update parent when view changes
    const handleViewChange = (view: ViewType) => {
      setViewType(view);
      onViewChange(view);
    };
  
    return (
      <div className="max-w-4xl mx-auto p-8">
        {/* Breadcrumb navigation stays the same */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Books", onClick: onNavigateToTextbook, type: 'home' },
              { label: textbook.title, onClick: onNavigateToChapter, type: 'textbook' },
              { label: chapter.title, onClick: onBack, type: 'chapter' },
              { label: problemSet.title, onClick: () => {}, type: 'problem-set' }
            ]}
          />
        </div>
  
        {/* Problem Set header with view toggle */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-card-foreground">
              {problemSet.title}
            </h1>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleViewChange('card')}
                className={cn(
                  "bg-card text-card-foreground",
                  "hover:bg-transparent",
                  viewType === 'card' 
                    ? 'ring-2 ring-yellow-500/30' 
                    : ''
                )}
              >
                <LayoutGrid 
                  className="h-4 w-4 text-muted-foreground"
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleViewChange('compact')}
                className={cn(
                  "bg-card text-card-foreground",
                  "hover:bg-transparent",
                  viewType === 'compact' 
                    ? 'ring-2 ring-yellow-500/30' 
                    : ''
                )}
              >
                <List 
                  className="h-4 w-4 text-muted-foreground"
                />
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            {problemSet.description}
          </p>
        </div>
  
        {/* Render view based on viewType */}
        <ProblemContentView
          items={problemSet.problems}
          viewType={viewType}
          onSelect={(problem) => onSelectProblem(problem)}
          renderMetadata={(problem) => (
            <div className="text-muted-foreground mb-4">
              <MathContent content={problem.content} />
              <p className="mt-2">
                Added {new Date(problem.date).toLocaleDateString()}
              </p>
            </div>
          )}
        />
      </div>
    );
  };