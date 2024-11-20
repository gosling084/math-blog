// src/components/pages/Contact.tsx
"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail,  } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons/GithubIcon';
import { TwitterIcon } from '../ui/icons/TwitterIcon';

export const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-card-foreground">
          Contact
        </h1>

        <Card className={"bg-card text-card-foreground"}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-card text-card-foreground">
                Get in Touch
              </h2>
              <div className="text-muted-foreground space-y-4">
                {/* <a href="mailto:your.email@example.com" className="flex items-center gap-2 hover:text-foreground">
                  <Mail className="h-5 w-5" />
                  <span>your.email@example.com</span>
                </a> */}
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

            {/* <div className="space-y-4 mt-6">
              <h2 className="text-2xl font-bold bg-card text-card-foreground">
                Contributing
              </h2>
              
              <p className="text-muted-foreground">
                Interested in contributing? 
                Visit the project repository on GitHub to learn more about how you can help.
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};