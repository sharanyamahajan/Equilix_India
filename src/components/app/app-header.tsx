import { Sparkles } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-8 bg-card/50 border-b backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
            Equilix Refined
          </h1>
        </div>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your HTML files to get AI-powered suggestions for optimization and best practices.
        </p>
      </div>
    </header>
  );
}
