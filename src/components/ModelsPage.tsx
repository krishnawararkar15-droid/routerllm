import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Search, Copy, Check, X, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, Menu, Activity, Sliders } from 'lucide-react';
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

const NavItem = ({ icon: Icon, label, active = false, to = "#", badge }: { icon: any, label: string, active?: boolean, to?: string, badge?: string }) => (
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
    {badge && <span className="ml-auto bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{badge}</span>}
  </Link>
);

const SidebarContent = ({ userEmail, stats, profilePopupOpen, setProfilePopupOpen, profileRef }: { userEmail: string, stats: any, profilePopupOpen?: boolean, setProfilePopupOpen?: (open: boolean) => void, profileRef?: any }) => {
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
      <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
      <NavItem icon={Key} label="API Keys" to="/dashboard/keys" />
      <NavItem icon={BarChart3} label="Usage" to="/dashboard/usage" />
      <NavItem icon={FileText} label="Documentation" to="/docs" />

      <SectionLabel label="Routing" />
      <NavItem icon={Zap} label="Auto Routing" to="/dashboard/routing" />
      <NavItem icon={Settings} label="Manual Override" to="/dashboard/override" />
      <NavItem icon={Sliders} label="Custom Rules" to="/dashboard/rules" badge="PRO" />

      <SectionLabel label="Cost Control" />
      <NavItem icon={Bell} label="Budget Alerts" to="/dashboard/alerts" badge="PRO" />

      <SectionLabel label="Model Access" />
      <NavItem icon={Layers} label="100+ Models" to="/dashboard/models" badge="PRO" />

      <SectionLabel label="Developer Tools" />
      <NavItem icon={FileText} label="Cost Transparency" to="/dashboard/cost" />

      <SectionLabel label="Plans & Security" />
      <NavItem icon={CreditCard} label="Free Tier" to="/dashboard/freetier" />
      <NavItem icon={Shield} label="Secure & Private" to="/dashboard/security" />

      <SectionLabel label="Key Management" />
      <NavItem icon={Key} label="Multiple Keys" to="/dashboard/multiplekeys" />
    </div>

    {/* Upgrade Banner for Free Users */}
    {(() => {
      const plan = localStorage.getItem('routellm_plan') || 'free';
      if (plan === 'free') {
        return (
          <div className="mx-3 mb-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-3">
            <p className="text-white text-xs font-semibold mb-1">⚡ Upgrade to Pro</p>
            <p className="text-gray-400 text-xs mb-2">Unlock all models and features</p>
            <a href="/dashboard/billing" className="block text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-all">
              Upgrade — $29/mo
            </a>
          </div>
        );
      }
      return null;
    })()}

    <div ref={profileRef} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#09090b' }} className="p-3 relative">
      <div className="flex items-center gap-3 px-2 py-2 mb-1" onClick={() => setProfilePopupOpen && setProfilePopupOpen(!profilePopupOpen)}>
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
      {profilePopupOpen && setProfilePopupOpen && (<ProfilePopup userEmail={userEmail} userPlan={stats?.plan || 'free'} onClose={() => setProfilePopupOpen(false)} />)}
    </div>
  </div>
  );
};

const models = [
  // FREE MODELS
  { id: "google/gemma-3-4b-it:free", name: "Gemma 3 4B", provider: "Google", cost: 0, costLabel: "FREE", speed: "Fast", context: "128K", bestFor: "Simple Q&A, short answers, summaries", type: "free" },
  { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B", provider: "Meta", cost: 0, costLabel: "FREE", speed: "Fast", context: "128K", bestFor: "General text, Q&A, translations", type: "free" },
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B", provider: "Mistral", cost: 0, costLabel: "FREE", speed: "Fast", context: "32K", bestFor: "Reasoning, structured output", type: "free" },
  { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B", provider: "Meta", cost: 0, costLabel: "FREE", speed: "Very Fast", context: "128K", bestFor: "Ultra fast simple tasks", type: "free" },
  { id: "google/gemma-2-9b-it:free", name: "Gemma 2 9B", provider: "Google", cost: 0, costLabel: "FREE", speed: "Fast", context: "8K", bestFor: "Chat, instructions, reasoning", type: "free" },
  // OPENAI
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", cost: 0.15, costLabel: "$0.15/1M", speed: "Fast", context: "128K", bestFor: "Most tasks, affordable and smart", type: "paid" },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", cost: 5.00, costLabel: "$5.00/1M", speed: "Medium", context: "128K", bestFor: "Complex reasoning, coding, analysis", type: "paid" },
  { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", cost: 10.00, costLabel: "$10.00/1M", speed: "Medium", context: "128K", bestFor: "Hard tasks needing maximum power", type: "paid" },
  { id: "openai/o1-mini", name: "O1 Mini", provider: "OpenAI", cost: 3.00, costLabel: "$3.00/1M", speed: "Slow", context: "128K", bestFor: "Math, science, deep reasoning", type: "paid" },
  // ANTHROPIC
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", cost: 0.25, costLabel: "$0.25/1M", speed: "Fast", context: "200K", bestFor: "Fast analysis, document Q&A", type: "paid" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", cost: 3.00, costLabel: "$3.00/1M", speed: "Medium", context: "200K", bestFor: "Best for coding and writing", type: "paid" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", cost: 15.00, costLabel: "$15.00/1M", speed: "Slow", context: "200K", bestFor: "Most complex tasks, research", type: "paid" },
  // GOOGLE
  { id: "google/gemini-flash-1.5", name: "Gemini Flash 1.5", provider: "Google", cost: 0.075, costLabel: "$0.075/1M", speed: "Very Fast", context: "1M", bestFor: "Ultra fast, huge context window", type: "paid" },
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", provider: "Google", cost: 3.50, costLabel: "$3.50/1M", speed: "Medium", context: "1M", bestFor: "Long documents, multimodal tasks", type: "paid" },
  // META
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", provider: "Meta", cost: 0.59, costLabel: "$0.59/1M", speed: "Medium", context: "128K", bestFor: "Powerful open source, coding", type: "paid" },
  { id: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B", provider: "Meta", cost: 3.00, costLabel: "$3.00/1M", speed: "Slow", context: "128K", bestFor: "Largest open source model", type: "paid" },
  // MISTRAL
  { id: "mistralai/mixtral-8x7b-instruct", name: "Mixtral 8x7B", provider: "Mistral", cost: 0.24, costLabel: "$0.24/1M", speed: "Fast", context: "32K", bestFor: "Efficient, multilingual tasks", type: "paid" },
  { id: "mistralai/mistral-large", name: "Mistral Large", provider: "Mistral", cost: 8.00, costLabel: "$8.00/1M", speed: "Medium", context: "128K", bestFor: "Enterprise reasoning and coding", type: "paid" },
];

const providerColors: Record<string, string> = {
  OpenAI: 'bg-blue-600',
  Anthropic: 'bg-purple-600',
  Google: 'bg-green-600',
  Meta: 'bg-orange-600',
  Mistral: 'bg-cyan-600',
};

const providerInitials: Record<string, string> = {
  OpenAI: 'O',
  Anthropic: 'A',
  Google: 'G',
  Meta: 'M',
  Mistral: 'Mi',
};

export const ModelsPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();
  const location = useLocation();
  const plan = localStorage.getItem('routellm_plan') || 'free';
  const isFree = plan === 'free';

  useEffect(() => {
    if (!userKey) { navigate('/login'); }
    fetch('https://routerllm.onrender.com/stats/' + userKey)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);

  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                         m.provider.toLowerCase().includes(search.toLowerCase()) ||
                         m.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'free') return m.type === 'free';
    return m.provider === filter;
  });

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelect = (id: string) => {
    if (selectedModels.includes(id)) {
      setSelectedModels(selectedModels.filter(m => m !== id));
    } else if (selectedModels.length < 3) {
      setSelectedModels([...selectedModels, id]);
    }
  };

  const clearSelection = () => setSelectedModels([]);

  const useInOverride = (id: string) => {
    localStorage.setItem('routellm_override_model', id);
    setToast('Model selected for override!');
    setTimeout(() => setToast(null), 2000);
  };

  const getSpeedColor = (speed: string) => {
    if (speed === 'Very Fast' || speed === 'Fast') return 'text-green-400';
    if (speed === 'Medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  const selectedModelsData = models.filter(m => selectedModels.includes(m.id));

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">

      {/* Mobile menu overlay */}
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
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h1 className="text-sm font-bold text-white/60">100+ Models</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8 relative">
          {isFree && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl"
              style={{backdropFilter: 'blur(8px)', background: 'rgba(10,13,20,0.85)'}}>
              <div className="text-center p-8 max-w-sm">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-white text-xl font-bold mb-2">100+ Models</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Access GPT-4o, Claude 3.5 Sonnet, Gemini, and 100+ models. Route any prompt to exactly the model you need.
                </p>
                <a href="/dashboard/billing"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl inline-block transition-all">
                  Upgrade to Pro — $29/mo →
                </a>
                <p className="text-gray-600 text-xs mt-3">7-day money back guarantee</p>
              </div>
            </div>
          )}
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-extrabold mb-1">100+ Models</h1>
              <p className="text-white/40 text-sm">Browse, filter and compare all models available via LLMLite</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search models..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {['all', 'free', 'OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                    filter === f 
                      ? "bg-blue-500/20 border-blue-500/40 text-blue-400" 
                      : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  {f === 'all' ? 'All Models' : f === 'free' ? 'Free Only' : f}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="text-xs text-white/30">
              Showing {filteredModels.length} models
            </div>

            {/* Model Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredModels.map(model => (
                <div
                  key={model.id}
                  className={cn(
                    "bg-white/[0.03] border rounded-xl p-5 transition-all hover:border-white/20",
                    selectedModels.includes(model.id) && "border-blue-500/50 bg-blue-500/5"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black", providerColors[model.provider])}>
                      {providerInitials[model.provider]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{model.name}</div>
                      <div className="text-xs text-white/30">{model.provider}</div>
                    </div>
                    <button
                      onClick={() => toggleSelect(model.id)}
                      className={cn(
                        "w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                        selectedModels.includes(model.id)
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-white/20 text-white/20 hover:border-white/40"
                      )}
                    >
                      {selectedModels.includes(model.id) && <Check className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", model.type === 'free' ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400")}>
                      {model.costLabel}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/60")}>
                      {model.speed}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/60">
                      {model.context}
                    </span>
                  </div>

                  {/* Best for */}
                  <div className="text-xs text-white/40 mb-4">{model.bestFor}</div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyId(model.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-1"
                    >
                      {copiedId === model.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === model.id ? 'Copied!' : 'Copy ID'}
                    </button>
                    <button
                      onClick={() => useInOverride(model.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 transition-all"
                    >
                      Use in Override
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>

      {/* Compare Panel */}
      {selectedModels.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-t border-white/[0.08] p-4 pb-24 lg:pb-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Compare Models ({selectedModels.length})</h3>
              <button onClick={clearSelection} className="text-xs text-white/40 hover:text-white">
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedModelsData.map(model => (
                <div key={model.id} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black", providerColors[model.provider])}>
                      {providerInitials[model.provider]}
                    </div>
                    <div className="font-bold text-sm truncate">{model.name}</div>
                    <button onClick={() => toggleSelect(model.id)} className="ml-auto text-white/20 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/30">Cost</span>
                      <span className={model.type === 'free' ? 'text-green-400' : 'text-white'}>{model.costLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Speed</span>
                      <span className={getSpeedColor(model.speed)}>{model.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Context</span>
                      <span>{model.context}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Best for</span>
                      <span className="text-right max-w-[120px] truncate">{model.bestFor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

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
