// src/components/pages/About.tsx
"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/shadcn";
import styles from './pages.module.css';
import { GithubIcon, TwitterIcon } from '@/components/ui';

export const About = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <h1 className={`pt-6 ${styles.pageTitle}`}>
          About This Project
        </h1>

        <Card className="bg-card text-card-foreground">
          <CardContent className={`${styles.spacingY} p-6`}>
            <p className={styles.sectionContent}>
              This blog is a record of my self-study in mathematics, with a present focus on theoretical texts on foundational topics (eg. calculus, linear algebra). Future topics of study are yet to be decided depending on specialization.
            </p>

            <div>
              <h2 className={styles.sectionTitle}>
                Project Goals
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Going &quot;cover-to-cover&quot; on theoretical texts in mathematics</li>
                <li>Learning through teaching; writing solutions manuals for others doing self-study</li>
                <li>Building a base for future work in theoretical and practical applications alike</li>
              </ul>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>
                Acknowledgements
              </h2>
              <p className={styles.sectionContent}>
                Special thanks to <a href="https://web.archive.org/web/20250210074011/https://www.stumblingrobot.com/" target="_blank" rel="noopener noreferrer">Stumbling Robot</a>, whose solutions for &quot;Tommy 1&quot; helped pave the way for this blog.
              </p>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>
                Contact
              </h2>
              <div className={`${styles.spacingX} text-muted-foreground`}>
                <a href="https://github.com/gosling084" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 pr-2 hover:text-foreground">
                  <div></div><GithubIcon />
                </a>
                <a href="https://x.com/gosling084" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                  <TwitterIcon />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};