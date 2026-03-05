import { Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
  const sections = [
    {
      title: "What We Collect",
      content: "Email address, password (bcrypt hash only), subscription key, request metadata (token count, model used, cost, timestamp). We do NOT collect: prompt text, AI responses, IP address, device info."
    },
    {
      title: "How We Use Your Data",
      content: "Email: to send API key and alerts. Request metadata: to show usage stats. We never sell, share, or rent your data."
    },
    {
      title: "Data Storage",
      content: "Stored in Supabase (PostgreSQL), hosted on AWS with enterprise security, encrypted database."
    },
    {
      title: "Third Party Services",
      content: "Supabase (database), OpenRouter (AI routing), Render.com (backend), Vercel (frontend), Paddle (payments), Resend (emails)"
    },
    {
      title: "Your Rights",
      content: "Right to access: support@llmlite.com / Right to delete: delete@llmlite.com / Right to correct: support@llmlite.com / Right to export: use Export button in dashboard"
    },
    {
      title: "Cookies",
      content: "We use localStorage to store subscription key and email. No tracking cookies. No advertising cookies."
    },
    {
      title: "Children's Privacy",
      content: "LLMLite is not intended for users under 13. We do not knowingly collect data from children."
    },
    {
      title: "Changes to This Policy",
      content: "We will notify you by email if there are significant changes."
    },
    {
      title: "Contact",
      content: "Email: privacy@llmlite.com"
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
        <h1 className="text-3xl md:text-4xl font-black mb-2">Privacy Policy</h1>
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
