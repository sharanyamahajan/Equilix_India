import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="py-8 bg-transparent">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Image
            src="/Equilix.png"
            alt="Equilix Logo"
            width={120}
            height={40} 
            className="h-auto"
            priority
          />
        </div>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          Your personal space for daily reflection, gratitude, and mental clarity.
        </p>
      </div>
    </header>
  );
}
