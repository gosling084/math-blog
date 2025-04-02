// src/components/shared/ContentView.tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/shadcn";
import { ChevronRight } from "lucide-react";
import { ContentItem, ContentViewProps } from "@/types/types";
import styles from './shared.module.css';

export function ContentView<T extends ContentItem>({ 
  items, 
  viewType, 
  onSelect,
  renderMetadata 
}: ContentViewProps<T>) {
  if (viewType === 'card') {
    return (
      <div className={styles.contentGrid}>
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
    <div className={styles.compactGrid}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className={styles.compactItem}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}