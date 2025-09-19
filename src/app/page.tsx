'use client';

import { DailyAffirmation } from '@/components/app/daily-affirmation';
import { GratitudeJournal } from '@/components/app/gratitude-journal';
import { WellnessSurvey } from '@/components/app/wellness-survey';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen font-body">
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          
          <section className="text-center py-16 md:py-24">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                Welcome to Equilix
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4 font-light">
                Your personal space for daily reflection, gratitude, and mental clarity.
              </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <WellnessSurvey />
              <GratitudeJournal />
            </div>
            <div className="space-y-8">
              <DailyAffirmation />
              <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-accent" />
                        Explore More Features
                    </CardTitle>
                    <CardDescription>
                        Discover other tools to support your well-being.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Link href="/emotion-detector" passHref>
                        <Button variant="outline" className="w-full justify-start gap-4">
                            <Camera className="text-primary" />
                            Emotion Check-in
                        </Button>
                    </Link>
                     <Link href="/ai-friend" passHref>
                        <Button variant="outline" className="w-full justify-start gap-4">
                            <Bot className="text-primary" />
                            AI Friend
                        </Button>
                    </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <footer className="text-center p-4 text-muted-foreground text-sm">
          <p>Equilix © {new Date().getFullYear()}. Your space to breathe and reflect.</p>
        </footer>
      </div>
    </>
  );
}
