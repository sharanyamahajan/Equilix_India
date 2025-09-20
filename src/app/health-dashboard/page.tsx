'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Heart, Activity, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Link from 'next/link';

const chartData = [
  { date: "Mon", stress: 68, bp: 135 },
  { date: "Tue", stress: 75, bp: 140 },
  { date: "Wed", stress: 50, bp: 125 },
  { date: "Thu", stress: 80, bp: 145 },
  { date: "Fri", stress: 60, bp: 130 },
  { date: "Sat", stress: 45, bp: 120 },
  { date: "Sun", stress: 55, bp: 128 },
];

const chartConfig = {
  stress: {
    label: "Stress Level",
    color: "hsl(var(--accent))",
  },
  bp: {
    label: "Blood Pressure (Systolic)",
    color: "hsl(var(--primary))",
  },
};


export default function HealthDashboardPage() {
    const currentStress = chartData[chartData.length - 1].stress;
    const currentBp = chartData[chartData.length - 1].bp;

    const getRiskLevel = (stress: number, bp: number) => {
        if (bp > 140 || stress > 75) return { label: 'High', variant: 'destructive', description: 'Your recent metrics indicate a high-risk level. It is highly recommended to consult a professional.' };
        if (bp > 130 || stress > 60) return { label: 'Elevated', variant: 'default', description: 'Your metrics are elevated. Consider mindfulness exercises and monitor your diet.'};
        return { label: 'Normal', variant: 'secondary', description: 'Your metrics are within a normal range. Keep up the healthy habits!' };
    }
    
    const risk = getRiskLevel(currentStress, currentBp);

    return (
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24">
             <div className="max-w-4xl mx-auto space-y-12 md:space-y-10">
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                        Health Dashboard
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                       AI-powered insights into your stress and hypertension risk.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="text-primary"/>
                                Current Risk Level
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                           <Badge variant={risk.variant} className="text-2xl px-4 py-2 mb-4">{risk.label}</Badge>
                           <p className="text-sm text-muted-foreground">{risk.description}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="text-accent" />
                                Weekly Snapshot
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="flex justify-around">
                                <div>
                                    <p className="text-3xl font-bold">{currentStress}</p>
                                    <p className="text-sm text-muted-foreground">Avg. Stress</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{currentBp} <span className="text-lg text-muted-foreground">mmHg</span></p>
                                    <p className="text-sm text-muted-foreground">Avg. BP</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                <Card className="shadow-lg shadow-primary/5 border-none bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">Wellness Trends</CardTitle>
                        <CardDescription>Your stress and blood pressure trends over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="w-full h-[300px]">
                         <ChartContainer config={chartConfig} className="w-full h-full">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                 <YAxis 
                                    yAxisId="left" 
                                    stroke="hsl(var(--primary))"
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickMargin={8}
                                    domain={[100, 160]}
                                 />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tickLine={false} axisLine={false} tickMargin={8} domain={[20, 100]} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area yAxisId="left" type="monotone" dataKey="bp" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" name="Blood Pressure" />
                                <Area yAxisId="right" type="monotone" dataKey="stress" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.1)" name="Stress" />
                            </AreaChart>
                        </ChartContainer>
                       </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Bot /> AI-Powered Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                           <Activity className="h-4 w-4" />
                           <AlertTitle>Actionable Insight</AlertTitle>
                           <AlertDescription>
                             Your stress levels peaked on Thursday. Consider exploring what might have caused this spike in your journal.
                           </AlertDescription>
                        </Alert>
                         <Alert>
                           <Heart className="h-4 w-4" />
                           <AlertTitle>Hypertension Risk</AlertTitle>
                           <AlertDescription>
                            Your blood pressure is consistently in the elevated range. We recommend the 'Mindful Breathing' exercise to help manage it.
                           </AlertDescription>
                        </Alert>
                        <div className="flex gap-4 pt-2">
                             <Button asChild>
                                <Link href="/breathing-exercise">
                                    Try Breathing Exercise <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="/journal">
                                    Go to Journal
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
