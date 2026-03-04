import { useState, useEffect } from 'react';
import { Settings, Play, RefreshCw, Zap, Copy, Check, Menu, X } from 'lucide-react';
import { LayoutDashboard, Key, BarChart3, FileText, Bell, Layers, Code2, CreditCard, Shield, LogOut } from 'lucide-react';
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

const models = [
  { id: 'auto', name: 'Auto Route', desc: 'Let RouteLLM decide', cost: 'Optimized', badge: 'RECOMMENDED', color: 'blue', icon: '⚡' },
  { id: 'google/gemma-3-4b-it:free', name: 'Gemma 3 4B', desc: 'Google — Fast and free', cost: '$0.00', badge: 'FREE', color: 'green', icon: '🟢' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', desc: 'Meta — Great for general tasks', cost: '$0.00', badge: 'FREE', color: 'green', icon: '🟢' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', desc: 'Mistral — Strong reasoning', cost: '$0.00', badge: 'FREE', color: 'green', icon: '🟢' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', desc: 'OpenAI — Fast and capable', cost: '$0.15/1M', badge: 'PAID', color: 'purple', icon: '🔵' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'OpenAI — Most powerful', cost: '$5.00/1M', badge: 'PAID', color: 'purple', icon: '🔵' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', desc: 'Anthropic — Fast and smart', cost: '$0.25/1M', badge: 'PAID', color: 'purple', icon: '🟣' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Anthropic — Best for coding', cost: '$3.00/1M', badge: 'PAID', color: 'purple', icon: '🟣' },
  { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', desc: 'Google — Ultra fast', cost: '$0.075/1M', badge: 'PAID', color: 'yellow', icon: '🟡' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', desc: 'Meta — Powerful open source', cost: '$0.59/1M', badge: 'PAID', color: 'orange', icon: '🟠' },
];

export const ManualOverride = () => {
  const [selectedModel, setSelectedModel] = useState('auto');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [compareModel1, setCompareModel1] = useState('google/gemma-3-4b-it:free');
  const [compareModel2, setCompareModel2] = useState('openai/gpt-4o-mini');
  const [comparePrompt, setComparePrompt] = useState('');
  const [compareResult1, setCompareResult1] = useState<any>(null);
  const [compareResult2, setCompareResult2] = useState<any>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    fetch('https://routerllm.onrender.com/stats/' + userKey)
      .then(r => r.json())
      .then(d => setStats(d));
  }, []);

  const runTest = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const body: any = { prompt, subscription_key: userKey };
      if (selectedModel !== 'auto') body.model_override = selectedModel;
      const res = await fetch('https://routerllm.onrender.com/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setResult(await res.json());
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const runCompare = async () => {
    if (!comparePrompt.trim()) return;
    setCompareLoading(true);
    setCompareResult1(null);
    setCompareResult2(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch('https://routerllm.onrender.com/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: comparePrompt, subscription_key: userKey, model_override: compareModel1 })
        }).then(r => r.json()),
        fetch('https://routerllm.onrender.com/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: comparePrompt, subscription_key: userKey, model_override: compareModel2 })
        }).then(r => r.json())
      ]);
      setCompareResult1(r1);
      setCompareResult2(r2);
    } catch(e) { console.error(e); }
    setCompareLoading(false);
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

      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={userEmail} stats={stats} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <Settings className="w-4 h-4 text-white/40" />
            <h1 className="text-sm font-bold text-white/60">Manual Override</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Manual Override</h1>
              <p className="text-white/40 text-sm">Skip auto routing and force any specific model for your requests</p>
            </div>

            {/* Warning banner */}
            <div className="bg-orange-500/[0.08] border border-orange-500/20 rounded-xl p-4 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="text-sm font-bold text-orange-400">Manual Override disables cost savings</div>
                <div className="text-xs text-white/40 mt-0.5">When you specify a model, auto routing is skipped. Use this only when you need a specific model's capabilities. For maximum savings use Auto Route.</div>
              </div>
            </div>

            {/* Model Selector + Test Console */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-bold">Test Console</h3>
                <span className="ml-2 text-[9px] bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
              <p className="text-white/30 text-xs mb-5">Pick any model and send a prompt to test it directly</p>

              {/* Model picker */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">Select Model</label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                  {models.map(m => (
                    <button key={m.id} onClick={() => setSelectedModel(m.id)}
                      className={cn("flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                        selectedModel === m.id ? "bg-blue-500/10 border-blue-500/40" : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
                      )}>
                      <span className="text-lg">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">{m.name}</span>
                          <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded flex-shrink-0",
                            m.badge === 'FREE' ? "bg-green-500/20 text-green-400" :
                            m.badge === 'RECOMMENDED' ? "bg-blue-500/20 text-blue-400" :
                            "bg-purple-500/20 text-purple-400"
                          )}>{m.badge}</span>
                        </div>
                        <div className="text-[10px] text-white/30 truncate">{m.desc}</div>
                        <div className="text-[10px] font-bold text-white/50 mt-0.5">{m.cost}</div>
                      </div>
                      {selectedModel === m.id && <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected model display */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-3 mb-4 flex items-center gap-3">
                <span className="text-sm">{models.find(m => m.id === selectedModel)?.icon}</span>
                <div>
                  <span className="text-xs text-white/40">Selected: </span>
                  <span className="text-xs font-black text-white">{models.find(m => m.id === selectedModel)?.name}</span>
                  <span className="text-xs text-white/40 ml-2">{models.find(m => m.id === selectedModel)?.cost}</span>
                </div>
                {selectedModel === 'auto' && <span className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg font-bold">Auto routing active — maximum savings</span>}
              </div>

              {/* Prompt input */}
              <div className="flex gap-3">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Type your prompt here..."
                  rows={3}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
                />
                <button onClick={runTest} disabled={loading || !prompt.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black px-8 rounded-xl text-sm transition-all flex flex-col items-center justify-center gap-1 flex-shrink-0">
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  <span className="text-[10px]">{loading ? 'Running' : 'Run'}</span>
                </button>
              </div>

              {/* Result */}
              {result && (
                <div className="mt-4 bg-black/30 border border-white/[0.08] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-black">🤖 {result.model_used}</div>
                    <div className="bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-black text-blue-400">{result.prompt_type}</div>
                    <div className="text-xs text-white/30">Tokens: <span className="text-white font-bold">{result.tokens_used}</span></div>
                    <div className="text-xs text-white/30">Cost: <span className="text-green-400 font-bold">${Number(result.cost_usd || 0).toFixed(6)}</span></div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{result.response}</p>
                </div>
              )}
            </div>

            {/* Model Comparison */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">⚖️</span>
                <h3 className="text-sm font-bold">Model Comparison</h3>
              </div>
              <p className="text-white/30 text-xs mb-5">Send the same prompt to two models and compare quality and cost side by side</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Model A', value: compareModel1, set: setCompareModel1, result: compareResult1 },
                  { label: 'Model B', value: compareModel2, set: setCompareModel2, result: compareResult2 },
                ].map((side, idx) => (
                  <div key={idx}>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">{side.label}</label>
                    <select value={side.value} onChange={e => side.set(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 mb-3">
                      {models.filter(m => m.id !== 'auto').map(m => (
                        <option key={m.id} value={m.id}>{m.name} — {m.cost}</option>
                      ))}
                    </select>
                    {side.result && (
                      <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-lg">{side.result.model_used}</span>
                          <span className="text-[10px] text-white/30">Tokens: <span className="text-white font-bold">{side.result.tokens_used}</span></span>
                          <span className="text-[10px] text-green-400 font-bold">${Number(side.result.cost_usd || 0).toFixed(6)}</span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed">{side.result.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <textarea
                value={comparePrompt}
                onChange={e => setComparePrompt(e.target.value)}
                placeholder="Enter prompt to compare both models..."
                rows={2}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none mb-3"
              />
              <button onClick={runCompare} disabled={compareLoading || !comparePrompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {compareLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Comparing...</> : <>⚖️ Compare Both Models</>}
              </button>
            </div>

            {/* All Models Reference Table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-4 lg:p-5 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold">All Available Models</h3>
                <p className="text-white/30 text-xs mt-0.5">Complete list of models you can route to</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Model</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Provider</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Cost</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Best For</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[
                    { name: 'Gemma 3 4B', provider: 'Google', cost: '$0.00', best: 'Short answers, summaries, Q&A', type: 'FREE' },
                    { name: 'Llama 3.1 8B', provider: 'Meta', cost: '$0.00', best: 'General text, translations', type: 'FREE' },
                    { name: 'Mistral 7B', provider: 'Mistral', cost: '$0.00', best: 'Reasoning, structured output', type: 'FREE' },
                    { name: 'GPT-4o Mini', provider: 'OpenAI', cost: '$0.15/1M', best: 'Complex reasoning, long context', type: 'PAID' },
                    { name: 'GPT-4o', provider: 'OpenAI', cost: '$5.00/1M', best: 'Most complex tasks, vision', type: 'PAID' },
                    { name: 'Claude 3 Haiku', provider: 'Anthropic', cost: '$0.25/1M', best: 'Analysis, coding, fast', type: 'PAID' },
                    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', cost: '$3.00/1M', best: 'Best coding, complex writing', type: 'PAID' },
                    { name: 'Gemini Flash 1.5', provider: 'Google', cost: '$0.075/1M', best: 'Ultra fast, multimodal', type: 'PAID' },
                    { name: 'Llama 3.1 70B', provider: 'Meta', cost: '$0.59/1M', best: 'Powerful open source tasks', type: 'PAID' },
                  ].map((m, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 text-[13px] font-bold">{m.name}</td>
                      <td className="px-6 py-3 text-[13px] text-white/50">{m.provider}</td>
                      <td className="px-6 py-3 text-[13px] font-bold text-green-400">{m.cost}</td>
                      <td className="px-6 py-3 text-[12px] text-white/40">{m.best}</td>
                      <td className="px-6 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[9px] font-black",
                          m.type === 'FREE' ? "bg-green-500/20 text-green-400" : "bg-purple-500/20 text-purple-400"
                        )}>{m.type}</span>
                      </td>
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
