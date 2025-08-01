import { useState, useEffect } from 'react';
import { PromptHistory } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';

export function usePromptHistory() {
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setHistory(LocalStorage.getHistory());
    setFavorites(LocalStorage.getFavorites());
  }, []);

  const addToHistory = (item: PromptHistory) => {
    LocalStorage.saveToHistory(item);
    setHistory(prev => [item, ...prev.slice(0, 49)]);
  };

  const toggleFavorite = (id: string) => {
    LocalStorage.toggleFavorite(id);
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const clearHistory = () => {
    LocalStorage.clearHistory();
    setHistory([]);
    setFavorites([]);
  };

  const getFavoriteItems = () => {
    return history.filter(item => favorites.includes(item.id));
  };

  return {
    history,
    favorites,
    addToHistory,
    toggleFavorite,
    clearHistory,
    getFavoriteItems,
  };
}