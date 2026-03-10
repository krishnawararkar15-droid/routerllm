import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Menu, X, Sliders } from 'lucide-react';
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

export const MultipleKeys = () => {
  console.log('MultipleKeys component loaded, email:', localStorage.getItem('routellm_email'))
  
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyEnv, setNewKeyEnv] = useState('development')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profilePopupOpen, setProfilePopupOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const email = localStorage.getItem('routellm_email') || ''
  const plan = localStorage.getItem('routellm_plan') || 'free'
  const planLimits: any = { free: 1, pro: 3, max: 999 }
  const keyLimit = planLimits[plan] || 1

  const fetchKeys = async () => {
    setLoading(true)
    try {
      console.log('Fetching keys for email:', email)
      if (!email) {
        console.log('No email found in localStorage')
        setLoading(false)
        return
      }
      const res = await fetch(`https://routerllm.onrender.com/keys/${encodeURIComponent(email)}`)
      console.log('Keys response status:', res.status)
      const data = await res.json()
      console.log('Keys data:', data)
      setKeys(data.keys || [])
    } catch (err) {
      console.error('Failed to fetch keys:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchKeys() }, [])

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('https://routerllm.onrender.com/keys/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, key_name: newKeyName, environment: newKeyEnv, plan })
      })
      const data = await res.json()
      if (data.key) {
        setCreatedKey(data.key)
        setShowCreateForm(false)
        setNewKeyName('')
        await fetchKeys()
      } else {
        alert(data.error || 'Failed to create key')
      }
    } catch (err) {
      alert('Connection error. Try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (keyId: string, isActive: boolean) => {
    await fetch('https://routerllm.onrender.com/keys/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key_id: keyId, is_active: isActive })
    })
    await fetchKeys()
  }

  const handleDelete = async (keyId: string) => {
    if (!confirm('Delete this key? This cannot be undone.')) return
    await fetch(`https://routerllm.onrender.com/keys/${keyId}`, { method: 'DELETE' })
    await fetchKeys()
  }

  const handleRename = async (keyId: string) => {
    await fetch('https://routerllm.onrender.com/keys/rename', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key_id: keyId, key_name: editingName })
    })
    setEditingId(null)
    await fetchKeys()
  }

  return (
    <div className="flex min-h-screen" style={{background: '#0a0a0a'}}>
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
              <SidebarContent userEmail={email} stats={{plan}} profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} profileRef={profileRef} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={email} stats={{plan}} profilePopupOpen={profilePopupOpen} setProfilePopupOpen={setProfilePopupOpen} profileRef={profileRef} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4 text-blue-400" />
            <h1 className="text-sm font-bold text-white/60">API Keys</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Free plan upgrade banner */}
            {plan === 'free' && keys.length >= 1 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-blue-400 font-semibold">Want more keys?</p>
                  <p className="text-gray-400 text-sm">Pro gives you 3 keys. Max gives unlimited keys.</p>
                </div>
                <a href="/dashboard/billing"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shrink-0">
                  Upgrade Now →
                </a>
              </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">API Keys</h1>
                <p className="text-gray-500 text-sm mt-1">Manage keys for different projects and environments</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">{keys.length}/{keyLimit === 999 ? '∞' : keyLimit} keys</span>
                {keys.length < keyLimit ? (
                  <button onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                    + Create New Key
                  </button>
                ) : (
                  <a href="/dashboard/billing"
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                    🔒 Upgrade for More Keys
                  </a>
                )}
              </div>
            </div>

            {/* Plan Key Limit Banner */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { plan: 'Free', keys: 1, price: '$0', current: plan === 'free' },
                { plan: 'Pro', keys: 3, price: '$29/mo', current: plan === 'pro' },
                { plan: 'Max', keys: 'Unlimited', price: '$99/mo', current: plan === 'max' },
              ].map(tier => (
                <div key={tier.plan} className={`rounded-2xl p-4 border text-center ${tier.current ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-gray-900'}`}>
                  <p className={`text-sm font-bold ${tier.current ? 'text-blue-400' : 'text-gray-400'}`}>{tier.plan}</p>
                  <p className="text-white text-xl font-bold mt-1">{tier.keys} {typeof tier.keys === 'number' ? (tier.keys > 1 ? 'Keys' : 'Key') : 'Keys'}</p>
                  <p className="text-gray-500 text-xs mt-1">{tier.price}</p>
                  {tier.current && <span className="text-blue-400 text-xs font-semibold">Current Plan</span>}
                </div>
              ))}
            </div>

            {/* Create Key Form */}
            {showCreateForm && (
              <div className="bg-gray-900 border border-blue-500/50 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-bold mb-4">Create New API Key</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase mb-2 block">Key Name</label>
                    <input
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. Production App, Testing, Mobile App"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase mb-2 block">Environment</label>
                    <select
                      value={newKeyEnv}
                      onChange={(e) => setNewKeyEnv(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="production">🔴 Production</option>
                      <option value="staging">🟡 Staging</option>
                      <option value="development">🟢 Development</option>
                      <option value="testing">🔵 Testing</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreateKey} disabled={creating || !newKeyName.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">
                    {creating ? 'Creating...' : 'Create Key'}
                  </button>
                  <button onClick={() => { setShowCreateForm(false); setNewKeyName('') }}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-xl text-sm font-medium transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* New Key Created Success Banner */}
            {createdKey && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <p className="text-green-400 font-bold">Key Created Successfully!</p>
                </div>
                <p className="text-yellow-400 text-xs mb-3">⚠️ Copy this key now — it will never be shown again in full.</p>
                <div className="flex items-center gap-3 bg-gray-900 rounded-xl p-3">
                  <code className="text-green-300 text-sm flex-1 font-mono break-all">{createdKey}</code>
                  <button onClick={() => copyKey(createdKey)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg shrink-0">
                    {copiedKey === createdKey ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <button onClick={() => setCreatedKey(null)} className="text-gray-500 text-xs mt-3 hover:text-gray-300">
                  I have saved my key — dismiss
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Empty state */}
            {!loading && keys.length === 0 && (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="text-5xl mb-4">🔑</div>
                <h3 className="text-white font-bold text-xl mb-2">No API Keys Yet</h3>
                <p className="text-gray-500 text-sm mb-6">Create your first API key to start routing requests</p>
                <button onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all">
                  + Create First Key
                </button>
              </div>
            )}

            {/* Keys List */}
            {!loading && keys.map(key => {
              const usagePercent = key.token_limit > 0 ? (key.tokens_used / key.token_limit * 100) : 0
              const envColors: any = {
                production: 'bg-red-500/20 text-red-400 border-red-500/30',
                staging: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                development: 'bg-green-500/20 text-green-400 border-green-500/30',
                testing: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }
              const envDots: any = { production: '🔴', staging: '🟡', development: '🟢', testing: '🔵' }

              return (
                <div key={key.id} className={`bg-gray-900 border rounded-2xl p-6 mb-4 transition-all ${key.is_active ? 'border-gray-800' : 'border-gray-800 opacity-60'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${key.is_active ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      {editingId === key.id ? (
                        <div className="flex items-center gap-2">
                          <input value={editingName} onChange={(e) => setEditingName(e.target.value)}
                            className="bg-gray-800 border border-blue-500 rounded-lg px-3 py-1 text-white text-sm focus:outline-none"
                            autoFocus />
                          <button onClick={() => handleRename(key.id)} className="text-green-400 text-xs hover:text-green-300">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs hover:text-gray-300">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold">{key.key_name}</h3>
                          <button onClick={() => { setEditingId(key.id); setEditingName(key.key_name) }}
                            className="text-gray-600 hover:text-gray-400 text-xs">✏️</button>
                        </div>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${envColors[key.environment] || envColors.development}`}>
                        {envDots[key.environment]} {key.environment}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(key.id, !key.is_active)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${key.is_active ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                        {key.is_active ? '⏸ Pause' : '▶ Activate'}
                      </button>
                      <button onClick={() => handleDelete(key.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg text-xs font-medium transition-all">
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-3 mb-4">
                    <code className="text-gray-300 text-sm font-mono flex-1">
                      {key.subscription_key.slice(0, 12)}••••••••••••••••••••{key.subscription_key.slice(-4)}
                    </code>
                    <button onClick={() => copyKey(key.subscription_key)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-all shrink-0">
                      {copiedKey === key.subscription_key ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-500 text-xs">Token Usage</span>
                      <span className="text-gray-400 text-xs">{(key.tokens_used || 0).toLocaleString()} / {(key.token_limit || 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                        style={{width: `${Math.min(100, usagePercent)}%`}}></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-gray-500 text-xs">STATUS</p>
                      <p className={`text-sm font-semibold ${key.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                        {key.is_active ? 'Active' : 'Paused'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">CREATED</p>
                      <p className="text-white text-sm">{key.created_at ? new Date(key.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">LAST USED</p>
                      <p className="text-white text-sm">{key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">USAGE</p>
                      <p className={`text-sm font-semibold ${usagePercent > 90 ? 'text-red-400' : 'text-white'}`}>{usagePercent.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </main>
    </div>
  );
};
