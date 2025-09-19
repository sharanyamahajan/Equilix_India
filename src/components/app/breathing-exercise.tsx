'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BreathingExercise() {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center">
        <div
          className={cn(
            'w-24 h-24 bg-primary rounded-full transition-all duration-[4000ms] ease-in-out',
            isAnimating ? 'scale-150' : 'scale-100'
          )}
          style={{
            animation: isAnimating ? 'breathe 8s ease-in-out infinite' : 'none'
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
    </div>
  )
}
