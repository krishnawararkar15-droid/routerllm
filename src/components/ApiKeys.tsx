import { useState, useEffect } from 'react';
import { Key, Copy, Check, Eye, EyeOff, Code2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ApiKeys = () => {
  const navigate = useNavigate();
  const userKey = localStorage.getItem('routellm_key') || '';
  const userEmail = localStorage.getItem('routellm_email') || '';
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('python');
  const [stats, setStats] = useState<any>(null);

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

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Total Requests</div>
            <div className="text-2xl font-bold">{stats?.total_requests ?? 0}</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Tokens Used</div>
            <div className="text-2xl font-bold">{(stats?.total_tokens ?? 0).toLocaleString()}</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Tokens Left</div>
            <div className="text-2xl font-bold text-green-400">{((stats?.token_limit ?? 500000) - (stats?.total_tokens ?? 0)).toLocaleString()}</div>
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
      </div>
    </div>
  );
};
