import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Download,
  Upload,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { analytics } from '@/lib/analytics';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultMode: string;
  defaultOutputStructure: string;
  autoSave: boolean;
  maxHistoryItems: number;
  enableAnalytics: boolean;
  apiTimeout: number;
  showAdvancedOptions: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  defaultMode: 'Text',
  defaultOutputStructure: 'Descriptive Paragraph',
  autoSave: true,
  maxHistoryItems: 50,
  enableAnalytics: true,
  apiTimeout: 30,
  showAdvancedOptions: false,
};

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('jenga-prompts-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
      toast({
        title: "Settings Error",
        description: "Failed to load settings. Using defaults.",
        variant: "destructive",
      });
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('jenga-prompts-settings', JSON.stringify(settings));
      setHasChanges(false);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to defaults.",
    });
  };

  const exportData = () => {
    try {
      const data = {
        settings,
        history: JSON.parse(localStorage.getItem('jenga-prompts-history') || '[]'),
        favorites: JSON.parse(localStorage.getItem('jenga-prompts-favorites') || '[]'),
        analytics: analytics.getStats(),
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jenga-prompts-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.settings) {
          setSettings({ ...defaultSettings, ...data.settings });
          setHasChanges(true);
        }
        
        if (data.history) {
          localStorage.setItem('jenga-prompts-history', JSON.stringify(data.history));
        }
        
        if (data.favorites) {
          localStorage.setItem('jenga-prompts-favorites', JSON.stringify(data.favorites));
        }

        toast({
          title: "Data Imported",
          description: "Your data has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid backup file. Please check the file and try again.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('jenga-prompts-history');
      localStorage.removeItem('jenga-prompts-favorites');
      localStorage.removeItem('jenga-prompts-analytics');
      analytics.clearData();
      
      toast({
        title: "Data Cleared",
        description: "All application data has been cleared.",
      });
    }
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value: any) => updateSetting('theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="defaultMode">Default Prompt Mode</Label>
                <Select value={settings.defaultMode} onValueChange={(value) => updateSetting('defaultMode', value)}>
                  <SelectTrigger>
                    <SelectValue />
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

              <div>
                <Label htmlFor="defaultOutput">Default Output Structure</Label>
                <Select value={settings.defaultOutputStructure} onValueChange={(value) => updateSetting('defaultOutputStructure', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Descriptive Paragraph">Descriptive Paragraph</SelectItem>
                    <SelectItem value="Simple JSON">Simple JSON</SelectItem>
                    <SelectItem value="Detailed JSON">Detailed JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="maxHistory">Max History Items</Label>
                <Input
                  id="maxHistory"
                  type="number"
                  min="10"
                  max="200"
                  value={settings.maxHistoryItems}
                  onChange={(e) => updateSetting('maxHistoryItems', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                <Input
                  id="apiTimeout"
                  type="number"
                  min="10"
                  max="120"
                  value={settings.apiTimeout}
                  onChange={(e) => updateSetting('apiTimeout', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave">Auto-save prompts</Label>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Enable analytics</Label>
                  <Switch
                    id="analytics"
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => updateSetting('enableAnalytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="advanced">Show advanced options</Label>
                  <Switch
                    id="advanced"
                    checked={settings.showAdvancedOptions}
                    onCheckedChange={(checked) => updateSetting('showAdvancedOptions', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={saveSettings} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button variant="outline" onClick={resetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            
            <div>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                id="import-file"
              />
              <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
            
            <Button variant="destructive" onClick={clearAllData}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Export your data regularly to prevent loss. Clearing data cannot be undone.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}