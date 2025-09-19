'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

const streakBadges = {
  0: { color: 'text-muted-foreground', label: 'Start your journey' },
  1: { color: 'text-orange-400', label: 'First entry!' },
  3: { color: 'text-orange-500', label: 'Getting consistent' },
  7: { color: 'text-red-500', label: '1 Week Streak!' },
  14: { color: 'text-red-600', label: '2 Week Power!' },
  30: { color: 'text-purple-600', label: '1 Month Habit!' },
};

type StreakLevel = keyof typeof streakBadges;

const getStreakLevel = (streak: number): StreakLevel => {
  if (streak >= 30) return 30;
  if (streak >= 14) return 14;
  if (streak >= 7) return 7;
  if (streak >= 3) return 3;
  if (streak >= 1) return 1;
  return 0;
};

export function JournalingStreak() {
  const [streak, setStreak] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Simulate fetching streak and hydrating on client
    setHydrated(true);
    const simulatedStreak = 7; 
    setStreak(simulatedStreak);
  }, []);

  if (!hydrated) {
    return (
        <Card>
            <CardHeader><CardTitle>Journaling Streak</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center h-24">
                <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
            </CardContent>
        </Card>
    )
  }
  
  const currentLevel = getStreakLevel(streak);
  const badge = streakBadges[currentLevel];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journaling Streak</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-2">
        <div className="relative">
          <Flame className={`w-16 h-16 transition-colors duration-500 ${badge.color}`} strokeWidth={1.5} />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-sm text-background dark:text-foreground pt-1">{streak}</span>
        </div>
        <p className="font-semibold text-lg">{badge.label}</p>
        <p className="text-sm text-muted-foreground">
          {streak > 0 ? `You've written for ${streak} day${streak > 1 ? 's' : ''} in a row.` : 'Write in your journal to start a streak!'}
        </p>
      </CardContent>
    </Card>
  );
}
