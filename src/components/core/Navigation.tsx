// src/components/core/Navigation.tsx

import { Textbook, Chapter, ProblemSet, Problem } from "@/types/types";
// Helper function to get next or previous problem
export const getProblemNavigation = (textbook: Textbook, currentProblem: Problem, direction: 'next' | 'previous'): Problem | null => {
    const [chapter, section, problem] = currentProblem.number.split(".").map(num => Number(num));
    
    const chapterIndex = textbook.chapters.findIndex((ch: Chapter) => ch.id === chapter);
    const sectionIndex = textbook.chapters[chapterIndex].problemSets.findIndex((sec: ProblemSet) => sec.id === section);
    const problemIndex = textbook.chapters[chapterIndex].problemSets[sectionIndex].problems.findIndex((p: Problem) => p.id === problem);
    
    const problemsLength = textbook.chapters[chapterIndex].problemSets[sectionIndex].problems.length;
    const sectionsLength = textbook.chapters[chapterIndex].problemSets.length;
    const chaptersLength = textbook.chapters.length;
  
    if (direction === "next") {
      if (problemIndex === (problemsLength - 1)) {
        if (sectionIndex === (sectionsLength - 1)) {
          if (chapterIndex === (chaptersLength - 1)) {
            return null;
          } else {
            return textbook.chapters[chapterIndex + 1].problemSets[0].problems[0];
          }
        } else {
          return textbook.chapters[chapterIndex].problemSets[sectionIndex + 1].problems[0];
        }
      } else {
        return textbook.chapters[chapterIndex].problemSets[sectionIndex].problems[problemIndex + 1];
      }
    } else if (direction === "previous") {
      if (problemIndex === 0) {
        if (sectionIndex === 0) {
          if (chapterIndex === 0) {
            return null;
          } else {
            const prevChapterLength = textbook.chapters[chapterIndex - 1].problemSets.length;
            const prevProblemSetLength = textbook.chapters[chapterIndex - 1].problemSets[prevChapterLength - 1].problems.length;
            return textbook.chapters[chapterIndex - 1].problemSets[prevChapterLength - 1].problems[prevProblemSetLength - 1];
          }
        } else {
          const prevProblemSetLength = textbook.chapters[chapterIndex].problemSets[sectionIndex - 1].problems.length;
          return textbook.chapters[chapterIndex].problemSets[sectionIndex - 1].problems[prevProblemSetLength - 1];
        }
      } else {
        return textbook.chapters[chapterIndex].problemSets[sectionIndex].problems[problemIndex - 1];
      }
    } else {
      return null;
    }
  };