'use client';

import { EmotionDetector } from '@/components/app/emotion-detector';

export default function EmotionDetectorPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background font-body">
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto space-y-8">
             <EmotionDetector />
          </div>
        </main>
      </div>
    </>
  );
}
