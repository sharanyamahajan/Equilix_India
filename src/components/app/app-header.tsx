import { EquilixLogo } from '@/components/icons/equilix-logo';

export function AppHeader() {
  return (
    <header className="py-8 bg-background/80 border-b backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <EquilixLogo className="w-10 h-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            Equilix
          </h1>
        </div>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal space for daily reflection, gratitude, and mental clarity.
        </p>
      </div>
    </header>
  );
}
