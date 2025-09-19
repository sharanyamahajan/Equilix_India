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

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export function AIFriend() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isTalking, setIsTalking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Not Supported',
          description: 'Your browser does not support camera/microphone access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Access Denied',
          description: 'Please enable camera and microphone permissions to use this feature.',
        });
      }
    };
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);
  
  // Mock conversation logic
  const handleTalk = () => {
      if (isTalking) {
          setIsTalking(false);
          // In a real app, you would stop recording here.
          
          const userMessage: Message = { sender: 'user', text: "I've been feeling a bit stressed lately." };
          setMessages(prev => [...prev, userMessage]);

          startTransition(async () => {
              const response = await getAIFriendResponse(userMessage.text);
              if (response.success && response.data) {
                  const aiMessage: Message = { sender: 'ai', text: response.data.reply };
                  setMessages(prev => [...prev, aiMessage]);
              } else {
                  toast({
                      variant: 'destructive',
                      title: 'AI Error',
                      description: 'Could not get a response from the AI friend.'
                  });
              }
          });

      } else {
          setIsTalking(true);
          // In a real app, you would start recording audio here.
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
          <div className="relative w-full aspect-video bg-secondary rounded-md overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 text-center p-4">
                <p className="font-semibold">Camera and Mic access required</p>
              </div>
            )}
          </div>
          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Media Required</AlertTitle>
              <AlertDescription>
                This feature needs camera and microphone access to work. Please update your browser settings.
              </AlertDescription>
            </Alert>
          )}
           <Button onClick={handleTalk} disabled={isPending || !hasCameraPermission} className="w-full">
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
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
