'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodePreviewProps {
  title: string;
  htmlContent: string;
}

export function CodePreview({ title, htmlContent }: CodePreviewProps) {
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');

  useEffect(() => {
    // Defer setting srcDoc to a client-side effect to avoid hydration issues with iframes.
    setIframeSrcDoc(htmlContent);
  }, [htmlContent]);

  return (
    <Card className="h-full flex flex-col min-h-[500px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Tabs defaultValue="preview" className="flex-grow flex flex-col">
        <TabsList className="mx-6">
          <TabsTrigger value="preview">Visual Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent
          value="preview"
          className="flex-grow mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-b-lg overflow-hidden"
        >
          <iframe
            srcDoc={iframeSrcDoc}
            title={`${title} Preview`}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0 bg-white"
          />
        </TabsContent>
        <TabsContent
          value="code"
          className="flex-grow mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-b-lg overflow-hidden"
        >
          <ScrollArea className="h-full bg-secondary/50 rounded-b-lg">
            <pre className="p-4 text-sm font-code text-secondary-foreground">
              <code>{htmlContent}</code>
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
