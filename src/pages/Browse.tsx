import { Globe, RefreshCw, ExternalLink } from 'lucide-react';

const Browse = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Browse</h1>
        <div className="flex gap-2">
          <button className="p-2 text-muted-foreground active:scale-90">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground active:scale-90">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WebView placeholder — in Capacitor this will be an actual WebView to sniffies.com */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Globe className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Sniffies WebView</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          When running as an APK, this tab loads Sniffies in an embedded browser. Your session stays active in the background to keep you online.
        </p>
        <div className="bg-secondary rounded-xl p-4 w-full max-w-xs">
          <p className="text-xs text-muted-foreground mb-2">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-online animate-pulse" />
            <span className="text-sm text-foreground">Session Active (Demo)</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Build the APK with Capacitor to enable the live WebView
        </p>
      </div>
    </div>
  );
};

export default Browse;
