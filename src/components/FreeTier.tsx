import { useState, useEffect } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X, DollarSign, TrendingUp, Check, AlertTriangle } from 'lucide-react';
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
      <NavItem icon={DollarSign} label="Cost Transparency" to="/dashboard/cost" active={location.pathname === '/dashboard/cost'} />

      <SectionLabel label="Model Access" />
      <NavItem icon={Layers} label="100+ Models" to="/dashboard/models" active={location.pathname === '/dashboard/models'} />

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

const freeModels = [
  { name: "Gemma 3 4B", provider: "Google", speed: "~800ms", bestFor: "Simple Q&A, short answers", context: "128K" },
  { name: "Llama 3.1 8B", provider: "Meta", speed: "~1100ms", bestFor: "General text, translations", context: "128K" },
  { name: "Mistral 7B", provider: "Mistral", speed: "~900ms", bestFor: "Reasoning, structured output", context: "32K" },
];

export const FreeTier = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const tokensUsed = stats?.tokens_used ?? stats?.total_tokens ?? 0;
  const tokenLimit = stats?.token_limit ?? 500000;
  const tokensRemaining = Math.max(0, tokenLimit - tokensUsed);
  const usagePercent = Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));
  
  const recentRequests = stats?.recent_requests ?? [];
  const simpleTokens = recentRequests
    .filter((r: any) => r.prompt_type === 'SIMPLE')
    .reduce((sum: number, r: any) => sum + (r.tokens_used || 0), 0);
  const complexTokens = recentRequests
    .filter((r: any) => r.prompt_type === 'COMPLEX')
    .reduce((sum: number, r: any) => sum + (r.tokens_used || 0), 0);
  const avgTokensPerRequest = stats?.total_requests > 0 ? Math.round(tokensUsed / stats.total_requests) : 0;
  
  const getBarColor = (pct: number) => {
    if (pct >= 80) return 'bg-red-500';
    if (pct >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleUpgrade = () => {
    alert('Email us at upgrade@routellm.com to upgrade your plan');
  };

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
            <CreditCard className="w-4 h-4 text-green-400" />
            <h1 className="text-sm font-bold text-white/60">Free Tier</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Section 1: Current Plan Status */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">FREE PLAN</span>
                <span className="text-white/40 text-xs">500,000 tokens / month</span>
              </div>
              <div className="text-3xl font-black mb-2">{tokensUsed.toLocaleString()} <span className="text-white/40 text-lg">tokens used</span></div>
              <div className="text-lg text-white/60 mb-4">{tokensRemaining.toLocaleString()} tokens remaining</div>
              
              <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all ${getBarColor(usagePercent)}`} style={{ width: `${usagePercent}%` }} />
              </div>
              <div className="text-xs text-white/40">{usagePercent}% used · {tokensRemaining.toLocaleString()} remaining · resets on 1st of next month</div>

              {usagePercent > 95 && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-red-400">Almost at limit — upgrade now to continue using RouteLLM</span>
                </div>
              )}
              {usagePercent > 80 && usagePercent <= 95 && (
                <div className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-bold text-orange-400">You are running low — upgrade to avoid interruption</span>
                </div>
              )}
            </div>

            {/* Section 2: Free Plan Includes */}
            <div>
              <h2 className="text-lg font-bold mb-4">What You Get on Free Plan</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-green-400 mb-4">✅ INCLUDED</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 500,000 tokens per month</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Auto routing (simple vs complex)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 3 free models (Gemma, Llama, Mistral)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Real-time routing decisions</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Cost transparency dashboard</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Basic usage analytics</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> API access with subscription key</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Request history (last 20)</li>
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-400 mb-4">❌ NOT INCLUDED</h3>
                  <ul className="space-y-3 text-sm opacity-60">
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Manual model override (Pro only)</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> GPT-4o, Claude, Gemini access</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Budget alerts via email</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Monthly usage reports</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Multiple API keys</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Priority support</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> 10M+ tokens per month</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Custom routing rules</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Free Models Available */}
            <div>
              <h2 className="text-lg font-bold mb-4">Models Available on Free Plan</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {freeModels.map((model, idx) => (
                  <div key={idx} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold">{model.name}</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">AVAILABLE</span>
                    </div>
                    <div className="space-y-2 text-xs text-white/60 mb-3">
                      <div className="flex justify-between"><span>Provider</span><span className="text-white">{model.provider}</span></div>
                      <div className="flex justify-between"><span>Cost</span><span className="text-green-400 font-bold">FREE</span></div>
                      <div className="flex justify-between"><span>Speed</span><span>{model.speed}</span></div>
                      <div className="flex justify-between"><span>Context</span><span>{model.context}</span></div>
                    </div>
                    <div className="text-xs text-white/40 pt-3 border-t border-white/[0.06]">{model.bestFor}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-white/40">Upgrade to Pro to unlock GPT-4o, Claude 3.5, Gemini and 95+ more models</div>
            </div>

            {/* Section 4: Plan Comparison Table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold">Compare Plans</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase">Feature</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-center uppercase bg-blue-500/10 border-x border-blue-500/20">Free</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-center uppercase">Starter</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-center uppercase">Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    <tr>
                      <td className="px-4 py-3 text-xs">Monthly Tokens</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20">500K</td>
                      <td className="px-4 py-3 text-xs text-center">10M</td>
                      <td className="px-4 py-3 text-xs text-center">100M</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Price</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20">$0</td>
                      <td className="px-4 py-3 text-xs text-center">$29/mo</td>
                      <td className="px-4 py-3 text-xs text-center">$99/mo</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Auto Routing</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Free Models</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Manual Override</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20 text-white/30">✕</td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Paid Models</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20 text-white/30">✕</td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Budget Alerts Email</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20 text-white/30">✕</td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Multiple API Keys</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20 text-white/30">✕</td>
                      <td className="px-4 py-3 text-xs text-center text-white/30">✕</td>
                      <td className="px-4 py-3 text-xs text-center"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-xs">Request History</td>
                      <td className="px-4 py-3 text-xs text-center bg-blue-500/10 border-x border-blue-500/20">20</td>
                      <td className="px-4 py-3 text-xs text-center">100</td>
                      <td className="px-4 py-3 text-xs text-center">Unlimited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3 justify-end">
                <button onClick={handleUpgrade} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg">Upgrade to Starter — $29/mo</button>
                <button onClick={handleUpgrade} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg">Upgrade to Pro — $99/mo</button>
              </div>
            </div>

            {/* Section 5: Token Usage Breakdown */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">How You Are Using Your 500K Tokens</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span>Simple Requests</span>
                    <span className="text-green-400 font-bold">{simpleTokens.toLocaleString()} tokens ({tokensUsed > 0 ? Math.round(simpleTokens/tokensUsed*100) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${tokensUsed > 0 ? (simpleTokens/tokensUsed)*100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span>Complex Requests</span>
                    <span className="text-orange-400 font-bold">{complexTokens.toLocaleString()} tokens ({tokensUsed > 0 ? Math.round(complexTokens/tokensUsed*100) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${tokensUsed > 0 ? (complexTokens/tokensUsed)*100 : 0}%` }} />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-xs text-white/40">
                <div>Average tokens per request: <span className="text-white">{avgTokensPerRequest}</span></div>
              </div>
            </div>

            {/* Section 6: Upgrade Banner */}
            <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-bold mb-1">Need more tokens?</div>
                  <div className="text-sm text-white/40">Upgrade to Starter for 10M tokens/month</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleUpgrade} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg">Starter $29/mo</button>
                  <button onClick={handleUpgrade} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg">Pro $99/mo</button>
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
