'use client';

import { useState, useRef, useEffect, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getEmotionDetection } from '@/app/actions';
import { Loader2, Camera, HelpCircle, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type EmotionResult = {
  emotion: string;
  confidence: number;
};

export default function StressDetectorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isDetecting, startTransition] = useTransition();
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [stressScore, setStressScore] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDetection = useCallback((detectionResult: any) => {
    if (detectionResult.emotion.toLowerCase() === 'stress') {
        const score = Math.round(detectionResult.confidence * 100);
        setStressScore(score);
        localStorage.setItem('detectedStressScore', score.toString());
    } else {
        setStressScore(0); // If not stressed, score is 0
        localStorage.setItem('detectedStressScore', '0');
    }
    setResult({
        emotion: detectionResult.emotion,
        confidence: detectionResult.confidence
    });
  }, []);

  const handleDetectEmotion = useCallback(() => {
    if (!videoRef.current || isDetecting) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUri = canvas.toDataURL('image/jpeg');

    startTransition(async () => {
      setResult(null);
      const response = await getEmotionDetection(imageDataUri);
      if (response.success && response.data) {
        handleDetection(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Detection Failed',
          description: response.error || 'Could not analyze emotion.',
        });
      }
    });
  }, [isDetecting, toast, handleDetection]);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();

    // Auto-detect every 5 seconds
    const interval = setInterval(() => {
        handleDetectEmotion();
    }, 5000);

    return () => {
      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, handleDetectEmotion]);
  
  const getStressColor = (score: number | null) => {
    if (score === null) return 'bg-muted';
    if (score > 75) return 'bg-destructive';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  return (
    <main className="flex-grow container mx-auto px-4 pt-20 pb-12 md:pt-24 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Live Stress Detector</CardTitle>
                    <CardDescription>Your estimated stress level will be updated automatically.</CardDescription>
                </div>
                 <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                 </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full aspect-video bg-secondary rounded-md overflow-hidden flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
               {isDetecting && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                 </div>
               )}
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 text-center p-4">
                    <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="font-semibold">Camera access is required</p>
                </div>
              )}
            </div>
            
            {hasCameraPermission !== null && !hasCameraPermission && (
                 <Alert variant="destructive">
                    <AlertTitle>Camera Required</AlertTitle>
                    <AlertDescription>
                        This feature needs camera access. Please update your browser settings and refresh the page.
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="space-y-2">
                <Label>Estimated Stress Level</Label>
                <div className="flex items-center gap-4">
                    <div className="w-full bg-muted rounded-full h-8 flex items-center p-1">
                        <div
                            className={`h-6 rounded-full transition-all duration-500 ${getStressColor(stressScore)}`}
                            style={{ width: `${stressScore ?? 0}%` }}
                        />
                    </div>
                    <span className="text-2xl font-bold w-16 text-right">{stressScore ?? '--'}%</span>
                </div>
            </div>

            {result && (
                <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>Analysis</AlertTitle>
                    <AlertDescription>
                        Detected emotion: <strong>{result.emotion}</strong> with {Math.round(result.confidence * 100)}% confidence. Your stress score is based on this analysis.
                    </AlertDescription>
                </Alert>
            )}

            <Button onClick={() => router.push('/health-dashboard')} disabled={stressScore === null} className="w-full">
              Return to Dashboard with this Score
            </Button>
          </CardContent>
        </Card>
    </main>
  );
}
