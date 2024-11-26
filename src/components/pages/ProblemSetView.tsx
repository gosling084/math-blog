// src/components/ProblemSetView.tsx
"use client";
import React, { useState } from 'react';
import { ChevronRight, LayoutGrid, List } from 'lucide-react'; // Add these icons
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Textbook, Chapter, ProblemSet, Problem, ViewType } from "@/types/types";
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MathContent } from '@/components/ui/MathContent';
import { ProblemContentView } from '@/components/ui/ProblemContentView';

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