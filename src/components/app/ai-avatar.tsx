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
  const avatarContainerVariants = {
    idle: { scale: 1 },
    listening: { scale: 1.02, transition: { duration: 0.5 } },
    talking: { scale: 1.02, transition: { duration: 0.5 } },
    thinking: { scale: 0.98, transition: { duration: 0.5 } },
  };

  const imageVariants = {
    idle: { scale: 1, filter: 'brightness(1)', y: 0, transition: { duration: 4, ease: "easeInOut", yoyo: Infinity } },
    listening: { scale: 1.05, filter: 'brightness(1.05)', y: -5, transition: { duration: 0.5 } },
    talking: { scale: 1.05, filter: 'brightness(1.05)', y: [0, -5, 0], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } },
    thinking: { scale: 1, filter: 'brightness(0.9)', y: 0, transition: { duration: 1 } },
  };

  return (
    <motion.div
      className="relative w-full h-full rounded-full overflow-hidden"
      initial="idle"
      animate={state}
      variants={avatarContainerVariants}
    >
      <motion.div
        className="w-full h-full"
        variants={imageVariants}
        style={{ transformOrigin: 'center' }}
      >
        <Image
          src="https://picsum.photos/seed/human-avatar/512/512"
          alt="Realistic AI Avatar"
          width={512}
          height={512}
          className="w-full h-full object-cover"
          data-ai-hint="woman smiling"
        />
      </motion.div>
    </motion.div>
  );
}
