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
      toast.error('Gemini Key required');
      return;
    }
    setScanning(true);
    setTimeout(() => {
      setResults([
        { id: '1', match: 95, analysis: 'Matches preferences (Athletic, Bearded).', isSuspect: false },
        { id: '2', match: 40, analysis: 'Low similarity. Body type mismatch.', isSuspect: false },
        { id: '3', match: 88, analysis: 'Strong match. Warning: Possible studio shot.', isSuspect: true },
      ]);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="p-3 space-y-3 overflow-y-auto max-h-[340px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-[10px] font-bold uppercase tracking-wider">AI Vision Hunter</h3>
        </div>
        <button
          onClick={startScan}
          disabled={scanning}
          className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
        >
          {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">Targeting Preferences</span>
          <Filter className="w-3 h-3 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-1">
          {['Athletic', 'Toned', 'Bearded', 'Masc'].map(pref => (
            <span key={pref} className="px-2 py-0.5 bg-background text-foreground text-[8px] font-medium rounded-md border border-border">
              {pref}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {results.map((res) => (
          <div key={res.id} className="p-3 bg-background border border-border rounded-xl group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold">Profile #{res.id}</span>
              </div>
              <div className="px-1.5 py-0.5 bg-primary/5 text-primary text-[9px] font-bold rounded">
                {res.match}% MATCH
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2.5 leading-relaxed">
              {res.analysis}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              {res.isSuspect ? (
                <div className="flex items-center gap-1 text-amber-600">
                  <ShieldAlert className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase">Catfish Alert</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-600">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase">Verified</span>
                </div>
              )}
              <button className="text-[9px] font-bold text-primary uppercase group-hover:underline">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BubbleHunter;
