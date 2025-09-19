'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const affirmations = [
  "I am capable of overcoming any challenge.",
  "I am worthy of love and respect.",
  "I choose to be happy and to love myself today.",
  "My potential to succeed is infinite.",
  "I am calm, I am present, I am at peace.",
  "I trust the journey, even when I do not understand it.",
  "I am creating a life that I love.",
  "My positive thoughts create positive feelings."
];

export function DailyAffirmation() {
  const [affirmation, setAffirmation] = useState('');

  const getNewAffirmation = () => {
    // This avoids hydration mismatch by ensuring random is only called client-side
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  };

  useEffect(() => {
    getNewAffirmation();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daily Affirmation</CardTitle>
        <Button variant="ghost" size="icon" onClick={getNewAffirmation}>
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">New Affirmation</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium text-center font-headline h-16 flex items-center justify-center">
          {affirmation || "Loading your daily boost..."}
        </p>
      </CardContent>
    </Card>
  );
}
