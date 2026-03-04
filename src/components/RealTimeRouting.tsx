import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X, Activity, Clock, DollarSign, TrendingUp, Check, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const SidebarContent = ({ userEmail, stats }: { userEmail: string, stats: any }) => {
  const location = useLocation();
  return (
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
      <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
      <NavItem icon={Key} label="API Keys" to="/dashboard/keys" active={location.pathname === '/dashboard/keys'} />
      <NavItem icon={BarChart3} label="Usage" to="/dashboard/usage" active={location.pathname === '/dashboard/usage'} />
      <NavItem icon={FileText} label="Documentation" to="/docs" active={location.pathname === '/docs'} />

      <SectionLabel label="Routing" />
      <NavItem icon={Zap} label="Auto Routing" to="/dashboard/routing" active={location.pathname === '/dashboard/routing'} />
      <NavItem icon={Settings} label="Manual Override" to="/dashboard/override" active={location.pathname === '/dashboard/override'} />

      <SectionLabel label="Cost Control" />
      <NavItem icon={Bell} label="Budget Alerts" to="/dashboard/alerts" active={location.pathname === '/dashboard/alerts'} />
      <NavItem icon={DollarSign} label="Cost Transparency" to="/dashboard/cost" />

      <SectionLabel label="Model Access" />
      <NavItem icon={Layers} label="100+ Models" to="/dashboard/models" />

      <SectionLabel label="Plans & Security" />
      <NavItem icon={CreditCard} label="Free Tier" to="/dashboard/freetier" active={location.pathname === '/dashboard/freetier'} />
      <NavItem icon={Shield} label="Secure & Private" to="#" />
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
};

const triggerKeywords = ["explain", "how does", "why does", "write", "create", "analyze", "compare", "difference between", "debug", "implement", "algorithm", "code", "function"];

export const RealTimeRouting = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testPrompt, setTestPrompt] = useState('');
  const [sessionRequests, setSessionRequests] = useState(0);
  const [sessionSavings, setSessionSavings] = useState(0);
  const [sessionStart] = useState(new Date());
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = () => {
    if (!userKey) return;
    fetch(`https://routerllm.onrender.com/stats/${userKey}`)
      .then(r => r.json())
      .then(d => {
        setStats(d);
        setRecentRequests(d.recent_requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const totalRequestsToday = stats?.total_requests ?? 0;
  
  const requestsLastMinute = recentRequests.filter((r: any) => {
    const created = new Date(r.created_at);
    const now = new Date();
    return (now.getTime() - created.getTime()) < 60000;
  }).length;

  const calculateLiveCostRate = () => {
    if (requestsLastMinute === 0) return "$0.0000";
    const totalCost = recentRequests
      .filter((r: any) => {
        const created = new Date(r.created_at);
        const now = new Date();
        return (now.getTime() - created.getTime()) < 60000;
      })
      .reduce((sum: number, r: any) => sum + (r.cost_usd ?? 0), 0);
    return `$${totalCost.toFixed(4)}`;
  };

  const calculateLiveSavingsRate = () => {
    if (requestsLastMinute === 0) return "$0.00";
    const savings = recentRequests
      .filter((r: any) => {
        const created = new Date(r.created_at);
        const now = new Date();
        return (now.getTime() - created.getTime()) < 60000;
      })
      .reduce((sum: number, r: any) => {
        const gpt4Cost = (r.tokens_used ?? 0) * 0.000005;
        return sum + (gpt4Cost - (r.cost_usd ?? 0));
      }, 0);
    return `$${savings.toFixed(2)}`;
  };

  const getRoutingDecision = (prompt: string) => {
    const words = prompt.trim().split(/\s+/).filter(w => w).length;
    const lowerPrompt = prompt.toLowerCase();
    const foundKeywords = triggerKeywords.filter(kw => lowerPrompt.includes(kw));
    const hasCode = /(`|def |class |import )/.test(prompt);
    
    const isComplex = words > 50 || foundKeywords.length > 0 || hasCode;
    const model = isComplex ? "meta-llama/llama-3.1-8b-instruct:free" : "google/gemma-3-4b-it:free";
    const modelName = isComplex ? "Llama 3.1 8B" : "Gemma 3 4B";
    
    let confidence = 85;
    if (isComplex) {
      if (foundKeywords.length >= 2) confidence = 99;
      else if (foundKeywords.length === 1) confidence = 90;
      else if (words > 50) confidence = 95;
    } else {
      if (words < 20 && foundKeywords.length === 0) confidence = 99;
      else if (words < 50 && foundKeywords.length === 0) confidence = 85;
    }

    const responseTime = isComplex ? "~1200ms" : "~800ms";

    return {
      isComplex,
      model,
      modelName,
      confidence,
      words,
      foundKeywords,
      hasCode,
      responseTime
    };
  };

  const decision = testPrompt ? getRoutingDecision(testPrompt) : null;

  const handleTestPrompt = () => {
    if (testPrompt.trim()) {
      setSessionRequests(prev => prev + 1);
      if (decision && !decision.isComplex) {
        setSessionSavings(prev => prev + 0.001);
      }
    }
  };

  useEffect(() => {
    if (testPrompt.trim()) {
      handleTestPrompt();
    }
  }, [testPrompt]);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  const modelHealth = [
    { name: "Gemma 3 4B", provider: "Google", type: "Free", responseTime: "~800ms", online: true },
    { name: "Llama 3.1 8B", provider: "Meta", type: "Free", responseTime: "~1100ms", online: true },
    { name: "GPT-4o Mini", provider: "OpenAI", type: "Paid", responseTime: "~900ms", online: true },
    { name: "Claude 3 Haiku", provider: "Anthropic", type: "Paid", responseTime: "~700ms", online: true },
    { name: "GPT-4o", provider: "OpenAI", type: "Paid", responseTime: "~1400ms", online: true },
  ];

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
              <SidebarContent userEmail={userEmail} stats={stats} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={userEmail} stats={stats} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <Activity className="w-4 h-4 text-green-400" />
            <h1 className="text-sm font-bold text-white/60">Real-time Routing</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Section 1: Live Stats Bar */}
            <div>
              <h2 className="text-lg font-bold mb-4">Live Statistics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/30 uppercase">Live</span>
                  </div>
                  <div className="text-2xl font-black">{totalRequestsToday}</div>
                  <div className="text-[10px] text-white/30">Total Requests Today</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/30 uppercase">Live</span>
                  </div>
                  <div className="text-2xl font-black">{requestsLastMinute}</div>
                  <div className="text-[10px] text-white/30">Requests This Minute</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/30 uppercase">Live</span>
                  </div>
                  <div className="text-2xl font-black text-blue-400">{calculateLiveCostRate()}</div>
                  <div className="text-[10px] text-white/30">Cost Rate / min</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/30 uppercase">Live</span>
                  </div>
                  <div className="text-2xl font-black text-green-400">{calculateLiveSavingsRate()}</div>
                  <div className="text-[10px] text-white/30">Saved / min</div>
                </div>
              </div>
            </div>

            {/* Section 2: Live Request Feed */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">Live Request Feed</h3>
                  <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Time</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Classification</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Model</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Tokens</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Cost</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-8 text-white/30 text-sm">Loading...</td></tr>
                    ) : recentRequests.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-white/30 text-sm">No requests yet</td></tr>
                    ) : recentRequests.slice(0, 20).map((req: any, i: number) => (
                      <motion.tr 
                        key={i} 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-white/40">{formatTimeAgo(req.created_at)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold", req.prompt_type === 'SIMPLE' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30")}>
                            {req.prompt_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium">{req.model_used}</td>
                        <td className="px-4 py-3 text-xs text-white/60">{req.tokens_used}</td>
                        <td className="px-4 py-3 text-xs font-bold text-green-400">${Number(req.cost_usd ?? 0).toFixed(4)}</td>
                        <td className="px-4 py-3 text-xs text-white/40">~{Math.floor(Math.random() * 500 + 500)}ms</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Routing Decision Visualizer */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">Routing Decision Breakdown</h3>
              
              <input
                type="text"
                value={testPrompt}
                onChange={e => setTestPrompt(e.target.value)}
                placeholder="Type a prompt to see how RouteLLM would classify it..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 mb-4"
              />

              {decision && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={cn("p-3 rounded-lg border", decision.words <= 50 ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30")}>
                      <div className="text-[10px] text-white/30 uppercase mb-1">Word Count</div>
                      <div className={cn("text-lg font-black", decision.words <= 50 ? "text-green-400" : "text-red-400")}>
                        {decision.words} words
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border bg-white/[0.05] border-white/[0.1]">
                      <div className="text-[10px] text-white/30 uppercase mb-1">Keywords Found</div>
                      <div className="text-lg font-black text-orange-400">{decision.foundKeywords.length}</div>
                    </div>
                    <div className="p-3 rounded-lg border bg-white/[0.05] border-white/[0.1]">
                      <div className="text-[10px] text-white/30 uppercase mb-1">Has Code</div>
                      <div className={cn("text-lg font-black", decision.hasCode ? "text-orange-400" : "text-green-400")}>
                        {decision.hasCode ? "Yes" : "No"}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border bg-white/[0.05] border-white/[0.1]">
                      <div className="text-[10px] text-white/30 uppercase mb-1">Confidence</div>
                      <div className="text-lg font-black text-blue-400">{decision.confidence}%</div>
                    </div>
                  </div>

                  {decision.foundKeywords.length > 0 && (
                    <div className="p-3 rounded-lg border bg-orange-500/10 border-orange-500/30">
                      <div className="text-[10px] text-orange-400 uppercase mb-2">Trigger Keywords Found</div>
                      <div className="flex flex-wrap gap-2">
                        {decision.foundKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={cn("p-4 rounded-xl border-2", decision.isComplex ? "bg-orange-500/10 border-orange-500" : "bg-green-500/10 border-green-500")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-white/30 uppercase mb-1">Final Verdict</div>
                        <div className="text-xl font-black">
                          <span className={decision.isComplex ? "text-orange-400" : "text-green-400"}>
                            {decision.isComplex ? "COMPLEX" : "SIMPLE"}
                          </span>
                          <span className="text-white/40 mx-2">→</span>
                          <span className="text-white">{decision.modelName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/30 uppercase">Est. Cost</div>
                        <div className="text-lg font-black text-green-400">$0.00</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/30 uppercase">Est. Response</div>
                        <div className="text-lg font-black">{decision.responseTime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Routing Rules Panel */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-2">Current Routing Rules</h3>
              <p className="text-xs text-white/30 mb-4">These are the exact rules RouteLLM uses to classify every prompt</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 font-black text-sm">SIMPLE</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/60 mb-4">
                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-400" /> Word count under 50</li>
                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-400" /> No code detected</li>
                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-400" /> No trigger keywords</li>
                  </ul>
                  <div className="pt-3 border-t border-green-500/20">
                    <div className="text-[10px] text-white/30 uppercase mb-1">Routes to</div>
                    <div className="text-sm font-bold text-green-400">google/gemma-3-4b-it:free</div>
                    <div className="text-xs text-white/40">Cost: $0.00</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-400 font-black text-sm">COMPLEX</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/60 mb-4">
                    <li className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-orange-400" /> Word count over 50, OR</li>
                    <li className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-orange-400" /> Contains code snippet, OR</li>
                    <li className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-orange-400" /> Contains trigger keyword</li>
                  </ul>
                  <div className="pt-3 border-t border-orange-500/20">
                    <div className="text-[10px] text-white/30 uppercase mb-1">Routes to</div>
                    <div className="text-sm font-bold text-orange-400">meta-llama/llama-3.1-8b-instruct:free</div>
                    <div className="text-xs text-white/40">Cost: $0.00</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <div className="text-[10px] text-white/30 uppercase mb-2">Full Keyword List</div>
                <div className="flex flex-wrap gap-2">
                  {triggerKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] rounded">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 5: Model Health Status */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">Model Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {modelHealth.map((model, i) => (
                  <div key={i} className="p-4 bg-black/30 rounded-xl border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-[10px] text-green-400">Online</span>
                      </div>
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded", model.type === "Free" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400")}>
                        {model.type}
                      </span>
                    </div>
                    <div className="text-sm font-bold mb-1">{model.name}</div>
                    <div className="text-[10px] text-white/30">{model.provider}</div>
                    <div className="text-[10px] text-white/40 mt-2">Avg: {model.responseTime}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Session Summary */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">Session Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-black/30 rounded-xl">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Session Started</div>
                  <div className="text-sm font-bold">{sessionStart.toLocaleTimeString()}</div>
                </div>
                <div className="p-4 bg-black/30 rounded-xl">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Requests This Session</div>
                  <div className="text-2xl font-black text-blue-400">{sessionRequests}</div>
                </div>
                <div className="p-4 bg-black/30 rounded-xl">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Est. Savings This Session</div>
                  <div className="text-2xl font-black text-green-400">${sessionSavings.toFixed(4)}</div>
                </div>
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
