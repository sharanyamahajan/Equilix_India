
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const AURA_API_ENDPOINT = '/api/aura'; 

type Expression = {
  mouthOpen: number; // 0..1
  eyebrowRaise: number; // 0..1
  pupilX: number; // -1..1
  pupilY: number; // -1..1
};

export default function AdvancedAuraCall(): JSX.Element {
  const [inCall, setInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [aiText, setAiText] = useState("Hi — I'm Aura. How are you feeling today?");
  const [expression, setExpression] = useState<Expression>({
    mouthOpen: 0,
    eyebrowRaise: 0,
    pupilX: 0,
    pupilY: 0,
  });

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const analyserLocalRef = useRef<AnalyserNode | null>(null);
  const analyserRemoteRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const animFrameRef = useRef<number | null>(null);

  function makePeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pc.oniceconnectionstatechange = () => console.log('ICE state:', pc.iceConnectionState);
    pc.ontrack = (ev) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = ev.streams[0];
      }
    };
    return pc;
  }

  async function startLocalMedia(): Promise<void> {
    const constraints = { audio: true, video: { width: 640, height: 480 } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    src.connect(analyser);
    analyserLocalRef.current = analyser;
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

  async function createConnectionAndExchangeSDP(): Promise<void> {
    const pc = makePeerConnection();
    pcRef.current = pc;

    if (!localStreamRef.current) throw new Error('Local stream missing');
    localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current as MediaStream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const resp = await fetch(AURA_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sdp: offer.sdp }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error('SDP exchange failed: ' + text);
    }

    const answerSdp = await resp.text();
    await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
  }

  function connectEventsWebSocket(): void {
    // Note: WebSocket functionality is not implemented in the backend for this version.
  }

  function startExpressionLoop(): void {
    const localAnalyser = analyserLocalRef.current;
    const remoteAnalyser = analyserRemoteRef.current;
    if (!localAnalyser && !remoteAnalyser) return;

    const tmpArrayLocal = new Uint8Array(localAnalyser?.frequencyBinCount || 0);
    const tmpArrayRemote = new Uint8Array(remoteAnalyser?.frequencyBinCount || 0);

    const loop = () => {
      let localLevel = 0;
      let remoteLevel = 0;

      if (localAnalyser) {
        localAnalyser.getByteTimeDomainData(tmpArrayLocal);
        let sum = 0;
        for (let i = 0; i < tmpArrayLocal.length; i++) {
          const v = tmpArrayLocal[i] - 128;
          sum += v * v;
        }
        localLevel = Math.sqrt(sum / tmpArrayLocal.length) / 128;
      }

      if (remoteAnalyser) {
        remoteAnalyser.getByteTimeDomainData(tmpArrayRemote);
        let sum = 0;
        for (let i = 0; i < tmpArrayRemote.length; i++) {
          const v = tmpArrayRemote[i] - 128;
          sum += v * v;
        }
        remoteLevel = Math.sqrt(sum / tmpArrayRemote.length) / 128;
      }

      const mouthOpen = Math.max(remoteLevel * 1.2, localLevel * 0.9);
      const eyebrowRaise = Math.min(localLevel * 1.5, 1);

      const t = Date.now() / 1000;
      const pupilX = Math.sin(t * 0.8) * 0.15 + (Math.random() - 0.5) * 0.02;
      const pupilY = Math.cos(t * 0.7) * 0.08 + (Math.random() - 0.5) * 0.02;

      setExpression({
        mouthOpen: Math.min(Math.max(mouthOpen, 0), 1),
        eyebrowRaise: Math.min(Math.max(eyebrowRaise, 0), 1),
        pupilX,
        pupilY,
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }

  function stopExpressionLoop(): void {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = null;
  }

  async function startCall(): Promise<void> {
    try {
      await startLocalMedia();
      await createConnectionAndExchangeSDP();
      attachRemoteAnalyser();
      // connectEventsWebSocket(); // Disabled for now
      startExpressionLoop();
      setInCall(true);
    } catch (e) {
      console.error('startCall error', e);
      cleanupAll();
      alert('Could not start call. See console for details.');
    }
  }

  function cleanupAll(): void {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    pcRef.current?.close();
    pcRef.current = null;

    wsRef.current?.close();
    wsRef.current = null;

    try {
      analyserLocalRef.current = null;
      analyserRemoteRef.current = null;
      if (audioCtxRef.current && typeof audioCtxRef.current.close === 'function') {
        audioCtxRef.current.close();
      }
      audioCtxRef.current = null;
    } catch (e) {
      console.warn('audio ctx close err', e);
    }

    stopExpressionLoop();

    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setInCall(false);
    setAiText("Session ended");
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

  function mouthPathFor(open: number) {
    const ctl = 0 + 22 * open;
    return `M68 128 Q100 ${128 + ctl} 132 128`;
  }

  function pupilTransform(x: number, y: number) {
    return `translate(${x * 6}, ${y * 4})`;
  }

  function eyebrowPath(raise: number, left = true) {
    const y = 78 - raise * 8;
    if (left) return `M60 ${y} Q80 ${y - 6} 96 ${y}`;
    return `M104 ${y} Q120 ${y - 6} 140 ${y}`;
  }

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
                <p className="mb-8">This is a safe space to talk about whatever's on your mind. Aura is here to listen without judgment. Ready to chat?</p>
                <Button onClick={startCall} size="lg">
                    Start Conversation
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center relative">
          {/* AI Avatar */}
          <div className="w-96 h-96 flex items-center justify-center relative">
            <svg viewBox="0 0 200 200" className="w-96 h-96">
              <defs>
                <radialGradient id="auraGrad" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="88" fill="url(#auraGrad)" />
              <g id="eyes" transform="translate(0, -4)">
                <ellipse cx="76" cy="90" rx="18" ry="10" fill="#fff" />
                <g transform={pupilTransform(expression.pupilX, expression.pupilY)}>
                  <circle cx="76" cy="90" r="5.2" fill="#0f172a" />
                </g>
                <ellipse cx="124" cy="90" rx="18" ry="10" fill="#fff" />
                <g transform={pupilTransform(expression.pupilX * 0.9, expression.pupilY)}>
                  <circle cx="124" cy="90" r="5.2" fill="#0f172a" />
                </g>
                <ellipse cx="68" cy="60" rx="14" ry="6" fill="rgba(255,255,255,0.08)" />
              </g>
              <path d={eyebrowPath(expression.eyebrowRaise, true)} stroke="#0f172a" strokeWidth={3} strokeLinecap="round" fill="none" />
              <path d={eyebrowPath(expression.eyebrowRaise, false)} stroke="#0f172a" strokeWidth={3} strokeLinecap="round" fill="none" />
              <path d={mouthPathFor(expression.mouthOpen)} stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs">
                <div className="bg-background/80 backdrop-blur-md text-foreground p-3 rounded-lg shadow-md text-center">
                    <div className="text-sm">{aiText}</div>
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
