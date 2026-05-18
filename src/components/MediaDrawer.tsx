import React from 'react';
import { Image as ImageIcon, Plus, Lock } from 'lucide-react';

const MediaDrawer = () => {
  // Mock media files
  const media = [
    { id: '1', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', premium: false },
    { id: '2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', premium: false },
    { id: '3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', premium: true },
    { id: '4', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', premium: false },
  ];

  return (
    <div className="py-2 border-y border-border/50">
      <div className="flex items-center justify-between px-4 mb-2">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Quick-Media</span>
        <button className="text-[9px] font-black text-primary uppercase">Manage Gallery</button>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar pb-1">
        <button className="flex-shrink-0 w-16 h-16 bg-secondary/50 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:bg-secondary transition-colors">
          <Plus className="w-4 h-4 text-muted-foreground" />
          <span className="text-[8px] font-bold text-muted-foreground uppercase">Add</span>
        </button>

        {media.map((item) => (
          <div key={item.id} className="relative flex-shrink-0 w-16 h-16 group cursor-pointer">
            <img
              src={item.url}
              alt="Media"
              className="w-full h-full object-cover rounded-2xl shadow-sm group-hover:ring-2 ring-primary transition-all"
            />
            {item.premium && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                <Lock className="w-3 h-3 text-white fill-current" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-5 h-5 bg-primary text-white rounded-lg flex items-center justify-center">
                <ImageIcon className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaDrawer;
