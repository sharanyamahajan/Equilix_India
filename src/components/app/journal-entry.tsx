'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function JournalEntry() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Thoughts</CardTitle>
        <CardDescription>
          A private space to write down what's on your mind.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="How are you feeling today? What's on your mind?..." 
          className="min-h-[200px] text-base"
        />
      </CardContent>
    </Card>
  );
}
