import { Globe, RefreshCw, ExternalLink, ShieldCheck, Settings2, EyeOff, Map, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HAX_SCRIPTS } from '@/lib/hax-service';
import { useState } from 'react';

const PLATFORMS = {
  sniffies: { name: 'Sniffies', url: 'https://sniffies.com' },
  nkp: { name: 'NKP', url: 'https://nowknotplanned.com' },
  barebackrt: { name: 'BarebackRT', url: 'https://barebackrt.com' },
  grindr: { name: 'Grindr', url: 'https://web.grindr.com' },
};

const Browse = () => {
  const { settings, updateSettings } = useAppStore();
  const [showHaxPanel, setShowHaxPanel] = useState(false);
  const currentPlatform = PLATFORMS[settings.activePlatform as keyof typeof PLATFORMS];

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    // Note: Cross-origin restrictions apply in standard browsers.
    // This is a placeholder for where the Capacitor WebView injection occurs.
    console.log(`[HAX4LIFE] Loaded ${settings.activePlatform}, applying scripts...`);
    try {
      const iframe = e.currentTarget;
      // In Capacitor, we use native bridge to inject HAX_SCRIPTS[settings.activePlatform]
    } catch (err) {
      console.warn("Cross-origin restriction prevented browser-side injection. Native WebView will handle this.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">Multi-Browse</h1>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase">Hax Active</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 text-muted-foreground hover:text-foreground active:scale-90 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-muted-foreground hover:text-foreground active:scale-90 transition-colors"
              onClick={() => window.open(currentPlatform.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Tabs
          value={settings.activePlatform}
          onValueChange={(val) => updateSettings({ activePlatform: val as any })}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full h-9 bg-muted/50 p-1">
            <TabsTrigger value="sniffies" className="text-[10px] py-1">Sniffies</TabsTrigger>
            <TabsTrigger value="nkp" className="text-[10px] py-1">NKP</TabsTrigger>
            <TabsTrigger value="barebackrt" className="text-[10px] py-1">BBRT</TabsTrigger>
            <TabsTrigger value="grindr" className="text-[10px] py-1">Grindr</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Actual Browser Instance */}
      <div className="flex-1 bg-background relative">
        <iframe
          src={currentPlatform.url}
          onLoad={handleIframeLoad}
          className="w-full h-full border-none"
          title={currentPlatform.name}
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />

        {/* Iframe Restriction Warning (Only in Dev/Browser) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
          <p className="text-[10px] font-bold text-muted-foreground max-w-[200px] text-center">
            Standard browsers may block framing. Use the Hax4Life APK to bypass security headers via native WebView.
          </p>
        </div>

        {/* Hax Overlay HUD */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          {showHaxPanel && (
            <div className="mb-3 bg-card/95 backdrop-blur-lg border border-border rounded-2xl p-4 shadow-2xl pointer-events-auto animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> Hax Toolbox
                </h3>
                <button onClick={() => setShowHaxPanel(false)} className="text-muted-foreground hover:text-foreground">
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, label: 'Paywall Bypass', status: 'ON' },
                  { icon: Map, label: 'Unblur Map', status: 'ON' },
                  { icon: EyeOff, label: 'Ghost Mode', status: 'ON' },
                  { icon: Zap, label: 'Fast Load', status: 'ON' },
                ].map((tool, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 bg-secondary/50 rounded-xl border border-border/50">
                    <tool.icon className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-foreground">{tool.label}</p>
                      <p className="text-[8px] text-online font-black uppercase">{tool.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            onClick={() => setShowHaxPanel(!showHaxPanel)}
            className="bg-card/90 backdrop-blur-md border border-primary/20 rounded-2xl p-3 shadow-2xl flex items-center justify-between pointer-events-auto cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Hax4Life Active</p>
                <p className="text-xs font-bold text-foreground">{currentPlatform.name} Protected</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[9px] text-online font-bold">● BYPASS ACTIVE</span>
                <span className="text-[9px] text-muted-foreground">Tap for Toolbox</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
