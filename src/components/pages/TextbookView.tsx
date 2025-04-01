// src/components/TextbookView.tsx
"use client";
import React, { useState } from 'react';  // Add useState
import { LayoutGrid, List } from 'lucide-react';  // Add LayoutGrid and List
import { Button } from "@/components/ui/shadcn";
import { cn } from "@/lib/utils";
import { Textbook, Chapter, ViewType } from "@/types/types";
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ContentView } from '@/components/shared/ContentView';

export const TextbookViewSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex gap-2 items-center">
        {[1, 2].map((i) => (
          <React.Fragment key={i}>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            {i < 2 && <div className="h-4 w-4" />} {/* Space for chevron */}
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
        {/* Author info */}
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>

      {/* Content cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1].map((i) => (
          <div 
            key={i}
            className="bg-card rounded-lg p-6 space-y-4 shadow-sm"
          >
            {/* Chapter title */}
            <div className="h-7 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
            {/* Metadata */}
            <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
            {/* Action button */}
            <div className="h-9 bg-gray-200 rounded w-32 mt-4 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

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