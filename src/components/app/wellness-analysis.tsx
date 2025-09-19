'use client';

import type { WellnessAnalysisOutput } from '@/ai/schemas/wellness';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, Activity, BrainCircuit } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface WellnessAnalysisProps {
  analysis: WellnessAnalysisOutput;
  onReset: () => void;
}

export function WellnessAnalysis({ analysis, onReset }: WellnessAnalysisProps) {
  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😔';
      default: return '🤔';
    }
  };

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Your Wellness Analysis</CardTitle>
                <CardDescription>Personalized feedback based on your input.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onReset}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Survey
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BrainCircuit />
                    Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                 <div className="flex items-center gap-2">
                    <p className="font-semibold">Overall Mood:</p>
                    <Badge variant={analysis.mood.toLowerCase() === 'positive' ? 'default' : analysis.mood.toLowerCase() === 'neutral' ? 'secondary' : 'destructive'}>
                        {getMoodEmoji(analysis.mood)} {analysis.mood}
                    </Badge>
                </div>
                <p>{analysis.summary}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="text-accent"/>
                    Suggestions for you
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-40 pr-4">
                    <ul className="space-y-3">
                        {analysis.suggestions.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary flex-shrink-0" />
                            <p className="text-sm">{item}</p>
                        </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity />
                    Recommended Action
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{analysis.recommendedAction}</p>
            </CardContent>
        </Card>

      </CardContent>
    </Card>
  );
}
