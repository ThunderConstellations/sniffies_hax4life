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

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.3 + 0.05
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 25) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 25) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      particles.forEach(p => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
        gradient.addColorStop(0, `rgba(155, 135, 245, ${p.alpha})`);
        gradient.addColorStop(1, 'rgba(155, 135, 245, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
        ctx.fill();

        p.alpha += p.speed * 0.01;
        if (p.alpha > 0.5 || p.alpha < 0.1) p.speed *= -1;
      });

      ctx.fillStyle = '#9b87f5';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(155, 135, 245, 0.3)';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 15, 0, Math.PI * 2);
      ctx.stroke();

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Ghost className="w-4 h-4 text-primary" />
          <h3 className="text-[10px] font-bold uppercase tracking-wider">Ghost Heatmap</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-md">
          <Flame className="w-3 h-3 fill-current" />
          <span className="text-[9px] font-bold uppercase">Activity: High</span>
        </div>
      </div>

      <div className="relative aspect-square w-full bg-muted/20 rounded-2xl border border-border overflow-hidden">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full h-full opacity-80"
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="px-1.5 py-0.5 bg-background/80 backdrop-blur-sm rounded border border-border flex items-center gap-1.5">
            <Users className="w-2.5 h-2.5 text-primary" />
            <span className="text-[8px] font-bold">42 Nearby</span>
          </div>
          <div className="px-1.5 py-0.5 bg-background/80 backdrop-blur-sm rounded border border-border flex items-center gap-1.5">
            <Navigation className="w-2.5 h-2.5 text-green-600" />
            <span className="text-[8px] font-bold">Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button className="py-2 bg-primary text-primary-foreground text-[9px] font-bold rounded-lg uppercase tracking-wider transition-opacity active:opacity-90">
          Jump
        </button>
        <button className="py-2 bg-muted text-muted-foreground text-[9px] font-bold rounded-lg uppercase tracking-wider transition-colors hover:text-foreground">
          Scan
        </button>
      </div>
    </div>
  );
};

export default BubbleHeatmap;
