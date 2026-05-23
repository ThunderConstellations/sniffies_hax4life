import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Shield, Bot, Eye, Battery, Download, Trash2,
  FileText, Key, Type, Moon, Globe, Terminal, Code,
  Zap, MapPin, ShieldCheck, Lock, Bell, UserPlus, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import HaxLab from '@/components/HaxLab';

const Settings = () => {
  const { settings, updateSettings, setUnlocked, exportAllConversations, identities, activeIdentityId, switchIdentity, addIdentity } = useAppStore();
  const [showLab, setShowLab] = useState(false);

  const handleExportAll = () => {
    const data = exportAllConversations();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hax_backup_${new Date().toISOString()}.json`;
    a.click();
    toast.success('All conversations exported');
  };

  const createIdentity = () => {
     const id = `id${Date.now()}`;
     addIdentity({ id, name: `Profile ${identities.length + 1}`, geminiKey: '', openRouterKey: '', activePlatform: 'sniffies' });
     toast.success('New transmission identity created');
  };

  if (showLab) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border bg-background flex items-center gap-3">
          <button onClick={() => setShowLab(false)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
            <Globe className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-black uppercase tracking-widest">Hax Lab</h1>
        </div>
        <HaxLab />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background animate-in fade-in duration-300">
      <div className="p-6 pb-2">
        <h1 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-1">Engine Configuration</h1>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">System Version 7.0.0 Stable</p>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Elite Hax Lab Entry */}
        <button
          onClick={() => setShowLab(true)}
          className="w-full p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Terminal className="w-5 h-5 text-primary-foreground" />
             </div>
             <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest text-foreground">Open Hax Lab</p>
                <p className="text-[9px] font-bold text-primary uppercase">Manual Script Injection</p>
             </div>
          </div>
          <Zap className="w-4 h-4 text-primary animate-pulse" />
        </button>

        {/* Identity Profiles */}
        <Card className="border-border bg-muted/10">
          <CardHeader className="p-4 pb-2">
             <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Identity Profiles
                </CardTitle>
                <button onClick={createIdentity} className="p-1.5 bg-primary/10 text-primary rounded-lg">
                   <UserPlus className="w-3.5 h-3.5" />
                </button>
             </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
             {identities.map(i => (
               <button
                 key={i.id}
                 onClick={() => switchIdentity(i.id)}
                 className={`w-full flex items-center justify-between p-3 rounded-xl border text-[9px] font-bold uppercase transition-all ${activeIdentityId === i.id ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-background border-border text-muted-foreground'}`}
               >
                  <span>{i.name}</span>
                  {activeIdentityId === i.id && <span className="text-[7px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Active</span>}
               </button>
             ))}
          </CardContent>
        </Card>

        {/* AI & Automation */}
        <Card className="border-border bg-muted/10">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" /> AI & Automation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">AI Auto-Pilot</p>
                <p className="text-[9px] text-muted-foreground uppercase">Mimic user voice pattern</p>
              </div>
              <Switch
                checked={settings.autoPilotEnabled}
                onCheckedChange={(v) => updateSettings({ autoPilotEnabled: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">AI Plan Guard</p>
                <p className="text-[9px] text-muted-foreground uppercase">Monitor meeting intent</p>
              </div>
              <Switch
                checked={settings.planGuardEnabled}
                onCheckedChange={(v) => updateSettings({ planGuardEnabled: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">AI Safety Shield</p>
                <p className="text-[9px] text-muted-foreground uppercase">Risk & Sentiment Analysis</p>
              </div>
              <Switch
                checked={settings.safetyShieldEnabled}
                onCheckedChange={(v) => updateSettings({ safetyShieldEnabled: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Proximity & Stealth */}
        <Card className="border-border bg-muted/10">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Proximity & Stealth
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Proximity Alarm: {settings.proximityAlertRadius}ft</label>
              </div>
              <Slider
                value={[settings.proximityAlertRadius]}
                onValueChange={([v]) => updateSettings({ proximityAlertRadius: v })}
                min={100}
                max={5000}
                step={100}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">Geo-Fencing</p>
                <p className="text-[9px] text-muted-foreground uppercase">Auto-Stealth in safe zones</p>
              </div>
              <Switch
                checked={settings.geoFencingEnabled}
                onCheckedChange={(v) => updateSettings({ geoFencingEnabled: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">Stealth Decoy</p>
                <p className="text-[9px] text-muted-foreground uppercase">Disguise floating bubble</p>
              </div>
              <Switch
                checked={settings.stealthMode}
                onCheckedChange={(v) => updateSettings({ stealthMode: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="border-border bg-muted/10">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Transmissions Core
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Gemini Engine Key</label>
                <input
                  type="password"
                  value={settings.geminiKey}
                  onChange={(e) => updateSettings({ geminiKey: e.target.value })}
                  placeholder="X-KEY-..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono focus:border-primary/50 outline-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">OpenRouter Key</label>
                <input
                  type="password"
                  value={settings.openRouterKey}
                  onChange={(e) => updateSettings({ openRouterKey: e.target.value })}
                  placeholder="SK-..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono focus:border-primary/50 outline-none"
                />
             </div>
          </CardContent>
        </Card>

        {/* Lock App */}
        <button
          onClick={() => setUnlocked(false)}
          className="w-full py-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
        >
          <Lock className="w-4 h-4 inline-block mr-2" /> Kill Session & Lock
        </button>
      </div>
    </div>
  );
};

export default Settings;
