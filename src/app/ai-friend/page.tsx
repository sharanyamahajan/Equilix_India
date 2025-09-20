'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Loader2, Mic, MicOff, PhoneOff, Send, User, Video, VideoOff, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAIFriendResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const initialMessages: Message[] = [
    {
        role: 'model',
        text: "Hello! It's wonderful to connect with you. How are you feeling today?"
    }
];

export default function AIFriendPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [aiSystemPrompt, setAiSystemPrompt] = useState<string | undefined>(undefined);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const customPrompt = localStorage.getItem('aiTwinSystemPrompt');
    if (customPrompt) {
        setAiSystemPrompt(customPrompt);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    startTransition(async () => {
        const response = await getAIFriendResponse({
          history: messages,
          message: currentInput,
          systemPrompt: aiSystemPrompt,
        });
        
        if (response.success && response.data) {
          const modelMessage: Message = { role: 'model', text: response.data.reply };
          setMessages((prev) => [...prev, modelMessage]);

          if (response.data.toolCalls) {
            for (const toolCall of response.data.toolCalls) {
              if (toolCall.toolName === 'navigation' && toolCall.args.path) {
                router.push(toolCall.args.path as string);
              }
            }
          }

        } else {
            console.error('AI Friend error:', response.error);
            const errorMessage: Message = {
              role: 'model',
              text: response.error || 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('div:first-child');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-grow container mx-auto px-4 pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center mb-8">
                 <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    AI Friend
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 font-light tracking-wide">
                    A friendly, face-to-face chat with Aura.
                </p>
            </div>

            <Card className="h-[70vh] flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-primary/10">
              {/* "Video Call" Section */}
              <div className="md:w-3/5 bg-secondary/40 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                   <motion.div 
                        className="absolute w-64 h-64 bg-primary/20 rounded-full"
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.7, 0.9, 0.7],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                     <motion.div 
                        className="absolute w-80 h-80 bg-accent/10 rounded-full"
                        animate={{
                            scale: [1, 0.98, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                   <Avatar className="w-48 h-48 mb-4 ring-4 ring-primary/20 relative z-10">
                        <AvatarFallback className="text-6xl bg-primary/10 text-primary">
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold z-10">Aura</h2>
                    <p className="text-muted-foreground z-10">Connecting...</p>

                    {/* User's "Video" Preview */}
                     <Card className="absolute bottom-4 right-4 w-32 h-24 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground"/>
                        <p className="text-xs text-muted-foreground mt-1">You</p>
                    </Card>
              </div>
              
              {/* Chat Section */}
              <div className="md:w-2/5 flex flex-col bg-secondary/20">
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="p-4 border-b flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold">Conversation</h3>
                    </div>
                    <ScrollArea className="flex-1 my-2 px-4" ref={scrollAreaRef}>
                    <div className="space-y-4 pr-4">
                        {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                            'flex items-start gap-2 text-xs',
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.role === 'model' && (
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs"><Bot className="h-3 w-3" /></AvatarFallback>
                            </Avatar>
                            )}
                            <div
                            className={cn(
                                'max-w-md rounded-lg p-2',
                                message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background'
                            )}
                            >
                            {message.text}
                            </div>
                        </div>
                        ))}
                        {isPending && (
                        <div className="flex items-start gap-2 justify-start">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs"><Bot className="h-3 w-3" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-background rounded-lg p-2 flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>
                            </div>
                        </div>
                        )}
                    </div>
                    </ScrollArea>

                    <div className="border-t p-2">
                    <div className="flex w-full items-center gap-2">
                        <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        disabled={isPending}
                        className="text-xs"
                        />
                        <Button onClick={handleSend} disabled={isPending || !input.trim()} size="sm">
                        <Send className="h-3 w-3" />
                        </Button>
                    </div>
                    </div>
                </CardContent>
              </div>
            </Card>

            <div className="flex justify-center items-center gap-4 mt-4">
                <Button variant={isMuted ? "secondary" : "outline"} size="icon" onClick={() => setIsMuted(!isMuted)}>
                   {isMuted ? <MicOff /> : <Mic />}
                </Button>
                 <Button variant={isVideoOff ? "secondary" : "outline"} size="icon" onClick={() => setIsVideoOff(!isVideoOff)}>
                    {isVideoOff ? <VideoOff /> : <Video />}
                </Button>
                <Button variant="destructive" size="lg" className="rounded-full px-8" onClick={() => router.push('/mode-selection')}>
                    <PhoneOff className="mr-2" /> End Call
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}
