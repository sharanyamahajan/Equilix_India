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

  if (!mounted) {
    return null; 
  }
  
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
              'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors border border-transparent',
              isMobile ? 'text-foreground' : 'text-muted-foreground',
              isActive
                ? isMobile ? 'bg-muted' : 'bg-background text-primary shadow-sm'
                : 'hover:text-foreground hover:bg-muted/50'
            )}
          >
            <link.icon className="h-4 w-4" />
            <span className={cn({ 'sm:inline': !isMobile, 'inline': isMobile })}>{link.label}</span>
          </Link>
        );
      })}
    </>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30 md:bg-transparent md:border-none md:backdrop-filter-none">
       <div className="md:hidden flex items-center justify-between p-4">
         <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full" aria-label="Equilix Home">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
             <EquilixLogo className="w-6 h-6 text-white" />
            </div>
        </Link>
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
             <div className="flex flex-col gap-4 mt-8">
                <NavContent isMobile={true} />
             </div>
          </SheetContent>
        </Sheet>
       </div>
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-500">
        <nav className="container mx-auto px-2 py-1 flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-lg border border-border/30 shadow-lg shadow-primary/5">
          <Link href="/" className="flex items-center justify-center w-11 h-11 rounded-full" aria-label="Equilix Home">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <EquilixLogo className="w-6 h-6 text-white" />
              </div>
          </Link>
          <div className="flex items-center gap-1">
            <NavContent />
          </div>
        </nav>
      </div>
    </header>
  );
}
