// src/components/ui/ContentView.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Problem, ViewType } from '@/types/types';
import { MathContent } from "./MathContent";

interface ProblemContentViewProps {
  items: Problem[];
  viewType: ViewType;
  onSelect: (problem: Problem) => void;
  renderMetadata?: (problem: Problem) => React.ReactNode;
}

export function ProblemContentView({ 
    items, 
    viewType, 
    onSelect 
  }: ProblemContentViewProps) {
    if (viewType === 'card') {
      return (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <Card 
              key={item.id}
              className="bg-card hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-foreground">
                  Problem {item.number}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  <MathContent content={item.content} />
                </div>
                <div className="text-muted-foreground mb-4">
                  <p>Added {new Date(item.date).toLocaleDateString()}</p>
                </div>
                <Button 
                  onClick={() => onSelect(item)}
                  className="flex items-center"
                >
                  View solution <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
  
    return (
      <div className="bg-card p-6 rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="text-left p-2 rounded text-primary hover:text-primary/80"
            >
              Problem {item.number}
            </button>
          ))}
        </div>
      </div>
    );
  }