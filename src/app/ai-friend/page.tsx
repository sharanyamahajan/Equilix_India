'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';


const AuraPal: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const handleStartCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const response = await fetch('/api/aura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdp: offer.sdp }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get answer from server.');
      }

      const answerData = await response.json();
      const answer = { type: 'answer' as const, sdp: answerData.sdp };
      await pc.setRemoteDescription(answer);

      setInCall(true);

    } catch (e: any) {
        console.error('Failed to start call:', e);
        setError(`Failed to start call: ${e.message}. Please check permissions and try again.`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleEndCall = () => {
    if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
    }
    if (localVideoRef.current && localVideoRef.current.srcObject) {
        (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
    }
    setInCall(false);
  };

  const character = {
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
          id="mouth"
          d="M 80 130 Q 100 130 120 130"
          stroke="#ffffff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        {!inCall ? (
          <div className="text-center p-8">
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 animate-pulse">Welcome to Aura</h1>
            <p className="text-xl text-muted-foreground mb-8">Your professional, real-time AI companion.</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button onClick={handleStartCall} size="lg" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Starting...</> : "Start Conversation"}
            </Button>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center relative">
            <div className="w-full flex-grow flex items-center justify-center flex-col relative">
              <div style={{ width: "300px", height: "300px" }}>{character.svg}</div>
               <Card className="absolute bottom-40 glass-card">
                  <CardContent className="p-4">
                    <p className="text-center">Aura is listening...</p>
                  </CardContent>
                </Card>
            </div>

            <div className="absolute bottom-28 right-4 w-[200px] h-[150px] rounded-xl overflow-hidden glass-card">
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
            </div>

            <audio ref={remoteAudioRef} autoPlay playsInline />

            <div className="w-full p-4 absolute bottom-0">
              <div className="max-w-sm mx-auto flex justify-center items-center space-x-4 glass-card rounded-full p-2">
                <Button
                  onClick={handleEndCall}
                  className="control-btn hang-up"
                  size="icon"
                  variant="destructive"
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
            background-color: rgba(255, 255, 255, 0.3) !important;
            border-radius: 9999px !important;
            width: 52px !important;
            height: 52px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease-in-out;
            color: #374151 !important; /* text-gray-700 */
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
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
    </>
  );
};

export default AuraPal;
