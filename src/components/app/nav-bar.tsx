'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, HeartPulse, User, Bot, Wind, Menu, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquilixLogo } from '@/components/icons/equilix-logo';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/emotion-detector', label: 'Emotion Scan', icon: Camera },
  { href: '/breathing-exercise', label: 'Breathing', icon: HeartPulse },
  { href: '/mantra-chanting', label: 'Mantra', icon: Wind },
  { href: '/ai-friend', label: 'AI Companion', icon: Bot },
  { href: '/my-twin', label: 'My Twin', icon: User },
  { href: '/about', label: 'About', icon: Info },
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
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
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
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <EquilixLogo className="w-6 h-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Equilix</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-end gap-6 text-sm md:flex">
          <NavLinks />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 py-4">
                 <Link href="/" className="flex items-center gap-2 px-3">
                    <EquilixLogo className="w-6 h-6 text-primary" />
                    <span className="font-bold">Equilix</span>
                  </Link>
                <NavLinks className="flex-col items-start" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
