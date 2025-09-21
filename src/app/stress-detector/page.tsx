'use client';

import { useState, useRef, useEffect, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { detectStress } from '@/app/actions';
import { Loader2, Camera, HelpCircle, ArrowLeft, Bot } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type StressResult = {
  stressScore: number;
  feedback: string;
};

export default function StressDetectorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isAnalyzing, startTransition] = useTransition();
  const [result, setResult] = useState<StressResult | null>(null);
  const [textInput, setTextInput] = useState('');
  const router = useRouter();
  const { toast } = useToast();

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
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);
  
  const handleAnalysis = useCallback(async () => {
    if (!videoRef.current || !textInput || isAnalyzing) {
        if (!textInput) {
            toast({
                variant: 'destructive',
                title: 'Text is required',
                description: 'Please describe how you are feeling to get an analysis.',
            });
        }
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUri = canvas.toDataURL('image/jpeg');

    startTransition(async () => {
      setResult(null);
      const response = await detectStress({ imageDataUri, text: textInput });
      if (response.success && response.data) {
        setResult(response.data);
        localStorage.setItem('detectedStressScore', response.data.stressScore.toString());
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: response.error || 'Could not analyze your stress level.',
        });
      }
    });
  }, [isAnalyzing, textInput, toast]);

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
                    <CardTitle>Advanced Stress Detector</CardTitle>
                    <CardDescription>Combines facial analysis with your written thoughts for a more accurate score.</CardDescription>
                </div>
                 <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                 </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full aspect-video bg-secondary rounded-md overflow-hidden flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 text-center p-4">
                    <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="font-semibold">Camera access is required</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="text-input">How are you feeling?</Label>
                <Textarea id="text-input" value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="e.g., 'Feeling a bit overwhelmed with work today...'" />
            </div>

            <Button onClick={handleAnalysis} disabled={isAnalyzing || !hasCameraPermission} className="w-full">
              {isAnalyzing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Bot className="mr-2 h-4 w-4" /> Analyze My Stress</>
              )}
            </Button>
            
            {result && (
              <div className="space-y-4 animate-in fade-in-50">
                 <div className="space-y-2">
                    <Label>Combined Stress Level</Label>
                    <div className="flex items-center gap-4">
                        <Progress value={result.stressScore} className={`h-6 [&>*]:${getStressColor(result.stressScore)}`} />
                        <span className="text-2xl font-bold w-16 text-right">{result.stressScore}%</span>
                    </div>
                </div>
                <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>AI Feedback</AlertTitle>
                    <AlertDescription>
                        {result.feedback}
                    </AlertDescription>
                </Alert>
                 <Button onClick={() => router.push('/health-dashboard')} className="w-full">
                  Return to Dashboard with this Score
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
    </main>
  );
}
