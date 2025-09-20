'use client';

import { NavBar } from '@/components/app/nav-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Shield, Heart, Lightbulb, Rocket } from 'lucide-react';

const principles = [
  {
    icon: Shield,
    title: 'Absolute Confidentiality',
    description: 'Your privacy is our highest priority. All conversations are anonymous and encrypted. We have a zero-knowledge policy. Trust is our foundation.',
  },
  {
    icon: Heart,
    title: 'Proactive Empathy',
    description: "Our AI is trained on active listening and non-judgment. It's designed to validate feelings and offer gentle, supportive guidance, not to give orders or medical advice.",
  },
  {
    icon: Lightbulb,
    title: 'A Bridge, Not a Replacement',
    description: 'We believe in human connection. Our tool helps you feel heard and builds confidence to seek help from qualified professionals when you are ready.',
  },
  {
    icon: Rocket,
    title: 'Ethical and Safe',
    description: 'Our system includes a robust safety layer to detect crisis situations and provide immediate links to human support, such as national helplines. We are committed to responsible innovation.',
  },
];


export default function AboutPage() {
    return (
        <>
            <NavBar />
            <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
                 <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
                    <section className="text-center fade-in-section is-visible">
                        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                            About Equilix
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                           Our mission is to empower youth with a confidential and empathetic guide to wellness.
                        </p>
                    </section>

                    <section className="fade-in-section is-visible" style={{animationDelay: '200ms'}}>
                        <Card className="shadow-lg shadow-primary/5">
                            <CardHeader>
                                <CardTitle>Our Core Principles</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-8">
                                {principles.map((p, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="text-primary pt-1">
                                            <p.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{p.title}</h3>
                                            <p className="text-muted-foreground text-sm">{p.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>

                     <section className="text-center fade-in-section is-visible" style={{animationDelay: '400ms'}}>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet the Team</h2>
                        <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-8">
                            <div className="text-center">
                                <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-primary/20">
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        <Users />
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold">Sharanya & Anannya Mahajan</h3>
                                <p className="text-muted-foreground">Founders & Visionaries</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
