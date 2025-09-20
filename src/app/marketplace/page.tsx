'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function MarketplacePage() {
    return (
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
             <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                        Expert Marketplace
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                       Connect with therapists, coaches, and join exclusive wellness workshops.
                    </p>
                </section>

                <Card className="shadow-lg shadow-accent/5 border-none bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl md:text-3xl">Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                        <Store className="w-16 h-16 mx-auto text-accent/50 mb-4" />
                        <p>This feature is currently under development.</p>
                        <p>You'll soon be able to book sessions with experts, join workshops, and access premium content.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
