'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const experts = [
  {
    id: 'expert-1',
    name: 'Dr. Nimesh G. Desai',
    title: 'Director, IHBAS, Delhi',
    specialties: ['Psychiatry', 'Public Mental Health', 'Addiction'],
    description: "A leading figure in Indian psychiatry, Dr. Desai has extensive experience in clinical care and mental health policy. He is renowned for his work at the Institute of Human Behaviour and Allied Sciences.",
    rating: 4.9,
    reviews: 350,
    imageHint: 'man professional',
  },
  {
    id: 'expert-2',
    name: 'Baba Ramdev',
    title: 'Yoga Guru & Co-founder, Patanjali',
    specialties: ['Yoga', 'Pranayama', 'Ayurveda'],
    description: "A globally recognized Yoga Guru, Swami Ramdev is credited with popularizing yoga and pranayama across India and the world. His teachings focus on holistic wellness through ancient practices.",
    rating: 5.0,
    reviews: 1200,
    imageHint: 'man yoga',
  },
  {
    id: 'expert-3',
    name: 'Gaur Gopal Das',
    title: 'Lifestyle Coach & Monk',
    specialties: ['Mindfulness', 'Motivation', 'Spiritual Wellness'],
    description: 'An electrical engineer turned monk, Gaur Gopal Das is a world-renowned motivational speaker who blends ancient philosophy with modern, practical wisdom to help people live happier lives.',
    rating: 5.0,
    reviews: 980,
    imageHint: 'man smiling',
  },
   {
    id: 'expert-4',
    name: 'Dr. Sameer Malhotra',
    title: 'Director, Max Healthcare, Delhi',
    specialties: ['Therapy', 'Stress Management', 'Mental Wellness'],
    description: "Dr. Malhotra is a top psychiatrist and therapist in Delhi, focusing on a multi-disciplinary approach to mental health. He is a prominent voice in de-stigmatizing mental health issues in India.",
    rating: 4.9,
    reviews: 280,
    imageHint: 'man corporate',
  },
  {
    id: 'expert-5',
    name: 'Dr. Deepika Chopra',
    title: 'Optimism Doctor®, PhD',
    specialties: ['Visualisation', 'Mindfulness', 'Positive Psychology'],
    description: "Dr. Chopra, known as the 'Optimism Doctor®', specializes in evidence-based techniques to cultivate happiness and resilience. Her work focuses on bridging holistic practices with scientific research.",
    rating: 5.0,
    reviews: 410,
    imageHint: 'woman meditation',
  },
  {
    id: 'expert-6',
    name: 'Luke Coutinho',
    title: 'Holistic Lifestyle Coach',
    specialties: ['Integrative Medicine', 'Nutrition', 'Wellness'],
    description: "Luke Coutinho focuses on a holistic approach to wellness, addressing root causes through lifestyle changes. He is a prominent figure in integrative and lifestyle medicine in India.",
    rating: 4.9,
    reviews: 750,
    imageHint: 'man professional',
  }
];

export default function MarketplacePage() {
    return (
        <main className="flex-grow container mx-auto px-4 pt-28 pb-12">
             <div className="max-w-6xl mx-auto space-y-12">
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                        Expert Marketplace
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                       Connect with curated professionals to guide you on your wellness journey.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {experts.map((expert) => {
                        const placeholder = PlaceHolderImages.find(p => p.id === expert.id);
                        return (
                            <Card key={expert.id} className="flex flex-col bg-secondary/30 hover:bg-secondary/50 hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-1">
                                <CardHeader className="flex-row gap-4 items-start">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                                        <Image
                                            src={placeholder?.imageUrl || "https://picsum.photos/seed/placeholder/200/200"}
                                            alt={`Profile of ${expert.name}`}
                                            width={80}
                                            height={80}
                                            data-ai-hint={expert.imageHint}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <CardTitle>{expert.name}</CardTitle>
                                        <CardDescription>{expert.title}</CardDescription>
                                        <div className="flex items-center gap-1 text-sm mt-1 text-amber-500">
                                            <span>&#9733;</span>
                                            <span>{expert.rating.toFixed(1)}</span>
                                            <span className="text-muted-foreground">({expert.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                     <p className="text-sm text-muted-foreground">{expert.description}</p>
                                     <div className="flex flex-wrap gap-2">
                                        {expert.specialties.map(specialty => (
                                            <Badge key={specialty} variant="secondary" className="font-normal">{specialty}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Book a Session</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
