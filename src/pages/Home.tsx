import { useAppStore } from '@/lib/store';
import { Shield, Zap, MessageSquare, Globe, Bot, Star, Activity, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Home = () => {
  const { conversations, settings } = useAppStore();
  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const onlineCount = conversations.filter(c => c.online).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-foreground tracking-tight">Hax4Life</h1>
          <div className="bg-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase">Elite Status</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Welcome back. Your session is secured.</p>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Status Dashboard */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary">{unreadCount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold mt-2">New Messages</p>
              <p className="text-lg font-black">{unreadCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <Activity className="w-4 h-4 text-online" />
                <span className="text-xs font-bold text-online">{onlineCount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold mt-2">Nearby Online</p>
              <p className="text-lg font-black">{onlineCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Platform */}
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">Active Instance</span>
              </div>
              <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-black uppercase">
                {settings.activePlatform}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Session persistence is keeping you online on {settings.activePlatform}. No active paywalls detected.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%] animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Status */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">AI Copilot</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {settings.geminiKey || settings.openRouterKey
                  ? 'Engines ready for chat assistance'
                  : 'AI keys not configured'}
              </p>
              <Star className={`w-4 h-4 ${(settings.geminiKey || settings.openRouterKey) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>

        {/* GPS Spoofing Mock */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm">GPS Teleport</span>
              </div>
              <span className="text-[10px] font-bold text-online bg-online/10 px-2 py-0.5 rounded-full uppercase">Active</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex flex-col gap-3">
              <div className="bg-secondary/50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Current Target</p>
                  <p className="text-xs font-bold">Los Angeles, CA (Mocked)</p>
                </div>
                <button className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-lg">Change</button>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                Browsers and apps will see your location as the target city to unlock more profiles.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Quick Actions</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: Zap, label: 'Boost Visibility', color: 'text-yellow-500' },
              { icon: Clock, label: 'Schedule Messages', color: 'text-blue-500' },
              { icon: Shield, label: 'Security Audit', color: 'text-green-500' },
            ].map((action, i) => (
              <button key={i} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-secondary rounded-lg ${action.color}`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold">{action.label}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
