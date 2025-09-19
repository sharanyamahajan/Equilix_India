'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Wind } from 'lucide-react';
import Link from 'next/link';
import { BreathingExercise } from './breathing-exercise';

export function RelaxingGames() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Gamepad2 /> Relaxing Activities</CardTitle>
        <CardDescription>
          Take a break with these simple and calming activities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className="bg-secondary/50">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wind />
                Breathing Exercise
              </CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Follow the animation to guide your breath. Inhale as it expands, exhale as it contracts.</p>
              <BreathingExercise />
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-lg">Mindful Maze</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Find your way through a calming maze. A simple way to focus your mind.</p>
                <Button asChild variant="outline">
                    <Link href="/mindful-maze">Play Game</Link>
                </Button>
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
