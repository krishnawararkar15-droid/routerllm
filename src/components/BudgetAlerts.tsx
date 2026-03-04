import { useState, useEffect } from 'react';
import { Bell, BellOff, Mail, Shield, AlertTriangle, CheckCircle, TrendingUp, Zap, Activity } from 'lucide-react';
import { LayoutDashboard, Key, BarChart3, FileText, Settings, Layers, Code2, CreditCard, LogOut, Menu, X } from 'lucide-react';
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

export const BudgetAlerts = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [tokenThreshold, setTokenThreshold] = useState(80);
  const [costLimit, setCostLimit] = useState(10);
  const [alertEmail, setAlertEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userKey) { navigate('/login'); return; }
    setAlertEmail(userEmail);
    fetch('https://routerllm.onrender.com/stats/' + userKey)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const tokensUsed = stats?.total_tokens ?? 0;
  const tokenLimit = stats?.token_limit ?? 500000;
  const tokenPct = Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));
  const totalCost = stats?.total_cost ?? 0;
  const costPct = Math.min(100, Math.round((totalCost / costLimit) * 100));
  const isTokenWarning = tokenPct >= tokenThreshold;
  const isCostWarning = totalCost >= costLimit * 0.8;

  const saveSettings = () => {
    localStorage.setItem('routellm_alert_threshold', String(tokenThreshold));
    localStorage.setItem('routellm_cost_limit', String(costLimit));
    localStorage.setItem('routellm_alert_email', alertEmail);
    localStorage.setItem('routellm_alerts_enabled', String(alertsEnabled));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    const savedThreshold = localStorage.getItem('routellm_alert_threshold');
    const savedCostLimit = localStorage.getItem('routellm_cost_limit');
    const savedEmail = localStorage.getItem('routellm_alert_email');
    const savedEnabled = localStorage.getItem('routellm_alerts_enabled');
    if (savedThreshold) setTokenThreshold(Number(savedThreshold));
    if (savedCostLimit) setCostLimit(Number(savedCostLimit));
    if (savedEmail) setAlertEmail(savedEmail);
    if (savedEnabled) setAlertsEnabled(savedEnabled === 'true');
  }, []);

  const mockAlertHistory = [
    { type: 'token', message: 'Token usage reached 80% of limit', time: '2 days ago', status: 'warning' },
    { type: 'cost', message: 'Monthly cost approaching $10 limit', time: '5 days ago', status: 'warning' },
    { type: 'token', message: 'Token usage reset for new month', time: '1 week ago', status: 'info' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">

      {/* Mobile menu overlay */}
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
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-400" />
              <h1 className="text-sm font-bold text-white/60">Budget Alerts</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Budget Alerts</h1>
              <p className="text-white/40 text-sm">Get notified before you exceed your token or cost limits</p>
            </div>

            {/* Alert Status Banner */}
            {isTokenWarning && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-orange-400">⚠️ Token usage alert triggered!</div>
                  <div className="text-xs text-white/40 mt-0.5">You have used {tokenPct}% of your token limit. Upgrade your plan to avoid interruptions.</div>
                </div>
                <button onClick={() => navigate('/dashboard/billing')} className="bg-orange-500 hover:bg-orange-400 text-white font-black px-4 py-2 rounded-lg text-xs flex-shrink-0">
                  Upgrade
                </button>
              </div>
            )}

            {/* Master Toggle */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", alertsEnabled ? "bg-green-500/20 border border-green-500/30" : "bg-white/[0.05] border border-white/[0.08]")}>
                    {alertsEnabled ? <Bell className="w-5 h-5 text-green-400" /> : <BellOff className="w-5 h-5 text-white/30" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">Budget Alerts</div>
                    <div className="text-xs text-white/40 mt-0.5">{alertsEnabled ? 'You will receive email alerts when limits are approached' : 'Alerts are disabled. You will not receive any warnings.'}</div>
                  </div>
                </div>
                {/* Toggle Switch */}
                <button onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={cn("relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0", alertsEnabled ? "bg-green-500" : "bg-white/20")}>
                  <div className={cn("absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300", alertsEnabled ? "left-8" : "left-1")} />
                </button>
              </div>
            </div>

            {/* Current Usage Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Token Usage */}
              <div className={cn("rounded-xl p-6 border", isTokenWarning ? "bg-orange-500/[0.05] border-orange-500/30" : "bg-white/[0.03] border-white/[0.08]")}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className={cn("w-4 h-4", isTokenWarning ? "text-orange-400" : "text-blue-400")} />
                    <span className="text-sm font-bold">Token Usage</span>
                  </div>
                  <span className={cn("text-2xl font-black", isTokenWarning ? "text-orange-400" : "text-blue-400")}>{tokenPct}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: tokenPct + '%', background: isTokenWarning ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} />
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>{tokensUsed.toLocaleString()} used</span>
                  <span>{tokenLimit.toLocaleString()} limit</span>
                </div>
                {isTokenWarning && (
                  <div className="mt-3 text-xs text-orange-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Alert threshold reached!
                  </div>
                )}
              </div>

              {/* Cost Usage */}
              <div className={cn("rounded-xl p-6 border", isCostWarning ? "bg-orange-500/[0.05] border-orange-500/30" : "bg-white/[0.03] border-white/[0.08]")}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={cn("w-4 h-4", isCostWarning ? "text-orange-400" : "text-green-400")} />
                    <span className="text-sm font-bold">Monthly Cost</span>
                  </div>
                  <span className={cn("text-2xl font-black", isCostWarning ? "text-orange-400" : "text-green-400")}>${totalCost.toFixed(4)}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: Math.min(100, costPct) + '%', background: isCostWarning ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #22c55e, #4ade80)' }} />
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>${totalCost.toFixed(4)} spent</span>
                  <span>${costLimit} limit</span>
                </div>
                {isCostWarning && (
                  <div className="mt-3 text-xs text-orange-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Approaching cost limit!
                  </div>
                )}
              </div>
            </div>

            {/* Alert Settings */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 space-y-6">
              <h3 className="text-sm font-bold">Alert Settings</h3>

              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Alert Email Address
                </label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={e => setAlertEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                  placeholder="your@email.com"
                />
                <p className="text-[10px] text-white/20 mt-1.5">Alerts will be sent to this email when thresholds are crossed</p>
              </div>

              {/* Token Threshold Slider */}
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">
                  Token Alert Threshold: <span className={cn("font-black", tokenThreshold >= 90 ? "text-red-400" : tokenThreshold >= 70 ? "text-orange-400" : "text-blue-400")}>{tokenThreshold}%</span>
                </label>
                <input type="range" min="10" max="95" step="5"
                  value={tokenThreshold}
                  onChange={e => setTokenThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: tokenThreshold >= 90 ? '#ef4444' : tokenThreshold >= 70 ? '#f97316' : '#3b82f6' }}
                />
                <div className="flex justify-between text-[10px] text-white/20 mt-1">
                  <span>10%</span><span>25%</span><span>50%</span><span>75%</span><span>95%</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {[50, 70, 80, 90].map(val => (
                    <button key={val} onClick={() => setTokenThreshold(val)}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all border", tokenThreshold === val ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white")}>
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Limit */}
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">
                  Monthly Cost Limit: <span className="text-green-400 font-black">${costLimit}</span>
                </label>
                <input type="range" min="1" max={Math.max(100, costLimit)} step={costLimit > 100 ? 10 : 1}
                  value={costLimit}
                  onChange={e => setCostLimit(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#22c55e' }}
                />
                <div className="flex justify-between text-[10px] text-white/20 mt-1">
                  <span>$1</span>
                  <span>${Math.round(Math.max(100, costLimit) * 0.25)}</span>
                  <span>${Math.round(Math.max(100, costLimit) * 0.5)}</span>
                  <span>${Math.round(Math.max(100, costLimit) * 0.75)}</span>
                  <span>${Math.max(100, costLimit)}</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[5, 10, 25, 50, 100].map(val => (
                    <button key={val} onClick={() => setCostLimit(val)}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all border", costLimit === val ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white")}>
                      ${val}
                    </button>
                  ))}
                </div>
                {/* Manual input for custom amount */}
                <div className="mt-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">
                    Or enter custom amount:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1">
                      <span className="px-4 text-white/40 font-bold text-sm border-r border-white/10 py-3">$</span>
                      <input
                        type="number"
                        min="1"
                        max="100000"
                        value={costLimit}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (val >= 1) setCostLimit(val);
                        }}
                        className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
                        placeholder="Enter any amount..."
                      />
                      <span className="px-4 text-white/30 text-xs">/month</span>
                    </div>
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                        if (input && Number(input.value) >= 1) setCostLimit(Number(input.value));
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white font-black px-4 py-3 rounded-xl text-xs flex-shrink-0">
                      Set
                    </button>
                  </div>
                  <p className="text-[10px] text-white/20 mt-1.5">You can set any amount from $1 to $100,000 per month</p>
                </div>
              </div>

              {/* Alert Types */}
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">Alert Types</label>
                <div className="space-y-3">
                  {[
                    { label: 'Token limit warning', desc: `Alert when usage reaches ${tokenThreshold}% of token limit`, enabled: true },
                    { label: 'Cost limit warning', desc: `Alert when monthly cost approaches $${costLimit}`, enabled: true },
                    { label: 'Token limit reached', desc: 'Alert when 100% of tokens are used', enabled: true },
                    { label: 'Weekly usage summary', desc: 'Weekly email with usage stats and savings', enabled: false },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                      <div>
                        <div className="text-xs font-bold">{alert.label}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{alert.desc}</div>
                      </div>
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", alert.enabled ? "bg-green-400" : "bg-white/20")} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button onClick={saveSettings}
                className={cn("w-full py-3 rounded-xl font-black text-sm transition-all", saved ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white")}>
                {saved ? '✓ Settings Saved!' : 'Save Alert Settings'}
              </button>
            </div>

            {/* How Alerts Work */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4">How Budget Alerts Work</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  { icon: '📊', title: 'We Monitor Usage', desc: 'RouteLLM tracks every token you use in real time after each API call' },
                  { icon: '⚡', title: 'Threshold Crossed', desc: `When usage hits ${tokenThreshold}% of your limit or cost hits $${(costLimit * 0.8).toFixed(0)}, alert is triggered` },
                  { icon: '📧', title: 'You Get Notified', desc: `Email sent to ${alertEmail || 'your email'} so you can take action before hitting the hard limit` },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-black/30 rounded-xl border border-white/[0.06]">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold mb-1">{item.title}</div>
                      <div className="text-[10px] text-white/30 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert History */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-5 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold">Alert History</h3>
                <p className="text-white/30 text-xs mt-0.5">Recent alerts triggered for your account</p>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {mockAlertHistory.map((alert, i) => (
                  <div key={i} className="flex items-center gap-4 p-5">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", alert.status === 'warning' ? "bg-orange-500/20 border border-orange-500/20" : "bg-blue-500/20 border border-blue-500/20")}>
                      {alert.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-orange-400" /> : <Bell className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{alert.message}</div>
                      <div className="text-xs text-white/30 mt-0.5">{alert.time}</div>
                    </div>
                    <span className={cn("text-[9px] font-black px-2 py-1 rounded-lg", alert.status === 'warning' ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400")}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                ))}
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
