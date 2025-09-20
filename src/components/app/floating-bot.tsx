'use client';
import { useState, useRef, useEffect } from 'react';
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
import { Bot, Loader2, Send, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chat } from '@/app/actions';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const initialMessages: Message[] = [
    {
        role: 'model',
        content: "Hello! I am the Swasthya Raksha Assistant. How can I help you today? You can ask me about water-borne diseases, public health, or how to use this app."
    }
];

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));
      const result = await chat({ history: chatHistory, message: currentInput });
      
      if (result.success && result.data) {
        const modelMessage: Message = { role: 'model', content: result.data.response };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        throw new Error(result.error || "Failed to get response from chat bot.");
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
            <SheetTitle>Swasthya Raksha Assistant</SheetTitle>
            <SheetDescription>
              Ask me questions about water-borne diseases or the app.
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
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-full">
                        {message.content}
                    </ReactMarkdown>
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
               {isLoading && (
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
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
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
