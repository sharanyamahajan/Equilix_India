'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Star } from 'lucide-react';

const experts = [
  {
    name: 'Dr. Evelyn Reed',
    title: 'Clinical Psychologist',
    specialties: ['CBT', 'Anxiety', 'Depression'],
    rating: 4.9,
    reviews: 124,
    image: 'https://picsum.photos/seed/expert1/400/400',
    imageHint: 'professional woman portrait',
    description: 'A compassionate, evidence-based approach to mental wellness. 15+ years of experience.'
  },
  {
    name: 'Marcus Thorne',
    title: 'Yoga & Mindfulness Coach',
    specialties: ['Vinyasa', 'Meditation', 'Stress-Relief'],
    rating: 4.8,
    reviews: 89,
    image: 'https://picsum.photos/seed/expert2/400/400',
    imageHint: 'man doing yoga',
    description: 'Helping you find balance and peace through the union of breath and movement.'
  },
  {
    name: 'Anya Sharma',
    title: 'Mantra & Sound Guru',
    specialties: ['Vedic Chanting', 'Sound Baths', 'Nada Yoga'],
    rating: 5.0,
    reviews: 210,
    image: 'https://picsum.photos/seed/expert3/400/400',
    imageHint: 'woman meditating',
    description: 'Unlock the power of sound to heal and elevate your consciousness.'
  },
  {
    name: 'David Chen',
    title: 'Performance Psychiatrist',
    specialties: ['ADHD', 'Burnout', 'Focus'],
    rating: 4.9,
    reviews: 156,
    image: 'https://picsum.photos/seed/expert4/400/400',
    imageHint: 'professional man portrait',
    description: 'Optimize your mental performance and achieve your goals with medical and therapeutic support.'
  }
];

export default function MarketplacePage() {
    return (
        <main className="flex-grow container mx-auto px-4 pt-28 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    Expert Marketplace
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                    Connect with curated professionals to guide you on your wellness journey.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {experts.map((expert, index) => (
                    <motion.div
                        key={expert.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                        <Card className="h-full flex flex-col overflow-hidden bg-secondary/30 hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-1">
                            <CardHeader className="p-0">
                                <div className="relative w-full h-56">
                                     <Image 
                                        src={expert.image} 
                                        alt={`Portrait of ${expert.name}`} 
                                        fill
                                        className="object-cover"
                                        data-ai-hint={expert.imageHint}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 flex flex-col flex-grow">
                                <CardTitle className="text-xl">{expert.name}</CardTitle>
                                <CardDescription className="text-primary font-medium">{expert.title}</CardDescription>
                                
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-bold">{expert.rating}</span>
                                    </div>
                                    <span>({expert.reviews} reviews)</span>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mt-3 flex-grow">{expert.description}</p>
                                
                                <div className="mt-4">
                                    {expert.specialties.map(spec => (
                                        <Badge key={spec} variant="secondary" className="mr-1 mb-1">{spec}</Badge>
                                    ))}
                                </div>

                                <Button className="w-full mt-4">Book Session</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </main>
    );
}
