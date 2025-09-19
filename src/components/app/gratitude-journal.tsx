'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function GratitudeJournal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gratitude Journal</CardTitle>
        <CardDescription>
          What are three things you're grateful for today?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="1. A warm cup of coffee..." 
          className="min-h-[150px] text-base resize-none"
        />
        <div className="flex justify-end">
            <Button>Save Entry</Button>
        </div>
      </CardContent>
    </Card>
  );
}
