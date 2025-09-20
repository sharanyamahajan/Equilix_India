'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export function FloatingBot() {
  return (
    <motion.div
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Button asChild size="icon" className="w-16 h-16 rounded-full shadow-lg shadow-primary/30">
        <Link href="/ai-friend">
          <Bot className="w-8 h-8" />
          <span className="sr-only">Chat with AI Friend</span>
        </Link>
      </Button>
    </motion.div>
  );
}
