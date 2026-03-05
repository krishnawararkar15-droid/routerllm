import { Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfService = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By using LLMLite you agree to these terms. If you do not agree, do not use the service."
    },
    {
      title: "Description of Service",
      content: "LLMLite is an AI API routing service that routes prompts to AI models via OpenRouter. We provide cost optimization by routing simple prompts to free models and complex prompts to paid models."
    },
    {
      title: "Account Registration",
      content: "You must provide a valid email to create an account. You are responsible for keeping your subscription key secure. Do not share your subscription key with others."
    },
    {
      title: "Acceptable Use",
      content: "You agree NOT to use LLMLite to: generate illegal, harmful, or abusive content; violate any laws or regulations; attempt to reverse engineer or abuse the routing system; resell access without written permission; send malicious or harmful prompts."
    },
    {
      title: "Plans and Payments",
      content: "Free plan: 100,000 tokens/month at no cost. Pro plan: $29/month for 10M tokens. Max plan: $99/month for 100M tokens. Payments processed by Paddle. Plans auto-renew monthly unless cancelled."
    },
    {
      title: "Token Limits",
      content: "When you exceed your monthly token limit, requests will be blocked until next month or until you upgrade. We are not liable for any interruption caused by reaching your limit."
    },
    {
      title: "Data and Privacy",
      content: "We do not store your prompt content. We store only metadata — token count, model used, cost, timestamp. See our Privacy Policy for full details."
    },
    {
      title: "Intellectual Property",
      content: "LLMLite and its dashboard are owned by us. You retain full ownership of all prompts and responses you send and receive."
    },
    {
      title: "Disclaimer",
      content: "LLMLite is provided as-is. We do not guarantee uptime, response quality, or availability of third-party AI models."
    },
    {
      title: "Limitation of Liability",
      content: "We are not liable for any indirect, incidental, or consequential damages. Our maximum liability is limited to the amount you paid us in the last 30 days."
    },
    {
      title: "Termination",
      content: "We may suspend or terminate your account if you violate these terms. You may cancel anytime by emailing support@llmlite.com"
    },
    {
      title: "Changes to Terms",
      content: "We may update these terms at any time. Continued use after changes means you accept the new terms."
    },
    {
      title: "Contact",
      content: "Email: support@llmlite.com"
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-white/40 mb-12">Last updated: March 2026</p>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-lg font-bold text-white mb-2">{section.title}</h2>
              <p className="text-white/60 leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm">
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
