'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app/app-header';
import { FileUploader } from '@/components/app/file-uploader';
import { AnalysisDashboard } from '@/components/app/analysis-dashboard';
import { Toaster } from "@/components/ui/toaster"

export type FileData = {
  name: string;
  content: string;
};

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  
  const handleFilesUpload = (uploadedFiles: FileData[]) => {
    setFiles(uploadedFiles);
  };

  const handleReset = () => {
    setFiles([]);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background font-body">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          {files.length === 0 ? (
            <FileUploader onFilesUpload={handleFilesUpload} />
          ) : (
            <AnalysisDashboard files={files} onReset={handleReset} />
          )}
        </main>
        <footer className="text-center p-4 text-muted-foreground text-sm">
          <p>Equilix Refined © {new Date().getFullYear()}. An AI-powered HTML optimization tool.</p>
        </footer>
      </div>
      <Toaster />
    </>
  );
}
