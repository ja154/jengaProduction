import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  History, 
  Heart, 
  Search, 
  Trash2, 
  Calendar,
  Filter,
  Copy,
  Eye
} from 'lucide-react';
import { PromptHistory as PromptHistoryType } from '@/lib/types';
import { useToast } from '@/hooks/useToast';

interface PromptHistoryProps {
  history: PromptHistoryType[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
  onViewPrompt: (item: PromptHistoryType) => void;
}

export function PromptHistory({ 
  history, 
  favorites, 
  onToggleFavorite, 
  onClearHistory,
  onViewPrompt 
}: PromptHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const { toast } = useToast();

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.input.corePromptIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.output.primaryResult.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === 'all' || item.input.promptMode.toLowerCase() === filterMode.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const favoriteItems = history.filter(item => favorites.includes(item.id));

  const copyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard!",
        description: "The prompt has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const HistoryItem = ({ item }: { item: PromptHistoryType }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{item.input.promptMode}</Badge>
            <span className="text-xs text-gray-500">
              {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(item.id)}
              className={favorites.includes(item.id) ? 'text-red-500' : 'text-gray-400'}
            >
              <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyPrompt(item.output.primaryResult)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewPrompt(item)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Original Idea:</p>
            <p className="text-sm text-gray-600 line-clamp-2">{item.input.corePromptIdea}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Enhanced Result:</p>
            <p className="text-sm text-gray-600 line-clamp-3">{item.output.primaryResult}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Prompt History
          </CardTitle>
          {history.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearHistory}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="all">All Modes</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="code">Code</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              All History ({filteredHistory.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favoriteItems.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {history.length === 0 ? (
                  <p>No prompts generated yet. Create your first enhanced prompt!</p>
                ) : (
                  <p>No prompts match your search criteria.</p>
                )}
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {filteredHistory.map(item => (
                  <HistoryItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            {favoriteItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No favorite prompts yet. Click the heart icon to save prompts!</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {favoriteItems.map(item => (
                  <HistoryItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}