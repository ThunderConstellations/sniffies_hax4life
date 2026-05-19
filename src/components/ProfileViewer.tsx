import React from 'react';
import { useAppStore, type Conversation } from '@/lib/store';
import { User, MapPin, Clock, Star, ShieldCheck, MessageCircle, X } from 'lucide-react';

interface ProfileViewerProps {
  convo: Conversation;
  onClose: () => void;
}

const ProfileViewer = ({ convo, onClose }: ProfileViewerProps) => {
  const { savedProfiles, saveProfile, unsaveProfile } = useAppStore();
  const isSaved = savedProfiles.includes(convo.id);

  return (
    <div className="flex flex-col h-full bg-background animate-in slide-in-from-bottom duration-300">
      {/* Cover Image Placeholder */}
      <div className="relative h-64 bg-muted border-b border-border overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
          <User className="w-24 h-24" />
        </div>

        {/* Header Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
           <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
              <X className="w-5 h-5" />
           </button>
           <div className="flex gap-2">
              <button
                onClick={() => isSaved ? unsaveProfile(convo.id) : saveProfile(convo.id)}
                className={`p-2 backdrop-blur-md rounded-full transition-all ${isSaved ? 'bg-primary text-primary-foreground' : 'bg-black/40 text-white hover:bg-black/60'}`}
              >
                 <Star className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
           </div>
        </div>

        {/* Profile Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent pt-20">
           <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{convo.userName}</h1>
              {convo.online && <div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-background shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
           </div>
           <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-primary"><MapPin className="w-3.5 h-3.5" /> {convo.distance}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {convo.lastSeen || 'Active Now'}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
        {/* Core Stats */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Position', value: convo.stats?.position || 'N/A' },
             { label: 'Body Type', value: convo.stats?.bodyType || 'N/A' },
             { label: 'Age', value: convo.stats?.age || 'N/A' },
             { label: 'Status', value: 'Verified' }
           ].map(stat => (
             <div key={stat.label} className="p-3 bg-muted/30 border border-border rounded-xl">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xs font-bold text-foreground uppercase tracking-tight">{stat.value}</p>
             </div>
           ))}
        </div>

        {/* Tags */}
        <div className="space-y-3">
           <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Interests / Looking For</h3>
           <div className="flex flex-wrap gap-2">
              {(convo.stats?.lookingFor || ['Chat', 'Fun', 'Plans']).map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase rounded-lg">
                  {tag}
                </span>
              ))}
           </div>
        </div>

        {/* Verification Badge */}
        <div className="p-4 bg-muted/20 border border-border rounded-2xl flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                 <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                 <p className="text-[11px] font-black text-foreground uppercase">Hax Identity Guard</p>
                 <p className="text-[10px] text-muted-foreground">Authenticity Score: 98%</p>
              </div>
           </div>
        </div>
      </div>

      {/* Floating Action: Message */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
         <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <MessageCircle className="w-5 h-5 fill-current" />
            Open Transmission
         </button>
      </div>
    </div>
  );
};

export default ProfileViewer;
