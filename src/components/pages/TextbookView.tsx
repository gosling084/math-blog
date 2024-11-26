// src/components/TextbookView.tsx
"use client";
import React, { useState } from 'react';  // Add useState
import { ChevronRight, LayoutGrid, List } from 'lucide-react';  // Add LayoutGrid and List
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Textbook, Chapter, ViewType } from "@/types/types";
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContentView } from '../ui/ContentView';

interface TextbookViewProps {
  textbook: Textbook;
  defaultView: ViewType;
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
  onViewChange: (view: ViewType) => void;
}

export const TextbookView = ({
  textbook,
  defaultView,
  onBack,
  onSelectChapter,
  onViewChange
}: TextbookViewProps) => {
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
            { label: "Books", onClick: onBack, type: 'home' },
            { label: textbook.title, onClick: () => {}, type: 'textbook' }
          ]}
        />
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">
            {textbook.title}
          </h1>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleViewChange('card')}
              className={cn(
                "bg-background",
                "hover:bg-transparent",
                viewType === 'card' 
                  ? 'ring-2 ring-yellow-500/30' 
                  : ''
              )}
            >
              <LayoutGrid 
                className={cn(
                  "h-4 w-4",
                  "text-muted-foreground"
                )} 
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleViewChange('compact')}
              className={cn(
                "bg-background",
                "hover:bg-transparent",
                viewType === 'compact' 
                  ? 'ring-2 ring-yellow-500/30' 
                  : ''
              )}
            >
              <List 
                className={cn(
                  "h-4 w-4",
                  "text-muted-foreground"
                )} 
              />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          {textbook.author} - {textbook.edition} ({textbook.year})
        </p>
      </div>

      <ContentView
        items={textbook.chapters}
        viewType={viewType}
        onSelect={(chapter) => onSelectChapter(chapter)}
        renderMetadata={(chapter) => (
          <div className="text-muted-foreground mb-4">
            {chapter.problemSets.length}
            {chapter.problemSets.length === 1 ? " section ": " sections "} {" • "} 
            {chapter.problemSets.reduce((total, set) => 
              total + set.problems.length, 0
            )} 
            {
              chapter.problemSets.reduce((total, set) => 
                total + set.problems.length, 0
              ) === 1 ? " problem " : " problems "
            }
          </div>
        )}
      />
    </div>
  );
};