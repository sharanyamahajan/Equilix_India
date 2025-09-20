'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, HeartPulse, Menu, Info, BrainCircuit, Bot, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/journal', label: 'Journal', icon: HeartPulse },
  { href: '/emotion-detector', label: 'Emotion Scan', icon: Camera },
  { href: '/my-twin', label: 'AI Twin', icon: BrainCircuit },
  { href: '/ai-friend', label: 'AI Friend', icon: Bot },
  { href: '/about', label: 'About', icon: Info },
];

export function NavBar() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const NavLinksContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map((link) => {
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 rounded-full text-sm font-medium transition-colors',
              isMobile ? 'px-4 py-3 text-base' : 'px-4 py-2',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className={cn({ 'hidden lg:inline': !isMobile })}>{link.label}</span>
            {isMobile && <span className="text-lg">{link.label}</span>}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? 'bg-background/80 border-b border-border/50 backdrop-blur-lg' : 'bg-transparent border-b border-transparent'
    )}>
      <div className="container flex h-20 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-signature text-3xl text-white">Equilix</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-2 text-sm md:flex">
          <div className="flex items-center gap-1 rounded-full p-1 bg-muted/50 border border-border/50">
            <NavLinksContent />
          </div>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center justify-end gap-2 ml-auto">
            <Button variant="ghost">Logout</Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/mantra-chanting">Mantra</Link>
            </Button>
        </div>


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
                 <Link href="/" className="flex items-center gap-2 px-3 mb-4">
                    <span className="font-signature text-4xl text-white">Equilix</span>
                  </Link>
                <div className="flex flex-col gap-2 px-2">
                  <NavLinksContent isMobile={true} />
                </div>
                 <div className="mt-auto flex flex-col gap-2 px-2">
                    <Button variant="ghost" className="justify-start text-lg">Logout</Button>
                     <Button asChild className="bg-primary hover:bg-primary/90 text-lg">
                        <Link href="/mantra-chanting">Mantra</Link>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
