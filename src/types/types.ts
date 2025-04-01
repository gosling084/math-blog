// src/types.ts
import { CurveSketchProps } from "@/components/shared/CurveSketch";

// For individual math problems
export interface Problem {
    id: number;
    number: string;        // e.g., "14.1.3" for Chapter 14, Section 1, Problem 3
    content: string;       // Problem statement with LaTeX
    hint: string           // Problem hint with LaTeX
    solution: string;      // Solution with LaTeX
    date: string;         // When the solution was added/updated
    hasVisualization?: boolean; // Flag to indicate if visualization is needed
    visualization?: CurveSketchProps; // Configuration for the visualization
  }
  
  // For sections within chapters (like 14.1, 14.2, etc.)
  export interface ProblemSet {
    id: number;
    title: string;        // e.g., "14.1 Vector-Valued Functions"
    description: string;  // Brief description of the section's content
    problems: Problem[];
  }
  
  // For chapters (like Chapter 14)
  export interface Chapter {
    id: number;
    title: string;        // e.g., "Chapter 14: Calculus of Vector Valued Functions"
    description: string;  // Chapter overview
    problemSets: ProblemSet[];
  }
  
  // For the textbook itself
  export interface Textbook {
    id: number;
    title: string;        // "Calculus, Vol. 1: One Variable Calculus..."
    author: string;       // "Tom M. Apostol"
    edition: string;      // "Second Edition"
    year: string;         // Publication year
    chapters: Chapter[];
  }

  export type ViewType = 'card' | 'compact';

  export interface ContentItem {
    id: number;
    title: string;
    description?: string;
    metadata?: {
      label: string;
      value: string | number;
    }[];
  }
  
  export interface ContentViewProps<T extends ContentItem> {
    items: T[];
    viewType: ViewType;
    onSelect: (item: T) => void;
    renderMetadata?: (item: T) => React.ReactNode;
  }