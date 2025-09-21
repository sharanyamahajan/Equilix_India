
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAIFriendResponse } from '@/app/actions';
import { type AIFriendInput } from '@/ai/schemas/ai-friend';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AIFriendPage() {
  const router = useRouter();
  const { toast } = useToast();

  // --- State Management ---
  const [screen, setScreen] = useState<'welcome' | 'call'>('welcome');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiStatusText, setAiStatusText] = useState("Hi there! What's on your mind today?");
  
  // --- Refs for DOM elements and external objects ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);
  const lipSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);


  const character = {
    name: 'Aura',
    prompt: `You are Aura, a professional and empathetic AI companion. Your purpose is to provide a safe, supportive space for users. Listen carefully, offer thoughtful perspectives, and gently guide them to reflect on their feelings. Do not give medical advice. Keep your responses concise, clear, and calm.`,
    svg: `<svg viewBox="0 0 200 200" id="aura-svg" class="w-full h-full">
            <defs>
                <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:#93c5fd; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#3b82f6; stop-opacity:0.9" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#auraGradient)" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.5" />
            <g id="eyes" style="transition: transform 0.2s ease-out;">
                <path class="eye-line" d="M 70 90 L 90 90" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
                <path class="eye-line" d="M 110 90 L 130 90" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
            </g>
            <path id="mouth" d="M 80 130 Q 100 130 120 130" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`,
    mouthShapes: {
      neutral: "M 80 130 Q 100 130 120 130",
      a: "M 80 130 Q 100 145 120 130",
      b: "M 80 135 Q 100 135 120 135",
      c: "M 80 125 Q 100 140 120 125"
    }
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

  const setAIStatus = (status: 'thinking' | 'speaking' | 'listening', text: string = "") => {
    if (!isMounted.current) return;
    if (status === 'speaking') {
      setIsAIThinking(true);
      setAiStatusText(text);
    } else if (status === 'thinking') {
      setIsAIThinking(true);
      setAiStatusText(""); // Placeholder for flashing dots
    } else {
      setIsAIThinking(false);
      setAiStatusText("I'm listening...");
    }
  };

  const startSpeechRecognition = useCallback(() => {
    if (recognitionRef.current && !isAIThinking) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // May already be started
      }
    }
  }, [isAIThinking]);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // May already have been stopped
      }
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isMounted.current) return;
    
    // Clear any ongoing speech before starting a new one.
    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      setIsAIThinking(true);
      stopSpeechRecognition();
      setAIStatus("speaking", text);
      startLipSync();
    };
    utterance.onend = () => {
      stopLipSync();
      setAIStatus("listening");
      if (isMounted.current && isMicOn) {
        startSpeechRecognition();
      }
    };
    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') {
        // These are expected when we call window.speechSynthesis.cancel() or start a new utterance.
        // We can safely ignore them.
      } else {
        console.error('Speech synthesis error:', e);
      }
      // Ensure UI resets correctly even if there was an error.
      stopLipSync();
      setAIStatus("listening");
      setIsAIThinking(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [startLipSync, stopLipSync, startSpeechRecognition, stopSpeechRecognition, isMicOn]);

  const getAIResponse = useCallback(async (userText: string) => {
    setAIStatus("thinking");
    
    const result = await getAIFriendResponse({
      history: [],
      message: userText,
      systemPrompt: character.prompt,
    } as AIFriendInput);
    
    if (result.success && result.data?.reply) {
      speak(result.data.reply);
    } else {
      console.error("Error calling AI Friend:", result.error);
      speak("I'm having a little trouble connecting right now. Please try again in a moment.");
    }
  }, [character.prompt, speak]);
  
  useEffect(() => {
    isMounted.current = true;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

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
        if (isMounted.current && isMicOn && !isAIThinking) {
          startSpeechRecognition();
        }
      };
    } else {
      toast({ title: "Unsupported Browser", description: "Speech recognition is not available in your browser.", variant: "destructive" });
    }

    // Blinking effect
    const eyeBlinkInterval = setInterval(() => {
      const eyes = document.getElementById('eyes');
      if (document.hidden || !eyes) return;
      eyes.style.transform = 'scaleY(0.1)';
      setTimeout(() => { if(eyes) eyes.style.transform = 'scaleY(1)'; }, 200);
    }, 4000);

    return () => {
      isMounted.current = false;
      clearInterval(eyeBlinkInterval);
      if (lipSyncIntervalRef.current) clearInterval(lipSyncIntervalRef.current);
      stopSpeechRecognition();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      window.speechSynthesis?.cancel();
    };
  }, [getAIResponse, stopSpeechRecognition, startSpeechRecognition, isMicOn, isAIThinking, toast]);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
      setIsMicOn(true);
    } catch (err) {
      console.error("Error accessing media devices.", err);
      toast({
        title: "Media Access Denied",
        description: "Could not access camera or microphone. Please check permissions.",
        variant: "destructive",
      });
      setIsCameraOn(false);
      setIsMicOn(false);
    }
  };

  const handleStartCall = async () => {
    await startMedia();
    setScreen('call');
    speak(`Hello! I'm Aura. What's on your mind today?`);
  };

  const handleEndCall = () => {
    // The main useEffect cleanup hook handles stopping streams, speech, etc.
    setScreen('welcome');
  };

  const toggleMic = () => {
    const newMicState = !isMicOn;
    if (localStreamRef.current && localStreamRef.current.getAudioTracks().length > 0) {
      localStreamRef.current.getAudioTracks()[0].enabled = newMicState;
      setIsMicOn(newMicState);
      if (newMicState) {
        startSpeechRecognition();
      } else {
        stopSpeechRecognition();
      }
    }
  };
  
  const toggleCamera = () => {
    const newCameraState = !isCameraOn;
    if (localStreamRef.current && localStreamRef.current.getVideoTracks().length > 0) {
      localStreamRef.current.getVideoTracks()[0].enabled = newCameraState;
      setIsCameraOn(newCameraState);
    }
  };
  
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
                  {isAIThinking && aiStatusText === "" && <div className="dot-flashing"></div>}
                  <p id="ai-status-text">{aiStatusText}</p>
              </div>
            </div>
            
            <div id="user-video-container" className="glass-card">
              <video id="user-video" ref={videoRef} autoPlay muted playsInline style={{display: isCameraOn ? 'block' : 'none' }}></video>
              {!isCameraOn && (
                <div id="camera-off-placeholder" className="icon-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </div>
              )}
            </div>

            <div className="w-full p-4 absolute bottom-0">
                <div className="max-w-sm mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                    <button id="mic-btn" onClick={toggleMic} className={`control-btn ${isMicOn ? 'active' : ''}`} title="Mute/Unmute Mic">
                      <svg id="mic-on-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${!isMicOn ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                      <svg id="mic-off-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isMicOn ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.586 15.586a7 7 0 01-9.172-9.172l9.172 9.172zM12 18.75a.75.75 0 01-.75-.75V15a3 3 0 013-3h.75a.75.75 0 010 1.5h-.75a1.5 1.5 0 00-1.5 1.5v3a.75.75 0 01-.75-.75zM19 11a7 7 0 01-14 0m12.414 4.414a7.001 7.001 0 00-9.172-9.172"/></svg>
                    </button>
                    <button id="camera-btn" onClick={toggleCamera} className={`control-btn ${isCameraOn ? 'active' : ''}`} title="Camera On/Off">
                      <svg id="camera-on-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${!isCameraOn ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <svg id="camera-off-icon" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isCameraOn ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.586 15.586a7 7 0 01-9.172-9.172l9.172 9.172zM15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button id="end-call-btn" onClick={handleEndCall} className="control-btn hang-up" title="End Conversation"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l6-6M2 2l20 20" /></svg></button>
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
        
        .icon-placeholder {
            width: 50%;
            height: 50%;
            color: #4b5563; /* text-gray-600 */
        }

        .control-btn {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 9999px;
            width: 52px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease-in-out;
            color: #374151; /* text-gray-700 */
        }

        .control-btn:hover {
            background-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }

        .control-btn.active {
            background-color: #3B82F6; /* bg-blue-500 */
            color: white;
        }
        
        .control-btn.hang-up { background-color: #ef4444; color: white; }
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
