import { PromptHistory } from './types';

const STORAGE_KEY = 'jenga-prompts-history';
const FAVORITES_KEY = 'jenga-prompts-favorites';

export class LocalStorage {
  static getHistory(): PromptHistory[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  static saveToHistory(item: PromptHistory): void {
    if (typeof window === 'undefined') return;
    
    try {
      const history = this.getHistory();
      const newHistory = [item, ...history.slice(0, 49)]; // Keep last 50 items
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  static getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  static toggleFavorite(id: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavorites();
      const newFavorites = favorites.includes(id)
        ? favorites.filter(fav => fav !== id)
        : [...favorites, id];
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  static clearHistory(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
}