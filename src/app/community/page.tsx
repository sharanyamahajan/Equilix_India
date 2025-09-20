
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Heart, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const forumCategories = [
    { title: 'General Discussion', description: 'Talk about anything on your mind.', icon: MessageSquare },
    { title: 'Success Stories', description: 'Share your progress and inspire others.', icon: Heart },
    { title: 'Ask for Advice', description: 'Seek guidance from the community.', icon: Users },
];

const supportGroups = [
    { title: 'Anxiety Support', imageHint: 'calm nature' },
    { title: 'Student & Academic Stress', imageHint: 'books library' },
    { title: 'Workplace Burnout', imageHint: 'office stress' },
];

const whatsAppGroupLink = "https://chat.whatsapp.com/BUwjfL9ee6g7rWQ3h5hSen?mode=ems_wa_t";

export default function CommunityPage() {
    return (
        <main className="flex-grow container mx-auto px-4 pt-28 pb-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                        Community Hub
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                       Connect with a supportive community. You are not alone.
                    </p>
                </section>

                <Card className="bg-secondary/30 border-none shadow-lg shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="text-2xl">Community Forums</CardTitle>
                        <CardDescription>Engage in conversations, share experiences, and find support.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        {forumCategories.map(cat => (
                            <Link key={cat.title} href={whatsAppGroupLink} target="_blank" rel="noopener noreferrer">
                                <Card className="hover:bg-secondary/50 transition-colors h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <cat.icon className="w-6 h-6 text-primary"/>
                                            <CardTitle className="text-lg">{cat.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
                
                 <Card className="bg-secondary/30 border-none shadow-lg shadow-accent/5">
                    <CardHeader>
                        <CardTitle className="text-2xl">Support Groups</CardTitle>
                        <CardDescription>Join small, private groups focused on specific topics, led by community moderators.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        {supportGroups.map(group => (
                            <div key={group.title} className="relative group overflow-hidden rounded-lg">
                                <Image
                                    src={`https://picsum.photos/seed/${group.title.replace(/\s/g, '')}/400/300`}
                                    alt={group.title}
                                    width={400}
                                    height={300}
                                    data-ai-hint={group.imageHint}
                                    className="object-cover w-full h-40 transform transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                                    <h3 className="text-white font-bold text-lg">{group.title}</h3>
                                </div>
                                <Button asChild className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" size="sm">
                                    <Link href={whatsAppGroupLink} target="_blank" rel="noopener noreferrer">Join</Link>
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                            <Shield className="w-8 h-8" />
                        </div>
                        <CardTitle className="mt-2">A Safe and Moderated Space</CardTitle>
                        <CardDescription className="max-w-xl mx-auto">
                            Our community is built on kindness and respect. All interactions are monitored by our team and AI to ensure a safe and supportive environment for everyone.
                        </CardDescription>
                    </CardHeader>
                </Card>

            </div>
        </main>
    );
}
