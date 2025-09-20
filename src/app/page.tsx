'use client';

import { AppHeader } from '@/components/app/app-header';
import { DailyAffirmation } from '@/components/app/daily-affirmation';
import { GratitudeJournal } from '@/components/app/gratitude-journal';
import { JournalingStreak } from '@/components/app/journaling-streak';
import { WellnessSurvey } from '@/components/app/wellness-survey';
import { NavBar } from '@/components/app/nav-bar';

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col min-h-screen bg-background font-body">
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
          <AppHeader />
          <div className="max-w-2xl mx-auto space-y-8 mt-8">
            <DailyAffirmation />
            <WellnessSurvey />
            <GratitudeJournal />
            <JournalingStreak />
          </div>
        </main>
      </div>
    </>
  );
}
