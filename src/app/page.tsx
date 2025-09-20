'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScanFace, BrainCircuit, Mic, Wind, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  { name: 'Emotion Scan', icon: ScanFace },
  { name: 'AI Twin', icon: BrainCircuit },
  { name: 'Mantra Coach', icon: Mic },
  { name: 'Breathing', icon: Wind },
  { name: 'Community', icon: Users },
];

const experts = [
    { 
        name: 'Dr. Alisha Gupta', 
        title: 'Psychiatrist', 
        image: PlaceHolderImages.find(p => p.id === 'expert-1')?.imageUrl,
        hint: 'woman professional',
    },
    { 
        name: 'Rohan Sharma', 
        title: 'Yoga Master', 
        image: PlaceHolderImages.find(p => p.id === 'expert-2')?.imageUrl,
        hint: 'man yoga',
    },
    { 
        name: 'Priya Singh', 
        title: 'Wellness Coach', 
        image: PlaceHolderImages.find(p => p.id === 'expert-3')?.imageUrl,
        hint: 'woman smiling',
     },
];

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-transparent font-body text-foreground">
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 pt-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-white">
            Step into the Future of <span className="text-primary">Wellness.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            A personal wellness and reflection space. Your journey to balance and clarity starts here.
          </p>
          <div className="mt-10">
            <Link href="/mode-selection" passHref>
              <Button size="lg" className="bg-primary text-primary-foreground text-lg font-bold px-10 py-6 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="mt-20 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                className="flex items-center gap-3 text-foreground/70"
              >
                <feature.icon className="w-5 h-5 text-primary/80" />
                <span className="font-medium text-sm md:text-base">{feature.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <section className="relative z-10 w-full max-w-6xl mx-auto py-20 px-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <Card className="bg-secondary/20 border-none backdrop-blur-md">
                <CardContent className="p-8 md:p-12">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">Connect with Our Experts</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
                            Elevate your wellness journey by connecting with our curated network of professionals.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {experts.map((expert) => (
                            <div key={expert.name} className="flex flex-col items-center">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20">
                                    <Image 
                                        src={expert.image || "https://picsum.photos/seed/placeholder/200/200"}
                                        alt={`Profile of ${expert.name}`}
                                        width={128}
                                        height={128}
                                        data-ai-hint={expert.hint}
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="mt-4 font-bold text-lg">{expert.name}</h3>
                                <p className="text-sm text-primary">{expert.title}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Button asChild size="lg">
                            <Link href="/marketplace">
                                Explore the Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    </section>

    </div>
  );
}
