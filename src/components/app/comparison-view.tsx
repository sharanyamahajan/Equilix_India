import { CodePreview } from './code-preview';
import { SuggestionCard } from './suggestion-card';

interface ComparisonViewProps {
  fileName: string;
  originalHtml: string;
  improvedHtml: string;
  suggestions: string[];
}

export function ComparisonView({ fileName, originalHtml, improvedHtml, suggestions }: ComparisonViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <SuggestionCard suggestions={suggestions} improvedHtml={improvedHtml} fileName={fileName} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CodePreview title="Before" htmlContent={originalHtml} />
        <CodePreview title="After (Preview)" htmlContent={improvedHtml} />
      </div>
    </div>
  );
}
