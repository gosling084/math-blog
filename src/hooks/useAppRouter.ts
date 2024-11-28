// src/hooks/useAppRouter.ts
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Textbook, Chapter, ProblemSet, Problem } from '@/types/types';
import { textbookData } from '@/data/textbooks';

type ActiveSection = 'home' | 'about' | 'contact';

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


  // Fill in content based on params
  const activeContent = {
    textbook: activeTextbook,
    chapter: activeChapter,
    problemSet: activeProblemSet,
    problem: activeProblem
  };

  // Navigation actions
  const actions = {
    navigateToHome: () => {
      router.push('/');
    },

    navigateToTextbook: (textbook: Textbook) => {
      router.push(`/?id=${textbook.id}`);
    },

    navigateToChapter: (textbook: Textbook, chapter: Chapter) => {
      router.push(`/?id=${textbook.id}&chapter=${chapter.id}`);
    },

    navigateToProblemSet: (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet) => {
      router.push(`/?id=${textbook.id}&chapter=${chapter.id}&set=${problemSet.id}`);
    },

    navigateToProblem: (textbook: Textbook, chapter: Chapter, problemSet: ProblemSet, problem: Problem) => {
      router.push(`/?id=${textbook.id}&chapter=${chapter.id}&set=${problemSet.id}&p=${problem.id}`);
    }
  };

  return { 
    params, 
    actions, 
    activeContent,
    activeSection,
    setActiveSection
  };
}