// src/app/layout.tsx
import '@/app/globals.css'
import { FontProvider } from '@/providers/font-provider';
import { ThemeProvider } from "next-themes"
import Script from 'next/script'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mathematical Immaturity',
  description: 'Growing up, one proof at a time.',
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    shortcut: [  // For Android
      { url: '/android-chrome-192x192.png' },
      { url: '/android-chrome-512x512.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="MathJax-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$']],
                  displayMath: [['$$', '$$']],
                  processEscapes: true,
                  processEnvironments: true
                },
                options: {
                  skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
                }
              };
            `,
          }}
        />
        <Script
          id="MathJax-script"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
          strategy="beforeInteractive"
          async
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground">
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "midnight", "forest", "coffee"]}
          disableTransitionOnChange
        >
          <FontProvider>
            {children}
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}