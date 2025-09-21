
'use client';

import { useState, useRef, useEffect, useTransition, Fragment } from 'react';
import { getAIFriendResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Bot, Loader2, Send, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const novaSystemPrompt = `You are Nova, a friendly and efficient AI assistant for the Equilix app. Your primary role is to help users navigate the application and understand its features. You are knowledgeable, concise, and slightly more direct than Aura. Your goal is to provide clear, helpful answers. You can navigate users to different pages if they ask. Do not give medical advice.`;

const initialMessages: Message[] = [
    {
        role: 'model',
        text: "Hello! I'm Nova, your guide to the Equilix app. How can I help you today?"
    }
];

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if(isOpen) { // If was open, now closing
      setMessages(initialMessages);
      setInput('');
    }
  };


  const handleSend = () => {
    if (!input.trim() || isPending) return;

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
            const errorMessage: Message = {
              role: 'model',
              text: response.error || 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
            toast({
                title: 'Error',
                description: response.error,
                variant: 'destructive',
            })
        }
    });
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl z-[1000] transition-transform transform hover:scale-110"
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? <X/> : '💬'}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 w-[350px] max-w-[90vw] h-[500px] max-h-[80vh] bg-card rounded-2xl shadow-xl flex flex-col z-[1000] overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
          <header className="bg-primary text-primary-foreground font-semibold p-3 text-center">
            Nova - Your Assistant
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
               <div key={i} className={cn("flex items-end gap-2", msg.role === 'user' ? "justify-end" : "justify-start")}>
                 {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0"><Bot size={20}/></div>}
                 <div className={cn(
                    "max-w-[80%] px-3 py-2 rounded-xl text-sm",
                    msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary text-secondary-foreground rounded-bl-none"
                  )}>
                    {msg.text}
                 </div>
                 {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-secondary/80 text-secondary-foreground flex items-center justify-center shrink-0"><User size={20}/></div>}
              </div>
            ))}
             {isPending && (
                <div className="flex items-end gap-2 justify-start">
                     <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0"><Bot size={20}/></div>
                     <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm bg-secondary text-secondary-foreground rounded-bl-none flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin"/>
                     </div>
                </div>
             )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex border-t p-2 gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 p-2 outline-none text-sm bg-background"
              disabled={isPending}
            />
            <Button
              onClick={handleSend}
              className="px-4 transition-colors"
              disabled={isPending || !input.trim()}
              aria-label="Send Message"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
