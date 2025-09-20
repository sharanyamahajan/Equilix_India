'use client';

import { AppHeader } from '@/components/app/app-header';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'AI Companion',
    description: 'Talk through your thoughts with a supportive, non-judgmental AI partner.',
    href: '/ai-friend',
    imageId: 'ai-companion',
  },
  {
    title: 'Breathing Exercise',
    description: 'Find your center and calm your mind with guided breathing sessions.',
    href: '/breathing-exercise',
    imageId: 'breathing-exercise',
  },
  {
    title: 'Emotion Check-in',
    description: 'Use your camera to get AI-powered feedback on your emotional state.',
    href: '/emotion-detector',
    imageId: 'emotion-check-in',
  },
  {
    title: 'Wellness & Journal',
    description: 'Reflect on your day, track your mood, and cultivate gratitude.',
    href: '/journal',
    imageId: 'wellness-journal',
  },
];

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen bg-background font-body">
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
          <AppHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10">
            {features.map((feature) => {
               const placeholder = PlaceHolderImages.find(p => p.id === feature.imageId);
               return (
                <Link href={feature.href} key={feature.title} passHref>
                  <Card className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                     <div className="relative w-full h-56">
                        {placeholder && (
                           <Image
                            src={placeholder.imageUrl}
                            alt={placeholder.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={placeholder.imageHint}
                           />
                        )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    <div className="p-6 bg-card flex-grow flex flex-col">
                      <h3 className="text-2xl font-headline font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                      <div className="mt-4 flex items-center text-primary font-semibold">
                        <span>Start Session</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
  );
}
