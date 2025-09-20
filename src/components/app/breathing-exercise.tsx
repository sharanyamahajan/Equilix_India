'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

export function BreathingExercise() {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <Card className="bg-secondary/50 p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg mb-2">Breathing Exercise</h3>
        <p className="text-sm text-muted-foreground mb-4">Follow the animation to guide your breath and find calm.</p>
      </div>
      <CardContent className="flex flex-col items-center gap-4 p-0 pt-4">
        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
          <div
            className={cn(
              'w-16 h-16 bg-primary rounded-full transition-all ease-in-out',
              isAnimating ? 'scale-150' : 'scale-100'
            )}
            style={{
              animation: isAnimating ? 'breathe 8s ease-in-out infinite' : 'none',
              transitionDuration: '4000ms'
            }}
          />
        </div>
        <Button variant="secondary" size="icon" onClick={() => setIsAnimating(!isAnimating)}>
          {isAnimating ? <Pause /> : <Play />}
          <span className="sr-only">{isAnimating ? 'Pause' : 'Play'}</span>
        </Button>
        <style jsx>{`
          @keyframes breathe {
            0%, 100% {
              transform: scale(0.8);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
