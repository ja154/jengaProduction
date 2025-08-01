import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Heart, Download, Share2 } from 'lucide-react';
import { JengaPromptsOutput } from '@/lib/types';
import { useToast } from '@/hooks/useToast';

interface PromptOutputProps {
  output: JengaPromptsOutput;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export function PromptOutput({ output, onToggleFavorite, isFavorite }: PromptOutputProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    const content = activeTab === 'text' 
      ? output.primaryResult 
      : JSON.stringify(output.structuredJSON, null, 2);
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The prompt has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = () => {
    const content = activeTab === 'text' 
      ? output.primaryResult 
      : JSON.stringify(output.structuredJSON, null, 2);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jenga-prompt-${Date.now()}.${activeTab === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your prompt has been downloaded.",
    });
  };

  const sharePrompt = async () => {
    const content = activeTab === 'text' 
      ? output.primaryResult 
      : JSON.stringify(output.structuredJSON, null, 2);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'JengaPrompts Enhanced Prompt',
          text: content,
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Enhanced Prompt Result</CardTitle>
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className={isFavorite ? 'text-red-500' : 'text-gray-500'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={sharePrompt}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadAsFile}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('text')}
          >
            Enhanced Text
          </Button>
          {output.structuredJSON && (
            <Button
              variant={activeTab === 'json' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('json')}
            >
              Structured Data
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] max-h-[500px] overflow-auto">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {activeTab === 'text' 
                ? output.primaryResult 
                : JSON.stringify(output.structuredJSON, null, 2)
              }
            </pre>
          </div>
          
          <Button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 h-8 w-8 p-0"
            variant="secondary"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>
            Characters: {(activeTab === 'text' ? output.primaryResult : JSON.stringify(output.structuredJSON, null, 2)).length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}