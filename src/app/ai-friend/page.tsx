'use client';

import { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getAIFriendResponse } from '@/app/actions';
import { type AIFriendInput } from '@/ai/schemas/ai-friend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export default function AIFriendPage() {
  const router = useRouter();
  const { toast } = useToast();

  // --- State ---
  const [screen, setScreen] = useState<'welcome' | 'call'>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAIResponding, startAIResponse] = useTransition();

  // --- DOM & Animation Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const lipSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);

  const character = {
    name: 'Aura',
    prompt: `You are Aura, a professional and empathetic AI companion. Your purpose is to provide a safe, supportive space for users. Listen carefully, offer thoughtful perspectives, and gently guide them to reflect on their feelings. Do not give medical advice. Keep your responses concise, clear, and calm.`,
    svg: `<svg viewBox="0 0 200 200" id="aura-svg" class="w-full h-full">
            <defs>
                <radialGradient id="auraGradientOuter" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0" />
                    <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.1" />
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.3" />
                </radialGradient>
                <radialGradient id="auraGradientInner" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stop-color="#bfdbfe" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.9" />
                </radialGradient>
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
             <circle cx="100" cy="100" r="95" fill="url(#auraGradientOuter)">
                 <animate attributeName="r" from="90" to="100" dur="4s" begin="0s" repeatCount="indefinite" />
                 <animate attributeName="opacity" from="0.3" to="0.5" dur="4s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="80" fill="url(#auraGradientInner)" filter="url(#glow)" />
            <g id="eyes" style="transition: transform 0.2s ease-out;">
                <circle cx="80" cy="90" r="5" fill="white" />
                <circle cx="120" cy="90" r="5" fill="white" />
            </g>
            <path id="mouth" d="M 85 130 Q 100 135 115 130" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`,
    mouthShapes: {
      neutral: 'M 85 130 Q 100 135 115 130',
      a: 'M 85 130 Q 100 145 115 130',
      b: 'M 85 135 Q 100 135 115 135',
      c: 'M 85 125 Q 100 140 115 125',
    },
  };

  const startLipSync = useCallback(() => {
    if (lipSyncIntervalRef.current || !mouthRef.current) return;
    const shapes = Object.values(character.mouthShapes);
    lipSyncIntervalRef.current = setInterval(() => {
      if (mouthRef.current) {
        mouthRef.current.setAttribute('d', shapes[Math.floor(Math.random() * shapes.length)]);
      }
    }, 120);
  }, [character.mouthShapes]);

  const stopLipSync = useCallback(() => {
    if (lipSyncIntervalRef.current) {
      clearInterval(lipSyncIntervalRef.current);
      lipSyncIntervalRef.current = null;
    }
    if (mouthRef.current) {
      mouthRef.current.setAttribute('d', character.mouthShapes.neutral);
    }
  }, [character.mouthShapes.neutral]);

  const speak = useCallback((text: string) => {
    if(!window.speechSynthesis) {
        console.warn("Speech synthesis not supported.");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = startLipSync;
    utterance.onend = stopLipSync;
    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e);
      stopLipSync();
      toast({ title: 'Speech Error', description: 'Could not play audio response.', variant: 'destructive' });
    };
    window.speechSynthesis.speak(utterance);
  }, [startLipSync, stopLipSync, toast]);

  const handleSend = () => {
    if (!input.trim() || isAIResponding) return;
    
    const newUserMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');

    startAIResponse(async () => {
      const response = await getAIFriendResponse({
        history: newMessages,
        message: input,
        systemPrompt: character.prompt,
      } as AIFriendInput);
      
      if (response.success && response.data) {
        const modelMessage: Message = { role: 'model', text: response.data.reply };
        setMessages(prev => [...prev, modelMessage]);
        speak(response.data.reply);

        if (response.data.toolCalls) {
          for (const toolCall of response.data.toolCalls) {
            if (toolCall.toolName === 'navigation' && toolCall.args.path) {
              toast({ title: 'Navigation', description: `Moving to ${toolCall.args.path}` });
              router.push(toolCall.args.path as string);
            }
          }
        }
      } else {
        toast({
          title: "AI Error",
          description: response.error || "Failed to get a response from the AI.",
          variant: "destructive",
        });
        // Add a message to the chat to indicate failure
        setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an issue. Please try again." }]);
      }
    });
  };

  useEffect(() => {
    // Blinking effect
    const eyeBlinkInterval = setInterval(() => {
      const eyes = document.getElementById('eyes');
      if (document.hidden || !eyes) return;
      eyes.style.transform = 'scaleY(0.1)';
      setTimeout(() => { if (eyes) eyes.style.transform = 'scaleY(1)'; }, 200);
    }, 4000);

    return () => {
      clearInterval(eyeBlinkInterval);
      if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      window.speechSynthesis?.cancel();
    };
  }, []);
  
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      localStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
      toast({
        title: "Camera Access Denied",
        description: "Could not access camera. The video feed will be disabled.",
        variant: "destructive",
      });
    }
  };

  const handleStartCall = async () => {
    await startMedia();
    setScreen('call');
    const welcomeMessage = { role: 'model', text: `Hello! I'm Aura. What's on your mind today?` } as Message;
    setMessages([welcomeMessage]);
    speak(welcomeMessage.text);
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setScreen('welcome');
    setMessages([]);
  };

  const latestBotMessage = messages.slice().reverse().find(m => m.role === 'model')?.text;

  return (
    <>
      <div id="app-wrapper" className="h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-500 font-body">
        {screen === 'welcome' && (
          <div id="welcome-screen" className="text-center p-8">
             <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 animate-pulse">Welcome to AI Video Call</h1>
             <p className="text-xl text-gray-600 mb-8">Your professional AI companion for mental wellness.</p>
            <p className="max-w-2xl mx-auto text-gray-600 mb-8">
              This is a safe space to talk about whatever's on your mind. <strong>Aura</strong> is here to listen without judgment. Ready to chat?
            </p>
            <Button id="start-call-btn" onClick={handleStartCall} size="lg">
              Start Conversation
            </Button>
          </div>
        )}

        {screen === 'call' && (
          <div id="call-screen" className="h-full w-full flex flex-col items-center justify-center relative p-4">
            <div className="w-full flex-grow flex items-center justify-center flex-col overflow-hidden relative">
              <div id="ai-character-container" dangerouslySetInnerHTML={{ __html: character.svg }} style={{ width: '300px', height: '300px' }} ref={() => {
                  if (typeof window !== "undefined") {
                    mouthRef.current = document.getElementById('mouth') as SVGPathElement | null
                  }
              }}></div>
              <div id="ai-status" className="absolute bottom-40 glass-card">
                  {isAIResponding && <div className="dot-flashing"></div>}
                  {!isAIResponding && <p id="ai-status-text">{latestBotMessage || "..."}</p>}
              </div>
            </div>
            
            <div id="user-video-container" className="glass-card">
              <video id="user-video" ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
            </div>

            <div className="w-full max-w-2xl p-4 absolute bottom-0 space-y-2">
               <div className="flex w-full items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message to Aura..."
                    disabled={isAIResponding}
                    className="h-12 text-base"
                  />
                  <Button onClick={handleSend} disabled={isAIResponding || !input.trim()} size="icon" className="h-12 w-12">
                    {isAIResponding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              <div className="max-w-sm mx-auto flex justify-center items-center">
                <Button id="end-call-btn" onClick={handleEndCall} className="control-btn hang-up" title="End Conversation">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l6-6M2 2l20 20" /></svg>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        body {
            background-color: #ccd8f1;
            background-image:
                radial-gradient(circle 50px at 20% 20%, rgba(255, 255, 255, 0.3), transparent 70%),
                radial-gradient(circle 40px at 80% 30%, rgba(255, 255, 255, 0.25), transparent 70%),
                radial-gradient(circle 60px at 50% 80%, rgba(255, 255, 255, 0.2), transparent 70%);
            background-repeat: no-repeat;
            background-size: cover;
            min-height: 100vh;
            margin: 0;
            overflow: hidden;
        }
        
        ::-webkit-scrollbar { display: none; }

        .glass-card {
            background: rgba(255, 255, 255, 0.25) !important;
            backdrop-filter: blur(14px) saturate(150%);
            -webkit-backdrop-filter: blur(14px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }

        #user-video-container {
            position: absolute;
            bottom: 12rem;
            right: 2rem;
            width: 200px;
            height: 150px;
            border-radius: 0.75rem;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #user-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }

        .control-btn.hang-up { 
          background-color: #ef4444; color: white; 
          border-radius: 9999px;
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease-in-out;
        }
        .control-btn.hang-up:hover { background-color: #dc2626; }

        #ai-status {
            min-height: 5rem;
            max-width: 80%;
            margin: 0 auto;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            text-align: center;
            color: #1f2937; /* text-gray-800 */
            transition: all 0.3s ease;
        }

        .dot-flashing {
            position: relative; width: 10px; height: 10px; border-radius: 5px;
            background-color: #3B82F6; color: #3B82F6;
            animation: dotFlashing 1s infinite linear alternate;
            animation-delay: .5s;
            display: inline-block; margin: 0 5px;
        }
        .dot-flashing::before, .dot-flashing::after {
            content: ''; display: inline-block; position: absolute; top: 0;
        }
        .dot-flashing::before {
            left: -15px; width: 10px; height: 10px; border-radius: 5px; background-color: #3B82F6; color: #3B82F6;
            animation: dotFlashing 1s infinite alternate; animation-delay: 0s;
        }
        .dot-flashing::after {
            left: 15px; width: 10px; height: 10px; border-radius: 5px; background-color: #3B82F6; color: #3B82F6;
            animation: dotFlashing 1s infinite alternate; animation-delay: 1s;
        }
        @keyframes dotFlashing {
            0% { background-color: #3B82F6; }
            50%, 100% { background-color: #93c5fd; }
        }
      `}</style>
    </>
  );
}
