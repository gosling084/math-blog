// src/components/ChapterView.tsx
"use client";
import React, { useState } from 'react';  // Add useState
import { ChevronRight, LayoutGrid, List } from 'lucide-react';  // Add LayoutGrid and List
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Textbook, Chapter, ProblemSet, ViewType } from "@/types/types";
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContentView } from '../ui/ContentView';

interface ChapterViewProps {
  textbook: Textbook;
  chapter: Chapter;
  defaultView: ViewType,
  onBack: () => void;
  onNavigateToTextbook: () => void;
  onSelectProblemSet: (problemSet: ProblemSet) => void;
  onViewChange: (view: ViewType) => void;
}

export const ChapterView = ({
  textbook,
  chapter,
  defaultView,
  onBack,
  onNavigateToTextbook,
  onSelectProblemSet,
  onViewChange
}: ChapterViewProps) => {
  const [viewType, setViewType] = useState<ViewType>(defaultView);

  // Update parent when view changes
  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    onViewChange(view);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: "Books", onClick: onNavigateToTextbook, type: 'home' },
            { label: textbook.title, onClick: onBack, type: 'textbook' },
            { label: chapter.title, onClick: () => {}, type: 'chapter' }
          ]}
        />
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-card-foreground">
            {chapter.title}
          </h1>
          <div className="flex space-x-2">
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
          {chapter.description}
        </p>
      </div>

      <ContentView
        items={chapter.problemSets}
        viewType={viewType}
        onSelect={(problemSet) => onSelectProblemSet(problemSet)}
        renderMetadata={(problemSet) => (
          <div className="text-muted-foreground mb-4">
            {problemSet.problems.length}
            {
              problemSet.problems.length === 1 ? " problem " : " problems "
            } available
          </div>
        )}
      />
    </div>
  );
};