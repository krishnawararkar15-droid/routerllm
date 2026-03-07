import React, { useState, useEffect, useRef } from 'react';
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
import { Usage } from './components/Usage';
import { Docs } from './components/Docs';
import { AutoRouting } from './components/AutoRouting';
import { ManualOverride } from './components/ManualOverride';
import { BudgetAlerts } from './components/BudgetAlerts';
import { ModelsPage } from './components/ModelsPage';
import { RealTimeRouting } from './components/RealTimeRouting';
import { CostTransparency } from './components/CostTransparency';
import { FreeTier } from './components/FreeTier';
import { SecurePrivate } from './components/SecurePrivate';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { RefundPolicy } from './components/RefundPolicy';
import { Pricing } from './components/Pricing';
import AuthCallback from './components/AuthCallback';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <div className="max-w-5xl mx-auto mt-4 px-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg shadow-black/20">
          <div className="flex justify-between items-center h-14 md:h-16 px-4 md:px-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center">
                <Layers className="text-black w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-lg md:text-xl font-extrabold font-display tracking-tight text-white">LLMLite</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Pricing</a>
              <a href="#docs" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Docs</a>
            </div>

            <div className="hidden md:flex items-center">
              <button onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full text-sm transition-all">
                Get Started
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white/60">
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
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
            className="md:hidden bg-black border-t border-white/5 overflow-hidden mx-4 mt-2 rounded-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a href="#features" className="block px-3 py-2 text-base font-medium text-white/60">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-white/60">How It Works</a>
              <a href="#pricing" className="block px-3 py-2 text-base font-medium text-white/60">Pricing</a>
              <a href="#docs" className="block px-3 py-2 text-base font-medium text-white/60">Docs</a>
              <div className="pt-4 flex flex-col space-y-2">
                <button onClick={() => { navigate('/signup'); setIsOpen(false); }} className="w-full bg-blue-600 text-white py-2 rounded-full font-medium">Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const DashboardPreview = () => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setScale(containerRef.current.offsetWidth / 780);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="mt-12 mx-auto w-full max-w-6xl px-4">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
        <div ref={containerRef} style={{width:'100%', overflow:'hidden', height: `${420 * scale}px`}}>
          <div style={{width:'780px',height:'420px',transform:`scale(${scale})`,transformOrigin:'top left'}} className="flex bg-black">

            {/* Sidebar */}
            <div className="flex-shrink-0 bg-[#050505] border-r border-white/[0.06]" style={{width:'190px'}}>
              <div className="flex items-center gap-2 p-4 border-b border-white/[0.06]">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-[10px] font-black text-white">R</div>
                <span className="text-white text-sm font-black">LLMLite</span>
              </div>
              <div className="p-2">
                <div className="text-[7px] text-white/20 uppercase tracking-widest px-2 py-1">Navigation</div>
                {[{label:'Dashboard',active:true},{label:'API Keys',active:false},{label:'Usage',active:false},{label:'Documentation',active:false}].map((item,i)=>(
                  <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-[10px] font-medium ${item.active?'bg-white/10 text-white border border-white/10':'text-white/40'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.active?'bg-blue-400':'bg-white/20'}`}/>{item.label}
                  </div>
                ))}
                <div className="text-[7px] text-white/20 uppercase tracking-widest px-2 py-1 mt-3">Routing</div>
                {['Auto Routing','Manual Override'].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-[10px] text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"/>{item}
                  </div>
                ))}
                <div className="text-[7px] text-white/20 uppercase tracking-widest px-2 py-1 mt-3">Cost Control</div>
                {['Savings Dashboard','Budget Alerts'].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-[10px] text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"/>{item}
                  </div>
                ))}
                <div className="text-[7px] text-white/20 uppercase tracking-widest px-2 py-1 mt-3">Model Access</div>
                {['100+ Models'].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-[10px] text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"/>{item}
                  </div>
                ))}
                <div className="text-[7px] text-white/20 uppercase tracking-widest px-2 py-1 mt-3">Key Management</div>
                {['Multiple Keys'].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-[10px] text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"/>{item}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-black overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/[0.06]">
                <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M10 10l4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span className="text-[9px] text-white/20">Search requests...</span>
                </div>
                <div className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg">New Key</div>
              </div>
              <div className="grid grid-cols-4 gap-2.5 p-4">
                {[
                  {label:'TOTAL REQUESTS',value:'4,571',badge:'+13.5%',color:'text-white'},
                  {label:'TOTAL TOKENS',value:'3.2M',badge:'+8.2%',color:'text-white'},
                  {label:'TOTAL SAVINGS',value:'$8,322',badge:'+34.7%',color:'text-green-400'},
                  {label:'AVG. LATENCY',value:'142ms',badge:'-12ms',color:'text-white'},
                ].map((card,i)=>(
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[7px] text-white/30 uppercase tracking-widest">{card.label}</span>
                      <span className="text-[7px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-bold">{card.badge}</span>
                    </div>
                    <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
                    <div className="flex gap-0.5 mt-2">
                      {[30,45,35,60,40,55,50,70].map((h,j)=>(
                        <div key={j} className="flex-1 rounded-sm bg-white/10" style={{height:'10px',opacity:h/100+0.2}}/>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mx-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-white">Requests Overview</div>
                    <div className="text-[9px] text-white/30">Real-time traffic across all routed models</div>
                  </div>
                  <div className="flex gap-1">
                    {['24h','7d','30d','All'].map((t,i)=>(
                      <div key={i} className={`text-[8px] px-2 py-0.5 rounded font-bold ${i===0?'bg-white/10 text-white border border-white/10':'text-white/30'}`}>{t}</div>
                    ))}
                  </div>
                </div>
                <div className="relative" style={{height:'100px'}}>
                  <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,90 C30,90 50,85 80,75 C120,60 150,58 200,44 C250,30 280,24 310,20 C340,16 370,28 400,34 C430,40 460,30 500,16 C540,4 570,2 600,1" fill="none" stroke="#3b82f6" strokeWidth="2.5"/>
                    <path d="M0,90 C30,90 50,85 80,75 C120,60 150,58 200,44 C250,30 280,24 310,20 C340,16 370,28 400,34 C430,40 460,30 500,16 C540,4 570,2 600,1 L600,100 L0,100 Z" fill="url(#g1)"/>
                  </svg>
                </div>
                <div className="flex justify-between mt-1">
                  {['00:00','04:00','08:00','12:00','16:00','20:00','23:59'].map((t,i)=>(
                    <span key={i} className="text-[7px] text-white/20">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06]">
                <span className="text-sm font-bold text-white">Recent Requests</span>
                <span className="text-[9px] text-blue-400 font-bold">View All →</span>
              </div>
              <div className="px-4 pb-3">
                {[
                  {model:'google/gemma-3-4b:free',type:'SIMPLE',tokens:'124',cost:'$0.0000'},
                  {model:'openai/gpt-4o-mini',type:'COMPLEX',tokens:'891',cost:'$0.0001'},
                  {model:'google/gemma-3-4b:free',type:'SIMPLE',tokens:'67',cost:'$0.0000'},
                ].map((row,i)=>(
                  <div key={i} className="flex items-center gap-3 py-1.5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"/>
                      <span className="text-[9px] font-bold text-white">{row.model}</span>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${row.type==='SIMPLE'?'bg-blue-500/20 text-blue-400':'bg-purple-500/20 text-purple-400'}`}>{row.type}</span>
                    <span className="text-[9px] text-white/40">{row.tokens}</span>
                    <span className="text-[9px] font-bold text-green-400">{row.cost}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const yGlow = useTransform(scrollY, [0, 500], [0, 150]);
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-0 overflow-hidden bg-black text-white">
      {/* Blue Radial Glow */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(37,99,235,0.15), transparent)' }} 
      />

      {/* Background Glow */}
      <motion.div
        style={{ y: yGlow }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full mb-6 md:mb-8"
          >
            <span>✦ Introducing LLMLite 1.0</span>
            <ArrowRight className="w-3 h-3" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight"
          >
            One API To Cut Your <br className="hidden md:block" /> AI Costs Forever
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-gray-400 text-center text-lg max-w-xl mx-auto mt-4"
          >
            LLMLite automatically routes every prompt to the cheapest AI model that can handle it. Simple questions go to free models. Complex tasks go to powerful ones. Save 30–80% on every API bill — automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200 mt-8"
            >
              Try it out →
            </motion.button>
          </motion.div>
        </div>

        {/* Dashboard Preview with Blue Glow */}
        <div className="relative mx-auto max-w-5xl mt-16 px-4">
          {/* Blue glow behind image */}
          <div className="absolute inset-0 rounded-2xl scale-95 blur-2xl" 
            style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.4), transparent 70%)' }} 
          />
          
          {/* Image with glow border */}
          <div className="relative rounded-2xl border border-white/10 ring-1 ring-blue-500/30 shadow-2xl shadow-blue-500/20 overflow-hidden">
            <DashboardPreview />
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32" 
              style={{ background: 'linear-gradient(to top, #000000, transparent)' }} 
            />
          </div>
        </div>
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
    <section className="py-12 md:py-16 bg-black border-b border-white/5">
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
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-4 md:mb-6">Everything Your API Was Missing</h2>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
            Four powerful features that make developers switch and stay
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            number={1}
            title="Auto Routing"
            description="Send any prompt and LLMLite instantly picks the cheapest capable model. Zero configuration needed."
            delay={0}
            isVisible={isVisible}
          />
          <FeatureCard
            number={2}
            title="Manual Model Override"
            description="Need GPT-4o for a specific request? Pass the model name and LLMLite skips classification entirely."
            delay={100}
            isVisible={isVisible}
          />
          <FeatureCard
            number={3}
            title="Savings Dashboard"
            description="See exactly how much you saved vs GPT-4o. Every token. Every dollar. Fully transparent."
            delay={200}
            isVisible={isVisible}
          />
        </div>

        <div className="mt-6">
          <FeatureCard
            number={4}
            title="Usage Management"
            description="Track every request in real time. See which models you use, how many tokens, and your exact cost per request. Nothing hidden."
            delay={400}
            isVisible={isVisible}
            fullWidth
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ number, title, description, delay, isVisible, fullWidth = false }: { number: number, title: string, description: string, delay: number, isVisible: boolean, fullWidth?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      whileHover={{ scale: 1.02 }}
      className={`group bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-white/5 transition-all hover:shadow-2xl hover:shadow-white/5 ${fullWidth ? 'md:col-span-3' : ''}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-lg flex items-center justify-center">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mt-3">{title}</h3>
      <p className="text-white/50 text-sm mt-2">{description}</p>
      
      <div className="bg-black rounded-xl p-3 mt-4">
        {number === 1 && <AutoRoutingAnimation isVisible={isVisible} delay={delay} />}
        {number === 2 && <ManualOverrideAnimation isVisible={isVisible} delay={delay} />}
        {number === 3 && <SavingsAnimation isVisible={isVisible} delay={delay} />}
        {number === 4 && <UsageManagementAnimation isVisible={isVisible} delay={delay} />}
      </div>
    </motion.div>
  );
};

const AutoRoutingAnimation = ({ isVisible, delay }: { isVisible: boolean; delay: number }) => {
  const [step, setStep] = React.useState(0);
  const [displayText, setDisplayText] = React.useState('');
  
  React.useEffect(() => {
    if (!isVisible) return;
    const texts = ['What is 2+2?', 'Explain neural networks'];
    const timeouts: NodeJS.Timeout[] = [];
    
    const runLoop = () => {
      let currentTextIndex = 0;
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex < texts[currentTextIndex].length) {
          setDisplayText(texts[currentTextIndex].slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setStep((currentTextIndex + 1) % 2 === 0 ? 1 : 0);
            setTimeout(() => {
              setStep((prev) => (prev + 1) % 2);
              charIndex = 0;
              setDisplayText('');
              currentTextIndex = (currentTextIndex + 1) % 2;
            }, 1500);
          }, 1000);
        }
      }, 80);
      
      timeouts.push(typeInterval as unknown as NodeJS.Timeout);
    };
    
    const startTimeout = setTimeout(() => {
      runLoop();
    }, delay);
    timeouts.push(startTimeout);
    
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isVisible, delay]);
  
  const isSimple = step === 0;
  
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Live Classification</div>
      <div className="bg-black border border-white/10 rounded-lg px-3 py-2">
        <span className="text-white text-xs font-mono">{displayText}</span>
        <span className="animate-pulse">|</span>
      </div>
      <div className={`flex items-center gap-2 transition-all duration-300 ${step > 0 ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`px-2 py-1 rounded text-[9px] font-bold ${isSimple ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
          {isSimple ? 'SIMPLE' : 'COMPLEX'}
        </span>
        <ArrowRight className="w-3 h-3 text-white/30" />
        <span className="text-white text-xs font-bold">{isSimple ? 'gemma-3-4b' : 'llama-3.1-8b'}</span>
        <span className="text-green-400 text-xs font-bold ml-auto">{isSimple ? '$0.00' : '$0.00'}</span>
      </div>
    </div>
  );
};

const ManualOverrideAnimation = ({ isVisible, delay }: { isVisible: boolean; delay: number }) => {
  const [selected, setSelected] = React.useState(0);
  
  React.useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % 3);
    }, 1500);
    const startTimeout = setTimeout(() => {
      interval;
    }, delay);
    return () => { clearInterval(interval); clearTimeout(startTimeout); };
  }, [isVisible, delay]);
  
  const models = [
    { name: 'Gemma 3 4B', cost: '$0.00', type: 'FREE' },
    { name: 'GPT-4o', cost: '$5.00/1M', type: 'PAID' },
    { name: 'Claude 3.5', cost: '$3.00/1M', type: 'PAID' },
  ];
  
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Select Model</div>
      <div className="space-y-1.5">
        {models.map((model, idx) => (
          <div 
            key={idx}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-300 ${
              selected === idx 
                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                : 'bg-black border-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selected === idx ? 'bg-blue-400' : 'bg-white/20'}`} />
              <span className="text-white text-[10px] font-medium">{model.name}</span>
            </div>
            <span className={`text-[9px] font-bold ${model.cost === '$0.00' ? 'text-green-400' : 'text-white/60'}`}>
              {model.cost}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SavingsAnimation = ({ isVisible, delay }: { isVisible: boolean; delay: number }) => {
  const [count, setCount] = React.useState(0);
  const [showStats, setShowStats] = React.useState(false);
  
  React.useEffect(() => {
    if (!isVisible) return;
    let startTimeout: NodeJS.Timeout;
    
    const startAnim = setTimeout(() => {
      const duration = 3000;
      const steps = 60;
      const increment = 1242 / steps;
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= 1242) {
          setCount(1242);
          clearInterval(counter);
          setTimeout(() => setShowStats(true), 500);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      startTimeout = counter as unknown as NodeJS.Timeout;
    }, delay);
    
    return () => { clearTimeout(startAnim); clearTimeout(startTimeout); };
  }, [isVisible, delay]);
  
  React.useEffect(() => {
    if (!isVisible) return;
    const resetInterval = setInterval(() => {
      setCount(0);
      setShowStats(false);
      setTimeout(() => {
        const duration = 3000;
        const steps = 60;
        const increment = 1242 / steps;
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= 1242) {
            setCount(1242);
            clearInterval(counter);
            setTimeout(() => setShowStats(true), 500);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }, 100);
    }, 5000);
    
    return () => clearInterval(resetInterval);
  }, [isVisible]);
  
  return (
    <div className="text-center">
      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Saved</div>
      <div className="text-4xl font-black text-green-400">${count.toLocaleString()}</div>
      <div className="text-[10px] text-white/40 mt-1">saved vs GPT-4o</div>
      <div className={`mt-3 space-y-1 transition-opacity duration-500 ${showStats ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-[9px] text-white/50">84,291 requests routed</div>
        <div className="text-[9px] text-white/50">71% cost reduction</div>
      </div>
    </div>
  );
};

const UsageManagementAnimation = ({ isVisible, delay }: { isVisible: boolean; delay: number }) => {
  const [progress, setProgress] = React.useState(0);
  const [rowsVisible, setRowsVisible] = React.useState([false, false, false]);
  
  React.useEffect(() => {
    if (!isVisible) return;
    const rowTimeouts: NodeJS.Timeout[] = [];
    
    rowTimeouts.push(setTimeout(() => setRowsVisible([true, false, false]), delay));
    rowTimeouts.push(setTimeout(() => setRowsVisible([true, true, false]), delay + 500));
    rowTimeouts.push(setTimeout(() => setRowsVisible([true, true, true]), delay + 1000));
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 65) {
          return 0;
        }
        return prev + 1;
      });
    }, 2000 / 65);
    
    return () => {
      rowTimeouts.forEach(t => clearTimeout(t));
      clearInterval(progressInterval);
    };
  }, [isVisible, delay]);
  
  const requests = [
    { model: 'gemma-3-4b', type: 'SIMPLE', tokens: '42', cost: '$0.00' },
    { model: 'gpt-4o', type: 'COMPLEX', tokens: '842', cost: '$0.012' },
    { model: 'llama-3.1-8b', type: 'SIMPLE', tokens: '124', cost: '$0.00' },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Recent Requests</div>
        {requests.map((req, idx) => (
          <div 
            key={idx}
            className={`flex items-center gap-2 px-2 py-1.5 rounded bg-black border border-white/5 transition-all duration-300 ${
              rowsVisible[idx] ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: `${idx * 50}ms` }}
          >
            <span className="text-white text-[9px] font-medium flex-1 truncate">{req.model}</span>
            <span className={`text-[7px] font-bold px-1 py-0.5 rounded ${req.type === 'SIMPLE' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
              {req.type}
            </span>
            <span className="text-white/40 text-[8px]">{req.tokens}</span>
            <span className="text-green-400 text-[8px] font-bold">{req.cost}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Monthly Usage</div>
        <div className="h-4 bg-black rounded-full overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-2000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-white text-xs font-bold">1.2M tokens used</span>
          <span className="text-white/40 text-xs">65% of limit used</span>
        </div>
      </div>
    </div>
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
      description: "Developers using LLMLite save 30–80% on monthly AI API bills. You pay us less than you save.",
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
    <section id="how-it-works" className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3" /> Why LLMLite
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-4 md:mb-6">Cut Costs and Ship Faster</h2>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop thinking about which model to use. Let LLMLite decide. Spend your energy building, not optimising.
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
    <section id="pricing" className="py-16 md:py-24 bg-black text-white relative overflow-hidden">
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
    <section className="py-16 md:py-24 bg-black">
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
    <section className="py-16 md:py-24 bg-black">
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
    <footer className="bg-black pt-16 md:pt-20 pb-8 md:pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center">
                <Layers className="text-black w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-lg md:text-xl font-extrabold font-display tracking-tight text-white">LLMLite</span>
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
              <li><Link to="/privacy" className="text-xs md:text-sm text-white/50 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs md:text-sm text-white/50 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/refund" className="text-xs md:text-sm text-white/50 hover:text-white">Refund Policy</Link></li>
              <li><Link to="/pricing" className="text-xs md:text-sm text-white/50 hover:text-white">Pricing</Link></li>
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
            © LLMLite 2024. All Rights Reserved
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
      <div className="min-h-screen bg-black font-sans selection:bg-white selection:text-black">
        <div className="hidden md:block">
          <CursorFollower />
        </div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/keys" element={<ApiKeys />} />
          <Route path="/dashboard/usage" element={<Usage />} />
          <Route path="/dashboard/routing" element={<AutoRouting />} />
          <Route path="/dashboard/override" element={<ManualOverride />} />
          <Route path="/dashboard/alerts" element={<BudgetAlerts />} />
          <Route path="/dashboard/models" element={<ModelsPage />} />
          <Route path="/dashboard/realtime" element={<RealTimeRouting />} />
          <Route path="/dashboard/cost" element={<CostTransparency />} />
          <Route path="/dashboard/freetier" element={<FreeTier />} />
          <Route path="/dashboard/security" element={<SecurePrivate />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </div>
    </Router>
  );
}
