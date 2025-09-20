'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookText, Wind, ScanFace, Mic, BrainCircuit, HeartPulse, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes = [
  {
    href: '/health-dashboard',
    title: 'Health Dashboard',
    description: 'AI-powered insights into your wellness trends and potential risks.',
    icon: HeartPulse,
    highlight: true,
  },
  {
    href: '/journal',
    title: 'Journal',
    description: 'Reflect on your day, track your mood, and express your thoughts.',
    icon: BookText,
  },
  {
    href: '/breathing-exercise',
    title: 'Breathing Exercise',
    description: 'Find calm and center yourself with guided breathing.',
    icon: Wind,
  },
  {
    href: '/emotion-detector',
    title: 'Emotion Scan',
    description: 'Use your camera to get AI-powered emotional feedback.',
    icon: ScanFace,
  },
  {
    href: '/mantra-chanting',
    title: 'Mantra Chanting',
    description: 'Practice mindfulness with real-time chant tracking.',
    icon: Mic,
  },
  {
    href: '/my-twin',
    title: 'My AI Twin',
    description: 'Craft and interact with your personalized AI companion.',
    icon: BrainCircuit,
  },
];

export default function ModeSelectionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-grow container mx-auto px-4 pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            How do you want to start?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4 font-light tracking-wide">
            Choose an activity to begin your wellness journey for today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modes.map((mode, index) => (
            <Link href={mode.href} key={mode.href} passHref>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
              >
                <Card className={cn(
                  "h-full bg-secondary/30 hover:bg-secondary/50 hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer",
                  mode.highlight && "bg-primary/5 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                )}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={cn(
                      "bg-primary/10 text-primary p-3 rounded-lg",
                      mode.highlight && "bg-primary/20"
                    )}>
                      <mode.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle>{mode.title}</CardTitle>
                      <CardDescription className={cn("mt-1", mode.highlight && "text-foreground/80")}>{mode.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
