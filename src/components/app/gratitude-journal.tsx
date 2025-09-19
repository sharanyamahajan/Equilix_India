'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function GratitudeJournal() {
  return (
    <Card id="journal">
      <CardHeader>
        <CardTitle>Gratitude Journal</CardTitle>
        <CardDescription>
          What are three things you're grateful for today?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="1. A warm cup of coffee...&#10;2. A surprising phone call from a friend...&#10;3. The quiet moment of sunrise..." 
          className="min-h-[150px] text-base resize-none"
        />
        <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">Your journal saves automatically.</p>
        </div>
      </CardContent>
    </Card>
  );
}
