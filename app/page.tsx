'use client';
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface JengaPromptsInput {
  corePromptIdea: string;
  promptMode: 'Text' | 'Image' | 'Video' | 'Audio' | 'Code';
  modifiers: {
    contentTone?: string;
    outputFormat?: string;
    style?: string;
    aspectRatio?: string;
    lighting?: string;
    framing?: string;
    cameraAngle?: string;
    detailLevel?: string;
    audioType?: string;
    vibeMood?: string;
    language?: string;
    task?: string;
  };
  outputStructure: 'Descriptive Paragraph' | 'Simple JSON' | 'Detailed JSON';
}

interface JengaPromptsOutput {
  primaryResult: string;
  structuredJSON?: Record<string, any>;
  errorMessage?: string;
}

const JengaPromptsPro: React.FC = () => {
  const [input, setInput] = useState<JengaPromptsInput>({
    corePromptIdea: "",
    promptMode: "Text",
    modifiers: {},
    outputStructure: "Descriptive Paragraph"
  });
  const [response, setResponse] = useState<JengaPromptsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputTab, setOutputTab] = useState<'text' | 'json'>('text');

  useEffect(() => {
    if (input.promptMode === 'Image') {
      setInput(prev => ({
        ...prev,
        modifiers: {
          ...prev.modifiers,
          style: prev.modifiers.style || 'photorealistic',
          aspectRatio: prev.modifiers.aspectRatio || '16:9',
        }
      }));
    }
  }, [input.promptMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const modifierKeys = [
      "contentTone", "outputFormat", "style", "aspectRatio",
      "lighting", "framing", "cameraAngle", "detailLevel",
      "audioType", "vibeMood", "language", "task"
    ];

    if (modifierKeys.includes(name)) {
      setInput(prev => ({
        ...prev,
        modifiers: {
          ...prev.modifiers,
          [name]: value
        }
      }));
    } else {
      setInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string) => {
    setInput(prev => ({ ...prev, promptMode: value as 'Text' | 'Image' | 'Video' | 'Audio' | 'Code' }));
  };

  const toggleOutputTab = (tab: 'text' | 'json') => {
    setOutputTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch');
      }

      const data: JengaPromptsOutput = await response.json();
      setResponse(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <Card>
        <CardHeader>
          <CardTitle>JengaPrompts Pro</CardTitle>
          <CardDescription>A toolkit for enhancing prompts across multiple modalities.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="corePromptIdea">Core Prompt Idea</Label>
            <Textarea name="corePromptIdea" value={input.corePromptIdea} onChange={handleChange} required />

            <Label htmlFor="promptMode">Select Prompt Mode</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Text">Text</SelectItem>
                <SelectItem value="Image">Image</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Audio">Audio</S
electItem>
                <SelectItem value="Code">Code</SelectItem>
              </SelectContent>
            </Select>

            {/* Additional inputs for modifiers can be conditionally rendered based on promptMode */}
            {input.promptMode === 'Image' && (
              <>
                <Label htmlFor="style">Style</Label>
                <Input name="style" value={input.modifiers.style} onChange={handleChange} />
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Input name="aspectRatio" value={input.modifiers.aspectRatio} onChange={handleChange} />
                <Label htmlFor="lighting">Lighting</Label>
                <Input name="lighting" value={input.modifiers.lighting} onChange={handleChange} />
                <Label htmlFor="framing">Framing</Label>
                <Input name="framing" value={input.modifiers.framing} onChange={handleChange} />
                <Label htmlFor="cameraAngle">Camera Angle</Label>
                <Input name="cameraAngle" value={input.modifiers.cameraAngle} onChange={handleChange} />
              </>
            )}

            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Prompt'}
            </Button>
          </form>

          {error && <p className="text-red-500">{error}</p>}
          {response && (
            <div className="mt-4">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => toggleOutputTab('text')} className={outputTab === 'text' ? 'bg-gray-200' : ''}>Text</Button>
                <Button variant="outline" onClick={() => toggleOutputTab('json')} className={outputTab === 'json' ? 'bg-gray-200' : ''}>JSON</Button>
              </div>
              <pre className="mt-2 p-2 border rounded bg-gray-100">{outputTab === 'text' ? response.primaryResult : JSON.stringify(response.structuredJSON, null, 2)}</pre>
              <Button onClick={copyToClipboard} className="mt-2">Copy to Clipboard</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JengaPromptsPro;
