'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-black">
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full"
        style={{ filter: 'blur(100px)' }}
        animate={{
          x: ['-20%', '100%', '50%', '-20%'],
          y: ['-20%', '50%', '120%', '-20%'],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full"
        style={{ filter: 'blur(100px)' }}
        animate={{
          x: ['120%', '-20%', '50%', '120%'],
          y: ['120%', '50%', '-20%', '120%'],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse',
          delay: 5,
        }}
      />
       <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full"
        style={{ filter: 'blur(80px)' }}
        animate={{
          x: ['-50%', '50%', '-50%'],
          y: ['-50%', '50%', '-50%'],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse',
          delay: 10,
        }}
      />
    </div>
  );
}
