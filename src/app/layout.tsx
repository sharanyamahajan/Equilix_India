import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NavBar } from '@/components/app/nav-bar';
import { AnimatedBackground } from '@/components/app/animated-background';
import { FloatingBot } from '@/components/app/floating-bot';


export const metadata: Metadata = {
  title: 'Equilix',
  description: 'Your personal space for reflection and growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 10v4'/%3E%3Cpath d='M12 18v-2'/%3E%3Cpath d='M12 8V7'/%3E%3Cpath d='M7 15a5 5 0 0 1 10 0'/%3E%3Cpath d='M5 18a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2'/%3E%3Cpath d='M5 11.8A7.9 7.9 0 0 1 12 4a7.9 7.9 0 0 1 7 7.8'/%3E%3Cpath d='M2.5 12.5a9.8 9.8 0 0 1 19 0'/%3E%3C/svg%3E" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Dancing+Script:wght@400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AnimatedBackground />
        <NavBar />
        <div className="flex-grow z-10">
          {children}
        </div>
        <FloatingBot />
        <Toaster />
      </body>
    </html>
  );
}
