'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Droplets, Wind, Paintbrush } from 'lucide-react';
import { BreathingExercise } from '@/components/app/breathing-exercise';
import Link from 'next/link';

export default function GamesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                        Relaxation Hub
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                        Take a break with these simple and calming games and activities designed to help you unwind and find your center.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gamepad2 /> Relaxing Activities</CardTitle>
                        <CardDescription>
                        A collection of tools to help you relax and de-stress.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <BreathingExercise />
                        <Card className="bg-secondary/50 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                            <h3 className="font-semibold text-lg mb-2">Mantra Chanting</h3>
                            <p className="text-sm text-muted-foreground mb-4">Focus your mind with meditative chanting.</p>
                            </div>
                            <Wind className="w-8 h-8 text-accent hidden sm:block" />
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/mantra-chanting">Begin Chanting</Link>
                        </Button>
                        </Card>
                        <Card className="bg-secondary/50 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                            <h3 className="font-semibold text-lg mb-2">Interactive Silk</h3>
                            <p className="text-sm text-muted-foreground mb-4">Weave calming, generative art with your cursor.</p>
                            </div>
                            <Paintbrush className="w-8 h-8 text-accent hidden sm:block" />
                        </div>
                        <Button asChild variant="outline">
                            <a href="http://weavesilk.com/" target="_blank" rel="noopener noreferrer">Play Game</a>
                        </Button>
                        </Card>
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
            </div>
        </main>
    </div>
  );
}
