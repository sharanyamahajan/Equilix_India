'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { getWellnessAnalysis } from '@/app/actions';
import type { WellnessSurveyInput, WellnessAnalysisOutput } from '@/ai/schemas/wellness';
import { WellnessAnalysis } from './wellness-analysis';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit } from 'lucide-react';

const surveySchema = z.object({
  age: z.coerce.number().min(13, "You must be at least 13 years old.").max(120),
  mood: z.number().min(0).max(100),
  thoughts: z.string().min(10, "Please share a bit more about what's on your mind.").max(1000),
});

export function WellnessSurvey() {
  const [analysis, setAnalysis] = useState<WellnessAnalysisOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof surveySchema>>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      age: '' as any,
      mood: 50,
      thoughts: '',
    },
  });

  const onSubmit = (values: z.infer<typeof surveySchema>) => {
    startTransition(async () => {
      const surveyData: WellnessSurveyInput = {
        age: values.age,
        mood: values.mood,
        thoughts: values.thoughts,
      };
      const result = await getWellnessAnalysis(surveyData);

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        toast({
          title: "Analysis Failed",
          description: "We couldn't generate your wellness analysis at this time. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };
  
  if (isPending) {
    return (
       <Card className="min-h-[400px] flex flex-col items-center justify-center bg-transparent">
        <CardHeader className="items-center text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <CardTitle>Analyzing your input...</CardTitle>
            <CardDescription>Our AI is preparing your personalized feedback.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (analysis) {
    return <WellnessAnalysis analysis={analysis} onReset={() => {
        setAnalysis(null);
        form.reset({ age: '' as any, mood: 50, thoughts: '' });
    }} />;
  }

  return (
    <Card className="shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <BrainCircuit className="w-6 h-6" />
          </span>
          Daily Wellness Check-in
        </CardTitle>
        <CardDescription>
          Take a moment to reflect. Your answers are private and secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your age?</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 25" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>On a scale of 1 to 100, how are you feeling?</FormLabel>
                   <FormControl>
                     <Slider
                        value={[field.value]}
                        max={100}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                  </FormControl>
                   <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not Good</span>
                    <span>Okay</span>
                    <span>Great</span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thoughts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's on your mind?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you've been thinking about lately... The more detail, the better the analysis."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isPending ? 'Analyzing...' : 'Get My AI Analysis'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
