import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Shield, Bell, Wifi, Battery, Download, Eye, Lock } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings, setUnlocked } = useAppStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="px-4 pb-24 space-y-3">
        {/* Connection */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wifi className="w-4 h-4 text-primary" /> Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Login Method</label>
              <Select
                value={settings.loginMethod}
                onValueChange={(v) => updateSettings({ loginMethod: v as any })}
              >
                <SelectTrigger className="bg-secondary border-none h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webview">Embedded WebView</SelectItem>
                  <SelectItem value="chrome">Chrome Session</SelectItem>
                  <SelectItem value="sniffies-app">Sniffies App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Auto Online</p>
                <p className="text-[11px] text-muted-foreground">Stay visible on Sniffies</p>
              </div>
              <Switch
                checked={settings.autoOnline}
                onCheckedChange={(v) => updateSettings({ autoOnline: v })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Poll interval: {settings.pollingInterval}s
              </label>
              <Slider
                value={[settings.pollingInterval]}
                onValueChange={([v]) => updateSettings({ pollingInterval: v })}
                min={5}
                max={60}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sound</label>
              <Select
                value={settings.notificationSound}
                onValueChange={(v) => updateSettings({ notificationSound: v })}
              >
                <SelectTrigger className="bg-secondary border-none h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="silent">Silent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bubble */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Chat Bubble
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Size: {settings.bubbleSize}px
              </label>
              <Slider
                value={[settings.bubbleSize]}
                onValueChange={([v]) => updateSettings({ bubbleSize: v })}
                min={40}
                max={80}
                step={4}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Opacity: {settings.bubbleOpacity}%
              </label>
              <Slider
                value={[settings.bubbleOpacity]}
                onValueChange={([v]) => updateSettings({ bubbleOpacity: v })}
                min={40}
                max={100}
                step={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Battery */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Battery className="w-4 h-4 text-primary" /> Battery
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Battery Saver</p>
                <p className="text-[11px] text-muted-foreground">Reduce polling frequency</p>
              </div>
              <Switch
                checked={settings.batterySaver}
                onCheckedChange={(v) => updateSettings({ batterySaver: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Backup */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" /> Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Auto Backup</p>
                <p className="text-[11px] text-muted-foreground">Save chats locally</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(v) => updateSettings({ autoBackup: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Incognito Mode</p>
                <p className="text-[11px] text-muted-foreground">Disguise as calculator</p>
              </div>
              <Switch
                checked={settings.incognitoEnabled}
                onCheckedChange={(v) => updateSettings({ incognitoEnabled: v })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">PIN Code</label>
              <Input
                type="password"
                value={settings.pin}
                onChange={(e) => updateSettings({ pin: e.target.value })}
                className="bg-secondary border-none h-9 text-sm"
                maxLength={8}
              />
            </div>
            <button
              onClick={() => setUnlocked(false)}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <Lock className="w-4 h-4" /> Lock App Now
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
