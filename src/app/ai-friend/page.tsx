'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const AURA_API_ENDPOINT = '/api/aura';
const MODEL = 'gemini-1.5-pro-exp'; 

type Expression = {
  mouthOpen: number; // 0..1
};

export default function AuraVideoCall(): JSX.Element {
  const [inCall, setInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [aiStatus, setAiStatus] = useState("Hi — I'm Aura. How are you feeling today?");
  const [expression, setExpression] = useState<Expression>({
    mouthOpen: 0,
  });

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const analyserLocalRef = useRef<AnalyserNode | null>(null);
  const analyserRemoteRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);

  const character = {
    mouthShapes: {
      neutral: 'M 80 130 Q 100 130 120 130',
      a: 'M 80 130 Q 100 145 120 130',
      b: 'M 80 135 Q 100 135 120 135',
      c: 'M 80 125 Q 100 140 120 125',
    },
  };
  
  let lipSyncInterval: NodeJS.Timer;
  const startLipSync = () => {
    if (lipSyncInterval || !mouthRef.current) return;
    const shapes = Object.values(character.mouthShapes);
    lipSyncInterval = setInterval(() => {
      mouthRef.current!.setAttribute('d', shapes[Math.floor(Math.random() * shapes.length)]);
    }, 120);
  };
  const stopLipSync = () => {
    clearInterval(lipSyncInterval);
    if (mouthRef.current) mouthRef.current.setAttribute('d', character.mouthShapes.neutral);
  };

  const startLocalMedia = async (): Promise<void> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        const src = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        src.connect(analyser);
        analyserLocalRef.current = analyser;
    } catch (err) {
        console.error('Cannot access camera/mic', err);
        setAiStatus('Camera or microphone not available.');
    }
  }

  const startCall = async (): Promise<void> => {
    setInCall(true);
    setAiStatus('Connecting...');
    await startLocalMedia();
    
    try {
        // Step 1: Create a session via our backend proxy
        const sessionResponse = await fetch(AURA_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create_session', model: MODEL }),
        });

        if (!sessionResponse.ok) {
            const errorText = await sessionResponse.text();
            throw new Error(`Failed to create session: ${errorText}`);
        }
        
        const sessionData = await sessionResponse.json();
        const sessionName = sessionData.name;
        console.log('Session created:', sessionName);

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pcRef.current = pc;

        localStreamRef.current?.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));

        pc.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
                attachRemoteAnalyser();
                startLipSync();
            }
             event.streams[0].onremovetrack = () => {
                stopLipSync();
            };
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Step 2: Exchange SDP via our backend proxy
        const sdpResponse = await fetch(AURA_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'exchange_sdp',
                sessionName: sessionName,
                sdp: offer.sdp
            }),
        });
        
        if (!sdpResponse.ok) {
            const errorText = await sdpResponse.text();
            throw new Error(`SDP exchange failed: ${errorText}`);
        }

        const answer = await sdpResponse.json();
        await pc.setRemoteDescription({ type: 'answer', sdp: answer.sdp });

        setAiStatus("Hi! I'm Aura. How are you feeling today?");

    } catch (e) {
      console.error('startCall error', e);
      cleanupAll();
      alert('Could not start call. See console for details.');
    }
  }


  function attachRemoteAnalyser(): void {
    if (!remoteAudioRef.current) return;
    const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    const dest = audioCtx.createMediaElementSource(remoteAudioRef.current);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    dest.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyserRemoteRef.current = analyser;
  }


  function cleanupAll(): void {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    pcRef.current?.close();
    pcRef.current = null;

    stopLipSync();
    
    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setInCall(false);
    setAiStatus("Session ended");
  }

  function toggleMic() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsMicOn((s) => !s);
  }
  function toggleCam() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCamOn((s) => !s);
  }

  useEffect(() => {
    return () => cleanupAll();
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const eyes = document.querySelector('#eyes') as SVGElement;
      if (!eyes) return;
      eyes.style.transform = 'scaleY(0.1)';
      setTimeout(() => {
        eyes.style.transform = 'scaleY(1)';
      }, 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center font-body bg-gradient-to-br from-blue-100 to-indigo-200">
      {!inCall ? (
        <Card className="max-w-xl text-center p-8 animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    Aura
                </CardTitle>
                <CardDescription className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light tracking-wide">
                    Your professional, real-time AI companion.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-8">{aiStatus}</p>
                <Button onClick={startCall} size="lg">
                    Start Conversation
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center relative">
          {/* AI Avatar */}
          <div className="w-96 h-96 flex items-center justify-center relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
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
                <path
                  ref={mouthRef}
                  d="M 80 130 Q 100 130 120 130"
                  stroke="#ffffff"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
            </svg>
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs">
                <div className="bg-background/80 backdrop-blur-md text-foreground p-3 rounded-lg shadow-md text-center">
                    <div className="text-sm">{aiStatus}</div>
                </div>
            </div>
          </div>

          {/* Local Video */}
          <div className="absolute bottom-28 right-4 w-[200px] h-[150px] rounded-xl overflow-hidden glass-card">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
          </div>

          {/* Remote Audio (Hidden) */}
          <audio ref={remoteAudioRef} autoPlay hidden />

          {/* Controls */}
          <div className="w-full p-4 absolute bottom-0">
              <div className="max-w-sm mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                  <Button onClick={toggleMic} className={cn("control-btn", isMicOn && 'active')} size="icon">
                      {isMicOn ? <Mic /> : <MicOff />}
                  </Button>
                  <Button onClick={toggleCam} className={cn("control-btn", isCamOn && 'active')} size="icon">
                      {isCamOn ? <Video /> : <VideoOff />}
                  </Button>
                  <Button onClick={cleanupAll} className="control-btn hang-up" size="icon" variant="destructive">
                      <PhoneOff />
                  </Button>
              </div>
          </div>
        </div>
      )}
       <style jsx global>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.25) !important;
            backdrop-filter: blur(14px) saturate(150%);
            -webkit-backdrop-filter: blur(14px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }
        .control-btn {
            background-color: hsla(var(--muted)) !important;
            border-radius: 9999px !important;
            width: 52px !important;
            height: 52px !important;
            color: hsl(var(--muted-foreground)) !important;
            border: 1px solid hsl(var(--border) / 0.4) !important;
        }
        .control-btn.active {
            background-color: hsl(var(--primary)) !important;
            color: hsl(var(--primary-foreground)) !important;
        }
        .control-btn.hang-up { 
            background-color: hsl(var(--destructive)) !important; 
            color: hsl(var(--destructive-foreground)) !important;
            border-color: transparent !important;
        }
        .control-btn.hang-up:hover { 
            background-color: hsl(var(--destructive) / 0.9) !important; 
        }
      `}</style>
    </div>
  );
}
