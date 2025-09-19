'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Droplets } from 'lucide-react';
import { BreathingExercise } from './breathing-exercise';

export function RelaxingGames() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Gamepad2 /> Relaxing Games</CardTitle>
        <CardDescription>
          Take a break with these simple and calming games.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        <BreathingExercise />
        <Card className="bg-secondary/50 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-2">Fluid Simulation</h3>
              <p className="text-sm text-muted-foreground mb-4">A relaxing, interactive fluid simulation to help you unwind.</p>
            </div>
            <Droplets className="w-8 h-8 text-accent hidden sm:block" />
          </div>
          <Button asChild variant="outline">
            <a href="https://paveldogreat.github.io/WebGL-Fluid-Simulation/" target="_blank" rel="noopener noreferrer">Play Game</a>
          </Button>
        </Card>
      </CardContent>
    </Card>
  );
}
