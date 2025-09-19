'use client';

import { EmotionDetector } from '@/components/app/emotion-detector';
import { RelaxingGames } from '@/components/app/relaxing-games';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EmotionDetectorPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background font-body">
        <header className="py-4 bg-background/80 border-b backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto space-y-8">
             <EmotionDetector />
             <RelaxingGames />
          </div>
        </main>
        <footer className="text-center p-4 text-muted-foreground text-sm">
          <p>Mindful Moments © {new Date().getFullYear()}. Your space to breathe and reflect.</p>
        </footer>
      </div>
    </>
  );
}
