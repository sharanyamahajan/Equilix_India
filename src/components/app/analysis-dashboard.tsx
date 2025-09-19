'use client';

import { useState, useEffect, useTransition } from 'react';
import type { FileData } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, FileWarning } from 'lucide-react';
import { ComparisonView } from './comparison-view';
import { getHtmlImprovements } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"

interface AnalysisDashboardProps {
  files: FileData[];
  onReset: () => void;
}

type AnalysisResult = {
  originalContent: string;
  improvedContent: string;
  suggestions: string[];
};

export function AnalysisDashboard({ files, onReset }: AnalysisDashboardProps) {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      handleSelectFile(files[0]);
    }
  }, [files]);

  const handleSelectFile = (file: FileData) => {
    if (isPending) return;
    setSelectedFile(file);
    setAnalysisResult(null);
    setAnalysisError(null);
    startTransition(async () => {
      const result = await getHtmlImprovements(file.content);
      if (result.success && result.data) {
        // Create a dummy "improved" HTML
        const improvedContent = `<!-- AI suggestions have been noted. Manual application is recommended. -->\n${file.content}`;
        setAnalysisResult({
          originalContent: file.content,
          improvedContent: improvedContent,
          suggestions: result.data.improvements,
        });
      } else {
        const errorMsg = result.error || "Could not retrieve AI suggestions.";
        setAnalysisError(errorMsg);
        toast({
          title: "Analysis Failed",
          description: errorMsg,
          variant: "destructive",
        })
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold font-headline">Analysis Dashboard</h2>
        <Button variant="outline" onClick={onReset}><ArrowLeft className="mr-2 h-4 w-4" />Upload New Files</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <Card className="lg:col-span-1 lg:sticky lg:top-28">
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.name}>
                  <Button
                    variant={selectedFile?.name === file.name ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => handleSelectFile(file)}
                    disabled={isPending}
                  >
                    <span className="truncate">{file.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          {isPending && (
            <Card className="h-full flex items-center justify-center min-h-[500px]">
              <div className="flex flex-col items-center gap-4 text-muted-foreground p-8 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="font-semibold text-lg">Analyzing {selectedFile?.name}...</p>
                <p className="text-sm">Our AI is working its magic. Please wait a moment.</p>
              </div>
            </Card>
          )}
          {!isPending && analysisError && (
             <Card className="h-full flex items-center justify-center min-h-[500px]">
              <div className="flex flex-col items-center gap-4 text-destructive p-8 text-center">
                <FileWarning className="w-12 h-12" />
                <p className="font-semibold text-lg">Analysis Failed</p>
                <p className="text-sm">{analysisError}</p>
                <Button variant="default" onClick={() => handleSelectFile(selectedFile!)}>Try Again</Button>
              </div>
            </Card>
          )}
           {!isPending && selectedFile && analysisResult && (
             <ComparisonView 
                key={selectedFile.name}
                fileName={selectedFile.name}
                originalHtml={analysisResult.originalContent}
                improvedHtml={analysisResult.improvedContent}
                suggestions={analysisResult.suggestions}
             />
          )}
        </div>
      </div>
    </div>
  );
}
