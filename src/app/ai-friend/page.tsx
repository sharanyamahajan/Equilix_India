// Renaming this page to story-generator in a future step
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateStory } from '@/app/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const storySchema = z.object({
  prompt: z.string().min(10, "Please enter a prompt of at least 10 characters.").max(500, "The prompt must be 500 characters or less."),
  genre: z.string(),
});

const genres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Adventure', 'Fable'];

export default function StoryGeneratorPage() {
  const [isGenerating, startGenerating] = useTransition();
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof storySchema>>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      prompt: '',
      genre: 'Fantasy',
    },
  });

  const onSubmit = (values: z.infer<typeof storySchema>) => {
    startGenerating(async () => {
        setGeneratedStory(null);
        const result = await generateStory({
            prompt: values.prompt,
            genre: values.genre,
        });

        if (result.success && result.data) {
            setGeneratedStory(result.data.story);
            toast({
                title: "Your Story is Ready!",
                description: "A new tale has been woven for you.",
            });
        } else {
            toast({
                title: "Generation Failed",
                description: "We couldn't create your story at this time. Please try again.",
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
                    AI Story Generator
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 font-light tracking-wide">
                    Craft a unique story from your imagination. Provide a prompt and let the AI bring it to life.
                </p>
            </div>

            <Card className="shadow-lg shadow-primary/5 bg-secondary/30 border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Wand2 className="text-primary w-6 h-6" />
                        Create Your Story
                    </CardTitle>
                    <CardDescription>
                       Choose a genre and write a prompt to start the magic.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="genre"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Genre</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a genre" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {genres.map(genre => (
                                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Story Prompt</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="e.g., 'A young librarian discovers a book that writes itself...'"
                                className="min-h-[120px] resize-none bg-background"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isGenerating} className="w-full">
                            {isGenerating ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Story...</>
                            ) : (
                                <><Sparkles className="mr-2 h-4 w-4" /> Generate Story</>
                            )}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>

            {isGenerating && (
                <Card className="min-h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                    <p className="font-semibold">Weaving your tale...</p>
                </Card>
            )}

            {generatedStory && (
                 <Card className="animate-in fade-in-50 duration-500 bg-secondary/30 border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Sparkles className="text-accent w-6 h-6" />
                            Your Generated Story
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-background/50 p-6 rounded-md text-base text-secondary-foreground whitespace-pre-wrap leading-relaxed">
                            {generatedStory}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </main>
    </div>
  );
}
