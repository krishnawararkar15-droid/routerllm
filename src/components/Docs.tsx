import { useState } from 'react';
import { LayoutDashboard, Key, BarChart3, FileText, Zap, Settings, Bell, Layers, Code2, CreditCard, Shield, LogOut, Copy, Check, BookOpen, Terminal, AlertCircle, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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
};

export const Docs = () => {
  const [activeSection, setActiveSection] = useState('quickstart');
  const [copied, setCopied] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userKey = localStorage.getItem('routellm_key') || 'sk-rl-your-key-here';
  const userEmail = localStorage.getItem('routellm_email') || '';

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const codes = {
    python: `import requests\n\nresponse = requests.post(\n    "https://routerllm.onrender.com/route",\n    json={\n        "prompt": "Summarize this article in 3 bullet points",\n        "subscription_key": "${userKey}"\n    }\n)\n\ndata = response.json()\nprint(data["response"])      # AI response\nprint(data["model_used"])   # Which model was used\nprint(data["prompt_type"])  # SIMPLE or COMPLEX`,

    javascript: `const response = await fetch("https://routerllm.onrender.com/route", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    prompt: "Summarize this article in 3 bullet points",\n    subscription_key: "${userKey}"\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.response);    // AI response\nconsole.log(data.model_used);  // Which model was used\nconsole.log(data.prompt_type); // SIMPLE or COMPLEX`,

    curl: `curl -X POST https://routerllm.onrender.com/route \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "prompt": "Summarize this article",\n    "subscription_key": "${userKey}"\n  }'`,

    response: `{\n  "response": "Here are 3 key points...",\n  "model_used": "gemma-3-4b",\n  "prompt_type": "SIMPLE",\n  "tokens_used": 124,\n  "cost_usd": 0.0000\n}`,

    nodejs: `const express = require('express');\nconst app = express();\n\napp.post('/chat', async (req, res) => {\n  const { userMessage } = req.body;\n\n  // Replace your old OpenAI call with this\n  const result = await fetch("https://routerllm.onrender.com/route", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({\n      prompt: userMessage,\n      subscription_key: "${userKey}"\n    })\n  });\n\n  const data = await result.json();\n  res.json({ reply: data.response });\n});\n\napp.listen(3000);`
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
              <SidebarContent userEmail={userEmail} stats={null} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/[0.06] flex-col hidden lg:flex">
        <SidebarContent userEmail={userEmail} stats={null} />
      </aside>

      <main className="flex-1 min-w-0 overflow-hidden flex flex-col md:flex-row">
        <header className="h-14 border-b border-white/[0.06] flex items-center px-4 lg:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-white/60">Documentation</h1>
          </div>
        </header>

        {/* Inner docs nav - desktop only */}
        <div className="hidden md:flex flex-col w-48 flex-shrink-0 border-r border-white/[0.06] bg-[#030303] overflow-y-auto">
          <div className="p-4">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">Getting Started</p>
            {[
              { id: 'quickstart', label: '🚀 Quick Start' },
              { id: 'auth', label: '🔑 Authentication' },
              { id: 'integration', label: '🔌 Integration' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium mb-0.5 transition-all ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {item.label}
              </button>
            ))}
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3 mt-5">API Reference</p>
            {[
              { id: 'api-route', label: '📡 POST /route' },
              { id: 'api-stats', label: '📊 GET /stats' },
              { id: 'api-signup', label: '✍️ POST /signup' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium mb-0.5 transition-all ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {item.label}
              </button>
            ))}
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3 mt-5">Reference</p>
            {[
              { id: 'models', label: '🤖 Models List' },
              { id: 'errors', label: '❌ Error Codes' },
              { id: 'faq', label: '❓ FAQ' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium mb-0.5 transition-all ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content - full width on mobile */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-10 min-w-0">
          <div className="max-w-2xl mx-auto">
            {/* Mobile dropdown */}
            <div className="md:hidden mb-6">
              <select value={activeSection} onChange={e => setActiveSection(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none">
                <optgroup label="Getting Started">
                  <option value="quickstart">🚀 Quick Start</option>
                  <option value="auth">🔑 Authentication</option>
                  <option value="integration">🔌 Integration</option>
                </optgroup>
                <optgroup label="API Reference">
                  <option value="api-route">📡 POST /route</option>
                  <option value="api-stats">📊 GET /stats</option>
                  <option value="api-signup">✍️ POST /signup</option>
                </optgroup>
                <optgroup label="Reference">
                  <option value="models">🤖 Models List</option>
                  <option value="errors">❌ Error Codes</option>
                  <option value="faq">❓ FAQ</option>
                </optgroup>
              </select>
            </div>

          {/* QUICK START */}
          {activeSection === 'quickstart' && (
            <div className="space-y-8">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Getting Started</div>
                <h1 className="text-3xl font-extrabold mb-2">Quick Start</h1>
                <p className="text-white/40 text-sm leading-relaxed">Get your first AI response routed through RouteLLM in under 2 minutes. No configuration needed.</p>
              </div>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Get your API key', desc: 'Your subscription key is already ready. Find it in the API Keys section.', action: 'Go to API Keys →', link: '/dashboard/keys' },
                  { step: '2', title: 'Make your first request', desc: 'Copy the code below and replace your existing OpenAI/Anthropic call with it.' },
                  { step: '3', title: 'Check your dashboard', desc: 'Every request is tracked. Go to your dashboard to see tokens used and money saved.' }
                ].map(s => (
                  <div key={s.step} className="flex gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-black flex-shrink-0">{s.step}</div>
                    <div>
                      <div className="text-sm font-bold mb-1">{s.title}</div>
                      <div className="text-xs text-white/40 leading-relaxed">{s.desc}</div>
                      {s.link && <Link to={s.link} className="text-xs text-blue-400 font-bold mt-2 block hover:text-blue-300">{s.action}</Link>}
                    </div>
                  </div>
                ))}
              </div>
              <CodeBlock id="quickstart-py" title="Python" code={codes.python} copied={copied} onCopy={copyCode} />
              <CodeBlock id="quickstart-js" title="JavaScript" code={codes.javascript} copied={copied} onCopy={copyCode} />
            </div>
          )}

          {/* AUTH */}
          {activeSection === 'auth' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Authentication</div>
                <h1 className="text-3xl font-extrabold mb-2">Authentication</h1>
                <p className="text-white/40 text-sm leading-relaxed">Every request to RouteLLM must include your subscription key. Never expose it in frontend code.</p>
              </div>
              <div className="bg-orange-500/[0.08] border border-orange-500/20 rounded-xl p-5">
                <div className="flex gap-3">
                  <span className="text-orange-400 text-lg">⚠️</span>
                  <div>
                    <div className="text-sm font-bold text-orange-400 mb-1">Security Warning</div>
                    <div className="text-xs text-white/50 leading-relaxed">Always make RouteLLM calls from your backend server. Never put your subscription key in frontend JavaScript that users can see.</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <h3 className="text-sm font-bold mb-3">Your Key</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-xs text-white/60">{userKey}</div>
                  <button onClick={() => copyCode('authkey', userKey)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-all">
                    {copied === 'authkey' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <CodeBlock id="auth-curl" title="How to pass your key" code={codes.curl} copied={copied} onCopy={copyCode} />
            </div>
          )}

          {/* INTEGRATION */}
          {activeSection === 'integration' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Integration</div>
                <h1 className="text-3xl font-extrabold mb-2">Integrating RouteLLM</h1>
                <p className="text-white/40 text-sm leading-relaxed">Replace your existing AI API calls with RouteLLM in minutes. Works as a drop-in replacement.</p>
              </div>
              <CodeBlock id="nodejs" title="Node.js / Express Example" code={codes.nodejs} copied={copied} onCopy={copyCode} />
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <h3 className="text-sm font-bold mb-3">What changes in your code</h3>
                <div className="space-y-3">
                  {[
                    { before: 'openai.chat.completions.create()', after: 'fetch("routerllm.onrender.com/route")' },
                    { before: 'model: "gpt-4o"', after: 'Automatically selected by RouteLLM' },
                    { before: '$5 per million tokens', after: '$0.00 for simple prompts' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 font-mono text-red-400 line-through">{item.before}</div>
                      <span className="text-white/30">→</span>
                      <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 font-mono text-green-400">{item.after}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API ROUTE */}
          {activeSection === 'api-route' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">API Reference</div>
                <h1 className="text-3xl font-extrabold mb-2">POST /route</h1>
                <p className="text-white/40 text-sm">Routes your prompt to the optimal AI model and returns the response.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-3">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">POST</span>
                  <span className="font-mono text-sm text-white/70">https://routerllm.onrender.com/route</span>
                </div>
                <div className="p-5">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Request Body</h4>
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/[0.06]">
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Parameter</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Type</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Required</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Description</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {[
                        { param: 'prompt', type: 'string', req: 'Yes', desc: 'The text prompt to send to the AI model' },
                        { param: 'subscription_key', type: 'string', req: 'Yes', desc: 'Your sk-rl- subscription key' },
                      ].map((r, i) => (
                        <tr key={i}>
                          <td className="py-2.5 font-mono text-xs text-blue-400">{r.param}</td>
                          <td className="py-2.5 font-mono text-xs text-purple-400">{r.type}</td>
                          <td className="py-2.5 text-xs text-white/40">{r.req}</td>
                          <td className="py-2.5 text-xs text-white/40">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Response</h4>
                </div>
                <div className="p-5">
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/[0.06]">
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Field</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Type</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Description</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {[
                        { field: 'response', type: 'string', desc: 'The AI generated response text' },
                        { field: 'model_used', type: 'string', desc: 'Which model handled your request' },
                        { field: 'prompt_type', type: 'string', desc: 'SIMPLE or COMPLEX classification' },
                        { field: 'tokens_used', type: 'number', desc: 'Total tokens consumed' },
                        { field: 'cost_usd', type: 'number', desc: 'Cost in USD for this request' },
                      ].map((r, i) => (
                        <tr key={i}>
                          <td className="py-2.5 font-mono text-xs text-green-400">{r.field}</td>
                          <td className="py-2.5 font-mono text-xs text-purple-400">{r.type}</td>
                          <td className="py-2.5 text-xs text-white/40">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <CodeBlock id="route-example" title="Example Request & Response" code={codes.python + '\n\n# Response:\n' + codes.response} copied={copied} onCopy={copyCode} />
            </div>
          )}

          {/* GET STATS */}
          {activeSection === 'api-stats' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">API Reference</div>
                <h1 className="text-3xl font-extrabold mb-2">GET /stats</h1>
                <p className="text-white/40 text-sm">Returns usage statistics for a subscription key.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-3">
                  <span className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded">GET</span>
                  <span className="font-mono text-sm text-white/70">https://routerllm.onrender.com/stats/{'{subscription_key}'}</span>
                </div>
                <div className="p-5">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">URL Parameters</h4>
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/[0.06]">
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Parameter</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Type</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Description</th>
                    </tr></thead>
                    <tbody>
                      <tr>
                        <td className="py-2.5 font-mono text-xs text-blue-400">subscription_key</td>
                        <td className="py-2.5 font-mono text-xs text-purple-400">string</td>
                        <td className="py-2.5 text-xs text-white/40">Your sk-rl- key in the URL path</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Response Fields</h4>
                </div>
                <div className="p-5">
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/[0.06]">
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Field</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Type</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Description</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {[
                        { field: 'total_requests', type: 'number', desc: 'Total API calls made with this key' },
                        { field: 'total_tokens', type: 'number', desc: 'Total tokens consumed across all requests' },
                        { field: 'total_cost', type: 'number', desc: 'Total cost in USD paid' },
                        { field: 'total_savings', type: 'number', desc: 'Money saved vs using GPT-4o for everything' },
                        { field: 'tokens_used', type: 'number', desc: 'Tokens used against your plan limit' },
                        { field: 'token_limit', type: 'number', desc: 'Your plan token limit (500000 for free)' },
                        { field: 'plan', type: 'string', desc: 'Your current plan: free, starter, or pro' },
                        { field: 'recent_requests', type: 'array', desc: 'Last 10 requests with model, tokens, cost, time' },
                      ].map((r, i) => (
                        <tr key={i}>
                          <td className="py-2.5 font-mono text-xs text-green-400">{r.field}</td>
                          <td className="py-2.5 font-mono text-xs text-purple-400">{r.type}</td>
                          <td className="py-2.5 text-xs text-white/40">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <CodeBlock id="stats-example" title="Example" code={`# Replace YOUR_KEY with your actual sk-rl- key
import requests

response = requests.get(
    "https://routerllm.onrender.com/stats/${userKey}"
)

data = response.json()
print(data["total_requests"])  # e.g. 42
print(data["total_savings"])   # e.g. 1.24
print(data["plan"])            # e.g. "free"`} copied={copied} onCopy={copyCode} />
            </div>
          )}

          {/* POST SIGNUP */}
          {activeSection === 'api-signup' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">API Reference</div>
                <h1 className="text-3xl font-extrabold mb-2">POST /signup</h1>
                <p className="text-white/40 text-sm">Creates a new account and returns a subscription key. If email already exists returns the existing key.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-3">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">POST</span>
                  <span className="font-mono text-sm text-white/70">https://routerllm.onrender.com/signup</span>
                </div>
                <div className="p-5">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Request Body</h4>
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/[0.06]">
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Parameter</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Type</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Required</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Description</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {[
                        { param: 'email', type: 'string', req: 'Yes', desc: 'User email address' },
                        { param: 'password', type: 'string', req: 'Yes', desc: 'Password — max 72 characters' },
                      ].map((r, i) => (
                        <tr key={i}>
                          <td className="py-2.5 font-mono text-xs text-blue-400">{r.param}</td>
                          <td className="py-2.5 font-mono text-xs text-purple-400">{r.type}</td>
                          <td className="py-2.5 text-xs text-white/40">{r.req}</td>
                          <td className="py-2.5 text-xs text-white/40">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Response Fields</h4>
                </div>
                <div className="p-5">
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/[0.06]">
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Field</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Type</th>
                      <th className="pb-2 text-[9px] text-white/30 uppercase tracking-widest">Description</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {[
                        { field: 'subscription_key', type: 'string', desc: 'Your sk-rl- key to use in all requests' },
                        { field: 'plan', type: 'string', desc: 'Your plan: free, starter, or pro' },
                        { field: 'token_limit', type: 'number', desc: 'Token limit for your plan' },
                        { field: 'email', type: 'string', desc: 'Your registered email' },
                      ].map((r, i) => (
                        <tr key={i}>
                          <td className="py-2.5 font-mono text-xs text-green-400">{r.field}</td>
                          <td className="py-2.5 font-mono text-xs text-purple-400">{r.type}</td>
                          <td className="py-2.5 text-xs text-white/40">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <CodeBlock id="signup-example" title="Example" code={`import requests

response = requests.post(
    "https://routerllm.onrender.com/signup",
    json={
        "email": "you@yourcompany.com",
        "password": "yourpassword"
    }
)

data = response.json()
print(data["subscription_key"])  # sk-rl-xxxxx
print(data["plan"])              # free
print(data["token_limit"])       # 500000`} copied={copied} onCopy={copyCode} />
            </div>
          )}

          {/* MODELS */}
          {activeSection === 'models' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Reference</div>
                <h1 className="text-3xl font-extrabold mb-2">Models</h1>
                <p className="text-white/40 text-sm leading-relaxed">RouteLLM automatically selects the best model for each prompt. Here are the models we route to.</p>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-500/[0.05] border border-blue-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Simple Prompts — Free Models</div>
                  {[
                    { name: 'gemma-3-4b', provider: 'Google', cost: '$0.00', best: 'Short answers, summaries, translations' },
                    { name: 'llama-3.1-8b', provider: 'Meta', cost: '$0.00', best: 'General text, Q&A, simple tasks' },
                    { name: 'mistral-7b', provider: 'Mistral', cost: '$0.00', best: 'Code, structured output, reasoning' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                      <div>
                        <div className="font-mono text-sm font-bold">{m.name}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{m.provider} · Best for: {m.best}</div>
                      </div>
                      <div className="text-green-400 font-black text-sm">{m.cost}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-purple-500/[0.05] border border-purple-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Complex Prompts — Powerful Models</div>
                  {[
                    { name: 'gpt-4o-mini', provider: 'OpenAI', cost: '$0.15/1M', best: 'Complex reasoning, long context' },
                    { name: 'claude-3-haiku', provider: 'Anthropic', cost: '$0.25/1M', best: 'Analysis, coding, structured tasks' },
                    { name: 'gemini-flash', provider: 'Google', cost: '$0.075/1M', best: 'Fast complex tasks, multimodal' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                      <div>
                        <div className="font-mono text-sm font-bold">{m.name}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{m.provider} · Best for: {m.best}</div>
                      </div>
                      <div className="text-purple-400 font-bold text-sm">{m.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ERRORS */}
          {activeSection === 'errors' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Reference</div>
                <h1 className="text-3xl font-extrabold mb-2">Error Codes</h1>
                <p className="text-white/40 text-sm">All possible errors and how to fix them.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                {[
                  { code: '401', error: 'Invalid subscription key', fix: 'Check your key in API Keys section. Make sure it starts with sk-rl-' },
                  { code: '429', error: 'Token limit exceeded', fix: 'You have used all tokens in your plan. Upgrade to continue.' },
                  { code: '400', error: 'Missing prompt', fix: 'Make sure your request body includes the prompt field.' },
                  { code: '500', error: 'Server error', fix: 'Server might be waking up. Wait 30 seconds and retry.' },
                  { code: '404', error: 'Subscription key not found', fix: 'Create an account at routellm.vercel.app/signup first.' },
                ].map((e, i) => (
                  <div key={i} className="flex gap-5 p-5 border-b border-white/[0.06] last:border-0">
                    <div className="w-12 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 font-black text-xs flex-shrink-0">{e.code}</div>
                    <div>
                      <div className="text-sm font-bold mb-1">{e.error}</div>
                      <div className="text-xs text-white/40">{e.fix}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Reference</div>
                <h1 className="text-3xl font-extrabold mb-2">FAQ</h1>
              </div>
              <div className="space-y-3">
                {[
                  { q: 'How does RouteLLM decide which model to use?', a: 'Every prompt is classified as SIMPLE or COMPLEX using a fast classifier. Simple prompts go to free models. Complex prompts go to powerful paid models. This classification happens in milliseconds before the main request.' },
                  { q: 'Is my prompt data stored?', a: 'We store metadata only — model used, token count, cost, timestamp. We do NOT store the content of your prompts. Your data stays private.' },
                  { q: 'What if I always need GPT-4o quality?', a: 'RouteLLM is best for apps where a mix of simple and complex queries exist. If every single prompt needs GPT-4o level quality, the savings will be smaller. But most apps have 60-80% simple prompts.' },
                  { q: 'What happens when I hit my token limit?', a: 'Requests will fail with a 429 error. You will receive an email warning at 80% usage. Upgrade your plan to increase your limit.' },
                  { q: 'Can I use this from the frontend directly?', a: 'No. Always call RouteLLM from your backend. Never expose your subscription key in frontend code that users can inspect.' },
                  { q: 'How is savings calculated?', a: 'We calculate what your tokens would have cost if all requests went to GPT-4o at $5 per million tokens. Actual cost is what you paid for the models used. The difference is your savings.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                    <div className="text-sm font-bold mb-2">Q: {item.q}</div>
                    <div className="text-xs text-white/40 leading-relaxed">A: {item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          </div>
        </div>
      </main>
    </div>
  );
};

const CodeBlock = ({ id, title, code, copied, onCopy }: { id: string, title: string, code: string, copied: string | null, onCopy: (id: string, text: string) => void }) => (
  <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
      <span className="text-xs font-bold text-white/50">{title}</span>
      <button onClick={() => onCopy(id, code)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-all">
        {copied === id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied === id ? 'Copied!' : 'Copy'}
      </button>
    </div>
    <pre className="p-5 text-xs text-white/70 font-mono overflow-x-auto leading-relaxed">{code}</pre>
  </div>
);
