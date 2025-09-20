import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NavBar } from '@/components/app/nav-bar';
import { AnimatedBackground } from '@/components/app/animated-background';


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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
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
        <Toaster />
      </body>
    </html>
  );
}
