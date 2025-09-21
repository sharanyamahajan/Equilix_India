'use client';

import { getAIFriendResponse } from '@/app/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Loader2, Play, Send, User } from 'lucide-react';
import React, { useState, useRef, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';

type Message = {
  role: 'user' | 'model';
  text: string;
  audio?: string;
};

const initialMessages: Message[] = [
  {
    role: 'model',
    text: "Hi — I'm Aura. How are you feeling today?",
  },
];

export default function AIFriendPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isGenerating, startGenerating] = useTransition();
  const [isClient, setIsClient] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch(e => {
            console.error("Audio playback failed:", e);
            toast({
                title: "Playback Error",
                description: "Could not play audio. Please try again.",
                variant: 'destructive',
            })
        });
    }
  };

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');

    startGenerating(async () => {
      const history = newMessages.slice(0, -1).map(({ role, text }) => ({ role, text }));
      const result = await getAIFriendResponse({ history, message: currentInput });

      if (result.success && result.data) {
        const modelMessage: Message = {
          role: 'model',
          text: result.data.reply,
          audio: result.data.audio,
        };
        setMessages(prev => [...prev, modelMessage]);
        if (result.data.audio) {
          playAudio(result.data.audio);
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || "I couldn't generate a response. Please try again.",
          variant: 'destructive',
        });
        setMessages(messages); // Revert to previous state on error
      }
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages, isGenerating]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-grow container mx-auto px-4 py-24 md:py-16 flex justify-center items-center">
        <Card className="w-full max-w-2xl shadow-2xl shadow-primary/10 flex flex-col h-[80vh]">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Aura</CardTitle>
                <CardDescription>Your personal AI companion</CardDescription>
            </CardHeader>

            <ScrollArea className="flex-1 my-4 pr-4" ref={scrollAreaRef}>
                <div className="space-y-6 p-4">
                    {messages.map((message, index) => (
                        <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                            {message.role === 'model' && (
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback className="bg-secondary"><Bot className="h-5 w-5" /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn('max-w-md rounded-lg p-3 text-sm flex items-center gap-2', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                                <p>{message.text}</p>
                                {message.role === 'model' && message.audio && (
                                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => playAudio(message.audio!)}>
                                        <Play className="h-4 w-4"/>
                                    </Button>
                                )}
                            </div>
                             {message.role === 'user' && (
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex items-start gap-3 justify-start">
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback className="bg-secondary"><Bot className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3 flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <CardContent className="border-t pt-6">
                <div className="flex w-full items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message to Aura..."
                        disabled={isGenerating}
                        className="text-base"
                    />
                    <Button size="icon" onClick={handleSend} disabled={isGenerating || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
      </main>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
