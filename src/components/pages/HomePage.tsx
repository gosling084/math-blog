// src/components/pages/HomePage.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { Textbook } from "@/types/types";
import { textbookData } from "@/data/textbooks";
import { ChevronRight } from 'lucide-react';
import { Button, Card } from "@/components/ui";
import styles from './pages.module.css';

export const HomePageSkeleton = () => {
  return (
    <div className={styles.widePageContainer}>
      {/* Header section skeleton */}
      <div className={`${styles.pageHeader}`}>
        <div className={`${styles.skeletonPulse} h-10 w-2/3 mx-auto rounded-lg`} />
        <div className={`${styles.skeletonPulse} h-5 w-3/4 mx-auto rounded mt-4`} />
      </div>

      {/* Card grid skeleton */}
      <div className={styles.scrollableContent}>
        <div className={styles.cardGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`${styles.skeletonPulse} ${styles.bookCover} border-0`}>
              <div className="absolute inset-0"></div>
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
    <div className={styles.widePageContainer}>
      {/* Page header - centered and fixed */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Mathematical Immaturity
        </h1>
        <p className={styles.pageSubtitle}>
          Push it to the limit.
        </p>
      </div>

      {/* Scrollable textbook grid container */}
      <div className={styles.scrollableContent}>
        <div className="pb-6">
          <div className={styles.cardGrid}>
            {textbookData.map((textbook) => (
              <div 
                key={textbook.id}
                className="relative group"
              >
                <Card 
                  className={`bg-card ${styles.cardHover} overflow-hidden cursor-pointer border-0`}
                  style={{ aspectRatio: '2/3' }} // Standard book aspect ratio
                  onClick={() => onSelectTextbook(textbook)}
                >
                  {/* Book Cover Image */}
                  <div className={styles.bookCover}>
                    <Image
                      src={`/book-covers/book-${textbook.id}.jpg`}
                      alt={textbook.title}
                      fill
                      style={{objectFit: 'cover'}}
                      priority={textbook.id <= 2} // Prioritize loading first two books
                    />
                    
                    {/* Hover Overlay with Book Info */}
                    <div className={styles.bookOverlay}>
                      <h3 className={styles.bookTitle}>{textbook.title}</h3>
                      <p className={styles.bookAuthor}>{textbook.author}</p>
                      <p className={styles.bookYear}>{textbook.year}</p>
                      
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