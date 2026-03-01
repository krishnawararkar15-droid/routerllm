import React, { useState, useEffect } from 'react';
const API_BASE = "/api/external";
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
  Plus,
  Zap,
  Layers,
  LogOut,
  CreditCard,
  Code2,
  Menu,
  X,
  RefreshCw
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
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router-dom';

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

const StatCard = ({ title, value, change, trend, id }: { title: string, value: string, change: string, trend: 'up' | 'down', id?: string }) => (
  <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-xl p-3 sm:p-[24px] relative overflow-hidden group">
    {/* Top Glow */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
    
    <div className="flex justify-between items-start mb-1.5 sm:mb-2">
      <span className="text-[8px] sm:text-[9px] font-bold text-white/40 uppercase tracking-widest">{title}</span>
      <div className="bg-white/10 border border-white/10 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold text-white/60 flex items-center gap-1">
        {trend === 'up' ? <ArrowUpRight className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> : <ArrowDownRight className="w-2 h-2 sm:w-2.5 sm:h-2.5" />}
        {change}
      </div>
    </div>
    
    <div id={id} className="text-lg sm:text-[28px] font-bold text-white mb-2 sm:mb-4 tracking-tight leading-none">{value}</div>
    
    {/* Sparkline */}
    <div className="h-4 sm:h-6 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sparklineData}>
          <Bar 
            dataKey="v" 
            fill="white" 
            radius={[1, 1, 0, 0]} 
            opacity={0.15}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userKey = localStorage.getItem('routellm_key');
  const userEmail = localStorage.getItem('routellm_email');

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://routerllm.onrender.com/stats/${userKey}`);
      const data = await res.json();
      setStats(data);
    } catch(e) {
      console.error('Failed to fetch stats', e);
    }
    setLoading(false);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const NavItem = ({ icon: Icon, label, active = false, to = "#", onClick }: { icon: any, label: string, active?: boolean, to?: string, onClick?: () => void }) => (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-[9px] rounded-lg transition-all w-full text-left",
        active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="w-[15px] h-[15px] flex-shrink-0" />
      <span className="text-[13px] font-medium">{label}</span>
    </Link>
  );

  const SectionLabel = ({ label }: { label: string }) => (
    <div className="px-3 pt-5 pb-1">
      <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.05]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Layers className="text-black w-4 h-4" />
          </div>
          <span className="text-[15px] font-extrabold tracking-tight">RouteLLM</span>
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-2 py-3">

        <SectionLabel label="Navigation" />
        <NavItem icon={LayoutDashboard} label="Dashboard" active to="/dashboard" />
        <NavItem icon={Key} label="API Keys" to="/dashboard/keys" />
        <NavItem icon={BarChart3} label="Usage" to="/dashboard/usage" />
        <NavItem icon={FileText} label="Documentation" to="#" />

        <SectionLabel label="Routing" />
        <NavItem icon={Zap} label="Auto Routing" to="#" />
        <NavItem icon={Settings} label="Manual Override" to="#" />
        <NavItem icon={Bell} label="Budget Alerts" to="#" />

        <SectionLabel label="Models" />
        <NavItem icon={Layers} label="100+ Models" to="#" />
        <NavItem icon={ArrowRight} label="Real-time Routing" to="#" />

        <SectionLabel label="Developer Tools" />
        <NavItem icon={Code2} label="Simple Integration" to="#" />
        <NavItem icon={Search} label="Cost Transparency" to="#" />

        <SectionLabel label="Account" />
        <NavItem icon={CreditCard} label="Billing & Plans" to="#" />
        <NavItem icon={Settings} label="Settings" to="#" />

      </div>

      {/* Bottom user section */}
      <div className="border-t border-white/[0.05] p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
            {userEmail ? userEmail[0].toUpperCase() : 'K'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-white truncate">{userEmail || 'User'}</div>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">Free Plan</div>
          </div>
        </div>
        <NavItem
          icon={LogOut}
          label="Logout"
          onClick={() => { localStorage.clear(); navigate('/login'); }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#050505] border-r border-white/[0.06] z-50 lg:hidden overflow-y-auto"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex flex-col hidden lg:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full bg-white/5 border border-white/[0.06] rounded-full pl-9 pr-4 py-1.5 text-[12px] sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={fetchStats} className="hidden sm:block p-2 text-white/40 hover:text-white transition-colors">
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
            <button className="bg-[#3b82f6] text-white font-bold px-3 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-[13px] hover:bg-[#60a5fa] transition-all whitespace-nowrap">
              New Key
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-[32px]">
          <div className="max-w-7xl mx-auto space-y-3 sm:space-y-[16px]">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-[16px]">
              <StatCard title="Total Requests" value={loading ? '...' : (stats?.total_requests ?? 0).toLocaleString()} change="+12.5%" trend="up" />
              <StatCard title="Total Tokens" value={loading ? '...' : (stats?.total_tokens ?? 0).toLocaleString()} change="+8.2%" trend="up" />
              <StatCard title="Total Savings" value={loading ? '...' : '$' + (stats?.total_savings ?? 0).toFixed(2)} change="+24.1%" trend="up" />
              <StatCard title="Avg. Latency" value={loading ? '...' : '142ms'} change="-12ms" trend="up" />
            </div>

            {/* Chart Section */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-xl p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h3 className="text-sm sm:text-base font-bold">Requests Overview</h3>
                  <p className="text-[10px] sm:text-[11px] text-white/40">Real-time traffic across all routed models</p>
                </div>
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg self-start">
                  {['24h', '7d', '30d', 'All'].map((range) => (
                    <button 
                      key={range}
                      className={cn(
                        "px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[8px] sm:text-[9px] font-bold transition-all",
                        range === '24h' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[180px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1623', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRequests)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="p-3 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold">Recent Requests</h3>
                <button className="text-[10px] sm:text-[11px] font-bold text-[#3b82f6] hover:text-[#60a5fa] transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-3 sm:px-6 py-3 text-[8px] sm:text-[9px] font-bold text-white/30 uppercase tracking-widest">Model</th>
                      <th className="px-3 sm:px-6 py-3 text-[8px] sm:text-[9px] font-bold text-white/30 uppercase tracking-widest">Type</th>
                      <th className="px-3 sm:px-6 py-3 text-[8px] sm:text-[9px] font-bold text-white/30 uppercase tracking-widest">Tokens</th>
                      <th className="px-3 sm:px-6 py-3 text-[8px] sm:text-[9px] font-bold text-white/30 uppercase tracking-widest">Cost</th>
                      <th className="px-3 sm:px-6 py-3 text-[8px] sm:text-[9px] font-bold text-white/30 uppercase tracking-widest text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {(stats?.recent_requests ?? []).map((req: any, i: number) => (
                      <tr key={i} className="h-[38px] sm:h-[44px] hover:bg-white/[0.02] transition-colors group">
                        <td className="px-3 sm:px-6 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#3b82f6]" />
                            <span className="text-[11px] sm:text-[13px] font-bold text-white">{req.model}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-2">
                          <span className={cn(
                            "px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold",
                            req.type === 'ROUTED' ? "bg-[#3b82f6]/20 text-[#3b82f6]" : "bg-[#3b82f6]/10 text-[#3b82f6]/60"
                          )}>
                            {req.type}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-2 text-[11px] sm:text-[13px] text-white/60">{req.tokens}</td>
                        <td className="px-3 sm:px-6 py-2 text-[11px] sm:text-[13px] font-bold text-white">{req.cost}</td>
                        <td className="px-3 sm:px-6 py-2 text-[11px] sm:text-[13px] text-white/30 text-right">{req.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

