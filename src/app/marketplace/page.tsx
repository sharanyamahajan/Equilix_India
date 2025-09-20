'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const experts = [
  {
    id: 'expert-1',
    name: 'Dr. Alisha Gupta',
    title: 'Psychiatrist, MD',
    specialties: ['Anxiety', 'Depression', 'Trauma'],
    description: "With over 15 years of experience, Dr. Gupta provides compassionate, evidence-based care to help you navigate life's challenges. Her holistic approach combines therapy with modern medicine.",
    rating: 4.9,
    reviews: 124,
    imageHint: 'woman professional',
  },
  {
    id: 'expert-2',
    name: 'Rohan Sharma',
    title: 'Certified Yoga Master',
    specialties: ['Vinyasa Flow', 'Meditation', 'Pranayama'],
    description: "Rohan's classes are a blend of dynamic movement and mindful stillness, designed to strengthen the body and calm the mind. He believes yoga is a path to inner peace for everyone.",
    rating: 5.0,
    reviews: 98,
    imageHint: 'man yoga',
  },
  {
    id: 'expert-3',
    name: 'Priya Singh',
    title: 'Holistic Wellness Coach',
    specialties: ['Stress Management', 'Habit Formation', 'Mindfulness'],
    description: 'Priya empowers you to build sustainable habits for a healthier, more balanced life. She offers personalized coaching to help you achieve your wellness goals, one step at a time.',
    rating: 4.8,
    reviews: 76,
    imageHint: 'woman smiling',
  },
   {
    id: 'expert-4',
    name: 'Dr. Kenji Tanaka',
    title: 'Therapist, PhD',
    specialties: ['Cognitive Behavioral Therapy', 'Relationships', 'Burnout'],
    description: "Dr. Tanaka specializes in providing practical tools to manage stress and improve communication. His goal is to help you build resilience and find more joy in your daily life.",
    rating: 4.9,
    reviews: 150,
    imageHint: 'man professional',
  },
  {
    id: 'expert-5',
    name: 'Sofia Rossi',
    title: 'Mantra & Sound Healing Guru',
    specialties: ['Vedic Chanting', 'Sound Baths', 'Guided Meditation'],
    description: "Sofia uses the power of sound and ancient mantras to guide you into deep states of relaxation and healing. Her sessions are a unique journey into self-discovery and tranquility.",
    rating: 5.0,
    reviews: 112,
    imageHint: 'woman meditation',
  },
  {
    id: 'expert-6',
    name: 'David Chen',
    title: 'Mindfulness Coach',
    specialties: ['MBSR', 'Corporate Wellness', 'Focus Training'],
    description: "A former tech executive, David now helps professionals and teams cultivate focus and reduce stress through practical mindfulness techniques. His approach is secular and science-backed.",
    rating: 4.9,
    reviews: 88,
    imageHint: 'man corporate',
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
