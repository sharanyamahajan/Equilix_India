'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, ZapOff, X } from 'lucide-react';
import Link from 'next/link';

const breathingCycle = [
  { text: 'Breathe In', duration: 4 },
  { text: 'Hold', duration: 7 },
  { text: 'Breathe Out', duration: 8 },
];

export default function BreathingExercisePage() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
  
  // Use a state to avoid hydration errors with window/navigator object
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const cycle = breathingCycle[currentPhase];
    const timer = setTimeout(() => {
      setCurrentPhase((prev) => (prev + 1) % breathingCycle.length);
    }, cycle.duration * 1000);

    if (isClient && hapticsEnabled && 'vibrate' in navigator) {
      if (cycle.text === 'Breathe In') {
        navigator.vibrate([100, 50, 100, 50, 100]);
      } else if (cycle.text === 'Breathe Out') {
        navigator.vibrate(200);
      }
    }
    
    return () => clearTimeout(timer);
  }, [currentPhase, hapticsEnabled, isClient]);

  const toggleHaptics = () => {
    if ('vibrate' in navigator) {
      setHapticsEnabled(!hapticsEnabled);
      if (!hapticsEnabled) {
          navigator.vibrate(50); // Provide feedback on enable
      }
    } else if (isClient) {
        alert("Haptic feedback is not supported on your device.");
    }
  };

  const phase = breathingCycle[currentPhase];

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center font-body overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background -z-10" />

      <Link href="/" passHref>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 text-muted-foreground hover:bg-background/50 hover:text-foreground">
          <X size={24} />
          <span className="sr-only">Close</span>
        </Button>
      </Link>
      
      {isClient && 'vibrate' in navigator && (
        <Button variant="ghost" size="icon" onClick={toggleHaptics} className="absolute top-4 left-4 z-10 text-muted-foreground hover:bg-background/50 hover:text-foreground">
            {hapticsEnabled ? <ZapOff size={20} /> : <Zap size={20} />}
            <span className="sr-only">{hapticsEnabled ? 'Disable' : 'Enable'} Haptics</span>
        </Button>
      )}

      <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
        <motion.div
          className="absolute w-full h-full rounded-full bg-primary/20"
          animate={{
            scale: phase.text === 'Breathe In' ? 1.2 : (phase.text === 'Hold' ? 1.2 : 0.8),
            opacity: phase.text === 'Breathe In' ? 1 : (phase.text === 'Hold' ? 1 : 0.7),
          }}
          transition={{ duration: phase.duration, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-2/3 h-2/3 rounded-full bg-primary/30"
           animate={{
            scale: phase.text === 'Breathe In' ? 1.3 : (phase.text === 'Hold' ? 1.3 : 0.7),
            opacity: phase.text === 'Breathe In' ? 1 : (phase.text === 'Hold' ? 1 : 0.6),
          }}
          transition={{ duration: phase.duration, ease: 'easeInOut', delay: 0.1 }}
        />
         <motion.div
          className="absolute w-1/2 h-1/2 rounded-full bg-primary"
           animate={{
            scale: phase.text === 'Breathe In' ? 1.4 : (phase.text === 'Hold' ? 1.4 : 0.6),
            opacity: phase.text === 'Breathe In' ? 1 : (phase.text === 'Hold' ? 1 : 0.5),
          }}
          transition={{ duration: phase.duration, ease: 'easeInOut', delay: 0.2 }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center"
          >
            <p className="text-3xl md:text-4xl font-semibold text-primary-foreground tracking-wider">
              {phase.text}
            </p>
            <p className="text-lg md:text-xl text-primary-foreground/80">for {phase.duration} seconds</p>
          </motion.div>
        </AnimatePresence>
      </div>

       <div className="absolute bottom-10 text-center text-muted-foreground text-sm">
        <p>Follow the rhythm and find your calm.</p>
        <p>Inspired by the 4-7-8 breathing technique.</p>
      </div>
    </div>
  );
}
