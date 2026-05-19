import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Search } from 'lucide-react';

const SniffiesMap = () => {
  const { settings } = useAppStore();
  const [noses, setNoses] = useState<{ x: number; y: number; type: string }[]>([]);

  useEffect(() => {
    // Generate cluster of "noses" (mock profiles)
    const newNoses = Array.from({ length: 25 }, () => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      type: Math.random() > 0.8 ? 'hotspot' : 'user'
    }));
    setNoses(newNoses);
  }, []);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
         <div className="flex-1 bg-background/80 backdrop-blur-md border border-border rounded-xl px-3 py-2 flex items-center gap-3 shadow-lg">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
               placeholder="SEARCH AREA..."
               className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest outline-none w-full"
            />
         </div>
         <button className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg active:scale-95 transition-transform">
            <Navigation className="w-4 h-4 fill-current" />
         </button>
      </div>

      {/* Map Canvas Mock */}
      <div className="flex-1 bg-[#0a0a0c] relative">
         {/* Grid Lines */}
         <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

         {/* User Noses */}
         {noses.map((n, i) => (
           <div
             key={i}
             className={`absolute w-2.5 h-2.5 rounded-full border border-background shadow-sm animate-in fade-in zoom-in duration-500 ${
               n.type === 'hotspot' ? 'bg-orange-500 scale-125' : 'bg-primary'
             }`}
             style={{ left: `${n.x}%`, top: `${n.y}%` }}
           />
         ))}

         {/* Hotspot Markers */}
         <div className="absolute top-1/3 left-1/4 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center animate-pulse">
               <MapPin className="w-4 h-4 text-orange-500 fill-current" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-black/80 rounded border border-white/10 text-[7px] font-black text-white uppercase whitespace-nowrap">
               West Hollywood Cruising
            </div>
         </div>
      </div>

      {/* Map HUD */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-20">
         <div className="px-2.5 py-1.5 bg-background/90 border border-border rounded-lg flex items-center gap-2 shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-black text-foreground uppercase tracking-tighter">Bypass Active</span>
         </div>
         <div className="flex gap-2">
            <button className="p-2 bg-background/90 border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors">
               <Compass className="w-4 h-4" />
            </button>
            <button className="p-2 bg-background/90 border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors">
               <Layers className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* Floating Action Button: Rapid Scan */}
      <button className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center animate-pulse-bubble z-20 active:scale-90 transition-transform">
         <Search className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SniffiesMap;
