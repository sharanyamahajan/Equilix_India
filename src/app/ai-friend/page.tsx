'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Main component
export default function AuraPalVideoCall() {
    const [screen, setScreen] = useState<'welcome' | 'call'>('welcome');
    const [aiStatusText, setAiStatusText] = useState("Your professional AI companion for mental wellness.");
    const [aiStatusState, setAiStatusState] = useState<'listening' | 'thinking' | 'speaking'>('listening');
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const mouthRef = useRef<SVGPathElement | null>(null);
    const isAIThinkingRef = useRef(false);
    const lipSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // --- NEW PROFESSIONAL CHARACTER: AURA ---
    const character = {
        name: 'Aura',
        prompt: `You are Aura, a professional and empathetic AI companion. Your purpose is to provide a safe, supportive space for users. Listen carefully, offer thoughtful perspectives, and gently guide them to reflect on their feelings. Do not give medical advice. Keep your responses concise, clear, and calm.`,
        svg: (
            <svg viewBox="0 0 200 200" id="aura-svg" className="w-full h-full">
                <defs>
                    <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{ stopColor: '#93c5fd', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.9 }} />
                    </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="90" fill="url(#auraGradient)" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.5" />
                <g id="eyes" style={{ transition: 'transform 0.2s ease-out' }}>
                    <path className="eye-line" d="M 70 90 L 90 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                    <path className="eye-line" d="M 110 90 L 130 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                </g>
                <path ref={mouthRef} id="mouth" d="M 80 130 Q 100 130 120 130" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
        ),
        mouthShapes: {
            neutral: "M 80 130 Q 100 130 120 130",
            a: "M 80 130 Q 100 145 120 130", // Open mouth for 'aah' sounds
            b: "M 80 135 Q 100 135 120 135", // Flat line for 'm', 'b' sounds
            c: "M 80 125 Q 100 140 120 125"  // Wider shape for 'ooh' sounds
        }
    };
    
    // --- LIP SYNC ---
    const startLipSync = useCallback(() => {
        if (lipSyncIntervalRef.current || !mouthRef.current) return;
        const shapes = Object.values(character.mouthShapes);
        lipSyncIntervalRef.current = setInterval(() => {
            if(mouthRef.current) {
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

    // --- SPEECH RECOGNITION ---
    const stopSpeechRecognition = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const startSpeechRecognition = useCallback(() => {
        if (recognitionRef.current && !isAIThinkingRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                // Already started is fine
            }
        }
    }, []);

    const speak = useCallback((text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            isAIThinkingRef.current = true;
            stopSpeechRecognition();
            setAiStatusState('speaking');
            setAiStatusText(text);
            startLipSync();
        };
        utterance.onend = () => {
            stopLipSync();
            setAiStatusState('listening');
            setAiStatusText("I'm listening...");
            isAIThinkingRef.current = false;
            if (isMicOn) startSpeechRecognition();
        };
        utterance.onerror = (e) => {
            console.error('Speech synthesis error', e);
            setAiStatusState('listening');
            isAIThinkingRef.current = false;
        };
        window.speechSynthesis.speak(utterance);
    }, [startLipSync, stopLipSync, stopSpeechRecognition, startSpeechRecognition, isMicOn]);

    const getAIResponse = useCallback(async (userText: string) => {
        isAIThinkingRef.current = true;
        setAiStatusState('thinking');
        try {
            const response = await fetch('/api/aura', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: userText, prompt: character.prompt }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }
            const result = await response.json();
            const aiText = result.text;
            speak(aiText || "I'm not sure what to say. Could you try rephrasing?");
        } catch (error) {
            console.error("Error calling backend API:", error);
            speak("I'm having a little trouble connecting. Please check your internet connection.");
        }
    }, [speak, character.prompt]);
    
    // Setup recognition on mount
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
                    getAIResponse(finalTranscript.trim());
                }
            };
            recognition.onerror = (event) => {
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    console.error('Speech recognition error:', event.error);
                }
            };
            recognition.onend = () => {
                if (isMicOn && !isAIThinkingRef.current) {
                    startSpeechRecognition();
                }
            };
            recognitionRef.current = recognition;
        } else {
            console.warn("SpeechRecognition API not supported.");
        }

        // Blinking eyes
        const interval = setInterval(() => {
            const eyes = document.getElementById('eyes');
            if (document.hidden || !eyes) return;
            eyes.style.transform = 'scaleY(0.1)';
            setTimeout(() => { eyes.style.transform = 'scaleY(1)'; }, 200);
        }, 4000);

        return () => {
            stopSpeechRecognition();
            stopLipSync();
            clearInterval(interval);
        };
    }, [getAIResponse, startSpeechRecognition, stopSpeechRecognition, stopLipSync, isMicOn]);

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
            alert("Could not access camera or microphone. Please check permissions and ensure you are using HTTPS.");
            setIsCameraOn(false);
            setIsMicOn(false);
        }
    };
    
    const handleStartCall = async () => {
        await startMedia();
        setScreen('call');
        setAiStatusText("Hi there! What's on your mind today?");
        if (isMicOn) {
            startSpeechRecognition();
        }
    };

    const handleEndCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        stopSpeechRecognition();
        setScreen('welcome');
    };

    const toggleMic = () => {
        const newMicState = !isMicOn;
        setIsMicOn(newMicState);
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = newMicState);
        }
        if (newMicState) startSpeechRecognition();
        else stopSpeechRecognition();
    };

    const toggleCamera = () => {
        const newCameraState = !isCameraOn;
        setIsCameraOn(newCameraState);
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = newCameraState);
        }
    };
    
    // --- UI Rendering ---
    return (
        <>
            <div id="app-wrapper" className="h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-500">
                {screen === 'welcome' ? (
                    <div id="welcome-screen" className="text-center p-8">
                        <h1 className="text-5xl font-bold mb-2 text-gray-800">Welcome to AI Video Call</h1>
                        <p className="text-xl text-gray-600 mb-8">{aiStatusText}</p>
                        <p className="max-w-2xl mx-auto text-gray-600 mb-8">
                            This is a safe space to talk about whatever is on your mind. <strong>Aura</strong> is here to listen without judgment. Ready to chat?
                        </p>
                        <button id="start-call-btn" onClick={handleStartCall} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
                            Start Conversation
                        </button>
                    </div>
                ) : (
                    <div id="call-screen" className="h-full w-full flex flex-col items-center justify-center relative">
                        <div className="w-full flex-grow flex items-center justify-center flex-col overflow-hidden relative">
                            <div id="ai-character-container" className="relative" style={{ width: 300, height: 300 }}>
                                {character.svg}
                            </div>
                            <div id="ai-status" className="absolute bottom-40 glass-card">
                                {aiStatusState === 'thinking' ? (
                                    <div className="dot-flashing"></div>
                                ) : (
                                    <p id="ai-status-text">{aiStatusText}</p>
                                )}
                            </div>
                        </div>
                        
                        <div id="user-video-container" className="glass-card">
                            <video id="user-video" ref={userVideoRef} autoPlay muted playsInline style={{ display: isCameraOn ? 'block' : 'none' }}></video>
                            <div id="camera-off-placeholder" className="icon-placeholder" style={{ display: isCameraOn ? 'none' : 'flex' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            </div>
                        </div>

                        <div className="w-full p-4 absolute bottom-0">
                            <div className="max-w-sm mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                                <button onClick={toggleMic} className={`control-btn ${isMicOn ? 'active' : ''}`} title="Mute/Unmute Mic">
                                    <svg id="mic-on-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${!isMicOn && 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                                    <svg id="mic-off-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isMicOn && 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.586 15.586a7 7 0 01-9.172-9.172l9.172 9.172zM12 18.75a.75.75 0 01-.75-.75V15a3 3 0 013-3h.75a.75.75 0 010 1.5h-.75a1.5 1.5 0 00-1.5 1.5v3a.75.75 0 01-.75-.75zM19 11a7 7 0 01-14 0m12.414 4.414a7.001 7.001 0 00-9.172-9.172"/></svg>
                                </button>
                                <button onClick={toggleCamera} className={`control-btn ${isCameraOn ? 'active' : ''}`} title="Camera On/Off">
                                    <svg id="camera-on-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${!isCameraOn && 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <svg id="camera-off-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isCameraOn && 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.586 15.586a7 7 0 01-9.172-9.172l9.172 9.172zM15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </button>
                                <button onClick={handleEndCall} className="control-btn hang-up" title="End Conversation">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l6-6M2 2l20 20" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Styles */}
            <style jsx global>{`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #ccd8f1;
                    background-image:
                        radial-gradient(circle 50px at 20% 20%, rgba(255, 255, 255, 0.3), transparent 70%),
                        radial-gradient(circle 40px at 80% 30%, rgba(255, 255, 255, 0.25), transparent 70%),
                        radial-gradient(circle 60px at 50% 80%, rgba(255, 255, 255, 0.2), transparent 70%);
                    background-repeat: no-repeat;
                    background-size: cover;
                    min-height: 100vh;
                    margin: 0;
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
                    bottom: 7rem;
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

                .icon-placeholder { width: 50%; height: 50%; color: #4b5563; }

                .control-btn {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 9999px; width: 52px; height: 52px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s ease-in-out; color: #374151;
                }
                .control-btn:hover { background-color: rgba(255, 255, 255, 0.5); transform: translateY(-2px); }
                .control-btn.active { background-color: #3B82F6; color: white; }
                .control-btn.hang-up { background-color: #ef4444; color: white; }
                .control-btn.hang-up:hover { background-color: #dc2626; }

                #ai-status {
                    min-height: 5rem; max-width: 80%; margin: 0 auto;
                    padding: 1rem 1.5rem; border-radius: 0.75rem;
                    text-align: center; color: #1f2937; transition: all 0.3s ease;
                }

                .dot-flashing {
                    position: relative; width: 10px; height: 10px; border-radius: 5px;
                    background-color: #3B82F6; color: #3B82F6;
                    animation: dotFlashing 1s infinite linear alternate; animation-delay: .5s;
                    display: inline-block; margin: 0 5px;
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
                    0% { background-color: #3B82F6; } 50%, 100% { background-color: #93c5fd; }
                }
            `}</style>
        </>
    );
}
