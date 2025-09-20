'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScanFace, BrainCircuit, Mic, Wind, Users } from 'lucide-react';

const features = [
  { name: 'Emotion Scan', icon: ScanFace },
  { name: 'AI Twin', icon: BrainCircuit },
  { name: 'Mantra Coach', icon: Mic },
  { name: 'Breathing', icon: Wind },
  { name: 'Community', icon: Users },
];

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
            A personal wellness and reflection space. Your journey to balance and clarity starts here.
          </p>
          <div className="mt-10">
            <Link href="/mode-selection" passHref>
              <Button size="lg" className="bg-primary text-primary-foreground text-lg font-bold px-10 py-6 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="mt-20 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                className="flex items-center gap-3 text-foreground/70"
              >
                <feature.icon className="w-5 h-5 text-primary/80" />
                <span className="font-medium text-sm md:text-base">{feature.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
