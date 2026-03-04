import { useState, useEffect } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X, DollarSign, TrendingUp, Receipt, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
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
      <NavItem icon={Activity} label="Real-time Routing" to="/dashboard/realtime" active={location.pathname === '/dashboard/realtime'} />

      <SectionLabel label="Cost Control" />
      <NavItem icon={BarChart3} label="Savings Dashboard" to="/dashboard/savings" />
      <NavItem icon={Bell} label="Budget Alerts" to="/dashboard/alerts" active={location.pathname === '/dashboard/alerts'} />
      <NavItem icon={DollarSign} label="Cost Transparency" to="/dashboard/cost" active={location.pathname === '/dashboard/cost'} />

      <SectionLabel label="Model Access" />
      <NavItem icon={Layers} label="100+ Models" to="/dashboard/models" />

      <SectionLabel label="Developer Tools" />
      <NavItem icon={Code2} label="Simple Integration" to="/docs" />

      <SectionLabel label="Plans & Security" />
      <NavItem icon={CreditCard} label="Free Tier" to="#" />
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

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

const pricing = [
  { model: "gemma-3-4b-it:free", provider: "Google", perToken: 0, per1K: 0, per1M: 0, type: "FREE" },
  { model: "llama-3.1-8b:free", provider: "Meta", perToken: 0, per1K: 0, per1M: 0, type: "FREE" },
  { model: "mistral-7b:free", provider: "Mistral", perToken: 0, per1K: 0, per1M: 0, type: "FREE" },
  { model: "gpt-4o-mini", provider: "OpenAI", perToken: 0.00000015, per1K: 0.00015, per1M: 0.15, type: "PAID" },
  { model: "gpt-4o", provider: "OpenAI", perToken: 0.000005, per1K: 0.005, per1M: 5.00, type: "PAID" },
  { model: "claude-3-haiku", provider: "Anthropic", perToken: 0.00000025, per1K: 0.00025, per1M: 0.25, type: "PAID" },
  { model: "claude-3.5-sonnet", provider: "Anthropic", perToken: 0.000003, per1K: 0.003, per1M: 3.00, type: "PAID" },
  { model: "gemini-flash-1.5", provider: "Google", perToken: 0.000000075, per1K: 0.000075, per1M: 0.075, type: "PAID" },
  { model: "gemini-pro-1.5", provider: "Google", perToken: 0.0000035, per1K: 0.0035, per1M: 3.50, type: "PAID" },
  { model: "llama-3.1-70b", provider: "Meta", perToken: 0.00000059, per1K: 0.00059, per1M: 0.59, type: "PAID" },
];

const getPriceRate = (model: string) => {
  if (model.includes(':free')) return { rate: 0, label: "$0.0000 / token" };
  if (model.includes('gpt-4o-mini')) return { rate: 0.00000015, label: "$0.00000015 / token" };
  if (model.includes('gpt-4o')) return { rate: 0.000005, label: "$0.000005 / token" };
  if (model.includes('claude-3-haiku')) return { rate: 0.00000025, label: "$0.00000025 / token" };
  if (model.includes('claude-3.5-sonnet')) return { rate: 0.000003, label: "$0.000003 / token" };
  if (model.includes('gemini-flash')) return { rate: 0.000000075, label: "$0.000000075 / token" };
  return { rate: 0.000001, label: "$0.000001 / token" };
};

export const CostTransparency = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  const [promptsPerMonth, setPromptsPerMonth] = useState(50000);
  const [simplePercent, setSimplePercent] = useState(70);
  const [avgTokens, setAvgTokens] = useState(200);

  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    fetch(`https://routerllm.onrender.com/stats/${userKey}`)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalSpent = stats?.total_cost ?? 0;
  const totalSaved = stats?.total_savings ?? (stats?.total_tokens ?? 0) * 0.000005 - totalSpent;
  const totalRequests = stats?.total_requests ?? 0;
  const costPerRequest = totalRequests > 0 ? totalSpent / totalRequests : 0;
  const freeRequests = (stats?.recent_requests ?? []).filter((r: any) => r.cost_usd === 0 || r.cost_usd === null || r.cost_usd === undefined).length;
  const freePercent = totalRequests > 0 ? Math.round((freeRequests / totalRequests) * 100) : 0;

  const recentRequests = (stats?.recent_requests ?? []).slice(0, 50);

  const toggleRow = (idx: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setExpandedRows(newSet);
  };

  const simplePrompts = Math.round(promptsPerMonth * (simplePercent / 100));
  const complexPrompts = promptsPerMonth - simplePrompts;
  const gpt4oCost = promptsPerMonth * avgTokens * 0.000005;
  const routeLLMCost = complexPrompts * avgTokens * 0.000001;
  const monthlySavings = gpt4oCost - routeLLMCost;
  const proCost = 99;
  const netSavings = monthlySavings - proCost;

  const daysInMonth = 30;
  const dayOfMonth = new Date().getDate();
  const projectedMonthlyCost = totalSpent > 0 ? (totalSpent / dayOfMonth) * daysInMonth : 0;
  const projectedSavings = totalSaved > 0 ? (totalSaved / dayOfMonth) * daysInMonth : 0;

  const modelLeaderboard = (stats?.recent_requests ?? []).reduce((acc: any, r: any) => {
    const model = r.model_used || 'unknown';
    if (!acc[model]) {
      acc[model] = { requests: 0, tokens: 0, cost: 0 };
    }
    acc[model].requests++;
    acc[model].tokens += r.tokens_used || 0;
    acc[model].cost += r.cost_usd || 0;
    return acc;
  }, {});
  const leaderboard = Object.entries(modelLeaderboard)
    .map(([model, data]: [string, any]) => ({ model, ...data }))
    .sort((a, b) => b.requests - a.requests);

  const freeModels = leaderboard.filter((m: any) => m.model.includes(':free'));
  const freeModelNames = [...new Set(freeModels.map((m: any) => m.model))].join(', ');

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
            <DollarSign className="w-4 h-4 text-green-400" />
            <h1 className="text-sm font-bold text-white/60">Cost Transparency</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Section 1: Top Summary Bar */}
            <div>
              <h2 className="text-lg font-bold mb-4">Cost Summary</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Total Spent</div>
                  <div className="text-2xl font-black">${totalSpent.toFixed(4)}</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Total Saved vs GPT-4o</div>
                  <div className="text-2xl font-black text-green-400">${Math.max(0, totalSaved).toFixed(2)}</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Cost Per Request</div>
                  <div className="text-2xl font-black">${costPerRequest.toFixed(6)}</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Free Request %</div>
                  <div className="text-2xl font-black text-green-400">{freePercent}% free</div>
                </div>
              </div>
            </div>

            {/* Section 2: Per Request Cost Breakdown */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold mb-1">Every Request. Every Penny. Full Transparency.</h3>
                <p className="text-xs text-white/30">Nothing is hidden. See the exact cost calculation for each request.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">#</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Model</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Type</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Tokens</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Price Rate</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Calculation</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Cost</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {loading ? (
                      <tr><td colSpan={8} className="text-center py-8 text-white/30 text-sm">Loading...</td></tr>
                    ) : recentRequests.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-8 text-white/30 text-sm">No requests yet</td></tr>
                    ) : recentRequests.map((req: any, idx: number) => {
                      const priceInfo = getPriceRate(req.model_used || '');
                      const tokens = req.tokens_used || 0;
                      const cost = req.cost_usd || 0;
                      const gpt4Cost = tokens * 0.000005;
                      const saved = gpt4Cost - cost;
                      const expanded = expandedRows.has(idx);
                      return (
                        <motion.tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-xs text-white/40">{idx + 1}</td>
                          <td className="px-4 py-3 text-xs font-medium">{req.model_used}</td>
                          <td className="px-4 py-3">
                            <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold", req.prompt_type === 'SIMPLE' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30")}>
                              {req.prompt_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">{tokens}</td>
                          <td className="px-4 py-3 text-[10px] text-white/40 font-mono">{priceInfo.label}</td>
                          <td className="px-4 py-3 text-[10px] text-white/40 font-mono">{tokens} × ${priceInfo.rate.toFixed(10)}</td>
                          <td className="px-4 py-3 text-xs font-bold text-green-400">${cost.toFixed(4)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleRow(idx)} className="text-white/30 hover:text-white">
                              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                          {expanded && (
                            <motion.td colSpan={7} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <div className="p-4 bg-gray-900/50 border border-dashed border-gray-600 rounded-xl m-4 font-mono text-xs">
                                <div className="border-b border-gray-700 pb-2 mb-2 font-bold">COST RECEIPT</div>
                                <div>Model: {req.model_used}</div>
                                <div>Type: {req.prompt_type}</div>
                                <div className="my-2"></div>
                                <div>Input tokens: ~{Math.floor(tokens * 0.7)}</div>
                                <div>Output tokens: ~{Math.ceil(tokens * 0.3)}</div>
                                <div>Total tokens: {tokens}</div>
                                <div className="my-2"></div>
                                <div>Price per token: ${priceInfo.rate.toFixed(10)}</div>
                                <div>Total cost: ${cost.toFixed(4)}</div>
                                <div className="my-2 border-t border-gray-700 pt-2"></div>
                                <div>GPT-4o would cost: ${gpt4Cost.toFixed(4)}</div>
                                <div className="text-green-400">You saved: ${saved.toFixed(4)}</div>
                              </div>
                            </motion.td>
                          )}
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Full Model Pricing Table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold mb-1">Model Pricing — Complete Breakdown</h3>
                <p className="text-xs text-white/30">Exact prices from OpenRouter. Updated monthly.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Model</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Provider</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Per Token</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Per 1K</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Per 1M</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-white/30 uppercase">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {pricing.map((p, idx) => (
                      <tr key={idx} className={p.type === 'FREE' ? 'bg-green-500/5' : ''}>
                        <td className="px-4 py-3 text-xs font-medium">{p.model}</td>
                        <td className="px-4 py-3 text-xs text-white/60">{p.provider}</td>
                        <td className="px-4 py-3 text-xs font-mono">${p.perToken.toFixed(10)}</td>
                        <td className="px-4 py-3 text-xs font-mono">${p.per1K.toFixed(6)}</td>
                        <td className="px-4 py-3 text-xs font-mono">${p.per1M.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold", p.type === 'FREE' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30")}>
                            {p.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Cost Calculator */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">Calculate Your Exact Costs</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-2 block">Prompts per month: {promptsPerMonth.toLocaleString()}</label>
                  <input type="range" min="1000" max="1000000" step="1000" value={promptsPerMonth} onChange={e => setPromptsPerMonth(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-2 block">% Simple: {simplePercent}%</label>
                  <input type="range" min="0" max="100" step="5" value={simplePercent} onChange={e => setSimplePercent(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase mb-2 block">Avg tokens/prompt: {avgTokens}</label>
                  <input type="range" min="50" max="2000" step="50" value={avgTokens} onChange={e => setAvgTokens(Number(e.target.value))} className="w-full" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                  <div className="text-sm font-bold text-red-400 mb-3">Without RouteLLM (all GPT-4o)</div>
                  <div className="space-y-2 text-xs">
                    <div>Simple: {simplePrompts} × {avgTokens} × $0.000005 = <span className="text-red-400 font-bold">${(simplePrompts * avgTokens * 0.000005).toFixed(2)}</span></div>
                    <div>Complex: {complexPrompts} × {avgTokens} × $0.000005 = <span className="text-red-400 font-bold">${(complexPrompts * avgTokens * 0.000005).toFixed(2)}</span></div>
                    <div className="pt-2 border-t border-red-500/20 font-bold text-red-400">Total: ${gpt4oCost.toFixed(2)}</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                  <div className="text-sm font-bold text-green-400 mb-3">With RouteLLM</div>
                  <div className="space-y-2 text-xs">
                    <div>Simple: {simplePrompts} × {avgTokens} × $0.00 = <span className="text-green-400 font-bold">$0.00</span></div>
                    <div>Complex: {complexPrompts} × {avgTokens} × $0.000001 = <span className="text-green-400 font-bold">${routeLLMCost.toFixed(2)}</span></div>
                    <div className="pt-2 border-t border-green-500/20 font-bold text-green-400">Total: ${routeLLMCost.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="text-[10px] text-green-400 uppercase mb-1">Your Monthly Savings</div>
                <div className="text-4xl font-black text-green-400">${monthlySavings.toFixed(2)}</div>
                {proCost > 0 && (
                  <div className="mt-2 text-xs text-white/40">
                    After RouteLLM Pro ($99/mo): <span className={netSavings > 0 ? "text-green-400" : "text-white/60"}>${netSavings.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Monthly Cost Projection */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">End of Month Projection</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-white/30 uppercase mb-1">Projected Monthly Spend</div>
                  <div className="text-2xl font-black text-yellow-400">${projectedMonthlyCost.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase mb-1">Projected Savings</div>
                  <div className="text-2xl font-black text-green-400">${projectedSavings.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase mb-1">Days Left in Month</div>
                  <div className="text-2xl font-black">{daysInMonth - dayOfMonth} days</div>
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(dayOfMonth / daysInMonth) * 100}%` }} />
              </div>
              <div className="text-xs text-white/30 mt-2">{dayOfMonth} of {daysInMonth} days elapsed</div>
            </div>

            {/* Section 6: Cost Leaderboard */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">Your Most Used Models</h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((model: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg">
                    <div className="w-8 text-center font-black text-lg text-white/20">#{idx + 1}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{model.model}</div>
                      <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(model.requests / leaderboard[0].requests) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{model.requests} reqs</div>
                      <div className={cn("text-xs font-bold", model.cost === 0 ? "text-green-400" : "text-white/60")}>
                        {model.cost === 0 ? "FREE" : `$${model.cost.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Zero Cost Proof */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">Why Your Requests Cost $0.00</h3>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
                <div className="text-sm">{freeRequests} out of {totalRequests} total requests used free models</div>
                <div className="text-xs text-white/40 mt-1">Free models used: {freeModelNames || 'gemma-3-4b-it:free, llama-3.1-8b:free'}</div>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap">
                <div className="px-3 py-2 bg-blue-500/20 rounded-lg">Your Prompt</div>
                <div className="text-white/40">→</div>
                <div className="px-3 py-2 bg-purple-500/20 rounded-lg">RouteLLM Classifier</div>
                <div className="text-white/40">→</div>
                <div className="flex gap-2">
                  <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">SIMPLE → Free Model</div>
                  <div className="text-green-400">$0.00</div>
                </div>
                <div className="text-white/40">or</div>
                <div className="flex gap-2">
                  <div className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg">COMPLEX → Paid Model</div>
                  <div className="text-yellow-400">small cost</div>
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
