'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAIFriendResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const novaSystemPrompt = `You are Nova, a friendly and efficient AI assistant for the Equilix app. Your primary role is to help users navigate the application and understand its features. You are knowledgeable, concise, and slightly more direct than Aura. Your goal is to provide clear, helpful answers. You can navigate users to different pages if they ask. Do not give medical advice.`;

const initialMessages: Message[] = [
    {
        role: 'model',
        text: "Hello! I am Nova, your guide to the Equilix app. How can I help you explore today?"
    }
];

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
          systemPrompt: novaSystemPrompt,
        });
        
        if (response.success && response.data) {
          const modelMessage: Message = { role: 'model', text: response.data.reply };
          setMessages((prev) => [...prev, modelMessage]);

          if (response.data.toolCalls) {
            for (const toolCall of response.data.toolCalls) {
              if (toolCall.toolName === 'navigation' && toolCall.args.path) {
                router.push(toolCall.args.path as string);
                setIsOpen(false);
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
  
  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && messages.length <= 1) { // Reset if only initial message is there
        setMessages(initialMessages);
    }
  }


  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('div:first-child');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-20"
        size="icon"
      >
        <Bot className="h-8 w-8" />
        <span className="sr-only">Open Chatbot</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Nova - Your AI Companion</SheetTitle>
            <SheetDescription>
              I'm here to listen and help you navigate the app.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 my-4 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
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
                      'max-w-xs rounded-lg p-3 text-sm',
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
          <SheetFooter>
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
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
