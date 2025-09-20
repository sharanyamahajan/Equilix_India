'use client';

import { DailyAffirmation } from '@/components/app/daily-affirmation';
import { GratitudeJournal } from '@/components/app/gratitude-journal';
import { WellnessSurvey } from '@/components/app/wellness-survey';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Bot, Sparkles, Brain, Feather, Wind, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { JournalingStreak } from '@/components/app/journaling-streak';


export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen font-body">
        <main className="flex-grow">
          
          <section className="relative text-center py-24 md:py-32 lg:py-40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-background -z-10"></div>
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 25% 30%, hsl(var(--primary) / 0.1), transparent 50%), radial-gradient(circle at 75% 70%, hsl(var(--accent) / 0.1), transparent 50%)',
                }}>
              </div>
              <div className="container mx-auto px-4 relative">
                <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-top-4 duration-1000">
                  Find Your Center with Equilix
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light tracking-wide">
                  A new era of mental wellness. Discover personalized tools and AI-driven insights designed to bring clarity, peace, and balance to your daily life.
                </p>
                <div className="mt-10 flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-transform transform hover:scale-105">
                        <Link href="#check-in">Start Your Check-in</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-background/50 backdrop-blur-sm">
                        <Link href="/breathing-exercise">Try Breathing Exercise</Link>
                    </Button>
                </div>
              </div>
          </section>

          <div className="container mx-auto px-4 py-16 md:py-24 space-y-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
              <div id="check-in" className="lg:col-span-2 space-y-8">
                <WellnessSurvey />
                <GratitudeJournal />
              </div>
              <div className="space-y-8">
                <DailyAffirmation />
                <JournalingStreak />
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border/50">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Sparkles className="text-accent" />
                          Explore Advanced Tools
                      </CardTitle>
                      <CardDescription>
                          Unlock deeper insights with our AI-powered features.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                      <Link href="/emotion-detector" passHref>
                          <Button variant="outline" className="w-full justify-start gap-4 p-6 text-base bg-background/50">
                              <Camera className="text-primary w-5 h-5" />
                              <span>
                                <p className="font-semibold">Real-time Emotion Scan</p>
                                <p className="text-xs text-muted-foreground">Check in with your feelings.</p>
                              </span>
                          </Button>
                      </Link>
                      <Link href="/breathing-exercise" passHref>
                          <Button variant="outline" className="w-full justify-start gap-4 p-6 text-base bg-background/50">
                              <HeartPulse className="text-primary w-5 h-5" />
                              <span>
                                <p className="font-semibold">Immersive Breathing</p>
                                <p className="text-xs text-muted-foreground">Calm your mind and body.</p>
                              </span>
                          </Button>
                      </Link>
                       <Link href="/ai-friend" passHref>
                          <Button variant="outline" className="w-full justify-start gap-4 p-6 text-base bg-background/50">
                              <Bot className="text-primary w-5 h-5" />
                               <span>
                                <p className="font-semibold">Your AI Companion</p>
                                <p className="text-xs text-muted-foreground">Talk through what's on your mind.</p>
                              </span>
                          </Button>
                      </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <footer className="bg-secondary/50 py-8">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
                <div className="flex justify-center gap-4 mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                  <Feather className="w-6 h-6 text-accent" />
                  <Wind className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Equilix</p>
                <p className="text-sm">Your space to breathe and reflect.</p>
                <p className="text-xs mt-4">&copy; {new Date().getFullYear()} Equilix. All Rights Reserved.</p>
            </div>
        </footer>
      </div>
    </>
  );
}
