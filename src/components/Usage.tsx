import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { ProfilePopup } from './ProfilePopup';

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

const SidebarContent = ({ userEmail, stats, profilePopupOpen = false, setProfilePopupOpen, profileRef }: { userEmail: string, stats: any, profilePopupOpen?: boolean, setProfilePopupOpen?: (open: boolean) => void, profileRef?: { current: HTMLDivElement | null } }) => {
  const location = useLocation();
  return (
  <div className="flex flex-col h-full" style={{ background: 'transparent' }}>
    <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'transparent' }}>
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <Layers className="text-black w-4 h-4" />
        </div>
          <span className="text-[15px] font-extrabold tracking-tight">LLMLite</span>
      </Link>
    </div>

    <div className="flex-1 overflow-y-auto px-2 py-3">
      <SectionLabel label="Navigation" />
      <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
      <NavItem icon={Key} label="API Keys" to="/dashboard/keys" active={location.pathname === '/dashboard/keys'} />
      <NavItem icon={BarChart3} label="Usage" to="/dashboard/usage" active={location.pathname === '/dashboard/usage'} />
      <NavItem icon={FileText} label="Documentation" to="/docs" active={location.pathname === '/docs'} />

      <SectionLabel label="Routing" />
      <NavItem icon={Zap} label="Auto Routing" to="/dashboard/routing" active={location.pathname === '/dashboard/routing'} />
      <NavItem icon={Settings} label="Manual Override" to="/dashboard/override" active={location.pathname === '/dashboard/override'} />

      <SectionLabel label="Cost Control" />
      <NavItem icon={Bell} label="Budget Alerts" to="/dashboard/alerts" />

      <SectionLabel label="Model Access" />
      <NavItem icon={Layers} label="100+ Models" to="/dashboard/models" />

      <SectionLabel label="Developer Tools" />
        <NavItem icon={FileText} label="Cost Transparency" to="/dashboard/cost" />

      <SectionLabel label="Key Management" />
      <NavItem icon={Key} label="Multiple Keys" to="/dashboard/keys" />
      <NavItem icon={BarChart3} label="Usage Tracking" to="/dashboard/usage" />

      <SectionLabel label="Plans & Security" />
      <NavItem icon={CreditCard} label="Free Tier" to="/dashboard/freetier" active={location.pathname === '/dashboard/freetier'} />
      <NavItem icon={Shield} label="Secure & Private" to="/dashboard/security" active={location.pathname === '/dashboard/security'} />
      <NavItem icon={Settings} label="Custom Rules" to="#" />
    </div>

    <div ref={profileRef} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#09090b' }} className="p-3 relative">
        <div 
          className="flex items-center gap-3 px-2 py-2 mb-1 cursor-pointer hover:bg-white/5 rounded-lg transition-all"
          onClick={() => setProfilePopupOpen && setProfilePopupOpen(!profilePopupOpen)}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 12px rgba(59,130,246,0.4)' }}>
            {userEmail ? userEmail[0].toUpperCase() : 'K'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-white truncate">{userEmail || 'User'}</div>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">{(stats?.plan ?? 'free').charAt(0).toUpperCase() + (stats?.plan ?? 'free').slice(1)} Plan</div>
          </div>
        </div>
        
        {profilePopupOpen && setProfilePopupOpen && (
          <ProfilePopup 
            userEmail={userEmail} 
            userPlan={stats?.plan || 'free'} 
            onClose={() => setProfilePopupOpen(false)} 
          />
        )}
      </div>
  </div>
  );
};

export const Usage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();
  const location = useLocation();

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

  const tokensUsed = stats?.total_tokens ?? stats?.tokens_used ?? 0;
  const tokenLimit = stats?.token_limit ?? 500000;
  const pct = Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));
  const simpleCount = (stats?.recent_requests || []).filter((r: any) => r.prompt_type?.toUpperCase() === 'SIMPLE').length;
  const complexCount = (stats?.recent_requests || []).filter((r: any) => r.prompt_type?.toUpperCase() === 'COMPLEX').length;
  const gpt4oCost = (tokensUsed * 0.000005).toFixed(4);
  const actualCost = (stats?.total_cost ?? 0).toFixed(4);
  const saved = ((tokensUsed * 0.000005) - (stats?.total_cost ?? 0)).toFixed(4);
  const chartData = buildChartData();

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent userEmail={userEmail} stats={stats} profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} profileRef={profileRef} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={userEmail} stats={stats} profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} profileRef={profileRef} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-white/60">Usage Analytics</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Total Requests</div>
                <div className="text-2xl lg:text-3xl font-black">{stats?.total_requests ?? 0}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Simple Requests</div>
                <div className="text-2xl lg:text-3xl font-black text-blue-400">{simpleCount}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Complex Requests</div>
                <div className="text-2xl lg:text-3xl font-black text-purple-400">{complexCount}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Total Saved</div>
                <div className="text-2xl lg:text-3xl font-black text-green-400">${saved}</div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">GPT-4o Would Cost</div>
                <div className="text-xl lg:text-2xl font-black text-white/40 line-through">${gpt4oCost}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-5">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Actual Cost</div>
                <div className="text-xl lg:text-2xl font-black text-white">${actualCost}</div>
              </div>
              <div className="bg-green-500/[0.05] border border-green-500/20 rounded-xl p-4 lg:p-5">
                <div className="text-[9px] text-green-400/60 uppercase tracking-widest mb-2">You Saved</div>
                <div className="text-xl lg:text-2xl font-black text-green-400">${saved}</div>
              </div>
            </div>

            {/* Full Request History Table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-4 lg:p-5 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold">Full Request History</h3>
                <p className="text-white/30 text-xs mt-0.5">All your recent API requests</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
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
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-white/[0.08]">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { label: 'Home', path: '/dashboard', icon: '🏠' },
            { label: 'Routing', path: '/dashboard/routing', icon: '⚡' },
            { label: 'Savings', path: '/dashboard/savings', icon: '💰' },
            { label: 'Usage', path: '/dashboard/usage', icon: '📊' },
            { label: 'Docs', path: '/docs', icon: '📄' },
          ].map(item => (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${location.pathname === item.path ? 'bg-white/10' : ''}`}>
              <span className="text-lg leading-none">{item.icon}</span>
              <span className={`text-[9px] font-bold ${location.pathname === item.path ? 'text-white' : 'text-white/30'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
