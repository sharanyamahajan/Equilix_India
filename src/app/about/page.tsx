'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Shield, Heart, Lightbulb, Rocket, Store, LifeBuoy, ShoppingBag, Target, ShieldCheck, Gamepad2, Briefcase, Sparkles, UserCheck } from 'lucide-react';

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

const roadmap = [
    {
        icon: Target,
        title: 'Personalized AI Care Pathways',
        description: 'Instead of just offering random tools, we build personalized journeys (stress relief, focus boost, sleep improvement, trauma healing). The AI adapts the path daily based on mood and emotion scans.',
        investorHook: 'Stickiness, personalization, high engagement.'
    },
    {
        icon: UserCheck,
        title: 'Early Detection & Risk Prediction',
        description: 'We use mood data, journaling, and behavior patterns to predict early signs of anxiety, depression, or burnout, and provide proactive nudges or recommend professional help.',
        investorHook: 'Potential for partnerships with insurance, healthcare, and corporates.'
    },
    {
        icon: Gamepad2,
        title: 'Gamified Engagement',
        description: 'Daily streaks, milestones, and leaderboards (anonymous) keep users motivated. Unlockable content (like Spotify Wrapped, but “Your Mental Wellness Journey 2025”).',
        investorHook: 'Engagement loop = user retention = revenue.'
    },
    {
        icon: Briefcase,
        title: 'Corporate Wellness Dashboard (B2B SaaS Angle)',
        description: 'Sell to companies → anonymous stress/mood reports. Helps HR measure team burnout, productivity risks.',
        investorHook: 'Scalable, repeatable, big TAM (corporate wellness).'
    },
    {
        icon: Sparkles,
        title: 'Cultural Differentiation',
        description: 'Calm & Headspace don’t have mantra chanting. AI Pronunciation + Digital Mala = local edge + global curiosity.',
        investorHook: 'Differentiation in a crowded market.'
    },
    {
        icon: ShieldCheck,
        title: 'Safe Community with AI Moderation',
        description: 'Anonymous peer-support forums. AI moderation to avoid triggering or harmful content.',
        investorHook: 'Scalable community → network effect → moat.'
    },
     {
        icon: Store,
        title: 'Marketplace for Mental Health Services',
        description: 'Premium experts (therapists, yoga teachers, coaches). Paid workshops (stress management, chanting retreats, sleep clinics).',
        investorHook: 'Extra revenue streams beyond subscription.'
    }
]


export default function AboutPage() {
    return (
        <>
            <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
                 <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
                    <section className="text-center">
                        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                            About Equilix
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                           Our mission is to empower youth with a confidential and empathetic guide to wellness.
                        </p>
                    </section>

                    <section>
                        <Card className="shadow-lg shadow-primary/5 border-none bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="text-center text-2xl md:text-3xl">Our Core Principles</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-8">
                                {principles.map((p, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="text-primary p-2 bg-primary/10 rounded-full">
                                            <p.icon className="w-6 h-6" />
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
                    
                    <section>
                        <Card className="shadow-lg shadow-primary/5 border-none bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="text-center text-2xl md:text-3xl">Our Roadmap & Vision</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-6">
                                    {roadmap.map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-6 p-4 rounded-lg bg-background/30 border border-border/50">
                                            <div className="flex-shrink-0 text-primary pt-1">
                                                <item.icon className="w-8 h-8 mx-auto sm:mx-0" />
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                                                <p className="text-xs text-primary/80 font-semibold mt-2 tracking-wide">👉 For Investors: <span className="italic">{item.investorHook}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center bg-background/50 border-l-4 border-primary p-4 rounded-r-lg">
                                    <p className="font-semibold italic text-primary-foreground">
                                        “We’re building not just an app, but an ecosystem — with marketplaces, partnerships, and multiple monetization streams.”
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                     <section className="text-center">
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
