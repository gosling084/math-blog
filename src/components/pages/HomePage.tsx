// src/components/HomePage.tsx
"use client";
import React from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Textbook } from "@/types/types";
import { textbookData } from "@/data/textbooks";
import { themeStyles } from '@/lib/styles';

interface HomePageProps {
  onSelectTextbook: (textbook: Textbook) => void;
}

export const HomePage = ({ onSelectTextbook }: HomePageProps) => {
  return (
    <div className="content-layout">
      {/* Header section */}
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Mathematical Immaturity
        </h1>
        <p className="text-xl text-muted-foreground">
          Growing up, one proof at a time.
        </p>
      </div>
  
      {/* Section title */}
      <div className="text-sm uppercase tracking-wide text-muted-foreground mb-6">
        Problem Set Solutions
      </div>
  
      {/* Cards */}
      <div className="card-layout">
        {textbookData.map((textbook) => (
          <Card 
            key={textbook.id} 
            className="card-hover"
          >
            <CardHeader>
              <CardTitle className="text-foreground">
                {textbook.title}
              </CardTitle>
              <p className="text-muted-foreground">
                {textbook.author} - {textbook.edition} ({textbook.year})
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {textbook.chapters.length}
                  {textbook.chapters.length === 1 ? " chapter " : " chapters "}
                  {" • "} 
                  {textbook.chapters.reduce((total, chapter) => 
                    total + chapter.problemSets.reduce((setTotal, set) => 
                      setTotal + set.problems.length, 0
                    ), 0
                  )}
                  {
                    textbook.chapters.reduce((total, chapter) => 
                      total + chapter.problemSets.reduce((setTotal, set) => 
                        setTotal + set.problems.length, 0
                      ), 0
                    ) === 1 ? " problem" : " problems"
                  }
                </p>
                <Button 
                  onClick={() => onSelectTextbook(textbook)}
                  className="flex items-center gap-2"
                >
                  View chapters <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};