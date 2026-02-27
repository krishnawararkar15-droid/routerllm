import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
const API_BASE = "https://routerllm.onrender.com";
import { 
  LayoutDashboard, 
  Key, 
  BarChart3, 
  Settings, 
  FileText, 
  Bell, 
  Search, 
  ChevronRight, 
  ChevronDown,
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight,
  Plus,
  Zap,
  Layers,
  LogOut,
  Shield,
  CreditCard,
  Code2,
  Cpu,
  Menu,
  X
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

const SidebarItem = ({ icon: Icon, label, active = false, to = "#" }: { icon: any, label: string, active?: boolean, to?: string }) => (
  <Link 
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-2.5 transition-all group relative rounded-xl mb-1.5 border",
      active 
        ? "bg-[#3b82f6]/10 text-white border-[#3b82f6]/30 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
        : "text-white/40 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10 backdrop-blur-sm"
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-[#3b82f6]" : "group-hover:text-[#3b82f6] transition-colors")} />
    <span className="text-[13px] font-bold">{label}</span>
  </Link>
);

const FeatureCard = ({ title, features }: { title: string, features: { icon: string, name: string, desc?: string }[] }) => (
  <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-xl p-3 mb-3 hover:bg-white/[0.05] transition-all group relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
    <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2.5 px-1">{title}</div>
    <div className="space-y-3">
      {features.map((f, i) => (
        <div key={i} className="flex items-start gap-2.5 px-1">
          <span className="text-xs mt-0.5">{f.icon}</span>
          <div>
            <div className="text-[11px] font-bold text-white group-hover:text-[#3b82f6] transition-colors leading-none mb-1">{f.name}</div>
            {f.desc && <div className="text-[9px] text-white/30 leading-tight">{f.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [subscriptionKey, setSubscriptionKey] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = localStorage.getItem('routellm_key');
    const email = localStorage.getItem('routellm_email');
    
    if (!key) {
      navigate('/signup');
      return;
    }
    
    setSubscriptionKey(key);
    setUserEmail(email || '');
    
    async function loadSubscriptionData() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/subscription/${key}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch subscription');
        }
        
        const data = await res.json();
        setSubscriptionData(data);
      } catch (err) {
        setError('Could not load data');
        console.error("Failed to load subscription:", err);
      } finally {
        setLoading(false);
      }
    }

    async function loadRecentRequests() {
      try {
        const res = await fetch(`${API_BASE}/route`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: "What is the capital of India?",
            subscription_key: key
          })
        });
        const data = await res.json();
        setRecentRequests([{
          model: data.model_used,
          type: 'ROUTED',
          tokens: data.tokens_used,
          cost: `$${data.cost_usd.toFixed(4)}`,
          time: 'Just now'
        }]);
      } catch (err) {
        console.error("Failed to load recent requests:", err);
      }
    }

    loadSubscriptionData();
    loadRecentRequests();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-center">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/signup')}
            className="mt-4 text-blue-500 hover:text-blue-400"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <Layers className="text-black w-4 h-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">RouteLLM</span>
        </Link>

        <div className="space-y-7">
          <div>
            <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 px-4">Navigation</div>
            <nav className="space-y-0.5">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
              <SidebarItem icon={Key} label="API Keys" />
              <SidebarItem icon={BarChart3} label="Usage" />
              <SidebarItem icon={FileText} label="Documentation" />
            </nav>
          </div>

          <div>
            <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 px-4">Platform Features</div>
            <div className="px-2">
              <FeatureCard 
                title="Routing" 
                features={[
                  { icon: '⚡', name: 'Auto Routing', desc: 'Cheapest capable model' },
                  { icon: '🎛', name: 'Manual Override', desc: 'Force specific models' }
                ]} 
              />
              <FeatureCard 
                title="Cost Control" 
                features={[
                  { icon: '💰', name: 'Savings Dashboard', desc: 'Track every cent saved' },
                  { icon: '🔔', name: 'Budget Alerts', desc: 'Spending limit notifications' }
                ]} 
              />
              <FeatureCard 
                title="Model Access" 
                features={[
                  { icon: '🌐', name: '100+ Models', desc: 'GPT-4, Claude, Llama' },
                  { icon: '🔀', name: 'Real-time Routing', desc: 'Instant classification' }
                ]} 
              />
              <FeatureCard 
                title="Developer Tools" 
                features={[
                  { icon: '🔌', name: 'Simple Integration', desc: '2 lines of code' },
                  { icon: '📋', name: 'Cost Transparency', desc: 'Exact token tracking' }
                ]} 
              />
              <FeatureCard 
                title="Key Management" 
                features={[
                  { icon: '🔑', name: 'Multiple Keys', desc: 'Per-project access' },
                  { icon: '📊', name: 'Usage Tracking', desc: 'Detailed key analytics' }
                ]} 
              />
              <FeatureCard 
                title="Plans & Security" 
                features={[
                  { icon: '🆓', name: 'Free Tier', desc: '500K tokens included' },
                  { icon: '🔒', name: 'Secure & Private', desc: 'No prompt storage' },
                  { icon: '⚙️', name: 'Custom Rules', desc: 'Enterprise logic' }
                ]} 
              />
            </div>
          </div>

          <div>
            <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 px-4">Account</div>
            <nav className="space-y-0.5">
              <SidebarItem icon={Settings} label="Settings" />
              <SidebarItem icon={CreditCard} label="Billing" />
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-black font-bold">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">{userEmail || 'User'}</div>
            <div className="inline-flex px-1.5 py-0.5 rounded bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[8px] font-bold text-[#3b82f6] uppercase tracking-widest">
              {subscriptionData?.plan || 'free'} Plan
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-bold">Log out</span>
        </button>
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
            <button className="hidden sm:block p-2 text-white/40 hover:text-white transition-colors">
              <Bell className="w-4.5 h-4.5" />
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
              <StatCard title="Total Requests" value={subscriptionData?.requests_used?.toLocaleString() || '0'} change="+12.5%" trend="up" />
              <StatCard title="Total Tokens" value={subscriptionData?.tokens_used ? (subscriptionData.tokens_used >= 1000000 ? (subscriptionData.tokens_used / 1000000).toFixed(1) + 'M' : subscriptionData.tokens_used >= 1000 ? (subscriptionData.tokens_used / 1000).toFixed(0) + 'K' : subscriptionData.tokens_used.toString()) : '0'} change="+8.2%" trend="up" />
              <StatCard title="Total Savings" value="$1,242.40" change="+24.1%" trend="up" />
              <StatCard title="Avg. Latency" value="142ms" change="-12ms" trend="up" />
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
                    {recentRequests.map((req, i) => (
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

