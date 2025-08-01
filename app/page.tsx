'use client';
import React, { useState, useEffect } from "react";
import { JengaPromptsInput, JengaPromptsOutput, PromptHistory as PromptHistoryType } from "@/lib/types";
import { APIClient } from "@/lib/api-client";
import { usePromptHistory } from "@/hooks/usePromptHistory";
import { useToast } from "@/hooks/useToast";
import { PromptForm } from "@/components/PromptForm";
import { PromptOutput } from "@/components/PromptOutput";
import { PromptHistory } from "@/components/PromptHistory";
import { Toaster } from "@/components/Toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JengaPromptsPro: React.FC = () => {
  const [response, setResponse] = useState<JengaPromptsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<PromptHistoryType | null>(null);
  const { 
    history, 
    favorites, 
    addToHistory, 
    toggleFavorite, 
    clearHistory 
  } = usePromptHistory();
  const { toast } = useToast();

  const handleSubmit = async (input: JengaPromptsInput) => {
    setLoading(true);
    setResponse(null);
    setSelectedHistoryItem(null);

    try {
      const result = await APIClient.enhancePrompt(input);
      setResponse(result);
      
      // Add to history
      const historyItem: PromptHistoryType = {
        id: Date.now().toString(),
        input,
        output: result,
        timestamp: new Date(),
      };
      addToHistory(historyItem);
      
      toast({
        title: "Prompt enhanced successfully!",
        description: "Your enhanced prompt is ready.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Enhancement failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistoryItem = (item: PromptHistoryType) => {
    setSelectedHistoryItem(item);
    setResponse(item.output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            JengaPrompts Pro
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Transform your ideas into powerful, detailed prompts across multiple modalities
          </p>
        </header>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="create">Create Prompt</TabsTrigger>
            <TabsTrigger value="history">History & Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-8">
            <PromptForm onSubmit={handleSubmit} loading={loading} />
            
            {response && (
              <PromptOutput 
                output={response} 
                onToggleFavorite={selectedHistoryItem ? () => toggleFavorite(selectedHistoryItem.id) : undefined}
                isFavorite={selectedHistoryItem ? favorites.includes(selectedHistoryItem.id) : false}
              />
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <PromptHistory
              history={history}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onClearHistory={clearHistory}
              onViewPrompt={handleViewHistoryItem}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  );
};

export default JengaPromptsPro;