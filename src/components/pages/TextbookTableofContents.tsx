// src/components/pages/TextbookTableOfContents.tsx
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textbook, Chapter, ProblemSet } from "@/types/types";
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const TextbookTableOfContentsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex gap-2 items-center">
        {[1, 2].map((i) => (
          <React.Fragment key={i}>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            {i < 2 && <div className="h-4 w-4" />}
          </React.Fragment>
        ))}
      </div>

      {/* Header section skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-9 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>

      {/* Table of contents skeleton */}
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Chapter skeleton */}
            {[1, 2].map((chapter) => (
              <div key={chapter} className="space-y-4">
                <div className="h-7 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
                <div className="space-y-3 pl-6">
                  {[1, 2, 3].map((section) => (
                    <div key={section} className="flex justify-between items-center">
                      <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                      <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface TextbookTableOfContentsProps {
  textbook: Textbook;
  onBack: () => void;
  onSelectProblemSet: (chapter: Chapter, problemSet: ProblemSet) => void;
}

export const TextbookTableOfContents = ({
  textbook,
  onBack,
  onSelectProblemSet
}: TextbookTableOfContentsProps) => {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: "Books", onClick: onBack, type: 'home' },
            { label: textbook.title, onClick: () => {}, type: 'textbook' }
          ]}
        />
      </div>

      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {textbook.title}
        </h1>
        <p className="text-muted-foreground">
          {textbook.author} - {textbook.edition} ({textbook.year})
        </p>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-10">
            {textbook.chapters.map((chapter) => (
              <div key={chapter.id} className="space-y-4">
                <h2 className="text-lg text-foreground border-b border-border pb-2">
                  {chapter.title}
                </h2>
                <div className="space-y-3 pl-6 pr-4">
                  {chapter.problemSets.map((problemSet) => (
                    <div 
                      key={problemSet.id} 
                      className="group"
                    >
                      <button 
                        onClick={() => onSelectProblemSet(chapter, problemSet)}
                        className="text-primary hover:text-primary/80 hover:underline text-left w-full"
                      >
                        <div className="flex items-baseline">
                          <span className="font-medium w-16">{`${chapter.id}.${problemSet.id}`}</span>
                          <span className="flex-1">{problemSet.description}</span>
                          <span className="text-muted-foreground text-sm whitespace-nowrap ml-2">
                            ({problemSet.problems.length} {problemSet.problems.length === 1 ? 'problem' : 'problems'})
                          </span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};