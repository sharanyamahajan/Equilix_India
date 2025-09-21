'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Play, CheckCircle, Repeat, Camera, CameraOff, Video, Loader2 } from 'lucide-react';
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
import { getOmChantDetection } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const mantras = [
    { text: 'Om', keyword: 'om', pronunciation: 'Ohm' },
    // Add other mantras if they can be visually distinct, otherwise it's best to keep it simple
];

type Screen = 'selection' | 'learning' | 'chanting' | 'completion';

export default function MantraChantingPage() {
    const [screen, setScreen] = useState<Screen>('selection');
    const [chantCount, setChantCount] = useState(0);
    const [selectedMantra, setSelectedMantra] = useState(mantras[0]);
    
    // Camera and AI states
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const lastDetectionTime = useRef(0);
    const wasChanting = useRef(false);
    const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { toast } = useToast();

    // Permissions and Camera Setup
    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions to use this app.',
                });
            }
        };

        if (screen === 'chanting') {
            getCameraPermission();
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
            }
        };
    }, [screen, toast]);

    const handleAnalysis = useCallback(async () => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL('image/jpeg', 0.5); // Use lower quality for performance

        const response = await getOmChantDetection(imageDataUri);

        if (response.success && response.data) {
            const isCurrentlyChanting = response.data.isChantingOm;
            // Detect the "start" of a chant: transition from not chanting to chanting
            if (isCurrentlyChanting && !wasChanting.current) {
                setChantCount(prev => prev + 1);
            }
            wasChanting.current = isCurrentlyChanting;
        }
    }, []);

    // Start/Stop Detection Loop
    useEffect(() => {
        if (isSessionActive && hasCameraPermission) {
            detectionIntervalRef.current = setInterval(handleAnalysis, 1200); // Analyze roughly every second
        } else {
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
            }
        }
        return () => {
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
            }
        };
    }, [isSessionActive, hasCameraPermission, handleAnalysis]);


    const handleSelectMantra = (value: string) => {
        const newMantra = mantras.find(m => m.text === value);
        if (newMantra) {
            setSelectedMantra(newMantra);
            setChantCount(0);
        }
    };
    
    const speakMantra = () => {
        const utterance = new SpeechSynthesisUtterance(selectedMantra.pronunciation);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
    
    const startChantingSession = () => {
        setChantCount(0);
        setScreen('chanting');
        setIsSessionActive(true);
    }
    
    const stopChantingSession = () => {
        setIsSessionActive(false);
        setScreen('completion');
    }

    const resetState = () => {
        setIsSessionActive(false);
        setChantCount(0);
        setScreen('selection');
    }

    const MainContent = () => {
        switch (screen) {
            case 'selection':
                return (
                    <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
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
                                    <p className="text-xs text-muted-foreground pt-1">Visual detection works best for "Om".</p>
                                </div>
                                <Button onClick={() => setScreen('learning')} className="w-full">Start Learning</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            
            case 'learning':
                 return (
                    <motion.div key="learning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                        <Card className="w-80 shadow-xl bg-background/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Learn the Mantra</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-4xl font-bold text-primary font-headline">{selectedMantra.text}</p>
                                <p className="text-muted-foreground">Listen to the pronunciation, then get ready to chant.</p>
                                <Button onClick={speakMantra} variant="outline" size="lg" className="w-full">
                                    <Play className="mr-2 h-5 w-5" /> Listen
                                </Button>
                                <Button onClick={startChantingSession} size="lg" className="w-full">
                                    Begin Chanting <Video className="ml-2 h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            case 'chanting':
                return (
                     <motion.div key="chanting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <motion.div
                                    className="absolute w-full h-full rounded-full bg-primary/10"
                                    animate={{ scale: wasChanting.current ? 1.1 : 1, opacity: wasChanting.current ? 0.8 : 0.4 }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                                <motion.div
                                    className="absolute w-2/3 h-2/3 rounded-full bg-primary/20"
                                    animate={{ scale: wasChanting.current ? 1.2 : 1, opacity: wasChanting.current ? 1 : 0.6 }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                                <div className="z-10 text-center">
                                    <p className="text-7xl md:text-8xl font-bold text-foreground tracking-tighter">
                                        {chantCount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Video Feed in the background */}
                        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover -z-10 opacity-10" autoPlay muted playsInline />

                        {hasCameraPermission === false && (
                            <Alert variant="destructive" className="max-w-md">
                                <CameraOff className="h-4 w-4" />
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>Please allow camera access to start counting your chants.</AlertDescription>
                            </Alert>
                        )}
                        
                        {hasCameraPermission === null && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <p>Accessing Camera...</p>
                            </div>
                        )}
                        
                        <p className="text-3xl md:text-4xl font-headline text-primary mb-12 h-12 text-center absolute top-[calc(50%+10rem)]">
                            {selectedMantra.text}
                        </p>
                        
                        <div className="absolute bottom-4 w-full p-4">
                             <div className="max-w-xs mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                                <Button onClick={stopChantingSession} variant="destructive" size="lg" className="rounded-full w-40">
                                    <CheckCircle size={20} className="mr-2"/> Finish
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'completion':
                 return (
                    <motion.div key="completion" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                        <Card className="w-80 shadow-xl bg-background/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Session Complete!</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                               <p className="text-muted-foreground">You completed</p>
                                <p className="text-6xl font-bold text-primary">{chantCount}</p>
                                <p className="text-muted-foreground">repetitions of "{selectedMantra.text}".</p>
                                <div className="flex gap-2">
                                    <Button onClick={startChantingSession} variant="outline" size="lg" className="w-full">
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
        return null;
    }

    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center font-body overflow-hidden">
            {screen !== 'chanting' && <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />}

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
            `}</style>
        </div>
    );
}
