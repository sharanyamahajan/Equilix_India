'use client';

import { AppHeader } from '@/components/app/app-header';
import { DailyAffirmation } from '@/components/app/daily-affirmation';
import { GratitudeJournal } from '@/components/app/gratitude-journal';
import { WellnessSurvey } from '@/components/app/wellness-survey';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background font-body">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-8">
              <DailyAffirmation />
              <GratitudeJournal />
            </div>
            <div className="space-y-8">
              <WellnessSurvey />
            </div>
          </div>
        </main>
        <footer className="text-center p-4 text-muted-foreground text-sm">
          <p>Mindful Moments © {new Date().getFullYear()}. Your space to breathe and reflect.</p>
        </footer>
      </div>
    </>
  );
}
