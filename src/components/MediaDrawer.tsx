import React from 'react';
import { useAppStore } from '@/lib/store';
import { Image as ImageIcon, Plus, Lock } from 'lucide-react';

const MediaDrawer = () => {
  const { photoVault } = useAppStore();

  const defaultMedia = [
    { id: 'd1', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', premium: false },
    { id: 'd2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', premium: false },
  ];

  const allMedia = [...photoVault, ...defaultMedia];

  return (
    <div className="py-2 border-y border-border">
      <div className="flex items-center justify-between px-3 mb-2">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Quick-Media</span>
        <button className="text-[8px] font-bold text-primary uppercase hover:underline">Vault</button>
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 no-scrollbar pb-0.5">
        <button className="flex-shrink-0 w-14 h-14 bg-muted/40 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-0.5 hover:bg-muted transition-colors">
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[7px] font-bold text-muted-foreground uppercase">Add</span>
        </button>

        {allMedia.map((item) => (
          <div key={item.id} className="relative flex-shrink-0 w-14 h-14 group cursor-pointer">
            <img
              src={item.url}
              alt="Media"
              className="w-full h-full object-cover rounded-xl border border-border group-hover:border-primary transition-colors"
            />
            {('category' in item && item.category === 'private') && (
              <div className="absolute inset-0 bg-background/60 rounded-xl flex items-center justify-center">
                <Lock className="w-3 h-3 text-muted-foreground fill-current" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-4 h-4 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
                <ImageIcon className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaDrawer;
