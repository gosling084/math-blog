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
          id: 13,
          title: "Chapter 13: Applications of Vector Algebra to Analytic Geometry",
          description: "Applications of vector algebra to the study of lines, planes, and conic sections.",
          problemSets: [
            {
              id: 25,
              title: "13.25 Miscellaneous exercises on conic sections",
              description: "A review section combining the material on conic sections with material from previous chapters",
              problems: [
                {
                  id: 1,
                  number: "13.25.1",
                  content: `Show that the area of the region bounded by the ellipse $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$ is $ab$ times the area of a circle with radius 1. \n\nNote: This statement can be proved from general properties of the integral, without performing any integrations.`,
                  hint: "Use Theorem 1.19 (Expansion or Contraction of the Interval of Integration): If $f$ is integrable on $[a, b]$, then for every real $k\\neq0$ we have $$\\int_{a}^{b} f(x)\\ dx = \\frac{1}{k}\\int_{ka}^{kb} f\\left(\\frac{x}{k}\\right)\\ dx$$",
                  solution: "We can express a circle of radius 1 centered at the origin as an ellipse with $a = b = 1$. In other words the standard form of a circle is $x^{2} + y^{2} = 1$. Expressing this as a function of $x$ gives us the graph of the upper semicircle $y = f(x) = \\sqrt{1 - x^{2}}$. Taking twice the area under the curve from $x = -1$ to $x = 1$ we get $$A_{circle} = 2\\int_{-1}^{1}\\sqrt{1 - x^{2}} \\ dx$$Doing the same for the ellipse with equation $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$ from its left to its right vertices, we see that its area is $$A_{ellipse} = 2|b|\\int_{-a}^{a}\\sqrt{1 - \\left(\\frac{x}{a}\\right)^2} \\ dx$$But we know from Theorem 1.19 (Expansion or Contraction of the Interval of Integration) that this integral is equal to $$2ab\\int_{-1}^{1}\\sqrt{1 - x^{2}} \\ dx = abA_{circle} \\quad \\blacksquare$$",
                  date: "2024-11-25"
                },
                {
                  id: 2,
                  number: "13.25.2",
                  content: `(a) Show that the volume of the solid of revolution generated by rotating the ellipse $$\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$$about its major axis is $ab^{2}$ times the volume of a unit sphere. \n\nNote: This statement can be proved from general properties of the integral, without performing any integrations.\n\n(b) What is the result if it is rotated about its minor axis?`,
                  hint: "The volume of a solid of revolution with cross sections cut along the $x$ axis is $$\\int_{a}^{b}\\pi f^{2}(x)  \\ dx$$\nTo show how the integral scales, use Theorem 1.19 (Expansion or Contraction of the Interval of Integration): If $f$ is integrable on $[a, b]$, then for every real $k\\neq0$ we have $$\\int_{a}^{b} f(x)\\ dx = \\frac{1}{k}\\int_{ka}^{kb} f\\left(\\frac{x}{k}\\right)\\ dx$$",
                  solution: "(a) The volume of a unit sphere can be expressed as the integral $$V_{c} = \\pi\\int_{-1}^{1} (1 - x^{2})\\ dx$$As we saw in problem 1, we can express the upper half of the ellipse defined by the equation $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$ as $y = f(x) = |b|\\sqrt{1 - \\left(\\frac{x}{a}\\right)^{2}}$. Its volume of revolution about the $x$ axis is $$V_{e} = b^{2}\\pi\\int_{-a}^{a} 1 - \\left(\\frac{x}{a}\\right)^{2}\\ dx$$But from Theorem 1.19 we know that this integral is equal to $$ab^{2}\\pi\\int_{-1}^{1} (1 - x^{2})\\ dx$$Which is $ab^{2}$ times the volume of a unit sphere. $\\blacksquare$\n\n(b) The solid obtained by revolving the ellipse around its minor axis (in this case, the $y$ axis) would have a volume $a^{2}b$ times the volume of a unit sphere. The positive half-ellipse can be written as a function of $y$ as follows: $$x = f(y) = |a|\\sqrt{1 - \\left(\\frac{y}{b}\\right)^{2}}$$Its volume of revolution is then $$a^{2}\\pi\\int_{-b}^{b} 1 - \\left(\\frac{y}{b}\\right)^{2}\\ dy$$so it follows that its volume is $a^{2}b$ times that of the unit sphere. $\\blacksquare$",
                  date: "2024-11-25"
                },
                {
                  id: 3,
                  number: "13.25.3",
                  content: "Find all positive numbers $A$ and $B$, $A\\ > B$, such that the area of the region enclosed by the ellipse $Ax^{2} + By^{2} = 3$ is equal to the area of the region enclosed by the ellipse $$(A + B)x^{2} + (A - B)y^{2} = 3$$",
                  hint: "Rewrite the equations $Ax^{2} + By^{2} = 3$ and $(A + B)x^{2} + (A - B)y^{2} = 3$ as $$\\frac{x^{2}}{a_0^{2}} + \\frac{y^{2}}{b_0^{2}} = 1; \\quad \\frac{x^{2}}{a_1^{2}} + \\frac{y^{2}}{b_1^{2}} = 1$$respectively, where $$a_{0}^{2} = \\frac{3}{A}, \\ b_{0}^{2} = \\frac{3}{B}; \\quad a_{1}^{2} = \\frac{3}{(A + B)}, \\ b_{1}^{2} = \\frac{3}{(A-B)}$$then, use the result from problem (1) to find the areas bounded by the two ellipses.",
                  solution: "We know from the proof of problem (1) that an ellipse with the standard form $$\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$$has an area $ab$ times that of a circle with radius 1. As such, the area of the region enclosed by the ellipse $Ax^{2} + By^{2} = 3$ is $\\frac{3}{\\sqrt{AB}}$ and the area of the ellipse enclosed by $$(A + B)x^{2} + (A - B)y^{2} = 3$$ is $\\frac{3}{\\sqrt{(A+B)(A-B)}}$. Setting these two areas equal to one-another, we see $$\\frac{3}{\\sqrt{AB}} = \\frac{3}{\\sqrt{(A+B)(A-B)}} \\quad (\\text{where} \\ AB>0,\\ A^{2} - B^{2}> 0)$$We can write this in the equivalent form $$A^{2} - AB - B^{2} = 0 \\quad (\\text{where} \\ AB>0, \\ A^{2} - B^{2}> 0)$$Solving this quadratic equation with $a = 1, b = -B, c = -B^{2}$ we find that $$\\displaylines{A &= \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a} \\\\&=\\frac{(1 \\pm \\sqrt{5})B}{2}}$$But we know that $A \\ > B, \\ AB \\ > 0, \\ A^{2} - B^{2} > 0$, thus $$A = \\frac{(1 + \\sqrt{5})B}{2} \\quad (\\text{where}\\ B > 0)\\quad \\blacksquare$$", 
                  date: "2024-11-28"
                },
                {
                  id: 4,
                  number: "13.25.4",
                  content: "A parabolic arch has base of length $b$ and height $h$. Determine the area of the region bounded by the arch and the base.",
                  hint: "Recall that the equation for a parabola opening downwards with vertex $(0, h)$ is $$x^{2} = 4c(y - h)\\quad (\\text{where}\\ c < 0)$$If we place its $x$ intercepts (where $y = 0$) at $\\frac{-b}{2}$ and $\\frac{b}{2}$, then its base will then be of length $b$. Setting $x = \\frac{b}{2}$ and solving for $c$ we get $c = \\frac{-b^{2}}{16h}$.",
                  solution: "Let the equation for the parabola with vertex $(0, h)$ and base of length $b$ be the function of $x$: $$y = f(x) = \\frac{x^{2}}{4c} + h\\quad (\\text{where}\\ c = \\frac{-b^{2}}{16h})$$Integrating from $x=\\frac{-b}{2}$ to $x=\\frac{b}{2}$ we get $$\\displaylines{\\int_{-b/2}^{b/2} \\frac{x^{2}}{4c} + h\\ dx &= \\ \\frac{x^{3}}{12c} + hx\\ \\Biggr|_{-b/2}^{b/2} \\\\ &=\\frac{b^{3}}{48c} + hb}$$Substituting $c = \\frac{-b^{2}}{16h}$ we get $$\\displaylines{\\frac{b^{3}}{48c} + hb = \\left(\\frac{16h}{-b^{2}}\\right)\\frac{b^{3}}{48}} + hb \\ = \\frac{2}{3}hb \\quad \\blacksquare$$",
                  date: "2024-12-03"
                },
                {
                  id: 5,
                  number: "13.25.5",
                  content: "The region bounded by the parabola $y^{2} = 8x$ and the line $x = 2$ is rotated about the $x$ axis. Find the volume of the solid of revolution so generated.",
                  hint: "The volume of a solid of revolution with cross sections cut along the $x$ axis is $$\\int_{a}^{b}\\pi f^{2}(x)  \\ dx$$\nBut if we define $y = f(x)$, then $f^{2}(x) = y^{2} = 8x$. We know from the parabola's equation that its vertex is $(0, 0)$, and since the cross sectional region is bound by the vertical line at $x = 2$, our limits of integration must be $a = 0$ and $b = 2$.",
                  solution: "The solid of revolution generated by rotating the above defined cross-sectional area around the $x$ axis is: $$\\displaylines{V = 8\\pi \\int_{0}^{2}x \\ dx \\\\ = 4\\pi x^{2}\\Biggr|_{0}^{2} \\\\ = 16\\pi \\ \\blacksquare}$$",
                  date: "2024-12-03"
                },
                {
                  id: 6,
                  number: "13.25.6",
                  content: "Two parabolas having the equations $y^{2} = 2(x - 1)$ and $y^{2} = 4(x - 2)$ enclose a plane region $R$.\n\t(a) Compute the area of $R$ by integration.\n\t(b) Find the volume of the solid of revolution generated by revolving $R$ about the $x$-axis.\n\t(c) Same as (b), but revolve $R$ about the $y$-axis.",
                  hint: "(a) Rearrange the equations for the parabolas as functions of $y$: $$y^{2} = 2(x - 1) \\quad  \\rightarrow \\quad x = f(y) = \\frac{y^{2}}{2} + 1$$ $$y^{2} = 2(x - 1) \\quad  \\rightarrow \\quad x = f(y) = \\frac{y^{2}}{2} + 1$$\nTo find the limits of integration, find the points at which the two graphs intersect, or in other words where: $\\frac{y^{2}}{2} + 1 = \\frac{y^{2}}{4} + 2$. Solving for $y$ we see that the graphs intersect at the points $(3, -2)$ and $(3, 2)$.",
                  solution: "(a) To find the area of the region $R$ bounded by the two graphs, first we must find the areas underneath each graph from their points of intersection. $$\\displaylines{A_{0} &= \\int_{-2}^{2} \\frac{y^{2}}{2} + 1 \\ dy\\\\ &= \\frac{y^{3}}{6} + y\\ \\Biggr|_{-2}^{2}\\\\ &= \\frac{80}{12}}$$ $$\\displaylines{A_{1} &= \\int_{-2}^{2} \\frac{y^{2}}{4} + 2 \\ dy\\\\ &= \\frac{y^{3}}{12} + 2y\\ \\Biggr|_{-2}^{2}\\\\ &= \\frac{102}{12}}$$Subtracting $A_{0}$ from $A_{1}$ we get $\\frac{32}{12}$ or $\\frac{8}{3}$ $\\quad \\blacksquare$",
                  date: "2024-12-03"
                }
              ]
            }
          ]
        },
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