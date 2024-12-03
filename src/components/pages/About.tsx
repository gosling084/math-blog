// src/components/pages/About.tsx
"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-card-foreground">
          About This Project
        </h1>

        <Card className={"bg-card text-card-foreground"}>
          <CardContent className="space-y-6 p-6">
            <p className="text-muted-foreground">
              This blog is a record of my self-study in mathematics, with a present focus on theoretical texts on foundational topics (eg. calculus, linear algebra). Future topics of study are yet to be decided depending on specialization.
            </p>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-card text-card-foreground">
                Project Goals
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Going &quot;cover-to-cover&quot; on theoretical texts in mathematics</li>
                <li>Learning through teaching; writing solutions manuals for others doing self-study</li>
                <li>Building a base for future work in theoretical and practical applications alike</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-card text-card-foreground">
                Contributing
              </h2>
              <p className="text-muted-foreground">
                Contributions and feedback are welcome. Please see the Contact page for more information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-card text-card-foreground">
                Acknowledgements
              </h2>
              <p className="text-muted-foreground">
                Special thanks to <a href="https://stumblingrobot.com" rel="noopener noreferrer">Stumbling Robot</a>, whose solutions for "Tommy 1" helped pave the way for this blog.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};