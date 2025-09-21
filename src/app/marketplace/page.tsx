'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Mail, Phone, MapPin } from 'lucide-react';

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
    email: 'n.desai@ihbas.org',
    phone: '+91 11 2211 4021',
    address: 'Institute of Human Behaviour & Allied Sciences, Delhi, India',
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
    email: 'feedback@patanjaliayurved.org',
    phone: '1800-180-4108',
    address: 'Patanjali Yogpeeth, Haridwar, Uttarakhand, India',
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
    email: 'connect@gaurgopaldas.com',
    phone: 'N/A',
    address: 'ISKCON Chowpatty, Mumbai, Maharashtra, India',
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
    email: 's.malhotra@maxhealthcare.com',
    phone: '+91 11 2651 5050',
    address: 'Max Super Speciality Hospital, Saket, New Delhi, India',
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
    email: 'info@deepikachopra.com',
    phone: 'N/A',
    address: 'Los Angeles, California, USA',
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
    email: 'info@lukecoutinho.com',
    phone: '+91 22 6625 2000',
    address: 'Mumbai, Maharashtra, India',
  }
];

type Expert = typeof experts[0];

export default function MarketplacePage() {
    const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

    return (
        <>
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
                                    <Button className="w-full" onClick={() => setSelectedExpert(expert)}>Book a Session</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </main>
        
        {selectedExpert && (
            <AlertDialog open={!!selectedExpert} onOpenChange={(open) => !open && setSelectedExpert(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Contact {selectedExpert.name}</AlertDialogTitle>
                        <AlertDialogDescription>
                            You can reach out to {selectedExpert.name} using the details below to schedule your session.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex items-start gap-4">
                            <Mail className="w-5 h-5 mt-1 text-primary shrink-0"/>
                            <div>
                                <h4 className="font-semibold">Email</h4>
                                <a href={`mailto:${selectedExpert.email}`} className="text-muted-foreground underline hover:text-primary transition-colors">{selectedExpert.email}</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Phone className="w-5 h-5 mt-1 text-primary shrink-0"/>
                            <div>
                                <h4 className="font-semibold">Phone</h4>
                                <p className="text-muted-foreground">{selectedExpert.phone}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <MapPin className="w-5 h-5 mt-1 text-primary shrink-0"/>
                            <div>
                                <h4 className="font-semibold">Address</h4>
                                <p className="text-muted-foreground">{selectedExpert.address}</p>
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        </>
    );
}
