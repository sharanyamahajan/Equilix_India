// @/components/app/ai-avatar.tsx
'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

export type AvatarState = 'idle' | 'listening' | 'talking' | 'thinking';

interface AIAvatarProps {
  state?: AvatarState;
}

export function AIAvatar({ state = 'idle' }: AIAvatarProps) {
  const avatarVariants = {
    idle: { scale: 1, filter: 'brightness(1)' },
    listening: { scale: 1.05, filter: 'brightness(1.1)', transition: { duration: 0.5 } },
    talking: { scale: 1.05, filter: 'brightness(1.1)', transition: { duration: 0.5, yoyo: Infinity } },
    thinking: { scale: 1, filter: 'brightness(0.9)', transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative w-full h-full rounded-full overflow-hidden"
      initial="idle"
      animate={state}
      variants={avatarVariants}
    >
      <Image
        src="https://picsum.photos/seed/ai-avatar/512/512"
        alt="Realistic AI Avatar"
        width={512}
        height={512}
        className="w-full h-full object-cover"
        data-ai-hint="woman smiling"
      />
    </motion.div>
  );
}
