'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, HeartPulse, User, Bot, Wind, Menu, X, Info, BrainCircuit, ChevronDown, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquilixLogo } from '@/components/icons/equilix-logo';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { 
    label: 'Relaxation', 
    icon: Wind,
    children: [
      { href: '/breathing-exercise', label: 'Breathing', icon: HeartPulse },
      { href: '/mantra-chanting', label: 'Mantra', icon: Wind },
    ]
  },
   { 
    label: 'Fun Things', 
    icon: Gamepad2,
    children: [
      { href: '/emotion-detector', label: 'Emotion Scan', icon: Camera },
      { href: '/games', label: 'Games', icon: Gamepad2 },
    ]
  },
  { 
    label: 'AI Services', 
    icon: BrainCircuit,
    children: [
      { href: '/ai-friend', label: 'AI Companion', icon: Bot },
      { href: '/my-twin', label: 'My Twin', icon: User },
    ]
  },
  { href: '/about', label: 'About', icon: Info },
];

export function NavBar() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);
  
  const NavLinksContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map((link) => {
        const isActive = link.href === pathname || (link.children && link.children.some(child => child.href === pathname));

        if (link.children) {
          if (isMobile) {
            return (
              <div key={link.label}>
                <div className={cn(
                  'flex items-center gap-3 rounded-md text-sm font-medium transition-colors px-3 py-2',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </div>
                <div className="flex flex-col pl-8">
                  {link.children.map(child => {
                     const isChildActive = pathname === child.href;
                     return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-3 rounded-md text-sm font-medium transition-colors px-3 py-2',
                            isChildActive
                              ? 'text-primary'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <child.icon className="h-5 w-5" />
                          <span>{child.label}</span>
                        </Link>
                     )
                  })}
                </div>
              </div>
            )
          }
          return (
             <DropdownMenu key={link.label}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}>
                   <link.icon className="h-5 w-5" />
                   {link.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {link.children.map(child => (
                   <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href} className="flex items-center gap-2">
                        <child.icon className="h-4 w-4 text-muted-foreground" />
                        {child.label}
                      </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
              isMobile ? 'px-3 py-2' : '',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
               !isMobile ? 'px-3 py-2' : ''
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
            <EquilixLogo className="w-8 h-8 text-primary" />
            <span className="hidden font-bold sm:inline-block">Equilix</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-end gap-2 text-sm md:flex">
          <NavLinksContent />
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
                 <Link href="/" className="flex items-center gap-2 px-3 mb-2">
                    <EquilixLogo className="w-8 h-8 text-primary" />
                    <span className="font-bold">Equilix</span>
                  </Link>
                <div className="flex flex-col gap-1">
                  <NavLinksContent isMobile={true} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
