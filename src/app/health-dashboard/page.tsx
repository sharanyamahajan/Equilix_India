'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Heart, Activity, TrendingUp, BarChart, Camera } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type HealthData = {
  date: string;
  stress: number | null;
  bp: number | null;
};

const initialChartData: HealthData[] = dayNames.map(day => ({
  date: day,
  stress: null,
  bp: null,
}));

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
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    const [chartData, setChartData] = useState<HealthData[]>(initialChartData);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [stressInput, setStressInput] = useState('');
    const [bpInput, setBpInput] = useState('');

    useEffect(() => {
        setIsClient(true);
        try {
            const storedData = localStorage.getItem('healthDashboardData');
            if (storedData) {
                setChartData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Failed to parse health data from localStorage", error);
            localStorage.removeItem('healthDashboardData');
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('healthDashboardData', JSON.stringify(chartData));
        }
    }, [chartData, isClient]);

    const handleAddData = () => {
        const stress = parseInt(stressInput, 10);
        const bp = parseInt(bpInput, 10);

        if (isNaN(stress) || isNaN(bp) || stress < 0 || stress > 100 || bp < 60 || bp > 200) {
            toast({
                title: "Invalid Input",
                description: "Please enter valid numbers. Stress (0-100), BP (60-200).",
                variant: "destructive",
            });
            return;
        }

        const newData = [...chartData];
        newData[currentDayIndex] = { ...newData[currentDayIndex], stress, bp };
        setChartData(newData);
        
        toast({
            title: "Data Added!",
            description: `Metrics for ${dayNames[currentDayIndex]} have been updated.`,
        });

        setCurrentDayIndex((prev) => (prev + 1) % dayNames.length);
        setStressInput('');
        setBpInput('');
    };

    const hasData = chartData.some(d => d.stress !== null && d.bp !== null);
    const lastEntry = [...chartData].reverse().find(d => d.stress !== null && d.bp !== null);

    const getRiskLevel = (stress: number | null, bp: number | null) => {
        if (!stress || !bp) return { label: 'N/A', variant: 'secondary', description: 'Enter data to see your risk level.' };
        if (bp > 140 || stress > 75) return { label: 'High', variant: 'destructive', description: 'Your recent metrics indicate a high-risk level. It is highly recommended to consult a professional.' };
        if (bp > 130 || stress > 60) return { label: 'Elevated', variant: 'default', description: 'Your metrics are elevated. Consider mindfulness exercises and monitor your diet.'};
        return { label: 'Normal', variant: 'secondary', description: 'Your metrics are within a normal range. Keep up the healthy habits!' };
    };

    const risk = getRiskLevel(lastEntry?.stress ?? null, lastEntry?.bp ?? null);

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
                
                <Card>
                    <CardHeader>
                        <CardTitle>Log Your Daily Metrics</CardTitle>
                        <CardDescription>Enter your stress and blood pressure for today, <strong>{dayNames[currentDayIndex]}</strong>.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                           <Label htmlFor="stress-input">Stress Level (0-100)</Label>
                           <div className="flex gap-2">
                            <Input id="stress-input" type="number" value={stressInput} onChange={(e) => setStressInput(e.target.value)} placeholder="e.g. 68" />
                            <Button asChild variant="outline" size="icon" title="Auto-detect Stress">
                                <Link href="/stress-detector">
                                    <Camera className="w-4 h-4" />
                                </Link>
                            </Button>
                           </div>
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="bp-input">Systolic BP (mmHg)</Label>
                           <Input id="bp-input" type="number" value={bpInput} onChange={(e) => setBpInput(e.target.value)} placeholder="e.g. 135" />
                        </div>
                        <Button onClick={handleAddData} className="self-end">Add Today's Data</Button>
                    </CardContent>
                </Card>

                {hasData ? (
                    <>
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
                                        Latest Snapshot
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="flex justify-around">
                                        <div>
                                            <p className="text-3xl font-bold">{lastEntry?.stress ?? 'N/A'}</p>
                                            <p className="text-sm text-muted-foreground">Stress Level</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold">{lastEntry?.bp ?? 'N/A'} <span className="text-lg text-muted-foreground">mmHg</span></p>
                                            <p className="text-sm text-muted-foreground">Blood Pressure</p>
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
                                            domain={[60, 200]}
                                         />
                                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Area yAxisId="left" type="monotone" dataKey="bp" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" name="Blood Pressure" connectNulls />
                                        <Area yAxisId="right" type="monotone" dataKey="stress" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.1)" name="Stress" connectNulls />
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
                                     Your stress levels seem to fluctuate. Consider exploring what might have caused any spikes in your journal.
                                   </AlertDescription>
                                </Alert>
                                 <Alert>
                                   <Heart className="h-4 w-4" />
                                   <AlertTitle>Hypertension Risk</AlertTitle>
                                   <AlertDescription>
                                    If your blood pressure is consistently elevated, we recommend the 'Mindful Breathing' exercise to help manage it.
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
                    </>
                ) : (
                    <Card className="flex flex-col items-center justify-center text-center p-12 space-y-4">
                         <BarChart className="w-16 h-16 text-muted-foreground"/>
                         <CardTitle>No Data Yet</CardTitle>
                         <CardDescription>Log your first set of metrics above to see your dashboard.</CardDescription>
                    </Card>
                )}
            </div>
        </main>
    );
}
