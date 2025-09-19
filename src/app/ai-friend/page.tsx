
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

const AuraAvatar = ({ aiStatus }: { aiStatus: 'listening' | 'thinking' | 'speaking' }) => {
    const isSpeaking = aiStatus === 'speaking';
    const isListening = aiStatus === 'listening';
  
    const mouthVariants = {
      listening: { d: "M 40 75 Q 50 80 60 75" },
      speaking: { d: "M 40 75 Q 50 85 60 75" },
      thinking: { d: "M 40 75 Q 50 75 60 75" },
    };
  
    return (
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 100 100" id="aura-svg" className="w-full h-full drop-shadow-lg">
          <defs>
            <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#E9E4F0" />
              <stop offset="100%" stopColor="#D3CCE3" />
            </radialGradient>
            <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9A7EB" />
              <stop offset="100%" stopColor="#A57ECE" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
          </defs>
  
          {/* Main Body/Shoulders */}
          <motion.path
            d="M 20 100 C 20 80, 80 80, 80 100 Z"
            fill="#BCCAEF"
            animate={{ y: isListening ? [0, -1, 0] : 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Head */}
          <circle cx="50" cy="50" r="40" fill="url(#faceGradient)" />
          
          {/* Hair */}
          <path d="M 20 50 A 30 30 0 0 1 80 50 A 40 40 0 0 1 20 50" fill="url(#hairGradient)" />

          {/* Eyes */}
          <g id="eyes">
              {/* Left Eye */}
              <motion.ellipse cx="35" cy="55" rx="4" ry="6" fill="white" 
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}
              />
              <circle cx="35" cy="55" r="2" fill="black" />
               <circle cx="36" cy="54" r="0.5" fill="white" />
              
              {/* Right Eye */}
              <motion.ellipse cx="65" cy="55" rx="4" ry="6" fill="white"
                 animate={{ scaleY: [1, 0.1, 1] }}
                 transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4.1, ease: "easeOut" }}
               />
              <circle cx="65" cy="55" r="2" fill="black" />
              <circle cx="66" cy="54" r="0.5" fill="white" />
          </g>

          {/* Cheeks */}
          <circle cx="28" cy="65" r="5" fill="#F4C2C2" opacity="0.5" filter="url(#glow)" />
          <circle cx="72" cy="65" r="5" fill="#F4C2C2" opacity="0.5" filter="url(#glow)" />
  
          {/* Mouth */}
          <motion.path
            id="mouth"
            stroke="black"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            initial="thinking"
            animate={aiStatus}
            variants={mouthVariants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
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
        <div className="font-sans min-h-screen m-0">
            <div id="app-wrapper" className="h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-500 bg-[#ccd8f1]">
                {screen === 'welcome' && (
                    <div id="welcome-screen" className="text-center p-8">
                        <h1 className="text-5xl font-bold mb-2 text-gray-800">Welcome to AI Video Call</h1>
                        <p className="text-xl text-gray-600 mb-8">Your professional AI companion for mental wellness.</p>
                        <p className="max-w-2xl mx-auto text-gray-600 mb-8">
                            This is a safe space to talk about whatever's on your mind. <b>Aura</b> is here to listen without judgment. Ready to chat?
                        </p>
                        <Button
                            id="start-call-btn"
                            onClick={handleStartCall}
                            disabled={!!loadingText}
                            size="lg"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg transition-transform transform hover:scale-105"
                        >
                            Start Conversation
                        </Button>
                        {loadingText && <p className="mt-4 text-gray-500">{loadingText}</p>}
                    </div>
                )}

                {screen === 'call' && (
                    <div id="call-screen" className="h-full w-full flex flex-col items-center justify-center relative">
                        <div className="w-full flex-grow flex items-center justify-center flex-col overflow-hidden relative">
                             <div id="ai-character-container" className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                                <AuraAvatar aiStatus={aiStatus} />
                            </div>
                            <div id="ai-status" className="absolute bottom-40 glass-card min-h-[5rem] max-w-[80%] mx-auto px-6 py-4 rounded-xl text-center text-gray-800 transition-all duration-300">
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
                            <video id="user-video" ref={userVideoRef} autoPlay muted playsInline className={cn("w-full h-full object-cover", { 'hidden': !isCameraOn })}></video>
                            {!isCameraOn && <div className="w-1/2 h-1/2 text-gray-600"><UserPlaceholderIcon /></div>}
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
                body {
                  font-family: 'Inter', sans-serif;
                }
                #app-wrapper {
                    background-image:
                        radial-gradient(circle 50px at 20% 20%, rgba(255, 255, 255, 0.3), transparent 70%),
                        radial-gradient(circle 40px at 80% 30%, rgba(255, 255, 255, 0.25), transparent 70%),
                        radial-gradient(circle 60px at 50% 80%, rgba(255, 255, 255, 0.2), transparent 70%);
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.25) !important;
                    backdrop-filter: blur(14px) saturate(150%);
                    -webkit-backdrop-filter: blur(14px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
                }
                .control-btn {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 9999px;
                    width: 52px; height: 52px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s ease-in-out; color: #374151; /* text-gray-700 */
                }
                .control-btn:hover { background-color: rgba(255, 255, 255, 0.5); transform: translateY(-2px); }
                .control-btn.active { background-color: #3B82F6; /* bg-blue-500 */ color: white; }
                .control-btn.hang-up { background-color: #ef4444; /* bg-red-500 */ color: white; }
                .control-btn.hang-up:hover { background-color: #dc2626; /* bg-red-600 */ }
                
                .dot-flashing {
                    position: relative; width: 10px; height: 10px; border-radius: 5px; background-color: #3B82F6; color: #3B82F6;
                    animation: dotFlashing 1s infinite linear alternate; animation-delay: .5s; display: inline-block; margin: 0 5px;
                }
                .dot-flashing::before, .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
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
        </div>
    );
}
