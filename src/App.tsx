import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link,
  useNavigate
} from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Layout, 
  Users, 
  BarChart3, 
  Zap, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Menu, 
  X, 
  Star,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Settings,
  Clock,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Play
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlowingEffectDemo } from './components/glowing-effect-demo';
import { CursorFollower } from './components/ui/cursor-follower';
import { Login, Signup } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { ApiKeys } from './components/ApiKeys';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center">
              <Layers className="text-black w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-lg md:text-xl font-extrabold font-display tracking-tight text-white">RouteLLM</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Pricing</a>
            <a href="#docs" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Docs</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-white/60 hover:text-white transition-colors px-4 py-2">Sign In</button>
            <button onClick={() => navigate('/signup')} className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all shadow-lg shadow-white/10">Get Started</button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white/60">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a href="#features" className="block px-3 py-2 text-base font-medium text-white/60">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-white/60">How It Works</a>
              <a href="#pricing" className="block px-3 py-2 text-base font-medium text-white/60">Pricing</a>
              <a href="#docs" className="block px-3 py-2 text-base font-medium text-white/60">Docs</a>
              <div className="pt-4 flex flex-col space-y-2">
                <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="w-full text-center py-2 font-medium text-white/60">Sign In</button>
                <button onClick={() => { navigate('/signup'); setIsOpen(false); }} className="w-full bg-white text-black py-2 rounded-full font-medium">Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const yGlow = useTransform(scrollY, [0, 500], [0, 150]);
  const yIcons = useTransform(scrollY, [0, 500], [0, -100]);
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden bg-[#0a0a0a] text-white">
      {/* Premium White Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[600px] bg-white/[0.07] blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      
      {/* Background Glow */}
      <motion.div 
        style={{ y: yGlow }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs md:text-sm font-medium mb-6 md:mb-8 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="text-white/60">Introducing RouteLLM 1.0</span>
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-white/40" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl md:text-6xl font-extrabold font-display tracking-tighter mb-4 md:mb-6 leading-[1.1]"
          >
            One API To Cut Your <br className="hidden md:block" /> AI Costs Forever
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-sm md:text-lg text-white/60 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            RouteLLM automatically routes every prompt to the cheapest AI model that can handle it. Simple questions go to free models. Complex tasks go to powerful ones. Save 30–80% on every API bill — automatically.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            <motion.button 
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/5 text-sm md:text-base"
            >
              Get Started
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 transition-colors text-sm md:text-base"
            >
              How it Works
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Icons */}
        <motion.div 
          style={{ y: yIcons }}
          className="absolute top-1/2 left-0 w-full h-full pointer-events-none hidden lg:block"
        >
          <FloatingIcon icon={<FileText className="w-6 h-6" />} delay={0} x="-25%" y="-25%" />
          <FloatingIcon icon={<Calendar className="w-6 h-6" />} delay={1.2} x="25%" y="-35%" />
          <FloatingIcon icon={<MessageSquare className="w-6 h-6" />} delay={2.4} x="-30%" y="15%" />
          <FloatingIcon icon={<Users className="w-6 h-6" />} delay={1.8} x="30%" y="5%" />
          <FloatingIcon icon={<Layout className="w-6 h-6" />} delay={0.6} x="-15%" y="-45%" />
          <FloatingIcon icon={<BarChart3 className="w-6 h-6" />} delay={3} x="15%" y="25%" />
        </motion.div>

        {/* Main Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ 
            rotateY: 2, 
            rotateX: -2, 
            scale: 1.02,
            transition: { duration: 0.4 }
          }}
          className="mt-16 md:mt-24 relative perspective-1000"
        >
          <div className="rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-[0_0_80px_-15px_rgba(255,255,255,0.15)] ring-1 ring-white/10">
            <div className="p-3 md:p-4 border-b border-white/10 flex items-center gap-2 bg-white/5 backdrop-blur-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-[8px] md:text-[10px] text-white/40 font-mono ml-3 md:ml-4 uppercase tracking-[0.2em] font-bold">ROUTELLM DASHBOARD V1.0</div>
            </div>
            <img 
              src="https://picsum.photos/seed/gantt/1600/900" 
              alt="RouteLLM Dashboard" 
              className="w-full h-auto opacity-95"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FloatingIcon = ({ icon, delay, x, y }: { icon: React.ReactNode, delay: number, x: string, y: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.2, 0.4, 0.2],
      y: [0, -15, 0],
      scale: 1
    }}
    transition={{ 
      opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
      scale: { duration: 1, delay }
    }}
    style={{ left: `calc(50% + ${x})`, top: `calc(50% + ${y})` }}
    className="absolute p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl"
  >
    <div className="text-white/80">{icon}</div>
  </motion.div>
);

const SocialProof = () => {
  const logos = ['ProductHunt', 'GitHub', 'Dev.to', 'Hashnode', 'IndieHackers'];

  return (
    <section className="py-12 md:py-16 bg-[#0a0a0a] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[8px] md:text-[10px] font-bold text-white/30 mb-8 md:mb-10 uppercase tracking-[0.2em]"
        >
          TRUSTED BY INDIE DEVELOPERS & BUILDERS
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-40 grayscale"
        >
          {logos.map((logo) => (
            <motion.span 
              key={logo} 
              whileHover={{ opacity: 1, grayscale: 0, scale: 1.1 }}
              className="text-lg md:text-2xl font-bold text-white cursor-default transition-all"
            >
              {logo}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection1 = () => {
  const features = [
    {
      title: "Auto Routing",
      description: "Send any prompt to our API and we handle the rest. We instantly classify your prompt and pick the best value model — no configuration needed.",
      icon: <Layout className="w-5 h-5" />,
      image: "https://picsum.photos/seed/pm/800/500"
    },
    {
      title: "Manual Model Override",
      description: "Need GPT-4o for a specific request? Just pass the model name. RouteLLM skips classification and calls exactly what you asked for.",
      icon: <Zap className="w-5 h-5" />,
      image: "https://picsum.photos/seed/workflow/800/500"
    },
    {
      title: "Savings Dashboard",
      description: "See exactly how many tokens you've used, how much you've spent, and how much you've saved compared to using GPT-4o for everything.",
      icon: <BarChart3 className="w-5 h-5" />,
      image: "https://picsum.photos/seed/goals/800/500"
    },
    {
      title: "Usage Management",
      description: "Manage multiple subscription keys, set budgets, track usage, and get alerts before you overspend — all in one place.",
      icon: <Users className="w-5 h-5" />,
      image: "https://picsum.photos/seed/resource/800/500"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
            <Settings className="w-3 h-3" /> Features
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-4 md:mb-6">Everything Your API Was Missing</h2>
          <p className="text-sm md:text-base text-white/50 max-w-2xl leading-relaxed font-medium">
            RouteLLM's intelligent routing handles any type of AI workload. And we never stop improving.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-white/5 transition-all hover:shadow-2xl hover:shadow-white/5"
            >
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="p-2.5 bg-[#1a1a1a] text-white rounded-xl shadow-sm group-hover:bg-white group-hover:text-black transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base md:text-lg font-extrabold font-display text-white">{feature.title}</h3>
              </div>
              <p className="text-xs md:text-sm text-white/50 mb-6 md:mb-8 leading-relaxed font-medium">
                {feature.description}
              </p>
              <div className="rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-sm group-hover:shadow-md transition-all">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-700 opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection2 = () => {
  const cards = [
    {
      title: "Instant Integration",
      description: "Works with your existing code. Change one line and you're live. No SDK, no rewriting anything.",
      icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />,
      bg: "bg-purple-500/10"
    },
    {
      title: "Real Cost Savings",
      description: "Developers using RouteLLM save 30–80% on monthly AI API bills. You pay us less than you save.",
      icon: <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />,
      bg: "bg-amber-500/10"
    },
    {
      title: "Always On",
      description: "Every prompt is classified and routed in milliseconds. No delays, no downtime, no manual effort.",
      icon: <Clock className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />,
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3" /> Why RouteLLM
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-4 md:mb-6">Cut Costs and Ship Faster</h2>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop thinking about which model to use. Let RouteLLM decide. Spend your energy building, not optimising.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/5 transition-all"
            >
              <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8", card.bg)}>
                {card.icon}
              </div>
              <h3 className="text-base md:text-lg font-extrabold font-display text-white mb-3 md:mb-4">{card.title}</h3>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed font-medium">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: "STARTER",
      price: isAnnual ? "24" : "29",
      description: "For solo developers and indie hackers who want to stop overpaying for AI.",
      features: ["10M tokens/month", "Auto-routing", "All free OpenRouter models", "Savings dashboard", "Email support"],
      buttonText: "Get Started",
      highlight: false
    },
    {
      name: "PRO",
      price: isAnnual ? "82" : "99",
      description: "For growing teams that need full control over their AI spending.",
      features: ["100M tokens/month", "Manual model selection", "Access to 100+ models", "Budget alerts", "Priority support"],
      buttonText: "Get Started",
      highlight: true
    },
    {
      name: "CUSTOM PLAN",
      price: "Custom",
      description: "For companies running AI at scale.",
      features: ["Unlimited tokens", "Custom routing rules", "Dedicated support", "Custom billing"],
      buttonText: "Get Started",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-20 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl text-center md:text-left"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
              <FileText className="w-3 h-3" /> Pricing
            </span>
            <h2 className="text-2xl md:text-5xl font-extrabold font-display tracking-tight text-white mb-4 md:mb-6">Simple and Flexible Pricing</h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 p-1 rounded-full border border-white/10 flex items-center relative"
          >
            <div 
              className={cn(
                "absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white rounded-full transition-all duration-300 ease-out",
                isAnnual ? "translate-x-[calc(100%)]" : "translate-x-0"
              )}
            />
            <button 
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-6 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold transition-all relative z-10",
                !isAnnual ? "text-black" : "text-white/40 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-6 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold transition-all relative z-10",
                isAnnual ? "text-black" : "text-white/40 hover:text-white"
              )}
            >
              Annually
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={cn(
                  "p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-500 relative group overflow-hidden",
                  plan.highlight 
                    ? "bg-white text-black border-white scale-100 md:scale-105 shadow-[0_30px_60px_-12px_rgba(255,255,255,0.2)]" 
                    : "bg-white/[0.03] backdrop-blur-xl text-white border-white/10 hover:border-white/20"
                )}
              >
                {/* Shine Effect for all cards */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className={cn(
                    "absolute inset-[-100%] animate-[spin_4s_linear_infinite]",
                    plan.highlight 
                      ? "bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,rgba(0,0,0,0.05)_180deg,transparent_240deg)]"
                      : "bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,rgba(255,255,255,0.1)_180deg,transparent_240deg)]"
                  )} />
                </div>
                
                {/* Edge Shine */}
                <div className={cn(
                  "absolute inset-0 border rounded-[1.5rem] md:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                  plan.highlight ? "border-black/5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]" : "border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                )} />
              
              <div className="relative z-10">
                <div className="mb-8 md:mb-10">
                  <span className={cn("text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]", plan.highlight ? "text-gray-400" : "text-white/30")}>
                    {plan.name}
                  </span>
                  <div className="mt-4 md:mt-6 flex items-baseline gap-1">
                    <span className="text-3xl md:text-5xl font-extrabold font-display tracking-tight">
                      {plan.price !== "Custom" && "$"}
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className={cn("text-[10px] md:text-xs font-medium ml-1", plan.highlight ? "text-gray-400" : "text-white/30")}>
                        /month
                      </span>
                    )}
                  </div>
                  <p className={cn("mt-4 md:mt-6 text-xs md:text-sm leading-relaxed font-medium", plan.highlight ? "text-gray-500" : "text-white/50")}>
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-3 md:space-y-5 mb-8 md:mb-12">
                  <p className={cn("text-[8px] md:text-[10px] font-bold uppercase tracking-widest", plan.highlight ? "text-black" : "text-white/80")}>
                    {idx === 0 ? "This Plan Includes:" : idx === 1 ? "Everything in Standard, plus:" : "Everything in Standard & Pro, plus:"}
                  </p>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 md:gap-3">
                      <CheckCircle2 className={cn("w-3.5 h-3.5 md:w-4 md:h-4 shrink-0", plan.highlight ? "text-black" : "text-white/20")} />
                      <span className={cn("text-xs md:text-sm font-medium", plan.highlight ? "text-gray-700" : "text-white/70")}>{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button 
                  onClick={() => navigate('/signup')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all",
                    plan.highlight 
                      ? "bg-black text-white hover:bg-gray-800" 
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  )}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AdvancedCapabilities = () => {
  return (
    <section className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" /> Advanced
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-4 md:mb-6">Built for the Future of AI Development</h2>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
            The next generation of API cost management with intelligent routing and real-time automation.
          </p>
        </motion.div>
        
        <GlowingEffectDemo />
      </div>
    </section>
  );
};

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 md:py-24 bg-[#0a0a0a]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto overflow-hidden relative px-4"
      >
        <div className="relative z-10 px-6 md:px-8 py-16 md:py-24 text-center max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-5xl font-extrabold font-display tracking-tight text-white mb-6 md:mb-8 leading-tight"
          >
            A Smarter Way to Use AI, Today
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm md:text-base text-white/50 mb-8 md:mb-12 leading-relaxed"
          >
            The power of 100+ AI models with the simplicity of one API call — at a fraction of the cost. Free to start, no credit card needed.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            <motion.button 
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              Get Started
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 transition-colors text-sm md:text-base"
            >
              How it Works
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] pt-16 md:pt-20 pb-8 md:pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-20">
          <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center">
              <Layers className="text-black w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-lg md:text-xl font-extrabold font-display tracking-tight text-white">RouteLLM</span>
          </div>
            <div className="flex items-center gap-3 md:gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-white/60 hover:bg-white hover:text-black transition-all">
                <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-white/60 hover:bg-white hover:text-black transition-all">
                <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-white/60 hover:bg-white hover:text-black transition-all">
                <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] md:text-sm font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3 md:space-y-4">
              <li><a href="#" className="text-xs md:text-sm text-white/50 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-xs md:text-sm text-white/50 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] md:text-sm font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">Developers</h4>
            <ul className="space-y-3 md:space-y-4">
              <li><a href="#" className="text-xs md:text-sm text-white/50 hover:text-white">GitHub</a></li>
              <li><a href="#" className="text-xs md:text-sm text-white/50 hover:text-white">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] md:text-sm font-bold text-white mb-4 md:mb-6 uppercase tracking-widest">Support</h4>
            <ul className="space-y-3 md:space-y-4">
              <li><a href="#" className="text-xs md:text-sm text-white/50 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-xs md:text-sm text-white/50 hover:text-white">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <button className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-lg text-[10px] md:text-sm font-medium text-white/60">
            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
            United States
          </button>
          <p className="text-[10px] md:text-sm text-white/30 text-center">
            © RouteLLM 2024. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <SocialProof />
      <FeaturesSection1 />
      <FeaturesSection2 />
      <PricingSection />
      <AdvancedCapabilities />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-white selection:text-black">
        <div className="hidden md:block">
          <CursorFollower />
        </div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/keys" element={<ApiKeys />} />
        </Routes>
      </div>
    </Router>
  );
}
