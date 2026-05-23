import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Zap, TrendingUp, Users } from 'lucide-react';

const data = [
  { time: '00:00', activity: 20 },
  { time: '04:00', activity: 10 },
  { time: '08:00', activity: 45 },
  { time: '12:00', activity: 70 },
  { time: '16:00', activity: 85 },
  { time: '20:00', activity: 100 },
  { time: '23:59', activity: 90 },
];

const TelemetryView = () => {
  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      <div className="p-4 border-b border-border bg-muted/10">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-primary" />
          <h2 className="text-[11px] font-black uppercase tracking-widest text-foreground">Local Telemetry</h2>
        </div>
        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Real-time Activity Analysis</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Activity Over Time */}
        <div className="bg-muted/20 border border-border rounded-2xl p-4 space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Activity Intensity (24h)</span>
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
           </div>
           <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00BCD4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '8px', fontSize: '9px' }}
                    itemStyle={{ color: '#00BCD4', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="activity" stroke="#00BCD4" fillOpacity={1} fill="url(#colorAct)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
           <div className="p-4 bg-muted/20 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                 <Users className="w-3.5 h-3.5 text-primary" />
                 <span className="text-[8px] font-black text-muted-foreground uppercase">Retention</span>
              </div>
              <p className="text-lg font-black tracking-tight">88%</p>
           </div>
           <div className="p-4 bg-muted/20 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                 <Zap className="w-3.5 h-3.5 text-yellow-500" />
                 <span className="text-[8px] font-black text-muted-foreground uppercase">Response</span>
              </div>
              <p className="text-lg font-black tracking-tight">2.4m</p>
           </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
           <p className="text-[10px] font-bold text-primary uppercase mb-2">Engine Prediction</p>
           <p className="text-xs text-foreground leading-relaxed">
             Peak activity expected at <span className="text-primary font-black uppercase">21:30</span>.
             Engine recommending <span className="text-primary font-black uppercase">Location Boost</span> in current sector.
           </p>
        </div>
      </div>
    </div>
  );
};

export default TelemetryView;
