'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getEmotionDetection } from '@/app/actions';
import { Loader2, Smile, Camera, Lightbulb } from 'lucide-react';
import { Progress } from '../ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


type EmotionResult = {
  emotion: string;
  confidence: number;
  feedback: string;
  suggestions: string[];
};

export function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isDetecting, startTransition] = useTransition();
  const [result, setResult] = useState<EmotionResult | null>(null);
  const { toast } = useToast();

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
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to use this feature.',
        });
      }
    };
    getCameraPermission();

    return () => {
      // Cleanup: stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleDetectEmotion = () => {
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
        setResult(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Detection Failed',
          description: response.error || 'Could not analyze emotion.',
        });
      }
    });
  };

  const getEmotionEmoji = (emotion: string) => {
    const lowerEmotion = emotion.toLowerCase();
    if (lowerEmotion.includes('happy') || lowerEmotion.includes('joy')) return '😊';
    if (lowerEmotion.includes('sad')) return '😢';
    if (lowerEmotion.includes('angry')) return '😠';
    if (lowerEmotion.includes('surprised')) return '😮';
    if (lowerEmotion.includes('neutral')) return '😐';
    return '🤔';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Check-in</CardTitle>
        <CardDescription>How are you feeling right now? Let's find out.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full aspect-video bg-secondary rounded-md overflow-hidden flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 text-center p-4">
                <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="font-semibold">Camera access is required</p>
                <p className="text-sm text-muted-foreground">Please allow camera permissions in your browser.</p>
            </div>
          )}
        </div>

        {hasCameraPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>Camera Required</AlertTitle>
                <AlertDescription>
                This feature needs camera access to work. Please update your browser settings.
                </AlertDescription>
            </Alert>
        )}

        <Button onClick={handleDetectEmotion} disabled={isDetecting || !hasCameraPermission} className="w-full">
          {isDetecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Detecting...
            </>
          ) : (
            'Detect My Emotion'
          )}
        </Button>

        {result && (
          <div className="animate-in fade-in-50 space-y-4">
            <Card className="bg-secondary/50 p-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{getEmotionEmoji(result.emotion)}</div>
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-baseline">
                      <p className="font-bold text-lg">{result.emotion}</p>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                  </div>
                  <Progress value={result.confidence * 100} className="h-2" />
                  <p className="text-sm pt-2">{result.feedback}</p>
                </div>
              </div>
            </Card>
            
            {result.suggestions && result.suggestions.length > 0 && (
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 font-semibold">
                      <Lightbulb className="text-accent" />
                      Suggestions & Exercises
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 pl-6 pr-2 pt-2 list-disc">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm">{suggestion}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
