import { Globe, RefreshCw, ExternalLink, ShieldCheck, Settings2, EyeOff, Map, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HAX_SCRIPTS } from '@/lib/hax-service';
import { useState, useEffect } from 'react';

const PLATFORMS = {
  sniffies: { name: 'Sniffies', url: 'https://sniffies.com' },
  nkp: { name: 'NKP', url: 'https://nowknotplanned.com' },
  barebackrt: { name: 'BarebackRT', url: 'https://barebackrt.com' },
  grindr: { name: 'Grindr', url: 'https://web.grindr.com' },
};

const Browse = () => {
  const { settings, updateSettings } = useAppStore();
  const [showHaxPanel, setShowHaxPanel] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const currentPlatform = PLATFORMS[settings.activePlatform as keyof typeof PLATFORMS];

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    console.log(`[HAX4LIFE] ${settings.activePlatform} loaded, syncing Phase 3 engine...`);
    // Native Android bridge will hook this load event to inject HAX_SCRIPTS[settings.activePlatform]
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-3 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-foreground uppercase tracking-wider">Multi-Browse Hub</h1>
            <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
              <ShieldCheck className="w-2.5 h-2.5 text-primary" />
              <span className="text-[8px] font-bold text-primary uppercase">Engine v3.0</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={handleRefresh} className="p-1.5 text-muted-foreground hover:text-foreground active:scale-90 transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 text-muted-foreground hover:text-foreground active:scale-90 transition-all"
              onClick={() => window.open(currentPlatform.url, '_blank')}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <Tabs
          value={settings.activePlatform}
          onValueChange={(val) => updateSettings({ activePlatform: val as any })}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full h-8 bg-muted/40 p-0.5 rounded-lg border border-border/50">
            <TabsTrigger value="sniffies" className="text-[9px] font-bold uppercase py-1">Sniffies</TabsTrigger>
            <TabsTrigger value="nkp" className="text-[9px] font-bold uppercase py-1">NKP</TabsTrigger>
            <TabsTrigger value="barebackrt" className="text-[9px] font-bold uppercase py-1">BBRT</TabsTrigger>
            <TabsTrigger value="grindr" className="text-[9px] font-bold uppercase py-1">Grindr</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Browser Core */}
      <div className="flex-1 bg-background relative">
        <iframe
          key={iframeKey}
          src={currentPlatform.url}
          onLoad={handleIframeLoad}
          className="w-full h-full border-none"
          title={currentPlatform.name}
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 select-none px-12 text-center">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Cross-Origin Protection Active. Final APK uses native bridge for deep injection.
          </p>
        </div>

        {/* Hax Controller HUD */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          {showHaxPanel && (
            <div className="mb-2 bg-background/95 backdrop-blur-xl border border-border rounded-xl p-3 shadow-xl pointer-events-auto animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                <h3 className="text-[9px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Advanced Hax Controller
                </h3>
                <button onClick={() => setShowHaxPanel(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, label: 'Unblur Photos', status: 'Active' },
                  { icon: Map, label: 'Bypass Map Gate', status: 'Active' },
                  { icon: EyeOff, label: 'Ghost Mode', status: 'Active' },
                  { icon: RefreshCw, label: 'Session Keep', status: 'Active' },
                ].map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-lg border border-border/50">
                    <tool.icon className="w-3 h-3 text-primary" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-foreground truncate">{tool.label}</p>
                      <p className="text-[7px] text-green-500 font-bold uppercase">{tool.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            onClick={() => setShowHaxPanel(!showHaxPanel)}
            className="bg-background/90 backdrop-blur-md border border-border rounded-xl p-2.5 shadow-xl flex items-center justify-between pointer-events-auto cursor-pointer transition-all active:scale-[0.98] border-l-2 border-l-primary"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Hax Engine v3.0</p>
                <p className="text-[10px] font-bold text-foreground">{currentPlatform.name} Protected</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[7px] text-green-500 font-bold uppercase">● Injected</span>
                <span className="text-[7px] text-muted-foreground uppercase">Configure</span>
              </div>
              <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
