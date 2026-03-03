import { useState, useEffect } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X, Copy, Check, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ApiKeys = () => {
  const navigate = useNavigate();
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('python');
  const [stats, setStats] = useState<any>(null);
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!userKey) {
      navigate('/login');
      return;
    }
    fetch('https://routerllm.onrender.com/stats/' + userKey)
      .then(r => r.json())
      .then(d => setStats(d));
  }, []);

  const copyKey = () => {
    navigator.clipboard.writeText(userKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runTest = async () => {
    if (!testPrompt) return;
    setTestLoading(true);
    try {
      const res = await fetch('https://routerllm.onrender.com/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt, subscription_key: userKey })
      });
      const data = await res.json();
      setTestResult(data);
    } catch(e) { console.error(e); }
    setTestLoading(false);
  };

  const codeExamples = {
    python: `import requests

response = requests.post(
    "https://routerllm.onrender.com/route",
    json={
        "prompt": "Your prompt here",
        "subscription_key": "${userKey}"
    }
)

print(response.json())`,
    javascript: `const response = await fetch("https://routerllm.onrender.com/route", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Your prompt here",
    subscription_key: "${userKey}"
  })
});

const data = await response.json();
console.log(data);`,
    curl: `curl -X POST https://routerllm.onrender.com/route \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Your prompt", "subscription_key": "${userKey}"}'`
  };

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

  const SidebarContent = () => (
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
        <NavItem icon={Key} label="API Keys" active to="/dashboard/keys" />
        <NavItem icon={BarChart3} label="Usage" to="/dashboard/usage" />
        <NavItem icon={FileText} label="Documentation" to="/docs" />

        <SectionLabel label="Routing" />
        <NavItem icon={Zap} label="Auto Routing" to="/dashboard/routing" />
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

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Mobile Sidebar */}
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
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-white/60">API Keys</h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Section 1 — Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold mb-1">API Keys</h1>
              <p className="text-white/40 text-sm">Manage your API keys and view integration examples</p>
            </div>

            {/* Section 2 — Your Key Card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold">Your Subscription Key</span>
                <span className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase">{stats?.plan || 'free'} plan</span>
              </div>
              <p className="text-white/30 text-xs mb-4">Use this key in every API request you make to RouteLLM</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white/70 truncate">
                  {showKey ? userKey : 'sk-rl-••••••••••••••••••••••••••••••••'}
                </div>
                <button onClick={() => setShowKey(!showKey)} className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                  {showKey ? <EyeOff className="w-4 h-4 text-white/50" /> : <Eye className="w-4 h-4 text-white/50" />}
                </button>
                <button onClick={copyKey} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-lg text-sm transition-all flex-shrink-0">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-orange-400/70 text-xs flex items-center gap-1">
                <span>⚠️</span> Never share this key. Never commit it to GitHub.
              </p>
            </div>

            {/* Section 3 — Key Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Total Requests</div>
                <div className="text-2xl lg:text-3xl font-bold">{stats?.total_requests ?? 0}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Tokens Used</div>
                <div className="text-2xl lg:text-3xl font-bold">{(stats?.total_tokens ?? 0).toLocaleString()}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Tokens Left</div>
                <div className="text-2xl lg:text-3xl font-bold text-green-400">{((stats?.token_limit ?? 500000) - (stats?.total_tokens ?? 0)).toLocaleString()}</div>
              </div>
            </div>

            {/* Section 4 — Code Examples */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-6">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold">Integration Examples</span>
                </div>
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                  {['python', 'javascript', 'curl'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <button onClick={() => { navigator.clipboard.writeText(codeExamples[activeTab]); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }}
                  className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/50" />}
                </button>
                <pre className="p-5 text-xs text-white/70 font-mono overflow-x-auto leading-relaxed">{codeExamples[activeTab]}</pre>
              </div>
            </div>

            {/* Section 5 — Danger Zone */}
            <div className="bg-red-500/[0.05] border border-red-500/20 rounded-xl p-6">
              <h3 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h3>
              <p className="text-white/30 text-xs mb-4">Regenerating your key will invalidate the current one. All existing integrations using the old key will stop working.</p>
              <button onClick={() => alert('Regenerate key coming soon!')}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Regenerate Key
              </button>
            </div>

            {/* Quick Test Card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold">Quick Test</span>
                <span className="text-xs text-white/30 ml-2">Send a test request right now</span>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={e => setTestPrompt(e.target.value)}
                  placeholder="Type any prompt here..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button onClick={runTest} disabled={testLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg text-sm transition-all flex-shrink-0 flex items-center gap-2">
                  {testLoading ? 'Running...' : '▶ Run Test'}
                </button>
              </div>
              {testResult && (
                <div className="mt-4 bg-black/40 border border-white/10 rounded-lg p-4">
                  <div className="flex gap-4 mb-2 text-xs">
                    <span className="text-white/40">Model: <span className="text-blue-400 font-bold">{testResult.model_used}</span></span>
                    <span className="text-white/40">Type: <span className="text-white font-bold">{testResult.prompt_type}</span></span>
                    <span className="text-white/40">Tokens: <span className="text-white font-bold">{testResult.tokens_used}</span></span>
                    <span className="text-white/40">Cost: <span className="text-green-400 font-bold">${testResult.cost_usd}</span></span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{testResult.response}</p>
                </div>
              )}
            </div>

            {/* How it works Card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 lg:p-6 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold">How RouteLLM Routes Your Requests</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-black/30 rounded-xl border border-white/[0.06]">
                  <div className="text-2xl mb-2">📥</div>
                  <div className="text-xs font-bold text-white mb-1">1. You Send Prompt</div>
                  <div className="text-[10px] text-white/30">Your app calls RouteLLM API with your key</div>
                </div>
                <div className="text-center p-4 bg-black/30 rounded-xl border border-white/[0.06]">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-xs font-bold text-white mb-1">2. We Classify</div>
                  <div className="text-[10px] text-white/30">Simple or Complex — decided in milliseconds</div>
                </div>
                <div className="text-center p-4 bg-black/30 rounded-xl border border-white/[0.06]">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-xs font-bold text-white mb-1">3. Cheapest Model Responds</div>
                  <div className="text-[10px] text-white/30">You save 30-80% vs always using GPT-4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
