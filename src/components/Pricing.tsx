import { Layers, ArrowLeft, Check, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { openCheckout } from '../lib/paddle';

const userEmail = localStorage.getItem('routellm_email') || '';

export const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      tokens: "100,000",
      tokensUnit: "tokens/month",
      description: "For developers who want to try LLMLite risk-free",
      features: [
        "100K tokens/month",
        "Auto-routing",
        "All free OpenRouter models",
        "Basic dashboard"
      ],
      cta: "Get Started",
      to: "/signup",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      tokens: "10,000,000",
      tokensUnit: "tokens/month",
      badge: "Most Popular",
      features: [
        "Everything in Free",
        "Manual model override",
        "GPT-4o, Claude, Gemini access",
        "Budget alerts email",
        "Full analytics dashboard",
        "3 API keys",
        "Email support"
      ],
      cta: "Start Pro",
      to: "/signup",
      highlight: true
    },
    {
      name: "Max",
      price: "$99",
      period: "/month",
      tokens: "100,000,000",
      tokensUnit: "tokens/month",
      features: [
        "Everything in Pro",
        "Custom routing rules",
        "Unlimited API keys",
        "Webhook alerts",
        "Priority support (4hr response)",
        "Team access (5 members)",
        "Monthly strategy call"
      ],
      cta: "Start Max",
      to: "/signup",
      highlight: false
    }
  ];

  const faqs = [
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Yes, changes take effect immediately."
    },
    {
      q: "What happens when I hit my token limit?",
      a: "Requests are paused until next month or you upgrade."
    },
    {
      q: "Do you store my prompts?",
      a: "Never. We only store token counts and metadata."
    },
    {
      q: "What payment methods do you accept?",
      a: "All major credit cards via Paddle."
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Layers className="text-black w-5 h-5" />
            </div>
            <span className="text-lg font-bold">LLMLite</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Simple, Transparent Pricing</h1>
          <p className="text-white/40">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-2xl p-6 border ${plan.highlight ? 'bg-white/5 border-blue-500/50' : 'bg-white/[0.02] border-white/10'}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> {plan.badge}
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-white/40 text-sm">{plan.period}</span>
                </div>
                <div className="mt-2 text-white/60 text-sm">{plan.tokens} {plan.tokensUnit}</div>
                {plan.description && <div className="mt-2 text-white/40 text-xs">{plan.description}</div>}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.name === "Free" ? (
              <Link 
                to={plan.to}
                className={`block w-full py-3 text-center font-bold rounded-xl transition-colors ${
                  plan.highlight 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </Link>
              ) : (
              <button 
                onClick={() => openCheckout(
                  plan.name === "Max" 
                    ? import.meta.env.VITE_PADDLE_MAX_PRICE_ID 
                    : import.meta.env.VITE_PADDLE_PRO_PRICE_ID, 
                  userEmail
                )}
                className={`block w-full py-3 text-center font-bold rounded-xl transition-colors ${
                  plan.highlight 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-white/40 text-sm mb-12">
          All plans include a 7-day money back guarantee. No questions asked.
        </p>

        <div className="border-t border-white/10 pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-white/60 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/terms" className="text-white/40 hover:text-white transition-colors">Terms</Link>
          <Link to="/privacy" className="text-white/40 hover:text-white transition-colors">Privacy</Link>
          <Link to="/refund" className="text-white/40 hover:text-white transition-colors">Refund</Link>
          <Link to="/pricing" className="text-white/40 hover:text-white transition-colors">Pricing</Link>
        </div>
        <p className="text-center text-xs text-white/20 mt-4">© {currentYear} LLMLite. All rights reserved.</p>
      </footer>
    </div>
  );
};
