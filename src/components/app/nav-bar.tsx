'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquilixLogo } from '@/components/icons/equilix-logo';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/emotion-detector', label: 'Emotion Detector', icon: Camera },
  { href: '/ai-friend', label: 'AI Friend', icon: Bot },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="container mx-auto px-2 py-1 flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-lg border border-border/20 shadow-md">
        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
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
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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
