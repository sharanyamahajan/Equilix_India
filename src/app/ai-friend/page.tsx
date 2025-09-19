'use client';

import { AIFriend } from '@/components/app/ai-friend';

export default function AIFriendPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <AIFriend />
        </div>
      </main>
    </div>
  );
}
