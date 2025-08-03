interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

interface AnalyticsData {
  sessionId: string;
  userId?: string;
  events: AnalyticsEvent[];
  promptsGenerated: number;
  favoritePrompts: number;
  mostUsedMode: string;
  totalSessions: number;
}

class Analytics {
  private sessionId: string;
  private data: AnalyticsData;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.data = this.loadAnalytics();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadAnalytics(): AnalyticsData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const stored = localStorage.getItem('jenga-prompts-analytics');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          sessionId: this.sessionId,
          events: [],
          totalSessions: (parsed.totalSessions || 0) + 1,
        };
      }
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
    }

    return this.getDefaultData();
  }

  private getDefaultData(): AnalyticsData {
    return {
      sessionId: this.sessionId,
      events: [],
      promptsGenerated: 0,
      favoritePrompts: 0,
      mostUsedMode: 'Text',
      totalSessions: 1,
    };
  }

  private saveAnalytics(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('jenga-prompts-analytics', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  track(event: string, properties?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date(),
    };

    this.data.events.push(analyticsEvent);

    // Update counters based on events
    switch (event) {
      case 'prompt_generated':
        this.data.promptsGenerated++;
        if (properties?.mode) {
          this.updateMostUsedMode(properties.mode);
        }
        break;
      case 'prompt_favorited':
        this.data.favoritePrompts++;
        break;
      case 'prompt_unfavorited':
        this.data.favoritePrompts = Math.max(0, this.data.favoritePrompts - 1);
        break;
    }

    this.saveAnalytics();
  }

  private updateMostUsedMode(mode: string): void {
    const modeEvents = this.data.events.filter(
      e => e.event === 'prompt_generated' && e.properties?.mode === mode
    );
    
    // Simple logic: if this mode has been used more than the current most used, update it
    const currentModeEvents = this.data.events.filter(
      e => e.event === 'prompt_generated' && e.properties?.mode === this.data.mostUsedMode
    );

    if (modeEvents.length > currentModeEvents.length) {
      this.data.mostUsedMode = mode;
    }
  }

  getStats() {
    return {
      promptsGenerated: this.data.promptsGenerated,
      favoritePrompts: this.data.favoritePrompts,
      mostUsedMode: this.data.mostUsedMode,
      totalSessions: this.data.totalSessions,
      sessionId: this.sessionId,
    };
  }

  getEvents(limit?: number): AnalyticsEvent[] {
    return limit ? this.data.events.slice(-limit) : this.data.events;
  }

  clearData(): void {
    this.data = this.getDefaultData();
    this.saveAnalytics();
  }
}

export const analytics = new Analytics();