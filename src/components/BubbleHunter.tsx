import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Sparkles, Target, Shield, Search } from 'lucide-react';
import { scanProfileVision } from '@/lib/ai-service';
import { toast } from 'sonner';

const BubbleHunter = () => {
  const { settings, updateSettings } = useAppStore();
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<{ id: string; match: boolean; reason: string }[]>([]);

  const startScan = async () => {
    if (!settings.geminiKey) {
      toast.error("Gemini API key required for Vision Hunter");
      return;
    }
    setScanning(true);
    // Mock profiles to scan (in real app, this would be scraped from the active platform)
    const mockProfiles = [
      { id: 'p1', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' },
      { id: 'p2', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
    ];

    for (const p of mockProfiles) {
      // In a real implementation, we'd fetch the actual image data
      // Here we simulate a match
      setResults(prev => [...prev, { id: p.id, match: true, reason: "Matches athletic preference" }]);
      await new Promise(r => setTimeout(r, 1500));
    }
    setScanning(false);
    toast.success("Scan complete. 2 matches found nearby.");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <span className="text-sm font-black text-foreground uppercase tracking-tight">AI Vision Hunter</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
          Gemini Vision scans nearby profile pics for your specific "Target Type".
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Target Description</label>
            <input
              value={settings.autoPilotTargetType}
              onChange={(e) => updateSettings({ autoPilotTargetType: e.target.value })}
              className="w-full bg-secondary border-none h-9 text-xs rounded-xl px-3 mt-1 focus:ring-1 ring-primary"
              placeholder="e.g. Athletic, bearded, tattoos..."
            />
          </div>

          <button
            onClick={startScan}
            disabled={scanning}
            className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-black rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {scanning ? <Search className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            {scanning ? 'Scanning Area...' : 'Start Vision Scan'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Recent Matches</p>
        {results.map((r, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl animate-in slide-in-from-left duration-300">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground">Potential Match</p>
              <p className="text-[10px] text-muted-foreground truncate">{r.reason}</p>
            </div>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BubbleHunter;
