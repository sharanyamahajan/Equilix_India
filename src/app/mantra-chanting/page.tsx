
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ZapOff, X, Mic, MicOff, Play, CheckCircle, Repeat } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const mantras = [
    { text: 'Om', keyword: 'om', pronunciation: 'Ohm' },
    { text: 'Om Shanti Om', keyword: 'shanti', pronunciation: 'Om Shanti Om' },
    { text: 'So Hum', keyword: 'soham', pronunciation: 'So Hum' },
    { text: 'Aham Prema', keyword: 'prema', pronunciation: 'Aham Prema' },
];

type Screen = 'selection' | 'learning' | 'chanting' | 'completion';

export default function MantraChantingPage() {
    const [screen, setScreen] = useState<Screen>('selection');
    const [isClient, setIsClient] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [chantCount, setChantCount] = useState(0);
    const [selectedMantra, setSelectedMantra] = useState(mantras[0]);
    const [hapticsEnabled, setHapticsEnabled] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsClient(true);
        // Cleanup on component unmount
        return () => {
            if (recognitionRef.current) {
               recognitionRef.current.stop();
            }
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        }
    }, []);
    
    const triggerAnimationAndHaptics = useCallback(() => {
        setIsAnimating(true);
        if (hapticsEnabled && 'vibrate' in navigator) {
            navigator.vibrate(100);
        }
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = setTimeout(() => setIsAnimating(false), 1000);
    }, [hapticsEnabled]);


    const handleMantraRecognized = useCallback(() => {
        setChantCount(prev => prev + 1);
        triggerAnimationAndHaptics();
    }, [triggerAnimationAndHaptics]);
    
    const startListening = useCallback(() => {
        if (!isClient || !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (recognitionRef.current) {
            recognitionRef.current.onresult = () => {};
            recognitionRef.current.onerror = () => {};
            recognitionRef.current.onend = () => {};
            recognitionRef.current.stop();
        }
        
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        let lastTranscript = '';
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            if (event.results[event.results.length - 1].isFinal && transcript !== lastTranscript) {
                if (transcript.includes(selectedMantra.keyword)) {
                    lastTranscript = transcript;
                    handleMantraRecognized();
                }
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'aborted' || event.error === 'no-speech') {
                return;
            }
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access was denied. Please allow microphone access to count chants.");
                setIsListening(false);
            }
        };
        
        recognition.onend = () => {
           if (isListening) {
             try {
                if(recognitionRef.current) recognitionRef.current.start()
             } catch(e) {
                // Already started or other error, often fine.
             }
           }
        };

        try {
            recognition.start();
            setIsListening(true);
        } catch(e) {
            console.error("Could not start recognition", e);
            setIsListening(false);
        }

    }, [isClient, selectedMantra.keyword, handleMantraRecognized, isListening]);
    
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }, []);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleSelectMantra = (value: string) => {
        const newMantra = mantras.find(m => m.text === value);
        if (newMantra) {
            setSelectedMantra(newMantra);
            setChantCount(0);
        }
    };
    
    const speakMantra = () => {
        if (!isClient) return;
        const utterance = new SpeechSynthesisUtterance(selectedMantra.pronunciation);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }

    const resetState = () => {
        stopListening();
        setChantCount(0);
        setScreen('selection');
    }

    const MainContent = () => {
        switch (screen) {
            case 'selection':
                return (
                    <motion.div 
                        key="selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="w-80 shadow-xl bg-background/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Choose Your Mantra</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="mantra-select">Mantra</Label>
                                    <Select value={selectedMantra.text} onValueChange={handleSelectMantra}>
                                        <SelectTrigger id="mantra-select"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {mantras.map(m => <SelectItem key={m.text} value={m.text}>{m.text}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={() => setScreen('learning')} className="w-full">Start Learning</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            
            case 'learning':
                 return (
                    <motion.div 
                        key="learning"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                    >
                        <Card className="w-80 shadow-xl bg-background/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Learn the Mantra</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-4xl font-bold text-primary font-headline">{selectedMantra.text}</p>
                                <p className="text-muted-foreground">Listen to the pronunciation, then practice repeating it.</p>
                                <Button onClick={speakMantra} variant="outline" size="lg" className="w-full">
                                    <Play className="mr-2 h-5 w-5" /> Listen
                                </Button>
                                <Button onClick={() => { setChantCount(0); setScreen('chanting'); }} size="lg" className="w-full">
                                    Begin Chanting <CheckCircle className="ml-2 h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            case 'chanting':
                return (
                     <motion.div
                        key="chanting"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                    >
                        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center mb-8">
                            <motion.div
                                className="absolute w-full h-full rounded-full bg-primary/10"
                                animate={{ scale: isAnimating ? 1.1 : 1, opacity: isAnimating ? 0.8 : 0.4 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                            <motion.div
                                className="absolute w-2/3 h-2/3 rounded-full bg-primary/20"
                                animate={{ scale: isAnimating ? 1.2 : 1, opacity: isAnimating ? 1 : 0.6 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />

                            <div className="z-10 text-center">
                                <p className="text-7xl md:text-8xl font-bold text-foreground tracking-tighter">
                                    {chantCount}
                                </p>
                            </div>
                        </div>

                        <p className="text-3xl md:text-4xl font-headline text-primary mb-12 h-12 text-center">
                            {selectedMantra.text}
                        </p>
                        
                        <div className="absolute bottom-4 w-full p-4">
                             <div className="max-w-xs mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                                 <button onClick={toggleListening} className={cn("control-btn", { 'active': isListening })} title={isListening ? "Stop Listening" : "Start Listening"}>
                                    {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                                </button>
                                 {isClient && 'vibrate' in navigator && (
                                    <button onClick={() => setHapticsEnabled(!hapticsEnabled)} className={cn("control-btn", { 'active': hapticsEnabled })} title={hapticsEnabled ? "Disable Haptics" : "Enable Haptics"}>
                                        {hapticsEnabled ? <ZapOff className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                                    </button>
                                )}
                                 <button onClick={() => { stopListening(); setScreen('completion'); }} className="control-btn hang-up" title="Finish Session">
                                    <CheckCircle size={24} />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                );

            case 'completion':
                 return (
                    <motion.div 
                        key="completion"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                    >
                        <Card className="w-80 shadow-xl bg-background/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Session Complete!</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                               <p className="text-muted-foreground">You completed</p>
                                <p className="text-6xl font-bold text-primary">{chantCount}</p>
                                <p className="text-muted-foreground">repetitions of "{selectedMantra.text}".</p>

                                <div className="flex gap-2">
                                <Button onClick={() => { setChantCount(0); setScreen('chanting'); }} variant="outline" size="lg" className="w-full">
                                    <Repeat className="mr-2 h-5 w-5" /> Again
                                </Button>
                                <Button onClick={resetState} size="lg" className="w-full">
                                    Done
                                </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

        }
    }

    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center font-body overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

            <div className="absolute top-4 right-4 z-20 flex gap-2">
                 <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-background/50 hover:text-foreground">
                        <X size={24} />
                        <span className="sr-only">Close</span>
                    </Button>
                 </Link>
            </div>

             <AnimatePresence mode="wait">
                {MainContent()}
            </AnimatePresence>

            <style jsx global>{`
                .glass-card {
                    background: hsl(var(--card) / 0.5) !important;
                    backdrop-filter: blur(12px) saturate(150%);
                    -webkit-backdrop-filter: blur(12px) saturate(150%);
                    border: 1px solid hsl(var(--border) / 0.2);
                    box-shadow: 0 8px 32px 0 hsl(var(--primary) / 0.1);
                }
                .control-btn {
                    background-color: hsl(var(--muted));
                    border-radius: 9999px;
                    width: 52px; height: 52px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s ease-in-out; color: hsl(var(--muted-foreground));
                }
                .control-btn:hover { background-color: hsl(var(--secondary)); transform: translateY(-2px); }
                .control-btn.active { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
                .control-btn.hang-up { background-color: hsl(var(--accent)); color: hsl(var(--accent-foreground)); }
            `}
            </style>
        </div>
    );
}