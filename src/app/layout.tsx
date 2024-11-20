// src/app/layout.tsx
import '@/app/globals.css'
import { ThemeProvider } from "next-themes"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "midnight", "forest", "coffee"]}  // Add this line
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}