import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Target, Search, Filter, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { scanProfileVision } from '@/lib/ai-service';
import { toast } from 'sonner';

const BubbleHunter = () => {
  const { settings } = useAppStore();
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<{ id: string; match: number; analysis: string; isSuspect: boolean }[]>([]);

  const startScan = async () => {
    if (!settings.geminiKey) {
      toast.error('Gemini Key required for Vision Hunter');
      return;
    }
    setScanning(true);
    // Simulate scanning local/nearby profiles
    setTimeout(() => {
      setResults([
        { id: '1', match: 95, analysis: 'Perfect match for preferences (Athletic, Bearded).', isSuspect: false },
        { id: '2', match: 40, analysis: 'Low similarity. Body type does not match.', isSuspect: false },
        { id: '3', match: 88, analysis: 'Strong match. Note: Image resolution is very high, possible studio shot.', isSuspect: true },
      ]);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-black uppercase tracking-tight">AI Vision Hunter</h3>
        </div>
        <button
          onClick={startScan}
          disabled={scanning}
          className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-3 bg-secondary/30 rounded-2xl border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-muted-foreground uppercase">Targeting Preferences</span>
          <Filter className="w-3 h-3 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Athletic', 'Toned', 'Bearded', 'Masc'].map(pref => (
            <span key={pref} className="px-2 py-0.5 bg-primary/5 text-primary text-[9px] font-bold rounded-md border border-primary/10">
              {pref}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {results.map((res) => (
          <div key={res.id} className="p-3 bg-card border border-border/50 rounded-2xl group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-black">Profile #{res.id}</span>
              </div>
              <div className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg">
                {res.match}% MATCH
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
              {res.analysis}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              {res.isSuspect ? (
                <div className="flex items-center gap-1.5 text-amber-500">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase">Catfish Warning</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-green-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase">Verified Authentic</span>
                </div>
              )}
              <button className="text-[10px] font-black text-primary uppercase group-hover:underline">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BubbleHunter;
