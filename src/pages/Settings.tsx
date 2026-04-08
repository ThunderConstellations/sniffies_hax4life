import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Shield, Bell, Wifi, Battery, Download, Eye, Lock, Palette, Type, Moon, FileText, Vibrate } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, updateSettings, setUnlocked, exportAllConversations } = useAppStore();

  const handleExportAll = () => {
    const data = exportAllConversations();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sniffbubble-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exported successfully');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">SniffBubble v1.0</p>
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
                  <SelectItem value="chrome">Chrome Session (Default)</SelectItem>
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
              <label className="text-xs text-muted-foreground mb-1 block">Default Sound</label>
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
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="silent">Silent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-foreground">Vibrate</p>
              </div>
              <Switch
                checked={settings.notificationVibrate}
                onCheckedChange={(v) => updateSettings({ notificationVibrate: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-foreground">Do Not Disturb</p>
                </div>
                <p className="text-[11px] text-muted-foreground ml-6">Silence during set hours</p>
              </div>
              <Switch
                checked={settings.dndEnabled}
                onCheckedChange={(v) => updateSettings({ dndEnabled: v })}
              />
            </div>
            {settings.dndEnabled && (
              <div className="flex gap-2 ml-6">
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground">Start</label>
                  <Input
                    type="time"
                    value={settings.dndStart}
                    onChange={(e) => updateSettings({ dndStart: e.target.value })}
                    className="bg-secondary border-none h-8 text-xs"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground">End</label>
                  <Input
                    type="time"
                    value={settings.dndEnd}
                    onChange={(e) => updateSettings({ dndEnd: e.target.value })}
                    className="bg-secondary border-none h-8 text-xs"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" /> Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Theme</label>
              <Select
                value={settings.theme}
                onValueChange={(v) => updateSettings({ theme: v as any })}
              >
                <SelectTrigger className="bg-secondary border-none h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="midnight">Midnight</SelectItem>
                  <SelectItem value="amoled">AMOLED Black</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Font Size: {settings.fontSize}px
              </label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([v]) => updateSettings({ fontSize: v })}
                min={12}
                max={20}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chat Bubble */}
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Show Distance</p>
              <Switch
                checked={settings.showDistance}
                onCheckedChange={(v) => updateSettings({ showDistance: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Read Receipts</p>
              <Switch
                checked={settings.showReadReceipts}
                onCheckedChange={(v) => updateSettings({ showReadReceipts: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Typing Indicator</p>
              <Switch
                checked={settings.showTypingIndicator}
                onCheckedChange={(v) => updateSettings({ showTypingIndicator: v })}
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
                <p className="text-[11px] text-muted-foreground">Reduce polling to 60s</p>
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
              <Download className="w-4 h-4 text-primary" /> Backup & Export
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
            {settings.autoBackup && (
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Backup every {settings.backupInterval}h
                </label>
                <Slider
                  value={[settings.backupInterval]}
                  onValueChange={([v]) => updateSettings({ backupInterval: v })}
                  min={1}
                  max={72}
                  step={1}
                />
              </div>
            )}
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 text-sm text-primary w-full py-2 px-3 bg-primary/10 rounded-lg"
            >
              <FileText className="w-4 h-4" /> Export All Chats as JSON
            </button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Security & Incognito
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Auto-download Media</p>
              <Switch
                checked={settings.mediaAutoDownload}
                onCheckedChange={(v) => updateSettings({ mediaAutoDownload: v })}
              />
            </div>
            <button
              onClick={() => setUnlocked(false)}
              className="flex items-center gap-2 text-sm text-destructive py-2 px-3 bg-destructive/10 rounded-lg w-full"
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
