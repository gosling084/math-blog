// src/components/pages/HomePage.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { Textbook } from "@/types/types";
import { textbookData } from "@/data/textbooks";
import { ChevronRight } from 'lucide-react';
import { Button, Card } from "@/components/ui/shadcn";

export const HomePageSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-8 flex flex-col h-full">
      {/* Header section skeleton */}
      <div className="space-y-4 mb-8 text-center flex-shrink-0">
        <div className="h-10 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
      </div>

      {/* Card grid skeleton */}
      <div className="overflow-y-auto flex-grow">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card rounded-lg shadow-sm animate-pulse relative overflow-hidden border-0" style={{ aspectRatio: '2/3' }}>
              <div className="absolute inset-0 bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface HomePageProps {
  onSelectTextbook: (textbook: Textbook) => void;
}

export const HomePage = ({ onSelectTextbook }: HomePageProps) => {
  return (
    <div className="max-w-6xl mx-auto px-8 flex flex-col h-full">
      {/* Page header - centered and fixed */}
      <div className="space-y-4 mb-8 text-center flex-shrink-0">
        <h1 className="text-4xl font-bold text-foreground">
          Mathematical Immaturity
        </h1>
        <p className="text-muted-foreground text-lg">
          Push it to the limit.
        </p>
      </div>

      {/* Scrollable textbook grid container */}
      <div className="overflow-y-auto flex-grow">
        <div className="pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {textbookData.map((textbook) => (
              <div 
                key={textbook.id}
                className="relative group"
              >
                <Card 
                  className="bg-card hover:shadow-lg transition-shadow overflow-hidden cursor-pointer border-0"
                  style={{ aspectRatio: '2/3' }} // Standard book aspect ratio
                  onClick={() => onSelectTextbook(textbook)}
                >
                  {/* Book Cover Image */}
                  <div className="relative h-full w-full">
                    <Image
                      src={`/book-covers/book-${textbook.id}.jpg`}
                      alt={textbook.title}
                      fill
                      style={{objectFit: 'cover'}}
                      priority={textbook.id <= 2} // Prioritize loading first two books
                    />
                    
                    {/* Hover Overlay with Book Info - Simplified */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white text-base md:text-lg font-bold mb-1 line-clamp-2">{textbook.title}</h3>
                      <p className="text-white/90 text-sm">{textbook.author}</p>
                      <p className="text-white/80 text-xs mb-2">{textbook.year}</p>
                      
                      <Button 
                        size="sm"
                        className="flex items-center justify-center group/btn mt-1 w-full text-xs"
                      >
                        View
                        <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};