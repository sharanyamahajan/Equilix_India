'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-transparent font-body text-foreground">
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-white">
            Step into the Future of <span className="text-primary">Wellness.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Equilix is not just another meditation app. It’s an AI-powered wellness ecosystem where users can scan emotions, practice guided breathing, chant mantras with real-time feedback, and interact with their evolving AI Twin. This creates daily engagement, personalized insights, and multiple monetization streams — from B2C subscriptions to B2B wellness partnerships.
          </p>
          <div className="mt-10">
            <Link href="/journal" passHref>
              <Button size="lg" className="bg-primary text-primary-foreground text-lg font-bold px-10 py-6 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
