import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { JengaPromptsInput, MODIFIER_OPTIONS } from '@/lib/types';

interface PromptFormProps {
  onSubmit: (input: JengaPromptsInput) => Promise<void>;
  loading: boolean;
}

export function PromptForm({ onSubmit, loading }: PromptFormProps) {
  const [input, setInput] = useState<JengaPromptsInput>({
    corePromptIdea: '',
    promptMode: 'Text',
    modifiers: {},
    outputStructure: 'Descriptive Paragraph'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.corePromptIdea.trim()) return;
    await onSubmit(input);
  };

  const handleInputChange = (field: keyof JengaPromptsInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleModifierChange = (field: string, value: string) => {
    setInput(prev => ({
      ...prev,
      modifiers: { ...prev.modifiers, [field]: value }
    }));
  };

  const renderModifierInputs = () => {
    const { promptMode } = input;
    const modifierFields: { [key: string]: string[] } = {
      Text: ['contentTone', 'outputFormat'],
      Image: ['style', 'aspectRatio', 'lighting', 'framing', 'cameraAngle', 'detailLevel'],
      Video: ['style', 'aspectRatio', 'lighting', 'framing', 'cameraAngle', 'detailLevel'],
      Audio: ['audioType', 'vibeMood', 'detailLevel'],
      Code: ['language', 'task', 'detailLevel']
    };

    const fields = modifierFields[promptMode] || [];

    return fields.map(field => (
      <div key={field} className="space-y-2">
        <Label htmlFor={field} className="text-sm font-medium capitalize">
          {field.replace(/([A-Z])/g, ' $1').trim()}
        </Label>
        <Select onValueChange={(value) => handleModifierChange(field, value)}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {MODIFIER_OPTIONS[field as keyof typeof MODIFIER_OPTIONS]?.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-purple-600" />
          JengaPrompts Pro
        </CardTitle>
        <CardDescription>
          Transform your ideas into powerful, detailed prompts across multiple modalities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="corePromptIdea" className="text-sm font-medium">
              Core Prompt Idea *
            </Label>
            <Textarea
              id="corePromptIdea"
              placeholder="Describe your idea or concept..."
              value={input.corePromptIdea}
              onChange={(e) => handleInputChange('corePromptIdea', e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={1000}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {input.corePromptIdea.length}/1000
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promptMode" className="text-sm font-medium">
                Prompt Mode *
              </Label>
              <Select onValueChange={(value: any) => handleInputChange('promptMode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Text">📝 Text</SelectItem>
                  <SelectItem value="Image">🎨 Image</SelectItem>
                  <SelectItem value="Video">🎬 Video</SelectItem>
                  <SelectItem value="Audio">🎵 Audio</SelectItem>
                  <SelectItem value="Code">💻 Code</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputStructure" className="text-sm font-medium">
                Output Structure
              </Label>
              <Select onValueChange={(value: any) => handleInputChange('outputStructure', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Descriptive Paragraph">Descriptive Paragraph</SelectItem>
                  <SelectItem value="Simple JSON">Simple JSON</SelectItem>
                  <SelectItem value="Detailed JSON">Detailed JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {input.promptMode !== 'Text' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {input.promptMode} Modifiers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderModifierInputs()}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            disabled={loading || !input.corePromptIdea.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Enhanced Prompt...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Enhanced Prompt
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}