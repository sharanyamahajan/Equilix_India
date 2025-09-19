'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getAIFriendResponse } from '@/app/actions';
import { Loader2, Mic, Bot, User } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AIAvatar, type AvatarState } from './ai-avatar';


type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export function AIFriend() {
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isTalking, setIsTalking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const { toast } = useToast();

  useEffect(() => {
    const getMicPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Not Supported',
          description: 'Your browser does not support microphone access.',
        });
        return;
      }
      try {
        // We only need audio now
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Access Denied',
          description: 'Please enable microphone permissions to use this feature.',
        });
      }
    };
    getMicPermission();
  }, [toast]);
  
  const handleTalk = () => {
      if (isTalking) {
          setIsTalking(false);
          setAvatarState('thinking');
          
          const userMessage: Message = { sender: 'user', text: "I've been feeling a bit stressed lately." };
          setMessages(prev => [...prev, userMessage]);

          startTransition(async () => {
              const response = await getAIFriendResponse(userMessage.text);
              if (response.success && response.data) {
                  const aiMessage: Message = { sender: 'ai', text: response.data.reply };
                  setMessages(prev => [...prev, aiMessage]);
                  setAvatarState('talking');
              } else {
                  toast({
                      variant: 'destructive',
                      title: 'AI Error',
                      description: 'Could not get a response from the AI friend.'
                  });
                   setAvatarState('idle');
              }
          });

      } else {
          setIsTalking(true);
          setAvatarState('listening');
          toast({
              title: "Let's talk!",
              description: "I'm listening. Click the button again when you're done."
          })
      }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your AI Friend</CardTitle>
        <CardDescription>Have a friendly chat. Your AI companion is here to listen.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative w-full aspect-video bg-primary/10 rounded-md overflow-hidden flex items-center justify-center p-4">
            <AIAvatar state={avatarState} />
          </div>
          {hasMicPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Microphone Required</AlertTitle>
              <AlertDescription>
                This feature needs microphone access to work. Please update your browser settings.
              </AlertDescription>
            </Alert>
          )}
           <Button onClick={handleTalk} disabled={isPending || !hasMicPermission} className="w-full">
            {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...</>
            ) : isTalking ? (
                <><Mic className="mr-2 h-4 w-4 text-red-500" /> I'm listening... (Click to stop)</>
            ) : (
                <><Mic className="mr-2 h-4 w-4" /> Talk to your AI Friend</>
            )}
        </Button>
        </div>
        <div className="flex flex-col">
            <Card className="bg-secondary/50 flex-grow">
                <CardHeader>
                    <CardTitle className="text-lg">Conversation</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground pt-16">
                                    <Bot className="mx-auto h-8 w-8 mb-2" />
                                    <p>Your conversation will appear here.</p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                    {message.sender === 'ai' && (
                                        <Avatar>
                                            <AvatarFallback><Bot /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`rounded-lg p-3 max-w-xs ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                     {message.sender === 'user' && (
                                        <Avatar>
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                             {isPending && (
                                <div className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-lg p-3 max-w-xs bg-background flex items-center">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
