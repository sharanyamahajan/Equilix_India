'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, HeartPulse, User, Bot, Wind, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquilixLogo } from '@/components/icons/equilix-logo';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/emotion-detector', label: 'Emotion Scan', icon: Camera },
  { href: '/breathing-exercise', label: 'Breathing', icon: HeartPulse },
  { href: '/mantra-chanting', label: 'Mantra', icon: Wind },
  { href: '/ai-friend', label: 'AI Companion', icon: Bot },
  { href: '/my-twin', label: 'My Twin', icon: User },
];

export function NavBar() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const NavLinks = ({ className }: { className?: string }) => (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
              'px-3 py-2',
              isActive
                ? 'bg-secondary text-primary'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              className
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
       <div className="container flex h-16 items-center">
            {/* Desktop Logo */}
            <div className="mr-4 hidden md:flex">
                <Link href="/" className="flex items-center gap-2">
                    <EquilixLogo className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Equilix</span>
                </Link>
            </div>

            {/* Mobile: Menu Button and Centered Logo */}
            <div className="md:hidden flex-1 flex items-center">
                 <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
                    {mobileNavOpen ? <X/> : <Menu />}
                    <span className="sr-only">Open Menu</span>
                </Button>
            </div>
             <div className="md:hidden flex-1 flex justify-center">
                 <Link href="/" className="flex items-center gap-2">
                    <EquilixLogo className="w-6 h-6 text-primary" />
                </Link>
             </div>
             <div className="md:hidden flex-1" />


            {/* Desktop Navigation */}
            <div className="hidden flex-1 items-center justify-end md:flex">
                <nav className="flex items-center gap-4 text-sm">
                    <NavLinks />
                </nav>
            </div>
       </div>

        {/* Mobile Navigation Panel */}
        {mobileNavOpen && (
             <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b animate-in fade-in-20 slide-in-from-top-2">
                <div className="container py-4 flex flex-col gap-2">
                    <NavLinks className="text-base"/>
                </div>
            </div>
        )}
    </header>
  );
}
