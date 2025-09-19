import type {Metadata} from 'next';
import './globals.css';
import { NavBar } from '@/components/app/nav-bar';
import { Toaster } from '@/components/ui/toaster';


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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NavBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
