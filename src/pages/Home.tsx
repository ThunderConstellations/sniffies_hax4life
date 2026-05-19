import { useAppStore } from '@/lib/store';
import { Shield, Zap, MessageSquare, Globe, Bot, Star, Activity, Clock, MapPin, Search, Image as ImageIcon, Plus, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';

const Home = () => {
  const { conversations, settings, photoVault, addToVault, removeFromVault } = useAppStore();
  const unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const onlineCount = conversations.filter(c => c.online).length;
  const [activeHomeTab, setActiveHomeTab] = useState<'hub' | 'vault'>('hub');

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="p-5 border-b border-border bg-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Search className="w-5 h-5 text-primary-foreground" />
             </div>
             <div>
                <h1 className="text-sm font-black text-foreground uppercase tracking-widest leading-tight">Sniffies Hax</h1>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">System Engine v5.1.0</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button
               onClick={() => setActiveHomeTab('hub')}
               className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${activeHomeTab === 'hub' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/50 border-border text-muted-foreground'}`}
             >
               Hub
             </button>
             <button
               onClick={() => setActiveHomeTab('vault')}
               className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${activeHomeTab === 'vault' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/50 border-border text-muted-foreground'}`}
             >
               Vault
             </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {activeHomeTab === 'hub' ? (
          <>
            {/* Real-time Telemetry */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 border border-border rounded-xl p-3 flex flex-col gap-1.5 relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase">Inbox</span>
                </div>
                <p className="text-xl font-black tracking-tighter relative z-10">{unreadCount}</p>
                <div className="absolute -bottom-2 -right-2 opacity-5">
                   <MessageSquare className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="bg-muted/30 border border-border rounded-xl p-3 flex flex-col gap-1.5 relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <Activity className="w-3.5 h-3.5 text-online" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase">Proximity</span>
                </div>
                <p className="text-xl font-black tracking-tighter relative z-10">{onlineCount}</p>
                <div className="absolute -bottom-2 -right-2 opacity-5">
                   <Activity className="w-12 h-12 text-online" />
                </div>
              </div>
            </div>

            {/* Engine Status */}
            <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                 <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground">Active Instance</span>
                 </div>
                 <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[8px] font-black uppercase rounded">
                    {settings.activePlatform}
                 </span>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Session Persistence</span>
                    <span className="text-[9px] font-black text-green-500 uppercase">Stable</span>
                 </div>
                 <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4 animate-pulse" />
                 </div>
                 <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                    Encryption layer active. Fingerprinting protection enabled.
                 </p>
              </div>
            </div>

            {/* AI & Spoofing Summary */}
            <div className="grid grid-cols-1 gap-3">
               <div className="p-3 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-foreground">AI Plan Guard</p>
                        <p className="text-[9px] text-muted-foreground">{settings.planGuardEnabled ? 'Protecting Transmissions' : 'Disabled'}</p>
                     </div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${settings.planGuardEnabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-muted-foreground'}`} />
               </div>

               <div className="p-3 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                        <MapPin className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-foreground">GPS Spoofing</p>
                        <p className="text-[9px] text-muted-foreground">Target: Los Angeles, CA</p>
                     </div>
                  </div>
                  <button className="text-[8px] font-black text-primary uppercase border border-primary/30 px-2 py-1 rounded hover:bg-primary/10 transition-colors">Relocate</button>
               </div>
            </div>
          </>
        ) : (
          /* Photo Vault UI */
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between px-1">
                <div>
                   <h2 className="text-xs font-black uppercase tracking-widest">Media Vault</h2>
                   <p className="text-[9px] font-bold text-muted-foreground uppercase">Secured Local Storage</p>
                </div>
                <button
                  onClick={() => addToVault('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 'private')}
                  className="p-2 bg-primary text-primary-foreground rounded-xl shadow-lg active:scale-95 transition-all"
                >
                   <Plus className="w-4 h-4" />
                </button>
             </div>

             <div className="grid grid-cols-3 gap-2">
                {photoVault.length === 0 ? (
                  <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-muted/10 border border-dashed border-border rounded-2xl">
                     <ImageIcon className="w-8 h-8 text-muted-foreground/20 mb-3" />
                     <p className="text-[9px] font-black text-muted-foreground uppercase">Vault is Empty</p>
                  </div>
                ) : (
                  photoVault.map((photo) => (
                    <div key={photo.id} className="relative aspect-square bg-muted rounded-xl overflow-hidden group">
                       <img src={photo.url} alt="Vault" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => removeFromVault(photo.id)} className="p-1.5 bg-destructive text-white rounded-lg">
                             <Trash2 className="w-3 h-3" />
                          </button>
                       </div>
                       {photo.category === 'private' && (
                          <div className="absolute top-1.5 left-1.5">
                             <Lock className="w-3 h-3 text-white fill-current drop-shadow-md" />
                          </div>
                       )}
                    </div>
                  ))
                )}
             </div>

             <div className="p-4 bg-muted/20 border border-border rounded-2xl">
                <h3 className="text-[9px] font-black uppercase text-muted-foreground mb-2">Vault Statistics</h3>
                <div className="flex justify-between text-[10px] font-bold uppercase">
                   <span>Items Stored</span>
                   <span className="text-primary">{photoVault.length}</span>
                </div>
             </div>
          </div>
        )}

        {/* Quick Utility Grid */}
        <div className="space-y-2 pt-2">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Utility Hub</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Zap, label: 'Boost' },
              { icon: Clock, label: 'History' },
              { icon: Star, label: 'Favs' },
            ].map((action, i) => (
              <button key={action.label} className="flex flex-col items-center gap-2 p-3 bg-muted/30 border border-border rounded-xl hover:border-primary/30 transition-all group">
                <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
