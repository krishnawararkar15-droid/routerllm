import { Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RefundPolicy = () => {
  const sections = [
    {
      title: "Our Refund Policy",
      content: "We offer a 7-day money back guarantee on all paid plans. Email us within 7 days for a full refund, no questions asked."
    },
    {
      title: "How to Request a Refund",
      content: "Email refunds@llmlite.com with your account email and optional reason. We process within 5-7 business days."
    },
    {
      title: "After 7 Days",
      content: "Refunds not available after 7 days. You can cancel anytime to stop future charges."
    },
    {
      title: "How to Cancel",
      content: "Email support@llmlite.com to cancel. You keep access until end of current billing period."
    },
    {
      title: "Exceptions",
      content: "No refunds for: accounts suspended for terms violations, requests after 7 days of billing date."
    },
    {
      title: "Contact",
      content: "Email: refunds@llmlite.com"
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
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
        <h1 className="text-3xl md:text-4xl font-black mb-2">Refund Policy</h1>
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
