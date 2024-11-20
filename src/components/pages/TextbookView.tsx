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

  // const CardView = () => (
  //   <div className="space-y-6">
  //     {textbook.chapters.map((chapter) => (
  //       <Card 
  //         key={chapter.id}
  //         className="bg-card text-card-foreground hover:shadow-lg transition-shadow"
  //       >
  //         <CardHeader>
  //           <CardTitle className="text-foreground text-foreground">
  //             {chapter.title}
  //           </CardTitle>
  //           <p className="text-muted-foreground">
  //             {chapter.description}
  //           </p>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-muted-foreground">
  //             <p className="mb-4">
  //               {chapter.problemSets.length} sections {" • "} 
  //               {chapter.problemSets.reduce((total, set) => 
  //                 total + set.problems.length, 0
  //               )} problems
  //             </p>
  //           </div>
  //           <Button 
  //             onClick={() => onSelectChapter(chapter)}
  //             className="flex items-center"
  //           >
  //             View chapter <ChevronRight className="w-4 h-4 ml-1" />
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     ))}
  //   </div>
  // );

  // const CompactView = () => (
  //   <div className="p-6 bg-card text-card-foreground rounded-lg">
  //     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  //       {textbook.chapters.map((chapter) => (
  //         <button
  //           key={chapter.id}
  //           onClick={() => onSelectChapter(chapter)}
  //           className="text-left p-2 rounded text-primary hover:text-primary/80"
  //         >
  //           {chapter.title}
  //         </button>
  //       ))}
  //     </div>
  //   </div>
  // );

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
          <h1 className="text-4xl font-bold text-foreground">
            {textbook.title}
          </h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleViewChange('card')}
              className={cn(
                "bg-background",
                "hover:bg-transparent",
                viewType === 'card' 
                  ? 'ring-2 ring-primary/30' 
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
                  ? 'ring-2 ring-primary/30' 
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

      {/* {viewType === 'card' ? <CardView /> : <CompactView />} */}
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