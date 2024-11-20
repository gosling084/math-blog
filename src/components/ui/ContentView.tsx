// src/components/ui/ContentView.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ContentItem, ContentViewProps } from "@/types/types";

export function ContentView<T extends ContentItem>({ 
  items, 
  viewType, 
  onSelect,
  renderMetadata 
}: ContentViewProps<T>) {
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
                {item.title}
              </CardTitle>
              {item.description && (
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {renderMetadata && renderMetadata(item)}
              <Button 
                onClick={() => onSelect(item)}
                className="flex items-center"
              >
                View details <ChevronRight className="w-4 h-4 ml-1" />
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
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}