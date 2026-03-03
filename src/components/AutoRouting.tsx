import { useState, useEffect } from 'react';
import { Zap, Brain, CheckCircle, ArrowRight, RefreshCw, Play } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LayoutDashboard, Key, BarChart3, FileText, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
      <NavItem icon={BarChart3} label="Usage" to="/dashboard/usage" />
      <NavItem icon={FileText} label="Documentation" to="/docs" />

      <SectionLabel label="Routing" />
      <NavItem icon={Zap} label="Auto Routing" active to="/dashboard/routing" />
      <NavItem icon={Settings} label="Manual Override" to="/dashboard/override" />

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

export const AutoRouting = () => {
  const [stats, setStats] = useState<any>(null);
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    fetch('https://routerllm.onrender.com/stats/' + userKey)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(e => console.error(e));
  }, []);

  const runTest = async (prompt?: string) => {
    const p = prompt || testPrompt;
    if (!p.trim()) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('https://routerllm.onrender.com/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: p, subscription_key: userKey })
      });
      const data = await res.json();
      setTestResult(data);
    } catch(e) { console.error(e); }
    setTestLoading(false);
  };

  const simpleCount = (stats?.recent_requests || []).filter((r: any) => r.prompt_type?.toUpperCase() === 'SIMPLE').length;
  const complexCount = (stats?.recent_requests || []).filter((r: any) => r.prompt_type?.toUpperCase() === 'COMPLEX').length;
  const total = simpleCount + complexCount;
  const simplePct = total > 0 ? Math.round((simpleCount / total) * 100) : 70;
  const complexPct = total > 0 ? Math.round((complexCount / total) * 100) : 30;

  const pieData = [
    { name: 'Simple', value: simpleCount || 7, color: '#3b82f6' },
    { name: 'Complex', value: complexCount || 3, color: '#8b5cf6' },
  ];

  const examplePrompts = [
    { prompt: 'What is 2+2?', type: 'SIMPLE', reason: 'Basic math — no reasoning needed' },
    { prompt: 'Translate hello to Spanish', type: 'SIMPLE', reason: 'Simple translation task' },
    { prompt: 'Summarize this in one sentence', type: 'SIMPLE', reason: 'Short summarization' },
    { prompt: 'Fix grammar: i went to store', type: 'SIMPLE', reason: 'Simple text correction' },
    { prompt: 'Write a 1000 word essay about climate change with citations', type: 'COMPLEX', reason: 'Long form content requiring deep knowledge' },
    { prompt: 'Analyze this business strategy and suggest improvements', type: 'COMPLEX', reason: 'Complex reasoning and analysis required' },
    { prompt: 'Debug this React code and explain why it fails', type: 'COMPLEX', reason: 'Technical debugging needs powerful model' },
    { prompt: 'Compare quantum computing vs classical computing in depth', type: 'COMPLEX', reason: 'Deep technical comparison needed' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={userEmail} stats={stats} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h1 className="text-sm font-bold text-white/60">Auto Routing</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
              <h3 className="text-sm font-bold mb-6">How Auto Routing Works</h3>
              <div className="flex flex-col lg:flex-row items-center gap-3">
                <div className="flex-1 bg-black/40 border border-white/[0.08] rounded-xl p-4 lg:p-5 text-center">
                  <div className="text-3xl mb-3">📥</div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-2">Step 1</div>
                  <div className="text-sm font-bold mb-1">Your Prompt Arrives</div>
                  <div className="text-[11px] text-white/30 leading-relaxed">Your app sends a prompt to RouteLLM API with your subscription key</div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/20 flex-shrink-0 rotate-90 lg:rotate-0" />
                <div className="flex-1 bg-black/40 border border-blue-500/20 rounded-xl p-4 lg:p-5 text-center">
                  <div className="text-3xl mb-3">🧠</div>
                  <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2">Step 2</div>
                  <div className="text-sm font-bold mb-1">Instant Classification</div>
                  <div className="text-[11px] text-white/30 leading-relaxed">Classified as SIMPLE or COMPLEX in milliseconds using a lightweight AI classifier</div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/20 flex-shrink-0 rotate-90 lg:rotate-0" />
                <div className="flex-1 bg-black/40 border border-green-500/20 rounded-xl p-4 lg:p-5 text-center">
                  <div className="text-3xl mb-3">💰</div>
                  <div className="text-xs font-black text-green-400 uppercase tracking-wider mb-2">Step 3</div>
                  <div className="text-sm font-bold mb-1">Cheapest Model Responds</div>
                  <div className="text-[11px] text-white/30 leading-relaxed">Simple → Free model. Complex → Powerful model. You save 30-80%.</div>
                </div>
              </div>
            </div>

            {/* LIVE ROUTING TESTER — most important section */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-bold">Live Routing Tester</h3>
                <span className="ml-2 text-[9px] bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Live</span>
              </div>
              <p className="text-white/30 text-xs mb-5">Type any prompt and see exactly which model RouteLLM picks and why</p>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={e => setTestPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runTest()}
                  placeholder="Type any prompt here and press Enter or click Route..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
                <button
                  onClick={() => runTest()}
                  disabled={testLoading || !testPrompt.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black px-8 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 flex-shrink-0"
                >
                  {testLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Routing...</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Route</>
                  )}
                </button>
              </div>

              {/* Quick example prompts */}
              <div className="mb-5">
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {['What is 2+2?', 'Translate hello to French', 'Write a 500 word essay on AI', 'Debug my React code'].map((p, i) => (
                    <button key={i} onClick={() => { setTestPrompt(p); runTest(p); }}
                      className="text-[11px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/50 hover:text-white px-3 py-1.5 rounded-lg transition-all">
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              {testResult && (
                <div className={`rounded-xl border p-5 transition-all ${testResult.prompt_type === 'SIMPLE' ? 'bg-blue-500/[0.05] border-blue-500/30' : 'bg-purple-500/[0.05] border-purple-500/30'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-black ${testResult.prompt_type === 'SIMPLE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                      {testResult.prompt_type === 'SIMPLE' ? '⚡ SIMPLE' : '🧠 COMPLEX'}
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                    <div className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-black text-white">
                      🤖 {testResult.model_used}
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-xs text-white/30">
                      <span>Tokens: <span className="text-white font-bold">{testResult.tokens_used}</span></span>
                      <span>Cost: <span className="text-green-400 font-bold">${Number(testResult.cost_usd || 0).toFixed(4)}</span></span>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">AI Response</p>
                    <p className="text-sm text-white/80 leading-relaxed">{testResult.response}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats + Pie chart */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-2 lg:col-span-1 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-5">
                <h3 className="text-sm font-bold mb-4">Your Routing Split</h3>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f1623', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-white/60">Simple</span></div>
                    <span className="font-black">{simplePct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /><span className="text-white/60">Complex</span></div>
                    <span className="font-black">{complexPct}%</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 grid grid-rows-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/[0.05] border border-blue-500/20 rounded-xl p-4 lg:p-5">
                    <div className="text-[9px] text-blue-400 uppercase tracking-widest mb-2">Simple Requests</div>
                    <div className="text-2xl lg:text-3xl font-black text-blue-400">{simpleCount || 0}</div>
                    <div className="text-[10px] text-white/30 mt-1">Routed to free models → $0.00</div>
                  </div>
                  <div className="bg-purple-500/[0.05] border border-purple-500/20 rounded-xl p-4 lg:p-5">
                    <div className="text-[9px] text-purple-400 uppercase tracking-widest mb-2">Complex Requests</div>
                    <div className="text-2xl lg:text-3xl font-black text-purple-400">{complexCount || 0}</div>
                    <div className="text-[10px] text-white/30 mt-1">Routed to powerful models</div>
                  </div>
                </div>
                <div className="bg-green-500/[0.05] border border-green-500/20 rounded-xl p-4 lg:p-5 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-green-400 uppercase tracking-widest mb-1">Total Saved by Routing</div>
                    <div className="text-2xl lg:text-3xl font-black text-green-400">${Number(stats?.total_savings ?? 0).toFixed(4)}</div>
                    <div className="text-[10px] text-white/30 mt-1">vs sending everything to GPT-4o</div>
                  </div>
                  <div className="hidden lg:block text-5xl">💰</div>
                </div>
              </div>
            </div>

            {/* Simple vs Complex examples */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
              <h3 className="text-sm font-bold mb-2">What Makes a Prompt SIMPLE vs COMPLEX?</h3>
              <p className="text-white/30 text-xs mb-5">Click any example to test it live</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" /> Simple — Goes to Free Model
                  </div>
                  <div className="space-y-2">
                    {examplePrompts.filter(e => e.type === 'SIMPLE').map((e, i) => (
                      <button key={i} onClick={() => { setTestPrompt(e.prompt); runTest(e.prompt); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-full text-left p-3 bg-blue-500/[0.04] hover:bg-blue-500/[0.08] border border-blue-500/10 hover:border-blue-500/30 rounded-xl transition-all group">
                        <div className="text-xs font-bold text-white group-hover:text-blue-300 mb-1">"{e.prompt}"</div>
                        <div className="text-[10px] text-white/30">{e.reason}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5" /> Complex — Goes to Powerful Model
                  </div>
                  <div className="space-y-2">
                    {examplePrompts.filter(e => e.type === 'COMPLEX').map((e, i) => (
                      <button key={i} onClick={() => { setTestPrompt(e.prompt); runTest(e.prompt); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-full text-left p-3 bg-purple-500/[0.04] hover:bg-purple-500/[0.08] border border-purple-500/10 hover:border-purple-500/30 rounded-xl transition-all group">
                        <div className="text-xs font-bold text-white group-hover:text-purple-300 mb-1">"{e.prompt}"</div>
                        <div className="text-[10px] text-white/30">{e.reason}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent routing decisions table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-5 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold">Recent Routing Decisions</h3>
                <p className="text-white/30 text-xs mt-0.5">How RouteLLM handled your last requests</p>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Classification</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Model Chosen</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Tokens</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Cost</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">GPT-4o Would Cost</th>
                    <th className="px-6 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {(stats?.recent_requests ?? []).length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-white/30 text-sm">No requests yet. Use the Live Tester above to make your first request!</td></tr>
                  ) : (stats?.recent_requests ?? []).map((req: any, i: number) => {
                    const gpt4oCost = (req.tokens_used * 0.000005).toFixed(4);
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${req.prompt_type === 'SIMPLE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-purple-500/20 text-purple-400 border border-purple-500/20'}`}>
                            {req.prompt_type === 'SIMPLE' ? '⚡ SIMPLE' : '🧠 COMPLEX'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="text-[13px] font-bold">{req.model_used}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-[13px] text-white/60">{req.tokens_used}</td>
                        <td className="px-6 py-3 text-[13px] font-bold text-green-400">${Number(req.cost_usd ?? 0).toFixed(4)}</td>
                        <td className="px-6 py-3 text-[13px] text-white/30 line-through">${gpt4oCost}</td>
                        <td className="px-6 py-3 text-[13px] text-white/30 text-right">{new Date(req.created_at).toLocaleTimeString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
