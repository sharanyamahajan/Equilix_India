'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';


export function GratitudeJournal() {
  return (
    <Card id="journal" className="shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
           <span className="grid place-items-center w-10 h-10 rounded-lg bg-accent/10 text-accent">
            <Feather className="w-6 h-6" />
          </span>
          Gratitude Journal
        </CardTitle>
        <CardDescription>
          What are three things you're grateful for today? Focusing on the positive can reshape your mindset.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="1. A warm cup of coffee...
2. A surprising phone call from a friend...
3. The quiet moment of sunrise..." 
          className="min-h-[150px] text-base resize-none bg-secondary/50"
        />
        <div className="flex justify-end items-center gap-4">
            <p className="text-xs text-muted-foreground">Your journal is saved automatically.</p>
            <Button variant="secondary">View Past Entries</Button>
        </div>
      </CardContent>
    </Card>
  );
}
