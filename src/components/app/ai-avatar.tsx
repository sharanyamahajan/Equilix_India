// @/components/app/ai-avatar.tsx
'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type AvatarState = 'idle' | 'listening' | 'talking' | 'thinking';

interface AIAvatarProps {
  state?: AvatarState;
}

export function AIAvatar({ state = 'idle' }: AIAvatarProps) {
  const eyeLidVariants = {
    idle: {
      scaleY: 0.1,
      transition: { duration: 0.2, delay: 3, repeat: Infinity, repeatDelay: 5 },
    },
    listening: { scaleY: 1 },
    talking: { scaleY: 1 },
    thinking: { scaleY: 1 },
  };

  const mouthVariants = {
    idle: { pathLength: 0, pathOffset: 0.5 },
    listening: { pathLength: 0.3, pathOffset: 0.35, transition: { duration: 0.5 } },
    talking: { 
      pathLength: 0.6, 
      pathOffset: 0.2, 
      transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } 
    },
    thinking: { 
        pathLength: 0.2, 
        pathOffset: 0.4,
        transition: { duration: 0.5 }
    },
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      initial="idle"
      animate={state}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gentle breathing animation for the head */}
      <motion.g
        animate={{ scale: [1, 1.02, 1], y: [0, -1, 0] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Head */}
        <path
          d="M 20 50 A 30 30 0 1 1 80 50 A 30 30 0 1 1 20 50"
          className="fill-primary/50"
        />
        <path
          d="M 25 50 A 25 25 0 1 1 75 50 A 25 25 0 1 1 25 50"
          className="fill-background"
        />

        {/* Eyes */}
        <g id="eyes" className="fill-primary">
          <circle cx="40" cy="45" r="4" />
          <circle cx="60" cy="45" r="4" />
          {/* Eyelids for blinking */}
          <motion.rect
            x="35"
            y="41"
            width="10"
            height="8"
            className="fill-background"
            variants={eyeLidVariants}
            transformOrigin="center"
          />
           <motion.rect
            x="55"
            y="41"
            width="10"
            height="8"
            className="fill-background"
            variants={eyeLidVariants}
            transformOrigin="center"
          />
        </g>

        {/* Mouth */}
        <g id="mouth">
          <motion.path
            d="M 40 65 Q 50 75 60 65"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            variants={mouthVariants}
          />
        </g>
      </motion.g>
    </motion.svg>
  );
}
