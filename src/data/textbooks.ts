// src/data/textbooks.ts
import { Textbook } from "@/types/types";

export const textbookData: Textbook[] = [
    {
      id: 1,
      title: "Calculus, Vol. 1: One Variable Calculus, with an Introduction to Linear Algebra",
      author: "Tom M. Apostol",
      edition: "Second Edition",
      year: "1967",
      chapters: [
        {
          id: 14,
          title: "Chapter 14: Calculus of Vector Valued Functions",
          description: "Introduction to vector-valued functions and their calculus",
          problemSets: [
            {
              id: 1,
              title: "14.1 Vector-Valued Functions",
              description: "Basic concepts and definitions of vector-valued functions",
              problems: [
                {
                  id: 1,
                  number: "14.1.1",
                  content: "Let $\\mathbf{r}(t) = (t\\cos t)\\mathbf{i} + (t\\sin t)\\mathbf{j} + (t)\\mathbf{k}$ for all real $t$. \n\n(a) Show that this curve lies on a cone. \n\n(b) Find the angle between the curve and the z-axis.",
                  hint: "",
                  solution: "Let's solve this step by step:\n\n(a) To show the curve lies on a cone, let's examine the relationship between x, y, and z:\n\n$x = t\\cos t$ \n$y = t\\sin t$ \n$z = t$\n\nNote that $x^2 + y^2 = t^2\\cos^2 t + t^2\\sin^2 t = t^2(\\cos^2 t + \\sin^2 t) = t^2 = z^2$\n\nThis equation $x^2 + y^2 = z^2$ describes a cone with apex at the origin.\n\n(b) The angle $\\theta$ between the curve and the z-axis can be found using the dot product:\n\n$\\cos \\theta = \\frac{\\mathbf{r}'(t) \\cdot \\mathbf{k}}{|\\mathbf{r}'(t)|}$\n\nwhere $\\mathbf{r}'(t) = (\\cos t - t\\sin t)\\mathbf{i} + (\\sin t + t\\cos t)\\mathbf{j} + \\mathbf{k}$\n\nTherefore, $\\cos \\theta = \\frac{1}{\\sqrt{(\\cos t - t\\sin t)^2 + (\\sin t + t\\cos t)^2 + 1}}$",
                  date: "2024-10-25"
                },
                {
                  id: 2,
                  number: "14.1.2",
                  content: "Show that the function $\\mathbf{r}(t) = (\\cos t)\\mathbf{i} + (\\sin t)\\mathbf{j} + (t)\\mathbf{k}$ represents a helix. Find its curvature $\\kappa$ and torsion $\\tau$.",
                  hint: "Test 2",
                  solution: "Let's solve this:\n\n1) First, let's find $\\mathbf{r}'(t)$ and $\\mathbf{r}''(t)$:\n\n$\\mathbf{r}'(t) = (-\\sin t)\\mathbf{i} + (\\cos t)\\mathbf{j} + \\mathbf{k}$\n\n$\\mathbf{r}''(t) = (-\\cos t)\\mathbf{i} + (-\\sin t)\\mathbf{j}$\n\n2) For curvature:\n$|\\mathbf{r}'(t)| = \\sqrt{\\sin^2 t + \\cos^2 t + 1} = \\sqrt{2}$\n\n$|\\mathbf{r}''(t)| = 1$\n\nTherefore, $\\kappa = \\frac{|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)|}{|\\mathbf{r}'(t)|^3} = \\frac{1}{2}$\n\n3) For torsion:\n$\\tau = \\frac{[\\mathbf{r}'(t), \\mathbf{r}''(t), \\mathbf{r}'''(t)]}{|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)|^2} = \\frac{1}{2}$",
                  date: "2024-10-24"
                }
              ]
            }
          ]
        }
      ]
    },
    // {
    //   id: 2,
    //   title: "Linear Algebra Done Right",
    //   author: "Sheldon Axler",
    //   edition: "Third Edition",
    //   year: "2015",
    //   chapters: []  // We can fill this in later
    // },
    // Add more textbooks as needed
  ];