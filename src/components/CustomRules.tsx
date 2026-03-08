import { useState, useEffect, useRef } from 'react';
import { Sliders, Trash2, Plus, ToggleLeft, ToggleRight, Clock, Zap } from 'lucide-react';
import { LayoutDashboard, Key, BarChart3, FileText, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { ProfilePopup } from './ProfilePopup';
import UpgradeBlock from './UpgradeBlock';

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
    <span className="text-[12px] font-medium flex-1">{label}</span>
    {badge && <span className="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{badge}</span>}
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
      <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
      <NavItem icon={Key} label="API Keys" to="/dashboard/keys" active={location.pathname === '/dashboard/keys'} />
      <NavItem icon={BarChart3} label="Usage" to="/dashboard/usage" active={location.pathname === '/dashboard/usage'} />
      <NavItem icon={FileText} label="Documentation" to="/docs" active={location.pathname === '/docs'} />

      <SectionLabel label="Routing" />
      <NavItem icon={Zap} label="Auto Routing" to="/dashboard/routing" active={location.pathname === '/dashboard/routing'} />
      <NavItem icon={Settings} label="Manual Override" to="/dashboard/override" active={location.pathname === '/dashboard/override'} />
      <NavItem icon={Sliders} label="Custom Rules" to="/dashboard/rules" active={location.pathname === '/dashboard/rules'} badge="PRO" />

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
      <NavItem icon={Settings} label="Custom Rules" to="/dashboard/rules" />
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

const RULE_TYPES = [
  { value: 'keyword', label: 'If prompt contains keyword' },
  { value: 'token_length', label: 'If prompt is longer than X tokens' },
  { value: 'cost_cap', label: 'Never spend more than $X per request' },
  { value: 'time_based', label: 'Only between certain hours' },
  { value: 'topic', label: 'If prompt is about a topic' },
  { value: 'fallback', label: 'If model fails, use backup' },
];

const TARGET_MODELS = [
  { value: 'gemma-3-4b:free', label: 'Gemma 3 4B', cost: '$0.00' },
  { value: 'llama-3.1-8b:free', label: 'Llama 3.1 8B', cost: '$0.00' },
  { value: 'mistral-7b:free', label: 'Mistral 7B', cost: '$0.00' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', cost: '$0.15/1M' },
  { value: 'gpt-4o', label: 'GPT-4o', cost: '$5.00/1M' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku', cost: '$0.25/1M' },
  { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', cost: '$3.00/1M' },
  { value: 'gemini-flash-1.5', label: 'Gemini Flash 1.5', cost: '$0.075/1M' },
];

const RULE_TYPE_COLORS: Record<string, string> = {
  keyword: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  token_length: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cost_cap: 'bg-green-500/20 text-green-400 border-green-500/30',
  time_based: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  topic: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  fallback: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const CustomRules = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();
  const location = useLocation();
  const plan = localStorage.getItem('routellm_plan') || 'free';
  const isFree = plan === 'free';

  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: 'keyword',
    condition_value: '',
    target_model: 'gpt-4o-mini',
    priority: 1,
  });

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    fetchRules();
  }, []);

  const fetchRules = () => {
    fetch(`https://routerllm.onrender.com/rules/${userKey}`)
      .then(r => r.json())
      .then(d => { setRules(d.rules || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('https://routerllm.onrender.com/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_key: userKey,
          rule_name: formData.rule_name,
          rule_type: formData.rule_type,
          condition_value: formData.condition_value,
          target_model: formData.target_model,
          priority: formData.priority,
        }),
      });
      if (res.ok) {
        setFormData({ rule_name: '', rule_type: 'keyword', condition_value: '', target_model: 'gpt-4o-mini', priority: 1 });
        fetchRules();
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const deleteRule = async (id: string) => {
    try {
      await fetch(`https://routerllm.onrender.com/rules/${id}`, { method: 'DELETE' });
      fetchRules();
    } catch (err) { console.error(err); }
  };

  const toggleRule = async (id: string, enabled: boolean) => {
    try {
      await fetch(`https://routerllm.onrender.com/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled }),
      });
      fetchRules();
    } catch (err) { console.error(err); }
  };

  const getConditionDescription = (rule: any) => {
    switch (rule.rule_type) {
      case 'keyword': return `When prompt contains: ${rule.condition_value}`;
      case 'token_length': return `When prompt exceeds: ${rule.condition_value} tokens`;
      case 'cost_cap': return `Max cost per request: $${rule.condition_value}`;
      case 'time_based': return `Active from: ${rule.condition_value}`;
      case 'topic': return `When topic is: ${rule.condition_value}`;
      case 'fallback': return 'Fallback chain active';
      default: return rule.condition_value;
    }
  };

  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    if (userKey) {
      fetch('https://routerllm.onrender.com/stats/' + userKey)
        .then(r => r.json())
        .then(d => setStats(d));
    }
  }, [userKey]);

  return (
    <div className="min-h-screen bg-black text-white flex font-sans relative">
      {isFree && (
        <UpgradeBlock
          feature="Custom Routing Rules"
          description="Define your own routing logic. Your rules run before auto-routing."
          requiredPlan="pro"
        />
      )}

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
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
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
        <SidebarContent userEmail={userEmail} stats={stats} profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} profileRef={profileRef} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-white/60">Custom Rules</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Custom Routing Rules</h1>
              <p className="text-white/40 text-sm">Define your own routing logic. Your rules run before auto-routing.</p>
            </div>

            {/* Add New Rule Form */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Rule
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Rule Name</label>
                  <input
                    type="text"
                    value={formData.rule_name}
                    onChange={e => setFormData({ ...formData, rule_name: e.target.value })}
                    placeholder="e.g. Code always uses Claude"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Rule Type</label>
                    <select
                      value={formData.rule_type}
                      onChange={e => setFormData({ ...formData, rule_type: e.target.value, condition_value: '' })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {RULE_TYPES.map(rt => (
                        <option key={rt.value} value={rt.value}>{rt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Condition</label>
                    {formData.rule_type === 'fallback' ? (
                      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/40 text-sm">Auto configured</div>
                    ) : formData.rule_type === 'time_based' ? (
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={formData.condition_value.split('-')[0] || '09:00'}
                          onChange={e => setFormData({ ...formData, condition_value: `${e.target.value}-17:00` })}
                          className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="time"
                          value={formData.condition_value.split('-')[1] || '17:00'}
                          onChange={e => setFormData({ ...formData, condition_value: `09:00-${e.target.value}` })}
                          className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <input
                        type={formData.rule_type === 'token_length' || formData.rule_type === 'cost_cap' ? 'number' : 'text'}
                        value={formData.condition_value}
                        onChange={e => setFormData({ ...formData, condition_value: e.target.value })}
                        placeholder={
                          formData.rule_type === 'keyword' ? 'Enter keyword e.g. python, code, debug' :
                          formData.rule_type === 'token_length' ? 'Token threshold e.g. 200' :
                          formData.rule_type === 'cost_cap' ? 'Max cost in USD e.g. 0.01' :
                          formData.rule_type === 'topic' ? 'Topic e.g. medical, legal, finance' : ''
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={formData.rule_type !== 'fallback'}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Target Model</label>
                    <select
                      value={formData.target_model}
                      onChange={e => setFormData({ ...formData, target_model: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TARGET_MODELS.map(m => (
                        <option key={m.value} value={m.value}>{m.label} ({m.cost})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Priority (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-all disabled:opacity-50"
                >
                  {saving ? 'Adding Rule...' : 'Add Rule'}
                </button>
              </form>
            </div>

            {/* Active Rules */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5" /> Your Active Rules
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{rules.length}</span>
              </h2>

              {loading ? (
                <p className="text-white/40 text-sm">Loading rules...</p>
              ) : rules.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">No rules yet. Add your first rule above to start customizing your routing.</p>
              ) : (
                <div className="space-y-3">
                  {rules.map((rule: any) => (
                    <div key={rule.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{rule.rule_name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RULE_TYPE_COLORS[rule.rule_type] || 'bg-gray-500/20 text-gray-400'}`}>
                            {rule.rule_type}
                          </span>
                          <span className="bg-white/10 text-white/60 text-[10px] px-2 py-0.5 rounded">Priority: {rule.priority}</span>
                        </div>
                        <p className="text-white/50 text-xs">{getConditionDescription(rule)}</p>
                        <p className="text-blue-400 text-xs mt-1">→ {rule.target_model}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleRule(rule.id, rule.enabled)} className="text-white/40 hover:text-white transition-colors">
                          {rule.enabled ? <ToggleRight className="w-6 h-6 text-green-400" /> : <ToggleLeft className="w-6 h-6" />}
                        </button>
                        <button onClick={() => deleteRule(rule.id)} className="text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How Rules Work */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" /> How Custom Rules Work
              </h2>
              <div className="space-y-3 text-white/60 text-sm">
                <p>• Rules run BEFORE auto-routing. If a rule matches your prompt, it overrides automatic model selection.</p>
                <p>• Rules run in priority order — higher number runs first.</p>
                <p>• If no rule matches, auto-routing takes over as normal.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomRules;
