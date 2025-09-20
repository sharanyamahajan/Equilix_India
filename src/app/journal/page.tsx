'use client';

import { DailyAffirmation } from '@/components/app/daily-affirmation';
import { GratitudeJournal } from '@/components/app/gratitude-journal';
import { JournalingStreak } from '@/components/app/journaling-streak';
import { WellnessSurvey } from '@/components/app/wellness-survey';

export default function JournalPage() {
  return (
      <div className="flex flex-col min-h-screen bg-background font-body">
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
            <div className="text-center mb-10">
                 <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    Wellness & Journal
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 font-light tracking-wide">
                    A dedicated space for your daily check-in, affirmations, and gratitude.
                </p>
            </div>
          <div className="max-w-2xl mx-auto space-y-8">
            <DailyAffirmation />
            <WellnessSurvey />
            <GratitudeJournal />
            <JournalingStreak />
          </div>
        </main>
      </div>
  );
}
