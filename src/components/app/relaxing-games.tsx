'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

const games = [
    {
        name: 'Calm Canvas',
        description: 'A simple drawing board to let your creativity flow. No rules, no goals, just zen-like creation.',
        url: 'https://codepen.io/dissimulated/full/KrWvJj'
    },
    {
        name: 'Fluid Simulation',
        description: 'Interact with beautiful, calming fluid dynamics. A mesmerizing visual experience.',
        url: 'https://paveldogreat.github.io/WebGL-Fluid-Simulation/'
    },
    {
        name: 'Silent Solitaire',
        description: 'A classic game of solitaire to focus your mind and pass the time peacefully.',
        url: 'https://www.google.com/search?q=solitaire'
    },
];

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
        {games.map((game) => (
            <Card key={game.name} className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                    <Button asChild variant="outline">
                        <a href={game.url} target="_blank" rel="noopener noreferrer">Play Game</a>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </CardContent>
    </Card>
  );
}
