
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, HeartPulse, Camera, Puzzle, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/emotion-detector', label: 'Emotion Detector', icon: Camera },
  { href: '/mindful-maze', label: 'Mindful Maze', icon: Puzzle },
  { href: '/fluid-game', label: 'Fluid Flow', icon: Waves },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="py-4 bg-background/80 border-b backdrop-blur-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline text-primary">
          <HeartPulse />
          <span>Mindful Moments</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
