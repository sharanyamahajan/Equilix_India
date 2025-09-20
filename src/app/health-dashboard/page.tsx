'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function HealthDashboardPage() {
    return (
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
             <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                        Health Dashboard
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                       AI-powered insights into your wellness trends and potential risks.
                    </p>
                </section>

                <Card className="shadow-lg shadow-primary/5 border-none bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl md:text-3xl">Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                        <AlertCircle className="w-16 h-16 mx-auto text-primary/50 mb-4" />
                        <p>This feature is currently under development.</p>
                        <p>Soon, you'll be able to see personalized trends, risk predictions, and proactive wellness recommendations here.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
