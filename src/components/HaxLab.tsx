import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Code, Terminal, Play, Save, Trash2, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

const HaxLab = () => {
  const { settings, updateSettings } = useAppStore();
  const [js, setJs] = useState(settings.labCustomJS);
  const [css, setCss] = useState(settings.labCustomCSS);

  const handleSave = () => {
    updateSettings({ labCustomJS: js, labCustomCSS: css });
    toast.success('Hax configuration saved to Engine core');
  };

  const clearLab = () => {
    setJs('');
    setCss('');
    updateSettings({ labCustomJS: '', labCustomCSS: '' });
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 border-b border-border bg-muted/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <h2 className="text-[11px] font-black uppercase tracking-widest">Hax Lab: Dev Console</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="p-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
               <Save className="w-3.5 h-3.5" />
            </button>
            <button onClick={clearLab} className="p-1.5 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
               <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
          Inject custom logic into active platform instances. Direct DOM access enabled.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* JS Console */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
             <Code className="w-3 h-3 text-yellow-500" />
             <span className="text-[9px] font-black text-muted-foreground uppercase">Script Injection (.js)</span>
          </div>
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            placeholder="// window.app.setPremium(true); ..."
            className="w-full h-40 bg-muted/30 border border-border rounded-xl p-3 text-[10px] font-mono text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* CSS Console */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
             <Zap className="w-3 h-3 text-primary" />
             <span className="text-[9px] font-black text-muted-foreground uppercase">UI Modification (.css)</span>
          </div>
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder=".paywall { display: none !important; } ..."
            className="w-full h-40 bg-muted/30 border border-border rounded-xl p-3 text-[10px] font-mono text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Status HUD */}
        <div className="p-4 bg-muted/20 border border-border rounded-2xl flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                 <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-foreground uppercase tracking-wider">Engine Sandbox</p>
                 <p className="text-[9px] text-muted-foreground">Virtual Machine Isolated</p>
              </div>
           </div>
           <div className="px-2 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase rounded border border-green-500/20">
              Live
           </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6 z-50">
         <button onClick={handleSave} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <Play className="w-4 h-4 fill-current" />
            Apply Core Changes
         </button>
      </div>
    </div>
  );
};

export default HaxLab;
