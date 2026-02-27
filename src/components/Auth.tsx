import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Layers, Play, Sparkles, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AuthLayout = ({ children, rightContent }: { children: React.ReactNode, rightContent: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1100px] bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-white/5">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Layers className="text-black w-5 h-5" />
            </div>
          </Link>
          {children}
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="hidden md:flex w-1/2 bg-[#0d0d0d] relative overflow-hidden border-l border-white/5 flex-col items-center justify-center p-12 text-center">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                 backgroundSize: '32px 32px' 
               }} 
          />
          
          <div className="relative z-10 w-full max-w-sm">
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [subscriptionKey, setSubscriptionKey] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscriptionKey.trim()) {
      localStorage.setItem('routellm_key', subscriptionKey.trim());
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout 
      rightContent={
        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#141414] rounded-2xl border border-white/10 p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Savings Dashboard</span>
                </div>
                <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500">
                  LIVE
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="text-[10px] text-white/30 uppercase font-bold">Tokens Used</div>
                  <div className="text-lg font-bold text-white">1.2M</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-white/30 uppercase font-bold">Spent</div>
                  <div className="text-lg font-bold text-white">$12.40</div>
                </div>
              </div>

              <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                <div className="text-[10px] text-emerald-500/60 uppercase font-bold mb-1">Money Saved</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-emerald-500">$67.80</div>
                  <div className="text-[10px] text-emerald-500/40 font-medium">vs GPT-4o</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Every request. Optimized.</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              84,291 requests routed this month. Zero manual work.
            </p>
          </div>
        </div>
      }
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white mb-3">Welcome back</h1>
        <p className="text-white/50 text-sm mb-8">Enter your subscription key to access your account.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Subscription Key</label>
            <input 
              type="text" 
              placeholder="sk-rl-..."
              value={subscriptionKey}
              onChange={(e) => setSubscriptionKey(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <button 
            disabled={!subscriptionKey.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-white/40 font-medium">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Create one now</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [subscriptionKey, setSubscriptionKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://routerllm.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      localStorage.setItem('routellm_key', data.subscription_key);
      localStorage.setItem('routellm_email', email);
      setSubscriptionKey(data.subscription_key);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (subscriptionKey) {
      navigator.clipboard.writeText(subscriptionKey);
    }
  };

  if (subscriptionKey) {
    return (
      <AuthLayout 
        rightContent={
          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#141414] rounded-2xl border border-white/10 p-6 shadow-2xl text-left overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Real-time Classifier</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-medium">
                      "What is 2+2?"
                    </div>
                    <ArrowRight className="w-3 h-3 text-white/20" />
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-400"
                    >
                      SIMPLE
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-full h-px bg-white/5 relative">
                      <motion.div 
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-white">gemma-3-4b</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-500">$0.00</div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/30 uppercase">Total Savings</span>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg font-bold text-emerald-500"
                    >
                      +$<motion.span
                        animate={{ opacity: [1, 0.8, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        1,242.40
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Save up to 80% on AI API costs</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Your prompts are automatically routed to the cheapest model that can handle them.
              </p>
            </div>
          </div>
        }
      >
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-3">Account Created!</h1>
          <p className="text-white/50 text-sm mb-8">Your subscription key is ready. Copy it below.</p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Subscription Key</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={subscriptionKey}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm"
                />
                <button 
                  onClick={copyToClipboard}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-4 py-3 text-white transition-all"
                >
                  Copy
                </button>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 group"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      rightContent={
        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#141414] rounded-2xl border border-white/10 p-6 shadow-2xl text-left overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Real-time Classifier</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-medium">
                    "What is 2+2?"
                  </div>
                  <ArrowRight className="w-3 h-3 text-white/20" />
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-400"
                  >
                    SIMPLE
                  </motion.div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-full h-px bg-white/5 relative">
                    <motion.div 
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-white">gemma-3-4b</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-500">$0.00</div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase">Total Savings</span>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-bold text-emerald-500"
                  >
                    +$<motion.span
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      1,242.40
                    </motion.span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Save up to 80% on AI API costs</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your prompts are automatically routed to the cheapest model that can handle them.
            </p>
          </div>
        </div>
      }
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white mb-3">Create an account</h1>
        <p className="text-white/50 text-sm mb-8">Join thousands of creators growing their channels.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Email address</label>
            <input 
              type="email" 
              placeholder="name@work-email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 group disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/40 font-medium">
            Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
