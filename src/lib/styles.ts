// src/lib/styles.ts
export const themeStyles = {
    layout: {
      main: "min-h-screen bg-background",
      container: "max-w-4xl mx-auto p-8",
      nav: "border-b bg-card shadow-md",
      navContent: "max-w-7xl mx-auto px-4",
      footer: "border-t bg-card shadow-md"
    },
    text: {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      heading: "text-4xl font-bold text-foreground",
      subheading: "text-xl text-muted-foreground"
    },
    card: {
      base: "bg-card border shadow-sm hover:shadow-lg transition-shadow",
      header: "space-y-2",
      title: "text-2xl font-semibold text-foreground",
      description: "text-muted-foreground"
    },
    navigation: {
      link: {
        base: "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
        active: "border-primary text-primary",
        inactive: "border-transparent text-muted-foreground hover:text-foreground"
      }
    }
  };