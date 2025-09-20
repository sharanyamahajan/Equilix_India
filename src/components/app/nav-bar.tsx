'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, HeartPulse, User, Bot, Wind, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquilixLogo } from '@/components/icons/equilix-logo';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const NavContent = ({isMobile = false}: {isMobile?: boolean}) => (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => isMobile && setMobileNavOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              isMobile ? 'text-lg text-foreground w-full' : 'text-muted-foreground',
              isActive
                ? 'text-primary'
                : 'hover:text-foreground'
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
       <div className="container flex h-16 items-center">
            <div className="mr-4 hidden md:flex">
                <Link href="/" className="flex items-center gap-2">
                    <EquilixLogo className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Equilix</span>
                </Link>
            </div>

            {/* Mobile Header */}
            {mounted ? (
              <div className="md:hidden flex-1">
                  <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu />
                          <span className="sr-only">Open Menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                      <div className="flex flex-col gap-4 py-8">
                          <Link href="/" className="flex items-center gap-2 px-4 mb-4" onClick={() => setMobileNavOpen(false)}>
                              <EquilixLogo className="w-8 h-8 text-primary" />
                              <span className="font-bold text-xl">Equilix</span>
                          </Link>
                          <NavContent isMobile={true} />
                      </div>
                  </SheetContent>
                  </Sheet>
              </div>
            ) : (
              <div className="md:hidden flex-1">
                <Button variant="ghost" size="icon" disabled>
                    <Menu />
                    <span className="sr-only">Open Menu</span>
                </Button>
              </div>
            )}
            
            <div className="flex flex-1 items-center justify-center md:justify-end">
                <Link href="/" className="md:hidden">
                    <EquilixLogo className="w-6 h-6 text-primary" />
                </Link>
                <nav className="hidden md:flex items-center gap-4 text-sm">
                    <NavContent />
                </nav>
            </div>
       </div>
    </header>
  );
}
