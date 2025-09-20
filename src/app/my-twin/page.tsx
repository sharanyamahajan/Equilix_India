// src/app/my-twin/page.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, User, Bot, BookCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createAITwin, learnFromJournal } from '@/app/actions';

const twinSchema = z.object({
  personality: z.string().min(20, "Please describe the personality in at least 20 characters.").max(1000, "The description must be 1000 characters or less."),
});

// Sample journal entries for the demo
const sampleJournalEntries = [
    "Feeling a bit overwhelmed with the new project at work, but also excited about the challenge. It's a classic case of stress and opportunity walking hand-in-hand. Trying to remind myself to take it one day at a time.",
    "Spent the weekend hiking. The silence of the forest is always so calming. It helps me clear my head and puts things into perspective. I think nature is my ultimate reset button.",
    "Had a really interesting conversation with a friend about the future of AI. It's both fascinating and slightly terrifying. I lean towards optimism, but it's hard to ignore the potential downsides. We need to be thoughtful about how we build it.",
    "Reflecting on my goals for this quarter. I'm proud of the progress I've made, but I also see where I've been procrastinating. Need to find a better balance between being kind to myself and holding myself accountable."
];

export default function MyTwinPage() {
  const [isGenerating, startGenerating] = useTransition();
  const [isLearning, startLearning] = useTransition();
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof twinSchema>>({
    resolver: zodResolver(twinSchema),
    defaultValues: {
      personality: '',
    },
  });

  const onSubmit = (values: z.infer<typeof twinSchema>) => {
    startGenerating(async () => {
        setGeneratedPrompt(null);
        const result = await createAITwin({ personalityDescription: values.personality });

        if (result.success && result.data) {
            setGeneratedPrompt(result.data.systemPrompt);
            localStorage.setItem('aiTwinSystemPrompt', result.data.systemPrompt);
            toast({
                title: "AI Twin Persona Created!",
                description: "Your personalized AI companion's personality has been updated.",
            });
        } else {
            toast({
                title: "Creation Failed",
                description: "We couldn't create your AI Twin at this time. Please try again.",
                variant: "destructive",
            });
        }
    });
  };

  const handleLearnFromJournal = () => {
    startLearning(async () => {
        const result = await learnFromJournal({ journalEntries: sampleJournalEntries });
        if (result.success && result.data) {
            form.setValue('personality', result.data.personalityDescription);
            toast({
                title: "Learning Complete",
                description: "I've analyzed the journal entries and drafted a personality. Feel free to refine it!",
            });
        } else {
            toast({
                title: "Learning Failed",
                description: result.error || "Could not learn from journal entries.",
                variant: "destructive",
            });
        }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                 <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    Create Your AI Twin
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 font-light tracking-wide">
                    Craft the perfect AI companion. Define its personality yourself, or let it learn from your writing to create a true digital twin.
                </p>
            </div>

            <Card className="shadow-lg shadow-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <User className="text-primary w-6 h-6" />
                        Define Your Twin's Personality
                    </CardTitle>
                    <CardDescription>
                        Describe the core traits of your ideal AI companion, or let it learn from your journal entries.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="personality"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Personality Description</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="e.g., 'A calm, wise mentor who is incredibly patient and always offers philosophical insights. They have a dry sense of humor and love to use metaphors related to nature.'"
                                className="min-h-[150px] resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                             <Button onClick={handleLearnFromJournal} type="button" variant="outline" disabled={isLearning || isGenerating} className="w-full">
                                {isLearning ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Learning...</>
                                ) : (
                                    <><BookCopy className="mr-2 h-4 w-4" /> Learn from Journal</>
                                )}
                            </Button>
                            <Button type="submit" disabled={isGenerating || isLearning} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                {isGenerating ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Persona...</>
                                ) : (
                                    <><Wand2 className="mr-2 h-4 w-4" /> Create AI Persona</>
                                )}
                            </Button>
                        </div>
                    </form>
                    </Form>
                </CardContent>
            </Card>

            {generatedPrompt && (
                 <Card className="animate-in fade-in-50 duration-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Bot className="text-accent w-6 h-6" />
                            Generated AI Persona
                        </CardTitle>
                        <CardDescription>
                           This is the new "system prompt" for your AI twin. It will now use this persona in your conversations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-secondary/50 p-4 rounded-md text-sm text-secondary-foreground font-mono whitespace-pre-wrap">
                            {generatedPrompt}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </main>
    </div>
  );
}
