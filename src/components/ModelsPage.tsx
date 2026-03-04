import { useState, useEffect } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Search, Copy, Check, X, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const SectionLabel = ({ label }: { label: string }) => (
  <div className="px-3 pt-5 pb-1.5">
    <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{label}</span>
  </div>
);

const SidebarItem = ({ icon: Icon, label, to = "#", active = false }: { icon: any, label: string, to?: string, active?: boolean }) => (
  <Link to={to} className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all w-full mb-1 ${active ? 'bg-white/10 text-white border border-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
    <Icon className="w-3.5 h-3.5" />
    <span className="text-[12px] font-medium">{label}</span>
  </Link>
);

const SidebarContent = () => {
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
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
        <SidebarItem icon={Key} label="API Keys" to="/dashboard/keys" active={location.pathname === '/dashboard/keys'} />
        <SidebarItem icon={BarChart3} label="Usage" to="/dashboard/usage" active={location.pathname === '/dashboard/usage'} />
        <SidebarItem icon={FileText} label="Documentation" to="/docs" active={location.pathname === '/docs'} />
        <SectionLabel label="Routing" />
        <SidebarItem icon={Zap} label="Auto Routing" to="/dashboard/routing" active={location.pathname === '/dashboard/routing'} />
        <SidebarItem icon={Settings} label="Manual Override" to="/dashboard/override" active={location.pathname === '/dashboard/override'} />
        <SectionLabel label="Cost Control" />
        <SidebarItem icon={BarChart3} label="Savings Dashboard" to="/dashboard/savings" />
        <SidebarItem icon={Bell} label="Budget Alerts" to="/dashboard/alerts" active={location.pathname === '/dashboard/alerts'} />
        <SectionLabel label="Model Access" />
        <SidebarItem icon={Layers} label="100+ Models" to="/dashboard/models" active={location.pathname === '/dashboard/models'} />
        <SectionLabel label="Developer Tools" />
        <SidebarItem icon={Code2} label="Simple Integration" to="/docs" />
        <SectionLabel label="Plans & Security" />
        <SidebarItem icon={CreditCard} label="Free Tier" to="#" />
        <SidebarItem icon={Shield} label="Secure & Private" to="#" />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#09090b' }} className="p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 12px rgba(59,130,246,0.4)' }}>
            {(localStorage.getItem('routellm_email') || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-white truncate">{localStorage.getItem('routellm_email') || 'User'}</div>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">FREE PLAN</div>
          </div>
        </div>
        <Link to="/login" onClick={() => localStorage.clear()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all w-full">
          <LogOut className="w-4 h-4" />
          <span className="text-[13px] font-medium">Logout</span>
        </Link>
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
  const userKey = localStorage.getItem('routellm_key') || '';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userKey) { navigate('/login'); }
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
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#050505] border-r border-white/[0.08] overflow-y-auto z-50">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-black">R</div>
                <span className="font-black text-white">RouteLLM</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05]">✕</button>
            </div>
            <div className="p-4">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] mr-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h1 className="text-sm font-bold text-white/60">100+ Models</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-extrabold mb-1">100+ Models</h1>
              <p className="text-white/40 text-sm">Browse, filter and compare all models available via RouteLLM</p>
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
