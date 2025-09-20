import { EquilixLogo } from '@/components/icons/equilix-logo';

export function AppHeader() {
  return (
    <header className="py-8 bg-transparent">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <EquilixLogo className="w-auto h-12 text-primary" />
        </div>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          Your personal space for daily reflection, gratitude, and mental clarity.
        </p>
      </div>
    </header>
  );
}
