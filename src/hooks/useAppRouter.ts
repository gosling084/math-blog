// src/hooks/useAppRouter.ts
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Textbook, Chapter, ProblemSet, Problem } from '@/types/types';
import { textbookData } from '@/data/textbooks';

type ActiveSection = 'home' | 'about' | 'contact';

// Define a comprehensive interface for the active content
interface ActiveContent {
  textbook: Textbook | null;
  chapter: Chapter | null;
  problemSet: ProblemSet | null;
  problem: Problem | null;
  // For ProblemSetView navigation
  previousProblemSet?: ProblemSet | null;
  nextProblemSet?: ProblemSet | null;
  // For cross-section navigation in ProblemView
  previousSectionLastProblem?: Problem | null;
  nextSectionFirstProblem?: Problem | null;
  previousSectionTitle?: string | null;
  nextSectionTitle?: string | null;
}

export function useAppRouter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');

  // Get all URL parameters
  const params = {
    bookId: searchParams.get('id'),
    chapterId: searchParams.get('chapter'),
    setId: searchParams.get('set'),
    problemId: searchParams.get('p')
  };

  // Effect for resetting section
  useEffect(() => {
    if (params.bookId || params.chapterId || params.setId || params.problemId) {
      setActiveSection('home');
    }
  }, [params.bookId, params.chapterId, params.setId, params.problemId]);

  // Get active content
  const activeTextbook = params.bookId ? textbookData.find(t => t.id.toString() === params.bookId) : null;
  const activeChapter = activeTextbook && params.chapterId ? 
    activeTextbook.chapters.find(c => c.id.toString() === params.chapterId) : null;
  const activeProblemSet = activeChapter && params.setId ?
    activeChapter.problemSets.find(s => s.id.toString() === params.setId) : null;
  const activeProblem = activeProblemSet && params.problemId ?
    activeProblemSet.problems.find(p => p.id.toString() === params.problemId) : null;

  // Helper function to get adjacent problem sets (previous and next)
  const getAdjacentProblemSets = (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet): { 
    previous: ProblemSet | null; 
    next: ProblemSet | null;
    previousSectionTitle: string | null;
    nextSectionTitle: string | null;
  } => {
    // Find problemSet index within the chapter
    const problemSetIndex = chapter.problemSets.findIndex(ps => ps.id === problemSet.id);
    
    // Check if there's a previous problem set in the same chapter
    if (problemSetIndex > 0) {
      return { 
        previous: chapter.problemSets[problemSetIndex - 1], 
        next: problemSetIndex < chapter.problemSets.length - 1 ? chapter.problemSets[problemSetIndex + 1] : null,
        previousSectionTitle: chapter.problemSets[problemSetIndex - 1].title,
        nextSectionTitle: problemSetIndex < chapter.problemSets.length - 1 ? chapter.problemSets[problemSetIndex + 1].title : null
      };
    }
    
    // Find chapter index
    const chapterIndex = textbook.chapters.findIndex(c => c.id === chapter.id);
    
    // Check if there's a previous chapter
    const previousChapter = chapterIndex > 0 ? textbook.chapters[chapterIndex - 1] : null;
    const previousProblemSet = previousChapter && previousChapter.problemSets.length > 0 
      ? previousChapter.problemSets[previousChapter.problemSets.length - 1] : null;
    
    // Check if there's a next problem set (either in this chapter or next)
    let nextProblemSet = null;
    let nextSectionTitle = null;
    if (problemSetIndex < chapter.problemSets.length - 1) {
      nextProblemSet = chapter.problemSets[problemSetIndex + 1];
      nextSectionTitle = nextProblemSet.title;
    } else {
      // Try to find first problem set in next chapter
      const nextChapter = chapterIndex < textbook.chapters.length - 1 ? textbook.chapters[chapterIndex + 1] : null;
      if (nextChapter && nextChapter.problemSets.length > 0) {
        nextProblemSet = nextChapter.problemSets[0];
        nextSectionTitle = nextProblemSet.title;
      }
    }
    
    return { 
      previous: previousProblemSet, 
      next: nextProblemSet,
      previousSectionTitle: previousProblemSet?.title || null,
      nextSectionTitle
    };
  };

  // Helper function for cross-section problem navigation
  const getCrossSectionProblems = (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet, problem: Problem): {
    previousSectionLastProblem: Problem | null;
    nextSectionFirstProblem: Problem | null;
    previousSectionTitle: string | null;
    nextSectionTitle: string | null;
  } => {
    // Find if this is first or last problem in set
    const isFirstProblem = problemSet.problems[0].id === problem.id;
    const isLastProblem = problemSet.problems[problemSet.problems.length - 1].id === problem.id;
    
    let previousSectionLastProblem = null;
    let nextSectionFirstProblem = null;
    let previousSectionTitle = null;
    let nextSectionTitle = null;

    // Get adjacent problem sets
    const { previous: prevProblemSet, next: nextProblemSet } = 
      getAdjacentProblemSets(textbook, chapter, problemSet);
    
    // If this is the first problem and there's a previous section
    if (isFirstProblem && prevProblemSet) {
      previousSectionLastProblem = prevProblemSet.problems[prevProblemSet.problems.length - 1];
      previousSectionTitle = prevProblemSet.title;
    }
    
    // If this is the last problem and there's a next section
    if (isLastProblem && nextProblemSet) {
      nextSectionFirstProblem = nextProblemSet.problems[0];
      nextSectionTitle = nextProblemSet.title;
    }
    
    return {
      previousSectionLastProblem,
      nextSectionFirstProblem,
      previousSectionTitle,
      nextSectionTitle
    };
  };

  // Initialize the active content with the core properties
  const activeContent: ActiveContent = {
    textbook: activeTextbook!,
    chapter: activeChapter!,
    problemSet: activeProblemSet!,
    problem: activeProblem!
  };
  
  // Add cross-section navigation data if all required content is available
  if (activeTextbook && activeChapter && activeProblemSet && activeProblem) {
    const { 
      previousSectionLastProblem, 
      nextSectionFirstProblem,
      previousSectionTitle,
      nextSectionTitle
    } = getCrossSectionProblems(activeTextbook, activeChapter, activeProblemSet, activeProblem);
    
    activeContent.previousSectionLastProblem = previousSectionLastProblem;
    activeContent.nextSectionFirstProblem = nextSectionFirstProblem;
    activeContent.previousSectionTitle = previousSectionTitle;
    activeContent.nextSectionTitle = nextSectionTitle;
  }
  
  // Add adjacent problem sets for ProblemSetView if all required content is available
  if (activeTextbook && activeChapter && activeProblemSet) {
    const { 
      previous: previousProblemSet, 
      next: nextProblemSet,
      previousSectionTitle,
      nextSectionTitle
    } = getAdjacentProblemSets(activeTextbook, activeChapter, activeProblemSet);
    
    activeContent.previousProblemSet = previousProblemSet;
    activeContent.nextProblemSet = nextProblemSet;
    activeContent.previousSectionTitle = previousSectionTitle;
    activeContent.nextSectionTitle = nextSectionTitle;
  }

  // Navigation actions
  const actions = {
    navigateToHome: () => {
      router.push('/');
    },

    navigateToTextbook: (textbook: Textbook) => {
      router.push(`/?id=${textbook.id}`);
    },

    // Since TextbookView and ChapterView are now combined, we'll only use this for navigation from breadcrumbs
    navigateToChapter: (textbook: Textbook, chapter: Chapter) => {
      router.push(`/?id=${textbook.id}&chapter=${chapter.id}`);
    },

    navigateToProblemSet: (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet) => {
      router.push(`/?id=${textbook.id}&chapter=${chapter.id}&set=${problemSet.id}`);
    },

    // New method to navigate directly from table of contents
    navigateFromTableOfContents: (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet) => {
      router.push(`/?id=${textbook.id}&chapter=${chapter.id}&set=${problemSet.id}`);
    },

    navigateToProblem: (textbook: number, chapter: number, problemSet: number, problem: number) => {
      router.push(`/?id=${textbook}&chapter=${chapter}&set=${problemSet}&p=${problem}`);
    }
  };

  return { 
    params, 
    actions, 
    activeContent,
    activeSection,
    setActiveSection,
    // Expose helper functions for external use
    getAdjacentProblemSets,
    getCrossSectionProblems
  };
}