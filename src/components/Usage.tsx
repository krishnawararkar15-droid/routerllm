import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, TrendingUp, Clock, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const SectionLabel = ({ label }: { label: string }) => (
  <div className="px-3 pt-5 pb-1.5">
    <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{label}</span>
  </div>
);

const NavItem = ({ icon: Icon, label, active = false, to = "#" }: { icon: any, label: string, active?: boolean, to?: string }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all w-full mb-1"
    style={active ? {
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
      color: '#ffffff'
    } : {
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      color: 'rgba(255,255,255,0.45)'
    }}
  >
    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={active ? { color: '#60a5fa' } : { color: 'rgba(255,255,255,0.4)' }} />
    <span className="text-[12px] font-medium">{label}</span>
  </Link>
);

const SidebarContent = ({ userEmail, stats }: { userEmail: string, stats: any }) => (
  <div className="flex flex-col h-full" style={{ background: 'transparent' }}>
    <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'transparent' }}>
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <Layers className="text-black w-4 h-4" />
        </div>
        <span className="text-[15px] font-extrabold tracking-tight">RouteLLM</span>
      </Link>
    </div>

    <div className="flex-1 overflow-y-auto px-2 py-3">
      <SectionLabel label="Navigation" />
      <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
      <NavItem icon={Key} label="API Keys" to="/dashboard/keys" />
      <NavItem icon={BarChart3} label="Usage" active to="/dashboard/usage" />
      <NavItem icon={FileText} label="Documentation" to="#" />

      <SectionLabel label="Routing" />
      <NavItem icon={Zap} label="Auto Routing" to="#" />
      <NavItem icon={Settings} label="Manual Override" to="#" />

      <SectionLabel label="Cost Control" />
      <NavItem icon={BarChart3} label="Savings Dashboard" to="#" />
      <NavItem icon={Bell} label="Budget Alerts" to="#" />

      <SectionLabel label="Model Access" />
      <NavItem icon={Layers} label="100+ Models" to="#" />
      <NavItem icon={Zap} label="Real-time Routing" to="#" />

      <SectionLabel label="Developer Tools" />
      <NavItem icon={Code2} label="Simple Integration" to="#" />
      <NavItem icon={FileText} label="Cost Transparency" to="#" />

      <SectionLabel label="Key Management" />
      <NavItem icon={Key} label="Multiple Keys" to="#" />
      <NavItem icon={BarChart3} label="Usage Tracking" to="#" />

      <SectionLabel label="Plans & Security" />
      <NavItem icon={CreditCard} label="Free Tier" to="#" />
      <NavItem icon={Shield} label="Secure & Private" to="#" />
      <NavItem icon={Settings} label="Custom Rules" to="#" />
    </div>

    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#09090b' }} className="p-3">
      <div className="flex items-center gap-3 px-2 py-2 mb-1">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 12px rgba(59,130,246,0.4)' }}>
          {userEmail ? userEmail[0].toUpperCase() : 'K'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-white truncate">{userEmail || 'User'}</div>
          <div className="text-[9px] text-white/30 uppercase tracking-wider">{(stats?.plan ?? 'free').charAt(0).toUpperCase() + (stats?.plan ?? 'free').slice(1)} Plan</div>
        </div>
      </div>
      <Link
        to="/login"
        onClick={() => localStorage.clear()}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all w-full"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-[13px] font-medium">Logout</span>
      </Link>
    </div>
  </div>
);

export const Usage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    fetch('https://routerllm.onrender.com/stats/' + userKey)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const buildChartData = () => {
    const days: Record<string, number> = {};
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      days[d.toDateString()] = 0;
      last7.push({ day: key, tokens: 0, date: d.toDateString() });
    }
    (stats?.recent_requests || []).forEach((r: any) => {
      const date = new Date(r.created_at).toDateString();
      const found = last7.find(d => d.date === date);
      if (found) found.tokens += r.tokens_used || 0;
    });
    return last7;
  };

  const tokensUsed = stats?.tokens_used ?? 0;
  const tokenLimit = stats?.token_limit ?? 500000;
  const pct = Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));
  const simpleCount = (stats?.recent_requests || []).filter((r: any) => r.prompt_type === 'SIMPLE').length;
  const complexCount = (stats?.recent_requests || []).filter((r: any) => r.prompt_type === 'COMPLEX').length;
  const gpt4oCost = (tokensUsed * 0.000005).toFixed(4);
  const actualCost = (stats?.total_cost ?? 0).toFixed(4);
  const saved = ((tokensUsed * 0.000005) - (stats?.total_cost ?? 0)).toFixed(4);
  const chartData = buildChartData();

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={userEmail} stats={stats} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <h1 className="text-sm font-bold text-white/60">Usage Analytics</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Usage Analytics</h1>
              <p className="text-white/40 text-sm">Track your token usage, costs, and request history</p>
            </div>

            {/* Token Progress Bar */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold">Token Usage This Month</h3>
                  <p className="text-white/30 text-xs mt-0.5">{tokensUsed.toLocaleString()} of {tokenLimit.toLocaleString()} tokens used</p>
                </div>
                <span className={`text-2xl font-black ${pct >= 80 ? 'text-orange-400' : 'text-blue-400'}`}>{pct}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: pct + '%', background: pct >= 80 ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} />
              </div>
              {pct >= 80 && (
                <p className="text-orange-400 text-xs mt-2 font-bold">⚠️ You are near your limit. Consider upgrading your plan.</p>
              )}
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Total Requests</div>
                <div className="text-3xl font-black">{stats?.total_requests ?? 0}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Simple Requests</div>
                <div className="text-3xl font-black text-blue-400">{simpleCount}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Complex Requests</div>
                <div className="text-3xl font-black text-purple-400">{complexCount}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Total Saved</div>
                <div className="text-3xl font-black text-green-400">${saved}</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-1">Token Usage — Last 7 Days</h3>
              <p className="text-white/30 text-xs mb-6">Daily token consumption across all your requests</p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="day" stroke="#ffffff20" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff20" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1623', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="tokens" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">GPT-4o Would Cost</div>
                <div className="text-2xl font-black text-white/40 line-through">${gpt4oCost}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Actual Cost</div>
                <div className="text-2xl font-black text-white">${actualCost}</div>
              </div>
              <div className="bg-green-500/[0.05] border border-green-500/20 rounded-xl p-5">
                <div className="text-[9px] text-green-400/60 uppercase tracking-widest mb-2">You Saved</div>
                <div className="text-2xl font-black text-green-400">${saved}</div>
              </div>
            </div>

            {/* Full Request History Table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-5 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold">Full Request History</h3>
                <p className="text-white/30 text-xs mt-0.5">All your recent API requests</p>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Model</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Tokens</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Cost</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-white/30 text-sm">Loading...</td></tr>
                  ) : (stats?.recent_requests ?? []).length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-white/30 text-sm">No requests yet. Make your first API call!</td></tr>
                  ) : (stats?.recent_requests ?? []).map((req: any, i: number) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <span className="text-[13px] font-bold">{req.model_used}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${req.prompt_type === 'SIMPLE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {req.prompt_type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[13px] text-white/60">{req.tokens_used}</td>
                      <td className="px-6 py-3 text-[13px] font-bold">${Number(req.cost_usd ?? 0).toFixed(4)}</td>
                      <td className="px-6 py-3 text-[13px] text-white/30 text-right">{new Date(req.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
