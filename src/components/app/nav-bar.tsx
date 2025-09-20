'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquilixLogo } from '@/components/icons/equilix-logo';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/emotion-detector', label: 'Emotion Scan', icon: Camera },
  { href: '/ai-friend', label: 'AI Companion', icon: Bot },
  { href: '/my-twin', label: 'My Twin', icon: User },
];

export function NavBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
      <nav className="container mx-auto px-2 py-1 flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-lg border border-border/30 shadow-lg shadow-primary/5">
        <Link href="/" className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" aria-label="Equilix Home">
          <EquilixLogo className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors border border-transparent',
                  isActive
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
