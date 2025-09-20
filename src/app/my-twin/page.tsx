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
import { Loader2, Wand2, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createAITwin } from '@/app/actions';
import { Separator } from '@/components/ui/separator';

const twinSchema = z.object({
  personality: z.string().min(20, "Please describe the personality in at least 20 characters.").max(500, "The description must be 500 characters or less."),
});

export default function MyTwinPage() {
  const [isPending, startTransition] = useTransition();
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof twinSchema>>({
    resolver: zodResolver(twinSchema),
    defaultValues: {
      personality: '',
    },
  });

  const onSubmit = (values: z.infer<typeof twinSchema>) => {
    startTransition(async () => {
        setGeneratedPrompt(null);
        const result = await createAITwin({ personalityDescription: values.personality });

        if (result.success && result.data) {
            setGeneratedPrompt(result.data.systemPrompt);
            // In a real app, we would save this to user settings.
            // For this demo, we'll store it in localStorage.
            localStorage.setItem('aiTwinSystemPrompt', result.data.systemPrompt);
            toast({
                title: "AI Twin Created!",
                description: "Your personalized AI companion is now ready. Try chatting with it!",
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

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                 <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    Create Your AI Twin
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 font-light tracking-wide">
                    Define the personality of your AI companion. It will learn to think, respond, and interact just like you'd want it to.
                </p>
            </div>

            <Card className="shadow-lg shadow-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <User className="text-primary w-6 h-6" />
                        Define Your Twin's Personality
                    </CardTitle>
                    <CardDescription>
                        Describe the core traits of your ideal AI companion. Is it witty, serious, empathetic, or something else entirely?
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
                                className="min-h-[120px] resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            {isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                            ) : (
                                <><Wand2 className="mr-2 h-4 w-4" /> Create AI Twin</>
                            )}
                        </Button>
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