// src/components/shared/Breadcrumb.tsx
"use client";
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './shared.module.css';

// Helper function to shorten text
const shortenText = (text: string, type: 'textbook' | 'chapter' | 'problem-set' | 'problem'): string => {
  switch (type) {
    case 'textbook':
      // For textbooks, take text up to first ':'
      return text.split(':')[0].trim();
    case 'chapter':
      // For chapters, take just the chapter number and first few words
      const chapterMatch = text.match(/Chapter \d+/);
      return chapterMatch ? chapterMatch[0] : text.slice(0, 20);
    case 'problem-set':
      // For problem sets, take just the section number
      return text.split(' ').slice(0, 1).join(' ');
    case 'problem':
      // For problems, keep as is since it's usually just "Problem X.Y.Z"
      return text;
    default:
      return text;
  }
};

interface BreadcrumbProps {
  items: {
    label: string;
    onClick: () => void;
    type: 'textbook' | 'chapter' | 'problem-set' | 'problem' | 'home';
  }[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <button
            onClick={item.onClick}
            className={cn(
              styles.breadcrumbItem,
              index === items.length - 1 
                ? styles.breadcrumbActive 
                : styles.breadcrumbInactive
            )}
            title={item.label} // Show full text on hover
          >
            {item.type === 'home' ? item.label : shortenText(item.label, item.type)}
          </button>
          {index < items.length - 1 && (
            <ChevronRight className={styles.breadcrumbSeparator} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};