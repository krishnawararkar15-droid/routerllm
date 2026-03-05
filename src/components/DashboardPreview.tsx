import React from 'react';
import { 
  LayoutDashboard, 
  Key, 
  BarChart3, 
  Settings, 
  FileText, 
  Bell, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight,
  Zap,
  Layers,
  LogOut,
  CreditCard,
  Menu,
  RefreshCw,
  Shield
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const data = [
  { name: '00:00', requests: 400 },
  { name: '04:00', requests: 300 },
  { name: '08:00', requests: 2000 },
  { name: '12:00', requests: 2780 },
  { name: '16:00', requests: 1890 },
  { name: '20:00', requests: 2390 },
  { name: '23:59', requests: 3490 },
];

const sparklineData = [
  { v: 40 }, { v: 70 }, { v: 45 }, { v: 90 }, { v: 65 }, { v: 80 }, { v: 95 }
];

const StatCard = ({ title, value, change, trend }: { title: string, value: string, change: string, trend: 'up' | 'down' }) => (
  <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-xl p-3 sm:p-4 relative overflow-hidden group">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
    <div className="flex justify-between items-start mb-1 sm:mb-2">
      <span className="text-[7px] sm:text-[8px] font-bold text-white/40 uppercase tracking-widest">{title}</span>
      <div className="bg-white/10 border border-white/10 px-1 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold text-white/60 flex items-center gap-1">
        {trend === 'up' ? <ArrowUpRight className="w-2 h-2" /> : <ArrowDownRight className="w-2 h-2" />}
        {change}
      </div>
    </div>
    <div className="text-sm sm:text-lg font-bold text-white mb-2 tracking-tight leading-none">{value}</div>
    <div className="h-3 sm:h-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sparklineData}>
          <Bar dataKey="v" fill="white" radius={[1, 1, 0, 0]} opacity={0.15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={cn(
    "flex items-center gap-2 px-2 py-1 rounded-lg transition-all w-full mb-0.5 cursor-default",
    active ? "bg-white/10 border border-white/10 text-white shadow-lg" : "text-white/40"
  )}>
    <Icon className={cn("w-3 h-3 flex-shrink-0", active ? "text-blue-400" : "text-white/20")} />
    <span className="text-[10px] font-medium">{label}</span>
  </div>
);

const SectionLabel = ({ label }: { label: string }) => (
  <div className="px-2 pt-3 pb-1">
    <span className="text-[7px] font-bold text-white/20 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export const DashboardPreview = () => {
  return (
    <div className="w-full aspect-video bg-black flex overflow-hidden text-white font-sans text-[10px] select-none pointer-events-none">
      {/* Sidebar */}
      <aside className="w-32 flex-shrink-0 border-r border-white/5 bg-[#09090b] flex flex-col hidden sm:flex">
        <div className="px-3 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
              <Layers className="text-black w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight">LLMLite</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <SectionLabel label="Navigation" />
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Key} label="API Keys" />
          
          <SectionLabel label="Routing" />
          <NavItem icon={Zap} label="Auto Routing" />
          <NavItem icon={Settings} label="Manual Override" />

          <SectionLabel label="Model Access" />
          <NavItem icon={Layers} label="100+ Models" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black">
        {/* Header */}
        <header className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-1/2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
            <div className="w-full bg-white/5 border border-white/5 rounded-full pl-7 pr-3 py-1 text-[9px] text-white/40">Search requests...</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-[9px]">New Key</div>
          </div>
        </header>

        {/* content */}
        <div className="flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard title="Total Requests" value="4,571" change="+12.5%" trend="up" />
            <StatCard title="Total Tokens" value="3.2M" change="+8.2%" trend="up" />
            <StatCard title="Total Savings" value="$8,322" change="+24.1%" trend="up" />
            <StatCard title="Avg. Latency" value="142ms" change="-12ms" trend="up" />
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[11px] font-bold">Requests Overview</h3>
                <p className="text-[8px] text-white/40">Real-time traffic across models</p>
              </div>
              <div className="flex gap-1 bg-white/5 p-0.5 rounded-md">
                {['24h', '7d', '30d'].map((r) => (
                  <div key={r} className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold", r === '24h' ? "bg-white/10 text-white" : "text-white/40")}>{r}</div>
                ))}
              </div>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="prevColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fill="url(#prevColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
