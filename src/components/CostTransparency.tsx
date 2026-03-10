import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X, TrendingUp, Receipt, Calculator, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
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

export const CostTransparency = () => {
  const [stats, setStats] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const key = localStorage.getItem('routellm_key')
      if (!key) return
      try {
        const res = await fetch(`https://routerllm.onrender.com/stats/${key}`)
        const data = await res.json()
        setStats(data)
        setRequests(data.recent_requests || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  )

  const totalCost = stats?.total_cost ?? 0
  const totalTokens = stats?.total_tokens ?? 0
  const totalRequests = stats?.total_requests ?? 0
  const totalSavings = stats?.total_savings ?? 0
  const avgCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0
  const gpt4oCost = (totalTokens / 1000000) * 5.00
  const savingsPercent = gpt4oCost > 0 ? ((gpt4oCost - totalCost) / gpt4oCost * 100) : 0
  const optimizationScore = Math.min(100, Math.round(savingsPercent))
  const scoreColor = optimizationScore >= 70 ? 'text-green-400' : optimizationScore >= 40 ? 'text-yellow-400' : 'text-red-400'
  const scoreLabel = optimizationScore >= 70 ? 'Excellent' : optimizationScore >= 40 ? 'Good' : 'Needs Work'

  const getRecommendations = () => {
    const recs = []
    const complexCount = requests.filter(r => r.prompt_type === 'COMPLEX').length
    const simpleCount = requests.filter(r => r.prompt_type === 'SIMPLE').length
    const paidRequests = requests.filter(r => r.cost_usd > 0)

    if (complexCount > simpleCount) {
      recs.push({
        icon: '⚡',
        title: 'High Complex Request Rate',
        description: `${complexCount} of your requests are classified as COMPLEX. Review if all need expensive models.`,
        saving: 'Potential saving: up to 60%',
        action: 'Add Custom Rule',
        link: '/dashboard/rules',
        color: 'yellow'
      })
    }
    if (paidRequests.length === 0 && totalRequests > 0) {
      recs.push({
        icon: '🎉',
        title: 'Running 100% Free',
        description: 'All your requests are using free models. Maximum savings achieved.',
        saving: 'Saving: 100% vs GPT-4o',
        action: null,
        color: 'green'
      })
    }
    if (totalRequests > 10 && savingsPercent < 30) {
      recs.push({
        icon: '🔧',
        title: 'Routing Not Optimized',
        description: 'Your routing could be more efficient. Enable smarter rules to reduce costs.',
        saving: 'Potential saving: up to 40%',
        action: 'Configure Auto Routing',
        link: '/dashboard/routing',
        color: 'red'
      })
    }
    if (recs.length === 0) {
      recs.push({
        icon: '✅',
        title: 'Well Optimized',
        description: 'Your routing is working efficiently. Keep monitoring for opportunities.',
        saving: `Current savings: ${savingsPercent.toFixed(1)}%`,
        action: null,
        color: 'green'
      })
    }
    return recs
  }

  const modelBreakdown = requests.reduce((acc: any, req: any) => {
    const model = req.model_used?.split('/').pop() || 'unknown'
    if (!acc[model]) acc[model] = { tokens: 0, cost: 0, count: 0 }
    acc[model].tokens += req.tokens_used || 0
    acc[model].cost += req.cost_usd || 0
    acc[model].count += 1
    return acc
  }, {})

  const modelBreakdownArray = Object.entries(modelBreakdown)
    .map(([name, data]: [string, any]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)

  const today = new Date()
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const projectedCost = dayOfMonth > 0 ? (totalCost / dayOfMonth) * daysInMonth : 0
  const projectedTokens = dayOfMonth > 0 ? (totalTokens / dayOfMonth) * daysInMonth : 0
  const projectedSavings = dayOfMonth > 0 ? (totalSavings / dayOfMonth) * daysInMonth : 0

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
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
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent userEmail={userEmail} stats={stats} profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} profileRef={profileRef} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={userEmail} stats={stats} profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} profileRef={profileRef} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Calculator className="w-4 h-4 text-blue-400" />
            <h1 className="text-sm font-bold text-white/60">Cost Transparency</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Cost Transparency</h1>
              <p className="text-white/40 text-sm">Every token. Every dollar. Fully transparent.</p>
            </div>

            {/* Cost Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">TOTAL SPENT</p>
                <p className="text-white text-3xl font-bold">${totalCost.toFixed(4)}</p>
                <p className="text-gray-500 text-xs mt-1">this month</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">TOTAL SAVED</p>
                <p className="text-green-400 text-3xl font-bold">${totalSavings.toFixed(4)}</p>
                <p className="text-gray-500 text-xs mt-1">vs GPT-4o</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">SAVINGS RATE</p>
                <p className="text-blue-400 text-3xl font-bold">{savingsPercent.toFixed(1)}%</p>
                <p className="text-gray-500 text-xs mt-1">cost reduction</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">AVG COST</p>
                <p className="text-purple-400 text-3xl font-bold">${avgCostPerRequest.toFixed(6)}</p>
                <p className="text-gray-500 text-xs mt-1">per request</p>
              </div>
            </div>

            {/* Optimization Score */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">🎯 Your Optimization Score</h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${scoreColor}`}>{optimizationScore}</div>
                  <div className={`text-sm font-semibold mt-1 ${scoreColor}`}>{scoreLabel}</div>
                  <div className="text-gray-500 text-xs mt-1">out of 100</div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-full h-4 mb-3">
                    <div className={`h-4 rounded-full transition-all ${optimizationScore >= 70 ? 'bg-green-500' : optimizationScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{width: `${optimizationScore}%`}}></div>
                  </div>
                  <div className="space-y-2">
                    {optimizationScore < 70 && (
                      <p className="text-yellow-400 text-sm">💡 Tip: Enable auto-routing to route simple prompts to free models</p>
                    )}
                    {savingsPercent < 50 && (
                      <p className="text-blue-400 text-sm">💡 Tip: Use Custom Rules to always route short prompts to Gemma (free)</p>
                    )}
                    {optimizationScore >= 70 && (
                      <p className="text-green-400 text-sm">✅ Great job! You are saving significantly vs using GPT-4o for everything</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">💡 Cost Recommendations</h3>
              <div className="space-y-3">
                {getRecommendations().map((rec, i) => (
                  <div key={i} className={`border rounded-xl p-4 flex items-start justify-between gap-4 ${
                    rec.color === 'green' ? 'border-green-500/30 bg-green-500/5' :
                    rec.color === 'yellow' ? 'border-yellow-500/30 bg-yellow-500/5' :
                    'border-red-500/30 bg-red-500/5'
                  }`}>
                    <div className="flex gap-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{rec.title}</p>
                        <p className="text-gray-400 text-xs mt-1">{rec.description}</p>
                        <p className={`text-xs mt-1 font-semibold ${
                          rec.color === 'green' ? 'text-green-400' : 'text-yellow-400'
                        }`}>{rec.saving}</p>
                      </div>
                    </div>
                    {rec.action && rec.link && (
                      <a href={rec.link}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg transition-all">
                        {rec.action} →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cost by Model */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">📊 Cost by Model</h3>
              {modelBreakdownArray.length === 0 ? (
                <p className="text-gray-500 text-sm">No requests yet. Start using the API to see breakdown.</p>
              ) : (
                <div className="space-y-3">
                  {modelBreakdownArray.map((model: any) => (
                    <div key={model.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{model.name}</span>
                          <span className="text-gray-500 text-xs">{model.count} requests</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white text-sm font-mono">${model.cost.toFixed(6)}</span>
                          <span className="text-gray-500 text-xs ml-2">{model.tokens.toLocaleString()} tokens</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full"
                          style={{width: `${totalRequests > 0 ? (model.count / totalRequests * 100) : 0}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Request Receipts */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">🧾 Request Receipts</h3>
                <span className="text-gray-500 text-xs">Last {requests.length} requests</span>
              </div>
              {requests.length === 0 ? (
                <p className="text-gray-500 text-sm">No requests yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                        <th className="text-left pb-3">Model</th>
                        <th className="text-left pb-3">Type</th>
                        <th className="text-right pb-3">Tokens</th>
                        <th className="text-right pb-3">Cost</th>
                        <th className="text-right pb-3">Saved vs GPT-4o</th>
                        <th className="text-right pb-3">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req: any, i: number) => {
                        const gpt4oEquivalentCost = ((req.tokens_used || 0) / 1000000) * 5.00
                        const saved = gpt4oEquivalentCost - (req.cost_usd || 0)
                        return (
                          <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                            <td className="py-3 text-white text-xs font-mono">{req.model_used?.split('/').pop() || 'N/A'}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                req.prompt_type === 'SIMPLE' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                              }`}>{req.prompt_type || 'N/A'}</span>
                            </td>
                            <td className="py-3 text-right text-gray-300 text-xs">{(req.tokens_used || 0).toLocaleString()}</td>
                            <td className="py-3 text-right text-white text-xs font-mono">${(req.cost_usd || 0).toFixed(6)}</td>
                            <td className="py-3 text-right text-green-400 text-xs font-mono">+${saved.toFixed(6)}</td>
                            <td className="py-3 text-right text-gray-500 text-xs">{req.created_at ? new Date(req.created_at).toLocaleTimeString() : 'N/A'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-700">
                        <td colSpan={2} className="pt-3 text-gray-400 text-xs font-semibold">TOTAL</td>
                        <td className="pt-3 text-right text-white text-xs font-mono">{totalTokens.toLocaleString()}</td>
                        <td className="pt-3 text-right text-white text-xs font-mono">${totalCost.toFixed(6)}</td>
                        <td className="pt-3 text-right text-green-400 text-xs font-mono">+${totalSavings.toFixed(6)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Forecast */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-1">📈 Month Forecast</h3>
              <p className="text-gray-500 text-xs mb-4">Based on your usage so far this month (Day {dayOfMonth} of {daysInMonth})</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs uppercase mb-1">Projected Cost</p>
                  <p className="text-white text-2xl font-bold">${projectedCost.toFixed(4)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs uppercase mb-1">Projected Tokens</p>
                  <p className="text-blue-400 text-2xl font-bold">{Math.round(projectedTokens).toLocaleString()}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs uppercase mb-1">Projected Savings</p>
                  <p className="text-green-400 text-2xl font-bold">${projectedSavings.toFixed(4)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
