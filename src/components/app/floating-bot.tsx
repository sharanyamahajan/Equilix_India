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
import { chat } from '@/app/actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


type Message = {
  role: 'user' | 'model';
  content: string;
};

const initialMessages: Message[] = [
  {
    role: 'model',
    content:
      "Hello! 👋 I am **Nova**, your smart AI companion. How can I assist you today?",
  },
];

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    startTransition(async () => {
        try {
            const chatHistory = messages.map((msg) => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            }));
    
            const result = await chat({ history: chatHistory, message: currentInput });
    
            if (result && result.data) {
                const modelMessage: Message = {
                role: 'model',
                content: result.data.response,
                };
                setMessages((prev) => [...prev, modelMessage]);
            } else {
                 throw new Error(result.error || "Unknown AI error");
            }
        } catch (error) {
            console.error('Nova error:', error);
            const errorMessage: Message = {
                role: 'model',
                content:
                '⚠️ Sorry, I ran into a problem. Please try again in a moment.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    });
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setMessages(initialMessages);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        size="icon"
      >
        <Bot className="h-8 w-8" />
        <span className="sr-only">Open Nova Bot</span>
      </Button>

      {/* Sliding Chat Window */}
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Nova - Your AI Friend</SheetTitle>
            <SheetDescription>
              Ask me anything! I can help with information, guidance,
              or just chat with you.
            </SheetDescription>
          </SheetHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 my-4 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-secondary">
                        <Bot className="h-5 w-5 text-secondary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-lg p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-full" remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-secondary">
                      <Bot className="h-5 w-5 text-secondary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3 flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Box */}
          <SheetFooter>
            <div className="flex w-full items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSend()
                }
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
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
