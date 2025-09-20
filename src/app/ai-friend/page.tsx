'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAIFriendResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const initialMessages: Message[] = [
    {
        role: 'model',
        text: "Hello! I am Aura, your personal AI companion. How can I help you today?"
    }
];

export default function AIFriendPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [aiSystemPrompt, setAiSystemPrompt] = useState<string | undefined>(undefined);

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
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                 <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    AI Friend
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 font-light tracking-wide">
                    Chat with Aura, your personal AI companion.
                </p>
            </div>

            <Card className="h-[60vh] flex flex-col">
              <CardContent className="p-0 flex-grow flex flex-col">
                <ScrollArea className="flex-1 my-4 px-4" ref={scrollAreaRef}>
                  <div className="space-y-4 pr-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-start gap-3',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'model' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-md rounded-lg p-3 text-sm',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          {message.text}
                        </div>
                        {message.role === 'user' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isPending && (
                      <div className="flex items-start gap-3 justify-start">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-lg p-3 flex items-center">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                          </div>
                      </div>
                      )}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex w-full items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      disabled={isPending}
                    />
                    <Button onClick={handleSend} disabled={isPending || !input.trim()}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
