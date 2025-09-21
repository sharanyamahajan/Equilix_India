
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { getAIFriendResponse } from '@/app/actions';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import type { AIFriendInput } from '@/ai/flows/ai-friend';

export default function AIFriendPage() {
  const [inCall, setInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [aiStatus, setAiStatus] = useState<'welcome' | 'thinking' | 'speaking' | 'listening'>('welcome');
  const [aiText, setAiText] = useState("Hi there! What's on your mind today?");
  const [messages, setMessages] = useState<AIFriendInput['history']>([]);
  
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);
  const lipSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const character = {
    name: 'Aura',
    svg: (
      <svg viewBox="0 0 200 200" id="aura-svg" className="w-full h-full">
        <defs>
          <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9} />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#auraGradient)" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.5" />
        <g id="eyes" style={{ transition: "transform 0.2s ease-out" }}>
          <path d="M 70 90 L 90 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M 110 90 L 130 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <path
          ref={mouthRef}
          id="mouth"
          d="M 80 130 Q 100 130 120 130"
          stroke="#ffffff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
    mouthShapes: {
      neutral: "M 80 130 Q 100 130 120 130",
      a: "M 80 130 Q 100 145 120 130",
      b: "M 80 135 Q 100 135 120 135",
      c: "M 80 125 Q 100 140 120 125",
    },
  };

  const startLipSync = useCallback(() => {
    if (lipSyncIntervalRef.current || !mouthRef.current) return;
    const shapes = Object.values(character.mouthShapes);
    lipSyncIntervalRef.current = setInterval(() => {
      if (mouthRef.current) {
        mouthRef.current.setAttribute("d", shapes[Math.floor(Math.random() * shapes.length)]);
      }
    }, 120);
  }, [character.mouthShapes]);

  const stopLipSync = useCallback(() => {
    if (lipSyncIntervalRef.current) {
      clearInterval(lipSyncIntervalRef.current);
      lipSyncIntervalRef.current = null;
    }
    if (mouthRef.current) {
      mouthRef.current.setAttribute("d", character.mouthShapes.neutral);
    }
  }, [character.mouthShapes.neutral]);

  const startSpeechRecognition = useCallback(() => {
    if (recognitionRef.current && isMicOn && aiStatus !== 'thinking' && aiStatus !== 'speaking') {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Recognition might already be started.
      }
    }
  }, [isMicOn, aiStatus]);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Recognition might already be stopped.
      }
    }
  }, []);
  
  const speak = useCallback((text: string) => {
    if (!isMounted.current) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => {
      stopSpeechRecognition();
      setAiStatus("speaking");
      setAiText(text);
      startLipSync();
    };

    utterance.onend = () => {
      stopLipSync();
      setAiStatus("listening");
      setMessages((prev) => [...(prev || []), { role: 'model', text }]);
      if (isMounted.current) {
        startSpeechRecognition();
      }
    };
    
    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.error('Speech synthesis error:', e);
      }
      stopLipSync();
      setAiStatus("listening");
    };

    window.speechSynthesis.speak(utterance);
  }, [startLipSync, stopLipSync, startSpeechRecognition, stopSpeechRecognition]);


  const getAIResponse = useCallback(async (userText: string) => {
    if (!isMounted.current) return;
    setAiStatus("thinking");
    
    const newHistory = [...(messages || []), { role: 'user', text: userText }];
    setMessages(newHistory);

    const result = await getAIFriendResponse({ history: newHistory, message: userText });

    if (isMounted.current) {
      if (result.success && result.data?.reply) {
        speak(result.data.reply);
      } else {
        console.error("AI error:", result.error);
        speak("I'm having a little trouble connecting right now.");
      }
    }
  }, [speak, messages]);

  useEffect(() => {
    isMounted.current = true;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
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

      recognition.onerror = (event: any) => {
         if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error("Speech recognition error:", event.error);
         }
      };

      recognition.onend = () => {
        if (isMounted.current && isMicOn && aiStatus === 'listening') {
          startSpeechRecognition();
        }
      };
    }
    
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
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
      window.speechSynthesis?.cancel();
    };
  }, [getAIResponse, stopSpeechRecognition, startSpeechRecognition, isMicOn, aiStatus]);


  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices", err);
      alert("Could not access media devices. Please check permissions.");
    }
  };

  const handleStartCall = async () => {
    setMessages([]);
    await startMedia();
    setInCall(true);
    setAiStatus("listening");
    if (isMicOn) {
      startSpeechRecognition();
    }
  };

  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    stopSpeechRecognition();
    window.speechSynthesis.cancel();
    setInCall(false);
    setAiStatus("welcome");
  };
  
  const toggleMic = () => {
      const newMicState = !isMicOn;
      setIsMicOn(newMicState);
      if (localStreamRef.current) {
          localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = newMicState));
      }
      if (newMicState) {
          startSpeechRecognition();
      } else {
          stopSpeechRecognition();
      }
  }

  const toggleCamera = () => {
      const newCamState = !isCameraOn;
      setIsCameraOn(newCamState);
      if (localStreamRef.current) {
          localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = newCamState));
      }
  }


  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        {!inCall ? (
          <div className="text-center p-8">
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 animate-pulse">Welcome to AI Video Call</h1>
            <p className="text-xl text-gray-600 mb-8">Your professional AI companion for mental wellness.</p>
            <p className="max-w-2xl mx-auto text-gray-600 mb-8">
              This is a safe space to talk about whatever's on your mind. <b>Aura</b> is here to listen without judgment. Ready to chat?
            </p>
            <Button
              onClick={handleStartCall}
              size="lg"
            >
              Start Conversation
            </Button>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center relative">
            <div className="w-full flex-grow flex items-center justify-center flex-col relative">
              <div style={{ width: "300px", height: "300px" }}>{character.svg}</div>
              <div className="absolute bottom-40 glass-card p-4 text-gray-800 text-center">
                {aiStatus === "thinking" ? (
                  <div className="dot-flashing"></div>
                ) : (
                  <p>{aiStatus === "speaking" ? aiText : "I'm listening..."}</p>
                )}
              </div>
            </div>

            {isCameraOn && (
              <div className="absolute bottom-28 right-4 w-[200px] h-[150px] rounded-xl overflow-hidden glass-card">
                <video ref={userVideoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
              </div>
            )}

            <div className="w-full p-4 absolute bottom-0">
              <div className="max-w-sm mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                <Button
                  onClick={toggleMic}
                  className={`control-btn ${isMicOn ? "active" : ""}`}
                  size="icon"
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </Button>
                <Button
                  onClick={toggleCamera}
                  className={`control-btn ${isCameraOn ? "active" : ""}`}
                  size="icon"
                >
                  {isCameraOn ? <Video /> : <VideoOff />}
                </Button>
                <Button
                  onClick={handleEndCall}
                  className="control-btn hang-up"
                  size="icon"
                >
                  <PhoneOff />
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
