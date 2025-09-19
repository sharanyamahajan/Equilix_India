'use client';

import { Download, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SuggestionCardProps {
  suggestions: string[];
  improvedHtml: string;
  fileName: string;
}

export function SuggestionCard({ suggestions, improvedHtml, fileName }: SuggestionCardProps) {
    const handleDownload = () => {
        const blob = new Blob([improvedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimized-${fileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <Card>
      <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-accent-foreground fill-accent" />
            AI-Powered Suggestions
          </CardTitle>
          <CardDescription>
            Here are the suggestions to improve your HTML based on best practices.
          </CardDescription>
        </div>
        <Button onClick={handleDownload} className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 shadow-[0_4px_14px_0_rgb(255,215,0,30%)] hover:shadow-[0_6px_20px_0_rgb(255,215,0,40%)] transition-all duration-300">
            <Download className="mr-2 h-4 w-4"/>
            Download Optimized
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 pr-4 border rounded-lg p-4 bg-secondary/50">
            {suggestions.length > 0 ? (
                <ul className="space-y-3">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary flex-shrink-0" />
                        <p className="text-sm text-secondary-foreground">{suggestion}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No specific improvements suggested. Your code looks great!</p>
            )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
