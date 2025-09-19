'use client';

import { AppHeader } from '@/components/app/app-header';
import { DailyAffirmation } from '@/components/app/daily-affirmation';
import { JournalEntry } from '@/components/app/journal-entry';

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background font-body">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-8">
              <DailyAffirmation />
              <JournalEntry />
            </div>
            <div className="hidden md:block">
              <div className="h-full bg-muted rounded-lg flex items-center justify-center p-8">
                 <p className="text-muted-foreground text-center">More features coming soon!</p>
              </div>
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
