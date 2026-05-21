import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Search, Users } from 'lucide-react';

const SniffiesMap = () => {
  const { conversations } = useAppStore();
  const [noses, setNoses] = useState<{ x: number; y: number; type: string; name?: string }[]>([]);

  useEffect(() => {
    // Generate clusters based on REAL conversation data if available
    const liveNoses = conversations.map(c => ({
       x: 20 + Math.random() * 60,
       y: 20 + Math.random() * 60,
       type: 'user',
       name: c.userName
    }));

    const hotspots = Array.from({ length: 5 }, () => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      type: 'hotspot'
    }));

    setNoses([...liveNoses, ...hotspots]);
  }, [conversations]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
         <div className="flex-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 flex items-center gap-3 shadow-2xl">
            <Search className="w-3.5 h-3.5 text-primary" />
            <input
               placeholder="SCANNING AREA..."
               className="bg-transparent border-none text-[9px] font-black uppercase tracking-[0.2em] text-white outline-none w-full"
            />
         </div>
         <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xl">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-black text-white">{conversations.length}</span>
         </div>
      </div>

      {/* Map Body */}
      <div className="flex-1 relative">
         <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle, #00BCD4 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

         {noses.map((n, i) => (
           <div
             key={i}
             className={`absolute transition-all duration-1000 ${
               n.type === 'hotspot' ? 'z-10' : 'z-20'
             }`}
             style={{ left: `${n.x}%`, top: `${n.y}%` }}
           >
             {n.type === 'hotspot' ? (
                <div className="relative">
                   <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/50 animate-ping absolute -inset-1" />
                   <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-500 fill-current" />
                   </div>
                </div>
             ) : (
                <div className="group relative">
                   <div className="w-3 h-3 bg-primary rounded-full border-2 border-white/20 shadow-[0_0_10px_rgba(0,188,212,0.5)] group-hover:scale-150 transition-transform cursor-pointer" />
                   <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-black/90 rounded border border-white/10 text-[6px] font-black text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {n.name}
                   </div>
                </div>
             )}
           </div>
         ))}
      </div>

      {/* HUD Controls */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-20">
         <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 flex flex-col gap-1 shadow-2xl">
            <button className="p-2 text-white/40 hover:text-primary transition-colors"><Compass className="w-4 h-4" /></button>
            <div className="h-px bg-white/5" />
            <button className="p-2 text-white/40 hover:text-primary transition-colors"><Layers className="w-4 h-4" /></button>
         </div>
         <div className="bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xl">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">Injected</span>
         </div>
      </div>

      <button className="absolute bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[0_0_25px_rgba(0,188,212,0.4)] flex items-center justify-center active:scale-90 transition-all z-20">
         <Navigation className="w-6 h-6 fill-current animate-pulse" />
      </button>
    </div>
  );
};

export default SniffiesMap;
