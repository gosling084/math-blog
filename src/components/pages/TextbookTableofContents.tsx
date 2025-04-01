// src/components/pages/textbook/TextbookTableOfContents.tsx
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/shadcn";
import { Textbook, Chapter, ProblemSet } from "@/types/types";
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import Head from 'next/head';

export const TextbookTableOfContentsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-8 flex flex-col h-full">
      {/* Breadcrumb skeleton - fixed */}
      <div className="mb-4 flex gap-2 items-center flex-shrink-0">
        {[1, 2].map((i) => (
          <React.Fragment key={i}>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            {i < 2 && <div className="h-4 w-4" />}
          </React.Fragment>
        ))}
      </div>

      {/* Header section skeleton - fixed */}
      <div className="space-y-2 mb-4 flex-shrink-0">
        <div className="h-9 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>

      {/* Table of contents skeleton - scrollable */}
      <div className="overflow-y-auto flex-grow">
        <Card className="bg-card">
          <CardHeader className="sticky top-0 bg-card z-10">
            <CardTitle className="text-xl font-medium">Table of Contents</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Chapter skeleton */}
              {[1, 2, 3, 4, 5].map((chapter) => (
                <div key={chapter} className="space-y-4">
                  <div className="h-7 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
                  <div className="space-y-3 pl-6">
                    {[1, 2, 3, 4, 5].map((section) => (
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
  // Create SEO-friendly title and description
  const seoTitle = `${textbook.title} Solutions - Mathematical Immaturity`;
  const seoDescription = `Problem set solutions to ${textbook.title} by ${textbook.author}, ${textbook.edition}. Step-by-step solutions with detailed explanations.`;

  return (
    <>
      {/* SEO metadata */}
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Head>

      <div className="max-w-4xl mx-auto px-8 flex flex-col h-full">
        {/* Fixed navigation and header */}
        <div className="flex-shrink-0">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { label: "Books", onClick: onBack, type: 'home' },
                { label: textbook.title, onClick: () => {}, type: 'textbook' }
              ]}
            />
          </div>

          <div className="space-y-2 mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              {textbook.title}
            </h1>
            <p className="text-muted-foreground">
              {textbook.author} - {textbook.edition} ({textbook.year})
            </p>
            
            {/* SEO-friendly heading - visually hidden but available to search engines */}
            <h2 className="sr-only">
              Solutions Manual for {textbook.title} by {textbook.author} - Complete problem solutions
            </h2>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-grow">
          <Card className="bg-card">
            <CardHeader className="sticky top-0 bg-card z-10">
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
      </div>
    </>
  );
};