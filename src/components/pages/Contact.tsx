// src/components/pages/Contact.tsx
"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/shadcn";
import { GithubIcon } from '@/components/ui/icons/GithubIcon';
import { TwitterIcon } from '@/components/ui/icons/TwitterIcon';
import styles from './pages.module.css';

export const Contact = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <h1 className={styles.pageTitle}>
          Contact
        </h1>

        <Card className="bg-card text-card-foreground">
          <CardContent className={`${styles.spacingY} p-6`}>
            <div className={styles.spacingY}>
              <h2 className={styles.sectionTitle}>
                Get in Touch
              </h2>
              <div className={`${styles.spacingY} text-muted-foreground`}>
                <a href="https://github.com/gosling084" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                  <GithubIcon />
                  <span>github.com/gosling084</span>
                </a>
                <a href="https://x.com/gosling084" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                  <TwitterIcon />
                  <span>@gosling084</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};