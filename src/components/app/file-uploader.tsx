'use client';

import type { ChangeEvent, FC, DragEvent } from 'react';
import { useRef, useState } from 'react';
import { File as FileIcon, UploadCloud, X } from 'lucide-react';

import type { FileData } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFilesUpload: (files: FileData[]) => void;
}

export const FileUploader: FC<FileUploaderProps> = ({ onFilesUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: File[] = Array.from(selectedFiles);
    const htmlFiles = newFiles.filter(
      (file) => file.type === 'text/html'
    );

    if (htmlFiles.length !== newFiles.length) {
      toast({
        title: 'Invalid File Type',
        description: 'Only HTML files (.html, .htm) are accepted.',
        variant: 'destructive',
      });
    }

    const combinedFiles = [...files, ...htmlFiles];
    const uniqueFiles = combinedFiles.filter(
        (file, index, self) => index === self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    if (uniqueFiles.length > 3) {
        toast({
            title: 'File Limit Exceeded',
            description: 'You can upload a maximum of 3 files.',
            variant: 'destructive',
        });
    }

    setFiles(uniqueFiles.slice(0, 3));
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input value to allow re-uploading the same file
    if(inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) return;
    const fileDataPromises = files.map((file) => {
      return new Promise<FileData>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve({ name: file.name, content });
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    try {
      const allFileData = await Promise.all(fileDataPromises);
      onFilesUpload(allFileData);
    } catch (e) {
      toast({
        title: 'Error',
        description: 'There was an error reading the files.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="max-w-3xl mx-auto animate-in fade-in-50 duration-500">
      <CardContent className="p-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".html,.htm"
            className="hidden"
            onChange={handleChange}
          />
          <UploadCloud className="w-16 h-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold text-foreground">
            {isDragActive
              ? 'Drop your HTML files here'
              : "Drag & drop files or click to upload"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Up to 3 HTML files
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground">Selected Files:</h3>
            <ul className="mt-2 space-y-2">
              {files.map((file) => (
                <li
                  key={file.name + file.size}
                  className="flex items-center justify-between p-2 rounded-md bg-secondary animate-in fade-in-0 slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-secondary-foreground truncate">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 flex-shrink-0"
                    onClick={() => removeFile(file)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleProcessFiles}
            disabled={files.length === 0}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_4px_14px_0_rgb(255,215,0,30%)] hover:shadow-[0_6px_20px_0_rgb(255,215,0,40%)] transition-all duration-300"
          >
            Analyze Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
