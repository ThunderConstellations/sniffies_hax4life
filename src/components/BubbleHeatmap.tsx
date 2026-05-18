import React, { useEffect, useRef } from 'react';
import { Flame, Ghost, Users, Navigation } from 'lucide-react';

const BubbleHeatmap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const particles: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];

    // Create hotspots
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw heat zones
      particles.forEach(p => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 10);
        gradient.addColorStop(0, `rgba(155, 135, 245, ${p.alpha})`);
        gradient.addColorStop(1, 'rgba(155, 135, 245, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 10, 0, Math.PI * 2);
        ctx.fill();

        p.alpha += p.speed * 0.01;
        if (p.alpha > 0.7 || p.alpha < 0.2) p.speed *= -1;
      });

      // Draw center marker
      ctx.fillStyle = '#9b87f5';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#9b87f5';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 20, 0, Math.PI * 2);
      ctx.stroke();

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Ghost className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-black uppercase tracking-tight">Ghost Heatmap</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 text-orange-500 rounded-lg">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span className="text-[10px] font-black uppercase">High Activity</span>
        </div>
      </div>

      <div className="relative aspect-square w-full bg-black/40 rounded-3xl border border-primary/20 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full h-full"
        />

        {/* Overlay Stats */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
            <Users className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-bold text-white">42 Nearby</span>
          </div>
          <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
            <Navigation className="w-3 h-3 text-green-500" />
            <span className="text-[9px] font-bold text-white">Teleport Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="py-2.5 bg-primary text-primary-foreground text-[10px] font-black rounded-xl uppercase tracking-wider shadow-lg shadow-primary/20">
          Jump to Hotspot
        </button>
        <button className="py-2.5 bg-secondary text-muted-foreground text-[10px] font-black rounded-xl uppercase tracking-wider">
          Scan Deeper
        </button>
      </div>
    </div>
  );
};

export default BubbleHeatmap;
