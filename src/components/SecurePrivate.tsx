import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X, TrendingUp, Check, AlertTriangle, Lock, Database, Globe, Server, Mail, Download, Eye, Edit, Trash2, ArrowRight, Sliders } from 'lucide-react';
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
      <NavItem icon={FileText} label="Integration" to="/docs" />

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

const dataFlowSteps = [
  { step: 1, title: 'Your App', description: 'Sends prompt', icon: '📱' },
  { step: 2, title: 'LLMLite', description: 'Receives prompt, NEVER stores it', icon: '🔄' },
  { step: 3, title: 'Classifier', description: 'Reads prompt type (SIMPLE/COMPLEX)', icon: '🔍' },
  { step: 4, title: 'AI Model', description: 'Processes and returns answer', icon: '🤖' },
  { step: 5, title: 'Your App', description: 'Gets response', icon: '✅' },
];

const securityFeatures = [
  { title: 'Bcrypt Password Hashing', icon: '🔐', description: 'Your password is never stored as plain text. We use bcrypt hashing — even we cannot see your password.' },
  { title: 'Unique Subscription Keys', icon: '🔑', description: 'Every account gets a unique sk-rl- key. Revoke it anytime. Your key is never shared.' },
  { title: 'HTTPS Only', icon: '🔒', description: 'All communication between your app and LLMLite is encrypted with HTTPS/TLS. No plain HTTP.' },
  { title: 'CORS Protection', icon: '🛡️', description: 'Cross-origin requests are controlled. Your subscription key is the only authentication needed.' },
  { title: 'Supabase Database Security', icon: '🗄️', description: 'Your data is stored in Supabase — enterprise grade PostgreSQL with row level security enabled.' },
  { title: 'No Third Party Data Sharing', icon: '🚫', description: 'We never sell, share, or transfer your data to any third party for any reason.' },
];

const thirdPartyServices = [
  { service: 'Supabase', whatItDoes: 'Stores user accounts and request metadata', whatItSees: 'Email, subscription key, token counts', link: 'https://supabase.com' },
  { service: 'OpenRouter', whatItDoes: 'Routes prompts to AI models', whatItSees: 'Your prompt text (not stored by us)', link: 'https://openrouter.ai' },
  { service: 'Render.com', whatItDoes: 'Hosts the LLMLite backend server', whatItSees: 'Network traffic only', link: 'https://render.com' },
  { service: 'Vercel', whatItDoes: 'Hosts the dashboard frontend', whatItSees: 'None', link: 'https://vercel.com' },
  { service: 'Resend', whatItDoes: 'Sends emails', whatItSees: 'Your email address only', link: 'https://resend.com' },
];

const safeToSend = ['General questions and answers', 'Product descriptions', 'Marketing copy', 'Code generation (non-proprietary)', 'Customer support responses', 'Educational content'];
const useWithCaution = ['Internal business documents', 'Non-personal business data', 'Anonymized customer data', 'Internal FAQs'];
const doNotSend = ['Passwords or API keys', 'Credit card numbers', 'Personal health information (PHI)', 'Personally identifiable information (PII)', 'Government ID numbers', 'Private legal documents'];

const securityChecklist = [
  'Never expose your subscription key in frontend JavaScript code',
  'Store your sk-rl- key in environment variables only',
  'Call LLMLite from your backend server, not from the browser',
  'Rotate your key every 90 days',
  'Set up budget alerts so you know if your key is being misused',
  'Monitor your usage dashboard for unexpected spikes',
];

export const SecurePrivate = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDataJson, setShowDataJson] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  const handleExportData = () => {
    if (!stats) return;
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'routellm-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewData = () => {
    setShowDataJson(!showDataJson);
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
            <Shield className="w-4 h-4 text-green-400" />
            <h1 className="text-sm font-bold text-white/60">Secure & Private</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Section 1: Trust Header */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 lg:p-8 text-center">
              <h1 className="text-2xl lg:text-3xl font-black mb-3">Your Data Is Private. Always.</h1>
              <p className="text-white/50 max-w-2xl mx-auto mb-6">LLMLite never reads, stores, or logs your prompts. Your data flows directly to the AI model and back to you.</p>
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-sm font-bold text-green-400">Prompts Never Stored</div>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm font-bold text-green-400">Direct Model Connection</div>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-sm font-bold text-green-400">Zero Data Retention</div>
                </div>
              </div>
            </div>

            {/* Section 2: Data Flow Diagram */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-2">Exactly What Happens to Your Data</h2>
              <p className="text-sm text-white/40 mb-6">Every single request follows this exact path. Nothing else.</p>
              
              <div className="overflow-x-auto pb-4">
                <div className="flex items-center justify-between min-w-[600px] gap-2">
                  {dataFlowSteps.map((step, idx) => (
                    <div key={step.step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm mb-2">
                          {step.step}
                        </div>
                        <div className="text-2xl mb-1">{step.icon}</div>
                        <div className="text-xs font-bold text-white">{step.title}</div>
                        <div className="text-[10px] text-white/40 text-center max-w-[80px]">{step.description}</div>
                      </div>
                      {idx < dataFlowSteps.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-white/20 mx-1 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-yellow-400">LLMLite only reads your prompt to classify it as SIMPLE or COMPLEX. It is never saved anywhere.</span>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-yellow-400">After classification, your prompt goes directly to the AI model. LLMLite never sees the response.</span>
                </div>
              </div>
            </div>

            {/* Section 3: What We Store vs Don't Store */}
            <div>
              <h2 className="text-lg font-bold mb-4">Complete Data Transparency</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-green-400 mb-4">✅ What We Store in Database</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Your email address (for login only)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Your subscription key (to authenticate requests)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Your plan type (free/pro/max)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Token count per request (just the number, not the content)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Which model was used (e.g. "gemma-3-4b")</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Cost per request (e.g. "$0.00")</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Timestamp of request</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-400 mb-4">❌ What We NEVER Store</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Your prompt text — never</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> The AI model's response — never</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Any personal information from your prompts</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> IP address</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Browser or device information</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Your users' data</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">✕</span> Any content of any message</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-white/40">In simple terms — we only store metadata (numbers and labels), never content.</p>
            </div>

            {/* Section 4: Security Architecture */}
            <div>
              <h2 className="text-lg font-bold mb-4">How We Protect Your Account</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityFeatures.map((feature, idx) => (
                  <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                    <div className="text-2xl mb-3">{feature.icon}</div>
                    <div className="text-sm font-bold mb-2">{feature.title}</div>
                    <div className="text-xs text-white/50">{feature.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Third Party Services */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold">Third Party Services We Use</h3>
                <p className="text-xs text-white/40 mt-1">Full transparency on every service that touches your data.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase">Service</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase">What It Does</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase">What Data It Sees</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {thirdPartyServices.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-xs font-bold">{row.service}</td>
                        <td className="px-4 py-3 text-xs text-white/60">{row.whatItDoes}</td>
                        <td className="px-4 py-3 text-xs text-white/60">{row.whatItSees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-white/[0.06]">
                <p className="text-xs text-white/40">OpenRouter has its own privacy policy. Your prompts pass through OpenRouter to reach the AI model. We recommend reading OpenRouter's privacy policy if you are handling sensitive data.</p>
              </div>
            </div>

            {/* Section 6: Sensitive Data Warning */}
            <div>
              <h2 className="text-lg font-bold mb-4">Should You Send Sensitive Data?</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-green-400 mb-4">✅ Safe to Send</h3>
                  <ul className="space-y-2 text-xs">
                    {safeToSend.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2"><Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-yellow-400 mb-4">⚠️ Use With Caution</h3>
                  <ul className="space-y-2 text-xs">
                    {useWithCaution.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2"><AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-400 mb-4">❌ Do Not Send</h3>
                  <ul className="space-y-2 text-xs">
                    {doNotSend.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-white/40">If you need to process sensitive data, contact us to discuss enterprise options with additional security measures.</p>
            </div>

            {/* Section 7: Your Data Rights */}
            <div>
              <h2 className="text-lg font-bold mb-4">Your Rights Over Your Data</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🗑️</div>
                    <div className="text-sm font-bold">Right to Delete</div>
                  </div>
                  <p className="text-xs text-white/50 mb-4">You can request complete deletion of your account and all associated data at any time.</p>
                  <button onClick={() => alert('Email delete@llmlite.com with subject: Delete My Account')} className="w-full py-2 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold rounded-lg hover:bg-red-600/30 transition-colors">
                    Request Deletion
                  </button>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">📤</div>
                    <div className="text-sm font-bold">Right to Export</div>
                  </div>
                  <p className="text-xs text-white/50 mb-4">You can export all your request history and account data at any time.</p>
                  <button onClick={handleExportData} className="w-full py-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-600/30 transition-colors">
                    Export My Data
                  </button>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">👁️</div>
                    <div className="text-sm font-bold">Right to Know</div>
                  </div>
                  <p className="text-xs text-white/50 mb-4">You can see exactly what data we have stored about you at any time.</p>
                  <button onClick={handleViewData} className="w-full py-2 bg-purple-600/20 border border-purple-600/30 text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-600/30 transition-colors">
                    {showDataJson ? 'Hide My Data' : 'View My Data'}
                  </button>
                  {showDataJson && stats && (
                    <pre className="mt-3 p-3 bg-black/50 border border-white/10 rounded-lg text-[10px] text-white/60 overflow-x-auto max-h-48">
                      {JSON.stringify(stats, null, 2)}
                    </pre>
                  )}
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">✏️</div>
                    <div className="text-sm font-bold">Right to Correct</div>
                  </div>
                  <p className="text-xs text-white/50 mb-4">If any data about your account is incorrect, contact us and we will fix it immediately.</p>
                  <button onClick={() => alert('Email support@llmlite.com')} className="w-full py-2 bg-green-600/20 border border-green-600/30 text-green-400 text-xs font-bold rounded-lg hover:bg-green-600/30 transition-colors">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

            {/* Section 8: Security Checklist */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Security Best Practices for Your Integration</h2>
              <ul className="space-y-3 mb-6">
                {securityChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-green-400 mb-2"># ✅ CORRECT — key in environment variable</div>
                <div className="text-white/60">import os</div>
                <div className="text-white/60">import requests</div>
                <div className="text-white/60 mb-2">&nbsp;</div>
                <div className="text-white">response = requests.post(</div>
                <div className="text-white pl-4">"https://routerllm.onrender.com/route",</div>
                <div className="text-white pl-4">json=&#123;&#123;</div>
                <div className="text-white pl-8">"prompt": user_message,</div>
                <div className="text-white pl-8">"subscription_key": os.environ.get("ROUTELLM_KEY")</div>
                <div className="text-white pl-4">&#125;&#125;</div>
                <div className="text-white">)</div>
                <div className="text-white/30 mt-4 mb-2"># ❌ WRONG — never hardcode your key</div>
                <div className="text-white/30"># "subscription_key": "sk-rl-abc123..."</div>
              </div>
            </div>

            {/* Section 9: Contact Security Team */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 text-center">
              <h2 className="text-lg font-bold mb-2">Security Concern or Question?</h2>
              <p className="text-sm text-white/50 mb-4">If you find a security vulnerability or have questions about our security practices, contact us immediately.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:security@llmlite.com" className="px-4 py-2 bg-red-600/20 border border-red-600/30 text-red-400 text-sm font-bold rounded-lg hover:bg-red-600/30 transition-colors">
                  security@llmlite.com
                </a>
                <span className="text-xs text-white/40">We respond to security reports within 24 hours</span>
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
