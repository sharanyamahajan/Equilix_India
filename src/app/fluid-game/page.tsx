'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NUM_BLOBS = 5;

const Blob = ({ style, id }: { style: React.CSSProperties, id: number }) => (
  <div
    className={cn(
        "absolute rounded-full mix-blend-soft-light filter blur-xl",
        `animate-blob-move-${id % 3 + 1}`
    )}
    style={style}
  ></div>
);

const generateBlobs = () => {
    return Array.from({ length: NUM_BLOBS }).map((_, i) => {
        const size = Math.random() * 200 + 100;
        const colors = [
            'bg-primary/70',
            'bg-accent/70',
            'bg-blue-400/70',
            'bg-pink-400/70',
            'bg-teal-400/70',
        ]
        return {
            id: i,
            style: {
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 80}%`,
                animationDuration: `${Math.random() * 20 + 15}s`,
                animationDelay: `${Math.random() * 5}s`,
            },
            className: colors[i % colors.length]
        };
    });
};


export default function FluidGamePage() {
  const [blobs, setBlobs] = useState(generateBlobs());
  
  const resetAnimation = () => {
    setBlobs(generateBlobs());
  }

  return (
    <>
      <style jsx global>{`
        @keyframes blob-move-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30vw, 20vh) scale(1.2); }
          50% { transform: translate(-10vw, -15vh) scale(0.8); }
          75% { transform: translate(15vw, -30vh) scale(1.1); }
        }
        @keyframes blob-move-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-25vw, 15vh) scale(0.9); }
          50% { transform: translate(10vw, -20vh) scale(1.3); }
          75% { transform: translate(-15vw, 30vh) scale(1); }
        }
        @keyframes blob-move-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20vw, -25vh) scale(1.1); }
          50% { transform: translate(-15vw, 10vh) scale(0.9); }
          75% { transform: translate(25vw, 20vh) scale(1.2); }
        }
        .animate-blob-move-1 { animation: blob-move-1 25s infinite alternate ease-in-out; }
        .animate-blob-move-2 { animation: blob-move-2 25s infinite alternate ease-in-out; }
        .animate-blob-move-3 { animation: blob-move-3 25s infinite alternate ease-in-out; }
      `}</style>

      <div className="fixed inset-0 bg-background -z-10">
        <div className="relative w-full h-full overflow-hidden">
            {blobs.map(blob => (
                <div key={blob.id} className={cn(
                    "absolute rounded-full mix-blend-soft-light filter blur-2xl opacity-70",
                    `animate-blob-move-${blob.id % 3 + 1}`,
                    blob.className
                )}
                style={blob.style}></div>
            ))}
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-screen">
          <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm">
              <CardHeader>
                  <CardTitle>Fluid Flow</CardTitle>
                  <CardDescription>
                      Watch the colors flow and let your mind drift. A moment of calm in a busy world.
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                      There's nothing to win, just a space to be.
                  </p>
                  <Button onClick={resetAnimation} variant="outline">
                    <RefreshCw className="mr-2" />
                    New Flow
                  </Button>
              </CardContent>
          </Card>
      </main>
    </>
  );
}