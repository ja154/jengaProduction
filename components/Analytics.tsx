import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Heart, 
  Zap,
  Calendar,
  Target
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

export function Analytics() {
  const stats = analytics.getStats();
  const recentEvents = analytics.getEvents(10);

  const getModeIcon = (mode: string) => {
    const icons = {
      Text: '📝',
      Image: '🎨',
      Video: '🎬',
      Audio: '🎵',
      Code: '💻'
    };
    return icons[mode as keyof typeof icons] || '📝';
  };

  const getEventDescription = (event: any) => {
    switch (event.event) {
      case 'prompt_generated':
        return `Generated ${event.properties?.mode || 'Text'} prompt`;
      case 'prompt_favorited':
        return 'Added prompt to favorites';
      case 'prompt_unfavorited':
        return 'Removed prompt from favorites';
      case 'prompt_copied':
        return 'Copied prompt to clipboard';
      case 'prompt_downloaded':
        return 'Downloaded prompt';
      case 'prompt_shared':
        return 'Shared prompt';
      default:
        return event.event.replace(/_/g, ' ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.promptsGenerated}</p>
                <p className="text-sm text-gray-600">Prompts Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.favoritePrompts}</p>
                <p className="text-sm text-gray-600">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-lg font-bold flex items-center">
                  {getModeIcon(stats.mostUsedMode)} {stats.mostUsedMode}
                </p>
                <p className="text-sm text-gray-600">Most Used Mode</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Usage Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Goal (10 prompts)</span>
                <span>{Math.min(stats.promptsGenerated, 10)}/10</span>
              </div>
              <Progress value={(stats.promptsGenerated / 10) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Favorite Rate</span>
                <span>{stats.promptsGenerated > 0 ? Math.round((stats.favoritePrompts / stats.promptsGenerated) * 100) : 0}%</span>
              </div>
              <Progress 
                value={stats.promptsGenerated > 0 ? (stats.favoritePrompts / stats.promptsGenerated) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ) : (
                recentEvents.reverse().map((event, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{getEventDescription(event)}</p>
                      <p className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {event.properties?.mode && (
                      <Badge variant="secondary" className="text-xs">
                        {getModeIcon(event.properties.mode)} {event.properties.mode}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}