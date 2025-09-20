'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ZapOff, X, Mic, MicOff, Bell, Waves, Wind } from 'lucide-react';
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
    { text: 'Om', keyword: 'om' },
    { text: 'Om Shanti Om', keyword: 'shanti' },
    { text: 'So Hum', keyword: 'soham' },
    { text: 'Aham Prema', keyword: 'prema' },
];

const backgrounds = [
    { name: 'None', icon: MicOff, sound: '' },
    { name: 'Temple Bells', icon: Bell, sound: '/sounds/temple-bells.mp3' },
    { name: 'River', icon: Waves, sound: '/sounds/river.mp3' },
    { name: 'Wind Chimes', icon: Wind, sound: '/sounds/wind-chimes.mp3' },
];

export default function MantraChantingPage() {
    const [isClient, setIsClient] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [chantCount, setChantCount] = useState(0);
    const [selectedMantra, setSelectedMantra] = useState(mantras[0]);
    const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);
    const [hapticsEnabled, setHapticsEnabled] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // This ref will hold the latest transcript and will be used to prevent multiple counts for the same phrase.
    const lastProcessedTranscript = useRef('');

    useEffect(() => {
        setIsClient(true);
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
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                // If it's already started, that's fine.
                setIsListening(true);
            }
        }
    }, []);
    
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }, []);

    useEffect(() => {
        if (!isClient || !isListening) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if (isClient) alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
                .toLowerCase();

            // Check if the new transcript contains the keyword and is different from the last processed one.
            // This prevents counting the same utterance multiple times as interim results come in.
            if (transcript.includes(selectedMantra.keyword) && transcript !== lastProcessedTranscript.current) {
                handleMantraRecognized();
                lastProcessedTranscript.current = transcript; // Mark this transcript as processed.
                // Abort and restart to clear the buffer and listen for a new, distinct chant.
                recognitionRef.current?.abort();
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access was denied. Please allow microphone access to count chants.");
                stopListening();
            }
        };
        
        recognition.onend = () => {
           lastProcessedTranscript.current = ''; // Clear memory when recognition cycle ends.
           if (isListening) {
             // If it stops and we still want to listen, restart it.
             startListening();
           }
        };

        recognitionRef.current = recognition;
        startListening();

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }

    }, [isClient, selectedMantra.keyword, handleMantraRecognized, isListening, startListening, stopListening]);
    
    useEffect(() => {
        if (audioRef.current) {
            if (selectedBackground.sound && isListening) {
                 console.log(`Audio playback for ${selectedBackground.name} is disabled as sound files are not present.`);
            } else {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        }
    }, [selectedBackground, isListening]);

    const toggleHaptics = () => {
        if ('vibrate' in navigator) {
            setHapticsEnabled(prev => {
                if (!prev) navigator.vibrate(50);
                return !prev;
            });
        } else {
            alert("Haptic feedback is not supported on your device.");
        }
    };
    
    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            setIsListening(true); // Let the useEffect handle the start
        }
    }
    
     const resetCounter = () => {
        setChantCount(0);
        lastProcessedTranscript.current = '';
    }

    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center font-body overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
            <audio ref={audioRef} loop />

            <div className="absolute top-4 right-4 z-20 flex gap-2">
                 <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-background/50 hover:text-foreground">
                        <X size={24} />
                        <span className="sr-only">Close</span>
                    </Button>
                 </Link>
            </div>
           
            <AnimatePresence>
                <motion.div
                    key="main-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center"
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
                            <p className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter">
                                {chantCount}
                            </p>
                            <p className="text-sm text-muted-foreground">REPETITIONS</p>
                        </div>
                    </div>

                    <p className="text-3xl md:text-4xl font-headline text-primary mb-12 h-12 text-center">
                        {selectedMantra.text}
                    </p>

                    <div className="w-full p-4 absolute bottom-0">
                        <div className="max-w-md mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                             <button onClick={toggleListening} className={cn("control-btn", { 'active': isListening })} title={isListening ? "Stop Listening" : "Start Listening"}>
                                {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                            </button>
                             {isClient && 'vibrate' in navigator && (
                                <button onClick={toggleHaptics} className={cn("control-btn", { 'active': hapticsEnabled })} title={hapticsEnabled ? "Disable Haptics" : "Enable Haptics"}>
                                    {hapticsEnabled ? <ZapOff className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                                </button>
                            )}
                             <Button variant="ghost" size="icon" onClick={resetCounter} className="control-btn" title="Reset Count">
                                <X size={20} />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
            
             <AnimatePresence>
                {!isListening && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ ease: 'easeInOut' }}
                        className="absolute bottom-[calc(theme(spacing.4)_+_70px)] z-10"
                    >
                        <Card className="w-80 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg">Mantra Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="mantra-select">Mantra</Label>
                                    <Select
                                        value={selectedMantra.text}
                                        onValueChange={(value) => {
                                            const newMantra = mantras.find(m => m.text === value);
                                            if (newMantra) {
                                                setSelectedMantra(newMantra);
                                                resetCounter();
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="mantra-select">
                                            <SelectValue placeholder="Select a mantra" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mantras.map(m => (
                                                <SelectItem key={m.text} value={m.text}>{m.text}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="background-select">Background Sound</Label>
                                    <Select
                                        value={selectedBackground.name}
                                        onValueChange={(value) => {
                                            const newBg = backgrounds.find(b => b.name === value);
                                            if (newBg) setSelectedBackground(newBg);
                                        }}
                                    >
                                        <SelectTrigger id="background-select">
                                            <SelectValue placeholder="Select a sound" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {backgrounds.map(b => (
                                                <SelectItem key={b.name} value={b.name}>
                                                    <div className="flex items-center gap-2">
                                                        <b.icon className="w-4 h-4" />
                                                        {b.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
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
            `}</style>
        </div>
    );
}
