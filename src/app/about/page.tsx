// src/app/about/page.tsx
"use client";
import React from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Info, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useState, useEffect } from 'react';
import { About } from '@/components/pages/About';

export default function AboutPage() {
  // All hooks must be called before any conditional returns
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link 
                href="/"
                className={cn(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname === "/" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link 
                href="/about"  
                className={cn(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname === '/about' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Info className="w-4 h-4 mr-2" />
                About
              </Link>
              <Link 
                href="/contact"
                className={cn(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  pathname === '/contact' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Link>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-10">
        {/* About view */}
          <About />

      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © 2024 Mathematics Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}