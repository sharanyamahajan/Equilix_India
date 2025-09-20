'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getAIFriendResponse } from '@/app/actions';
import { ScrollArea } from '../ui/scroll-area';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { role: 'model', text: "Hello! I'm Aura. How can I help you navigate the app or what's on your mind?" },
      ]);
    } else {
        setMessages([]);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');

    startTransition(async () => {
      const response = await getAIFriendResponse({
        history: messages,
        message: input,
        systemPrompt: `You are Aura, a helpful and friendly AI assistant for the Equilix app. Your goal is to assist users. You can chat with them, or if they ask to go to a specific page, you must use the navigation tool. Available pages are: Home, Dashboard, AI Friend, Marketplace, Community, About, Journal, Breathing Exercise, Emotion Scan, Mantra Chanting, My AI Twin. If you use the navigation tool, respond with a confirmation like "Certainly, taking you to the..." and the page name. Otherwise, provide a conversational response. Keep responses very short.`,
      });

      if (response.success && response.data) {
        if (response.data.toolCalls?.some(tc => tc.toolName === 'navigation')) {
          // AI wants to navigate. The navigation tool in the backend will handle the redirect.
          const navCall = response.data.toolCalls.find(tc => tc.toolName === 'navigation');
          if (navCall && navCall.args.path) {
             const message = `Taking you to ${navCall.args.path.replace('/', '') || 'the home page'}...`;
             setMessages(prev => [...prev, { role: 'model', text: message }]);
             setTimeout(() => {
               router.push(navCall.args.path);
               setIsOpen(false);
             }, 1000);
          }
        } else {
           setMessages(prev => [...prev, { role: 'model', text: response.data.reply }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
      }
    });
  };

  const isCurrentPageAI = pathname === '/ai-friend';
  if (isCurrentPageAI) return null;

  return (
    <>
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 1,
        }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="w-16 h-16 rounded-full shadow-lg shadow-primary/30">
           <AnimatePresence>
            {isOpen ? (
                 <motion.div key="close" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1}} exit={{ rotate: 180, opacity: 0}}><X className="w-8 h-8" /></motion.div>
            ) : (
                <motion.div key="bot" initial={{ rotate: 180, opacity: 0 }} animate={{ rotate: 0, opacity: 1}} exit={{ rotate: -180, opacity: 0}}><Bot className="w-8 h-8" /></motion.div>
            )}
           </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-28 right-8 z-40 w-full max-w-sm"
          >
            <Card className="shadow-2xl shadow-primary/20 bg-background/80 backdrop-blur-lg border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="text-primary" />
                  Chat with Aura
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80 p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={cn("flex items-end gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'model' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
                        <div className={cn(
                            "max-w-[80%] rounded-xl px-4 py-2 text-sm",
                             msg.role === 'user'
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                        )}>
                            {msg.text}
                        </div>
                      </div>
                    ))}
                    {isPending && (
                       <div className="flex items-end gap-2 justify-start">
                         <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                          <div className="bg-secondary rounded-xl px-4 py-2 text-sm">
                             <Loader2 className="w-4 h-4 animate-spin"/>
                          </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
                <CardFooter className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      disabled={isPending}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardFooter>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
