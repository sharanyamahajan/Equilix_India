// src/app/ai-friend/page.tsx
'use client';

import { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { getAIFriendResponse } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG Icons ---
const UserPlaceholderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const DotFlashing = () => <div className="dot-flashing"></div>;

const AuraAvatar = ({ aiStatus }: { aiStatus: string }) => {
    const isSpeaking = aiStatus === 'speaking';
    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
            >
                <motion.circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="url(#gradient)"
                    initial={{ scale: 1 }}
                    animate={{ scale: isSpeaking ? 1.03 : 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                />
                <defs>
                    <radialGradient id="gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="30%">
                        <stop stopColor="#AEC6CF" stopOpacity="0.7" />
                        <stop offset="1" stopColor="#AEC6CF" stopOpacity="0.3" />
                    </radialGradient>
                </defs>
                <motion.circle
                    cx="200"
                    cy="200"
                    r="150"
                    fill="hsl(var(--background))"
                />
                <motion.path
                    d="M150 220 Q200 250, 250 220"
                    stroke="#AEC6CF"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ d: "M170 230 Q200 230, 230 230" }}
                    animate={{
                        d: isSpeaking
                            ? [
                                "M170 230 Q200 250, 230 230",
                                "M170 230 Q200 220, 230 230",
                                "M170 230 Q200 240, 230 230",
                                "M170 230 Q200 230, 230 230"
                            ]
                            : "M160 235 Q200 250, 240 235"
                    }}
                    transition={{ duration: 0.4, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' }}
                />
                <g id="eyes">
                    <motion.circle cx="160" cy="180" r="10" fill="#AEC6CF" animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }} />
                    <motion.circle cx="240" cy="180" r="10" fill="#AEC6CF" animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }} />
                </g>
            </svg>
        </motion.div>
    );
};


// --- Main Component ---
export default function AiFriendPage() {
    const [screen, setScreen] = useState('welcome'); // 'welcome' | 'call'
    const [loadingText, setLoadingText] = useState('');
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [aiStatus, setAiStatus] = useState<'listening' | 'thinking' | 'speaking'>('speaking');
    const [aiStatusText, setAiStatusText] = useState("Hi there! What's on your mind today?");
    
    const localStreamRef = useRef<MediaStream | null>(null);
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isAIThinkingRef = useRef(false);

    const [isPending, startTransition] = useTransition();

    const startSpeechRecognition = useCallback(() => {
        if (recognitionRef.current && !isAIThinkingRef.current) {
            try {
                recognitionRef.current.start();
                setAiStatus('listening');
                setAiStatusText("I'm listening...");
            } catch (e) {
                // Already started
            }
        }
    }, []);

    const stopSpeechRecognition = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const speak = useCallback((text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            isAIThinkingRef.current = true;
            stopSpeechRecognition();
            setAiStatus('speaking');
            setAiStatusText(text);
        };
        utterance.onend = () => {
            isAIThinkingRef.current = false;
            if (isMicOn) {
                startSpeechRecognition();
            } else {
                 setAiStatus('listening');
                 setAiStatusText("Microphone is muted.");
            }
        };
        utterance.onerror = (e) => {
            if ((e as SpeechSynthesisErrorEvent).error !== 'canceled') {
              console.error('Speech synthesis error', e);
              setAiStatus('listening');
              setAiStatusText("I'm having trouble speaking. Please try again.");
              isAIThinkingRef.current = false;
            }
        };
        window.speechSynthesis.speak(utterance);
    }, [isMicOn, startSpeechRecognition, stopSpeechRecognition]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript.trim()) {
                    stopSpeechRecognition();
                    
                    isAIThinkingRef.current = true;
                    setAiStatus('thinking');
                    setAiStatusText(''); // Clear text while thinking
                    
                    startTransition(async () => {
                        const response = await getAIFriendResponse(finalTranscript.trim());
                        if (response.success && response.data) {
                            speak(response.data.reply);
                        } else {
                            speak("I'm having a little trouble connecting right now. Please try again in a moment.");
                        }
                    });
                }
            };
            
            recognition.onerror = (event) => {
                if (event.error !== 'no-speech') console.error('Speech recognition error:', event.error);
                 if (event.error === 'not-allowed') {
                    alert("Microphone access was denied. Please allow microphone access to talk to the AI friend.")
                    setIsMicOn(false);
                }
            };

            recognition.onend = () => {
                if (isMicOn && !isAIThinkingRef.current) {
                    startSpeechRecognition();
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            stopSpeechRecognition();
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            window.speechSynthesis.cancel();
        };
    }, [isMicOn, speak, startSpeechRecognition, stopSpeechRecognition]);

    const startMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (userVideoRef.current) {
                userVideoRef.current.srcObject = stream;
            }
            setIsCameraOn(true);
            setIsMicOn(true);
        } catch (err) {
            console.error("Error accessing media devices.", err);
            alert("Could not access camera or microphone. Please check permissions.");
            setIsCameraOn(false);
            setIsMicOn(false);
        }
    };

    const handleStartCall = async () => {
        setLoadingText('Initializing...');
        await startMedia();
        setScreen('call');
        setLoadingText('');
        speak("Hi there! What's on your mind today?");
    };

    const handleEndCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        stopSpeechRecognition();
        window.speechSynthesis.cancel();
        setScreen('welcome');
    };

    const toggleMic = () => {
        const newMicState = !isMicOn;
        setIsMicOn(newMicState);
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = newMicState);
        }
        if (newMicState) {
            startSpeechRecognition();
        } else {
            stopSpeechRecognition();
            setAiStatus('listening');
            setAiStatusText("Microphone is muted.");
        }
    };

    const toggleCamera = () => {
        const newCameraState = !isCameraOn;
        setIsCameraOn(newCameraState);
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = newCameraState);
        }
    };

    return (
        <div className="font-sans bg-background min-h-screen m-0">
            <div id="app-wrapper" className="h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-500 bg-background">
                {screen === 'welcome' && (
                    <div id="welcome-screen" className="text-center p-8">
                        <h1 className="text-5xl font-bold mb-2 text-foreground font-headline">AI Friend</h1>
                        <p className="text-xl text-muted-foreground mb-8">Your professional AI companion for mental wellness.</p>
                        <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
                            This is a safe space to talk about whatever's on your mind. <b>Aura</b> is here to listen without judgment. Ready to chat?
                        </p>
                        <Button
                            id="start-call-btn"
                            onClick={handleStartCall}
                            disabled={!!loadingText}
                            size="lg"
                            className="font-bold text-lg transition-transform transform hover:scale-105"
                        >
                            Start Conversation
                        </Button>
                        {loadingText && <p className="mt-4 text-muted-foreground">{loadingText}</p>}
                    </div>
                )}

                {screen === 'call' && (
                    <div id="call-screen" className="h-full w-full flex flex-col items-center justify-center relative">
                        <div className="w-full flex-grow flex items-center justify-center flex-col overflow-hidden relative">
                             <div id="ai-character-container" className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                                <AuraAvatar aiStatus={aiStatus} />
                            </div>
                            <div id="ai-status" className="absolute bottom-40 min-h-[5rem] max-w-[80%] mx-auto px-6 py-4 rounded-xl text-center text-card-foreground transition-all duration-300 glass-card">
                                 <AnimatePresence mode="wait">
                                    <motion.div
                                        key={aiStatusText} // Use aiStatusText to trigger animation on text change
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {aiStatus === 'thinking' ? <DotFlashing /> : <p id="ai-status-text">{aiStatusText}</p>}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        <div id="user-video-container" className="glass-card absolute bottom-28 right-8 w-[200px] h-[150px] rounded-xl overflow-hidden cursor-move flex items-center justify-center">
                            <video id="user-video" ref={userVideoRef} autoPlay muted playsInline className={cn("w-full h-full object-cover -scale-x-100", { 'hidden': !isCameraOn })}></video>
                            {!isCameraOn && <div className="w-1/2 h-1/2 text-muted-foreground"><UserPlaceholderIcon /></div>}
                        </div>
                        
                        <div className="w-full p-4 absolute bottom-0">
                            <div className="max-w-sm mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                                <button onClick={toggleMic} className={cn("control-btn", { 'active': isMicOn })} title="Mute/Unmute Mic">
                                    {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                                </button>
                                <button onClick={toggleCamera} className={cn("control-btn", { 'active': isCameraOn })} title="Camera On/Off">
                                    {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                                </button>
                                <button onClick={handleEndCall} className="control-btn hang-up" title="End Conversation">
                                    <PhoneOff className="h-6 w-6" />
                               </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style jsx global>{`
                body { font-family: 'Inter', sans-serif; }
                #app-wrapper {
                    background-image:
                        radial-gradient(circle 50px at 20% 20%, hsl(var(--primary) / 0.1), transparent 70%),
                        radial-gradient(circle 40px at 80% 30%, hsl(var(--primary) / 0.08), transparent 70%),
                        radial-gradient(circle 60px at 50% 80%, hsl(var(--primary) / 0.05), transparent 70%);
                }
                .glass-card {
                    background: hsl(var(--card) / 0.5) !important;
                    backdrop-filter: blur(14px) saturate(150%);
                    -webkit-backdrop-filter: blur(14px) saturate(150%);
                    border: 1px solid hsl(var(--border) / 0.2);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
                }
                .control-btn {
                    background-color: hsl(var(--secondary));
                    border-radius: 9999px;
                    width: 52px; height: 52px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s ease-in-out; color: hsl(var(--secondary-foreground));
                }
                .control-btn:hover { background-color: hsl(var(--accent)); transform: translateY(-2px); }
                .control-btn.active { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
                .control-btn.hang-up { background-color: hsl(var(--destructive)); color: hsl(var(--destructive-foreground)); }
                .control-btn.hang-up:hover { background-color: hsl(var(--destructive) / 0.9); }
                
                .dot-flashing {
                    position: relative; width: 10px; height: 10px; border-radius: 5px; background-color: #AEC6CF; color: #AEC6CF;
                    animation: dotFlashing 1s infinite linear alternate; animation-delay: .5s; display: inline-block; margin: 0 5px;
                }
                .dot-flashing::before, .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
                .dot-flashing::before {
                    left: -15px; width: 10px; height: 10px; border-radius: 5px; background-color: #AEC6CF; color: #AEC6CF;
                    animation: dotFlashing 1s infinite alternate; animation-delay: 0s;
                }
                .dot-flashing::after {
                    left: 15px; width: 10px; height: 10px; border-radius: 5px; background-color: #AEC6CF; color: #AEC6CF;
                    animation: dotFlashing 1s infinite alternate; animation-delay: 1s;
                }
                @keyframes dotFlashing { 0% { background-color: #AEC6CF; } 50%, 100% { background-color: rgba(174, 198, 207, 0.5); } }
            `}</style>
        </div>
    );
}
