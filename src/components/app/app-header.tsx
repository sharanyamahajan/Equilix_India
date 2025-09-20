export function AppHeader() {
  return (
    <header className="py-8 bg-transparent">
      <div className="container mx-auto px-4 text-center">
         <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            Good Morning
         </h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mt-2 font-light">
          Your personal space for daily reflection, gratitude, and mental clarity.
        </p>
      </div>
    </header>
  );
}
