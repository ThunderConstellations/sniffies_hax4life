import React from 'react';
import { useAppStore } from '@/lib/store';
import { MapPin, Navigation, Crosshair } from 'lucide-react';

const BubbleRadar = () => {
  const { settings } = useAppStore();

  return (
    <div className="p-4 space-y-4">
      <div className="relative w-full aspect-square rounded-full border-2 border-primary/20 bg-primary/5 overflow-hidden flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute w-3/4 h-3/4 border border-primary/10 rounded-full" />
        <div className="absolute w-1/2 h-1/2 border border-primary/10 rounded-full" />

        {/* Radar Sweep */}
        <div className="absolute inset-0 bg-conic-gradient from-primary/20 to-transparent animate-spin-slow origin-center" />

        {/* Simulated Pings */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_primary]" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse delay-700 shadow-[0_0_8px_primary]" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-primary rounded-full animate-pulse delay-1000 shadow-[0_0_8px_primary]" />

        <Crosshair className="w-6 h-6 text-primary/40 relative z-10" />
      </div>

      <div className="bg-secondary/50 p-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-[11px] font-medium text-foreground">Current: Downtown Hub</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold active:scale-95 transition-transform">
          <Navigation className="w-3 h-3" />
          Teleport
        </button>
      </div>
    </div>
  );
};

export default BubbleRadar;
