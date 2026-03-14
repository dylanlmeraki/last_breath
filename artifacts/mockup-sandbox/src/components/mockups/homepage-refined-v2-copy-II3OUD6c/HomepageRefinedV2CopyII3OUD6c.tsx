import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  FileText,
  ClipboardCheck,
  Shield,
  ArrowRight,
  Phone,
  PhoneCall,
  Clock,
  Menu,
  MessageCircle,
  X,
  HardHat,
  Ruler,
  Droplets,
  Target,
  ArrowUp,
  Monitor,
  CheckSquare,
  Award,
  Users,
  Building2,
  MapPin,
  Mail,
  Zap,
  ChevronRight
} from "lucide-react";

// Helper hooks
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedSection({ children, className = "", delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" | "down";
}) {
  const { ref, inView } = useInView(0.1);
  const transform = direction === "up" ? "translateY(40px)" : direction === "down" ? "translateY(-40px)" : direction === "left" ? "translateX(-40px)" : "translateX(40px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transform,
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const { ref, inView } = useInView(0.3);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(start);
    }, duration / 60);
    return () => clearInterval(interval);
  }, [inView, target, duration]);
  return <span ref={ref}>{inView ? `${count.toLocaleString()}${suffix}` : `0${suffix}`}</span>;
}

// Global styles injected here for the hero animations
const styles = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

@keyframes hero-scroll {
  0% { background-position: 0 0; }
  100% { background-position: 100px 0; }
}
@keyframes beam-wave {
  0% { transform: translateX(-10%) rotate(-5deg); opacity: 0; }
  25% { opacity: 0.8; }
  75% { opacity: 0.8; }
  100% { transform: translateX(110%) rotate(5deg); opacity: 0; }
}
@keyframes blueprint-pulse {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.08; }
}
.font-ibm { font-family: 'IBM Plex Sans', sans-serif; }
.card-tilt {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.card-tilt:hover {
  transform: perspective(1000px) rotateY(-2deg) translateY(-5px);
}
`;

function AnimatedBeams() {
  const beams = [
    { color: "bg-cyan-400", width: "4px", top: "15%", duration: "12s", delay: "0s" },
    { color: "bg-cyan-500", width: "2px", top: "30%", duration: "15s", delay: "2s" },
    { color: "bg-blue-500", width: "6px", top: "45%", duration: "10s", delay: "4s" },
    { color: "bg-orange-500", width: "3px", top: "60%", duration: "14s", delay: "1s" },
    { color: "bg-cyan-300", width: "8px", top: "70%", duration: "18s", delay: "5s" },
    { color: "bg-blue-400", width: "4px", top: "85%", duration: "11s", delay: "3s" },
    { color: "bg-cyan-600", width: "2px", top: "20%", duration: "16s", delay: "7s" },
    { color: "bg-orange-400", width: "5px", top: "80%", duration: "13s", delay: "6s" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {beams.map((b, i) => (
        <div
          key={i}
          className={`absolute left-0 w-full blur-sm ${b.color}`}
          style={{
            height: b.width,
            top: b.top,
            animation: `beam-wave ${b.duration} infinite linear`,
            animationDelay: b.delay,
            transformOrigin: "left center"
          }}
        />
      ))}
    </div>
  );
}

function BlueprintStructural() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ animation: "blueprint-pulse 12s infinite ease-in-out" }}>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.3" />
        </pattern>
        <pattern id="grid-large" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="url(#grid)" />
          <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-large)" />
      
      <g stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeOpacity="0.6">
        {/* I-Beam section */}
        <path d="M200 150 L200 450 M250 150 L250 450 M180 150 L270 150 M180 450 L270 450" />
        <path d="M225 150 L225 450" strokeWidth="3" />
        
        <path d="M600 250 L600 550 M650 250 L650 550 M580 250 L670 250 M580 550 L670 550" />
        <path d="M625 250 L625 550" strokeWidth="3" />
        
        {/* Connecting beam */}
        <path d="M250 200 L600 300 M250 250 L600 350" />
        <path d="M225 225 L625 325" strokeWidth="2" />
        
        {/* Dimension lines */}
        <path d="M200 100 L600 100" strokeWidth="1" strokeDasharray="5,5" />
        <path d="M200 90 L200 110 M600 90 L600 110" />
        <path d="M200 100 L210 95 L210 105 Z" fill="#06B6D4" fillOpacity="0.6"/>
        <path d="M600 100 L590 95 L590 105 Z" fill="#06B6D4" fillOpacity="0.6"/>
        <text x="400" y="90" fill="#06B6D4" fontSize="14" fontFamily="monospace" textAnchor="middle" opacity="0.8">24'-0" TYP. SPAN</text>
        
        {/* Grid References */}
        <circle cx="225" cy="50" r="20" />
        <text x="225" y="55" fill="#06B6D4" fontSize="16" fontFamily="monospace" textAnchor="middle">A</text>
        <path d="M225 70 L225 130" strokeDasharray="4,4" />
        
        <circle cx="625" cy="50" r="20" />
        <text x="625" y="55" fill="#06B6D4" fontSize="16" fontFamily="monospace" textAnchor="middle">B</text>
        <path d="M625 70 L625 230" strokeDasharray="4,4" />
        
        {/* Callout */}
        <circle cx="425" cy="275" r="30" strokeDasharray="5,5" />
        <path d="M445 255 L500 200 L650 200" />
        <text x="510" y="190" fill="#06B6D4" fontSize="12" fontFamily="monospace">W14x68 STL BEAM</text>
        <text x="510" y="215" fill="#06B6D4" fontSize="10" fontFamily="monospace">MOMENT CONNECTION</text>
        
        {/* Section mark */}
        <path d="M100 300 L150 300 M125 280 L125 320" strokeWidth="2" />
        <path d="M125 280 L115 290 L135 290 Z" fill="#06B6D4" fillOpacity="0.6"/>
        <circle cx="125" cy="335" r="15" />
        <text x="125" y="340" fill="#06B6D4" fontSize="12" fontFamily="monospace" textAnchor="middle">1</text>
        <path d="M125 350 L125 365" />
        <text x="125" y="375" fill="#06B6D4" fontSize="10" fontFamily="monospace" textAnchor="middle">S2.1</text>
      </g>
    </svg>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block z-0">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          style={{
            left: `${10 + i * 8}%`,
            top: `${15 + (i % 4) * 20}%`,
            animation: `float ${4 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      <style>{`@keyframes float { 0% { transform: translateY(0px) scale(1); opacity: 0.3; } 100% { transform: translateY(-30px) scale(1.5); opacity: 0.8; } }`}</style>
    </div>
  );
}

function PELogo() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 rounded-sm w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shadow-lg border-t border-white/20">
      <span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tighter">PE</span>
    </div>
  );
}

function SmallPELogo() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 rounded-sm w-9 h-9 sm:w-11 sm:h-11 shadow-sm border-t border-white/20">
      <span className="text-white font-bold text-sm sm:text-base tracking-tighter">PE</span>
    </div>
  );
}

export function HomepageRefinedV2CopyII3OUD6c() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white font-ibm text-slate-800">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <SmallPELogo />
              <span className="text-white font-semibold tracking-tight text-lg">Pacific Engineering</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {["Home", "Services", "About Us", "Previous Work", "Contact"].map((item) => (
              <a key={item} href="#" className="text-2xl font-medium text-white/90 hover:text-cyan-400 transition-colors">
                {item}
              </a>
            ))}
            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
              <button className="w-full py-4 bg-orange-600 text-white font-semibold rounded-sm text-lg shadow-lg">
                Request a Quote
              </button>
              <a href="tel:4156894428" className="w-full py-4 bg-white/5 text-white font-semibold rounded-sm text-lg flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-cyan-400" /> (415) 689-4428
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/95 backdrop-blur-md shadow-xl border-b border-white/10 py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SmallPELogo />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight tracking-tight">Pacific Engineering</span>
              <span className="text-cyan-400 text-xs font-medium tracking-wide hidden sm:block">Consulting Engineers & Contractors</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {["Home", "Services", "About", "Projects", "Contact"].map((item) => (
              <a key={item} href="#" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-wider">
                {item}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <a href="tel:4156894428" className="hidden md:flex items-center gap-2 text-white hover:text-cyan-400 transition-colors font-semibold">
              <Phone className="w-4 h-4 text-cyan-500" /> (415) 689-4428
            </a>
            <button className="hidden sm:flex px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold uppercase tracking-wider rounded-sm shadow-[0_4px_14px_rgba(249,115,22,0.4)] transition-all active:scale-95">
              Get Quote
            </button>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-20 overflow-hidden bg-slate-950">
        {/* Scrolling background pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08] z-0"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #06B6D4 0, #06B6D4 1px, transparent 1px, transparent 40px)",
            backgroundSize: "100px 100%",
            animation: "hero-scroll 30s linear infinite"
          }}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-slate-950 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/80 to-slate-950 z-0" />
        
        <BlueprintStructural />
        <FloatingParticles />
        <AnimatedBeams />

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 max-w-5xl mx-auto text-center mt-10">
          <AnimatedSection direction="up" delay={0}>
            <div className="flex justify-center mb-8">
              <PELogo />
            </div>
            
            <h1 className="text-white font-bold tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-[1.1]">
              Pacific Engineering <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">
                & Construction Inc.
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent to-cyan-500" />
              <div className="w-2 h-2 bg-orange-500 rotate-45" />
              <div className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
            
            <p className="text-slate-300 text-lg sm:text-xl md:text-2xl font-light tracking-wide max-w-3xl mx-auto mb-10">
              Bay Area Consulting Engineers & Contractors
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
              <button className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(249,115,22,0.4)] transition-all hover:-translate-y-1">
                <PhoneCall className="w-5 h-5" />
                Request a Quote
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-1">
                <Clock className="w-5 h-5" />
                Schedule a Consult
              </button>
            </div>
            
            <p className="text-cyan-400/80 text-sm md:text-base font-medium tracking-widest uppercase mb-16">
              Same-day response · No obligations · 40+ years Bay Area expertise
            </p>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6 rounded-sm shadow-xl flex flex-col items-center justify-center group hover:border-cyan-500/50 transition-colors">
                <div className="text-4xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  <AnimatedCounter target={40} suffix="+" />
                </div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Years Experience</div>
              </div>
              <div className="bg-gradient-to-b from-cyan-900/40 to-slate-900/80 backdrop-blur-sm border border-cyan-500/30 p-6 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center transform sm:scale-105 z-10">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">Full-Service</div>
                <div className="text-cyan-400 text-xs uppercase tracking-widest font-semibold">Vertically Integrated</div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6 rounded-sm shadow-xl flex flex-col items-center justify-center group hover:border-cyan-500/50 transition-colors">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Full-Scale</div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-semibold text-center">Res, Comm & Infra</div>
              </div>
            </div>
            
          </AnimatedSection>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ArrowDownIcon className="w-6 h-6 text-cyan-500" />
        </div>
      </section>

      {/* Background elements between sections */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <BlueprintStructural />
      </div>

      {/* Services Section */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Expertise</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Core Services</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-sm" />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Construction Service",
                desc: "Fully licensed for any project from residential additions to public and governmental infrastructure.",
                icon: Shield,
                grad: "from-blue-900 to-blue-600",
                iconGrad: "from-blue-600 to-blue-400",
                items: ["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"]
              },
              {
                title: "Engineering Consulting",
                desc: "Professional expertise across civil and structural disciplines with innovative project solutions.",
                icon: Ruler,
                grad: "from-blue-800 to-cyan-600",
                iconGrad: "from-blue-500 to-cyan-400",
                items: ["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management"]
              },
              {
                title: "Inspections & Testing",
                desc: "Thorough inspections ensuring ongoing compliance with actionable improvement recommendations.",
                icon: ClipboardCheck,
                grad: "from-cyan-900 to-teal-500",
                iconGrad: "from-cyan-500 to-teal-400",
                items: ["Structural Systems Inspections", "Stormwater Testing", "Materials Sampling & Testing", "Environmental Compliance"]
              },
              {
                title: "Stormwater Planning",
                desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance.",
                icon: Droplets,
                grad: "from-teal-900 to-cyan-600",
                iconGrad: "from-teal-600 to-cyan-400",
                items: ["PE/QSD/QSP site assessment", "BMP design & maintenance", "Clear documentation", "Federal/state/local compliance"]
              }
            ].map((svc, i) => (
              <AnimatedSection key={i} delay={i * 0.1} direction={i % 2 === 0 ? "right" : "left"}>
                <div className="card-tilt bg-white rounded-sm shadow-xl border border-slate-100 p-8 h-full flex flex-col items-center text-center relative overflow-hidden group">
                  {/* Bottom border gradient */}
                  <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${svc.grad} opacity-80`} />
                  
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${svc.iconGrad} shadow-lg border-t border-white/30 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <svc.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-wide">{svc.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed max-w-md">{svc.desc}</p>
                  
                  <ul className="space-y-3 w-full max-w-sm mt-auto">
                    {svc.items.map((item, j) => (
                      <li key={j} className="flex items-center justify-center gap-3">
                        <CheckCircle className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-br ${svc.iconGrad} flex-shrink-0`} style={{ color: "var(--tw-gradient-from)" }} />
                        <span className="text-slate-700 font-medium text-left flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-900 relative z-10 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">From First Call to Final Inspection</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-cyan-400 mx-auto rounded-sm" />
          </AnimatedSection>

          {/* Desktop Flow Diagram */}
          <div className="hidden lg:block relative max-w-6xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute top-24 left-[10%] right-[10%] h-2 bg-slate-800 rounded-full" />
            <div className="absolute top-24 left-[10%] w-[80%] h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            
            <div className="grid grid-cols-4 gap-6 relative">
              {[
                { step: "01", title: "Consultation", desc: "In-depth project(s) overview with our engineering team", icon: Phone },
                { step: "02", title: "Client Portal Integration", desc: "Free enterprise-grade project management & internal communication software — easy to use", icon: Monitor, hasMockup: true },
                { step: "03", title: "Proposal & Plans", desc: "Detailed scope, timeline, and engineering plans tailored to your project", icon: FileText },
                { step: "04", title: "Execution", desc: "Our integrated team handles engineering, inspections, and construction", icon: HardHat }
              ].map((s, i) => (
                <AnimatedSection key={i} delay={i * 0.2} className="relative pt-8 h-full">
                  {/* Badge on line */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900 border-4 border-slate-900 flex items-center justify-center z-20">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg border-t border-white/30 text-white font-bold text-xl">
                      {s.step}
                    </div>
                  </div>
                  
                  {/* Arrow indicating direction */}
                  {i < 3 && (
                    <div className="absolute top-10 -right-6 -translate-y-1/2 z-20 text-cyan-400">
                      <ChevronRight className="w-8 h-8 opacity-70" />
                    </div>
                  )}

                  {/* Card content */}
                  <div className="mt-16 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 rounded-sm shadow-xl text-center flex flex-col items-center h-full hover:bg-slate-800 hover:border-cyan-500/50 transition-colors">
                    <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-6 shadow-inner border-b border-white/5">
                      <s.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">{s.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                    
                    {s.hasMockup && (
                      <div className="mt-6 w-full bg-slate-900 border border-slate-700 rounded-sm p-3 shadow-inner overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-slate-700 rounded w-3/4" />
                          <div className="h-2 bg-slate-800 rounded w-full" />
                          <div className="h-2 bg-slate-800 rounded w-5/6" />
                        </div>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Mobile Flow (Vertical) */}
          <div className="lg:hidden space-y-8 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-cyan-500">
            {[
              { step: "01", title: "Consultation", desc: "In-depth project(s) overview with our engineering team", icon: Phone },
              { step: "02", title: "Client Portal Integration", desc: "Free enterprise-grade project management & internal communication software — easy to use", icon: Monitor },
              { step: "03", title: "Proposal & Plans", desc: "Detailed scope, timeline, and engineering plans tailored to your project", icon: FileText },
              { step: "04", title: "Execution", desc: "Our integrated team handles engineering, inspections, and construction", icon: HardHat }
            ].map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-900 bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-20 ml-2 md:ml-0 border-t border-white/30">
                  {s.step}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/80 border border-slate-700 p-6 rounded-sm shadow-xl ml-4 md:ml-0 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-sm bg-slate-700 flex items-center justify-center border-b border-white/5">
                      <s.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wide">{s.title}</h4>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </section>

      {/* Why Choose Us & Trust Badges */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm mb-4 block">The PE Advantage</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Why Choose Pacific Engineering?</h2>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              We bring decades of experience, vertically integrated services, and a commitment to rapid, reliable solutions. From initial assessments to final inspections, we're your single point of contact.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <button className="min-w-[200px] px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider rounded-sm shadow-[0_4px_14px_rgba(249,115,22,0.4)] transition-all">
                Our Portfolio
              </button>
              <button className="min-w-[200px] px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider rounded-sm shadow-[0_4px_14px_rgba(15,23,42,0.4)] transition-all">
                About Us
              </button>
            </div>
          </AnimatedSection>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: CheckSquare, value: "100%", label: "Compliance Rate" },
              { icon: Users, value: "50+", label: "Expert Engineers" },
              { icon: Building2, value: "10k+", label: "Projects Completed" },
              { icon: Award, value: "40+", label: "Years in Bay Area" }
            ].map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1} direction="up" className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center mb-4 shadow-lg border-t border-white group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-inner border-t border-white/20">
                    <t.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{t.value}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative z-10 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')]" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection direction="up">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Get Your Project on Track</h2>
            <p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto font-light">
              Connect with our team today for a rapid assessment and comprehensive proposal. No obligations, just expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg uppercase tracking-wider rounded-sm shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all hover:-translate-y-1">
                Start Now
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center">
            
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <PELogo />
              </div>
              <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Pacific Engineering <br/><span className="text-cyan-400">& Construction Inc.</span></h3>
              <p className="text-slate-400 text-sm max-w-xs mt-4">
                Bay Area Consulting Engineers & Contractors. Delivering excellence in every structural detail.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-white font-bold uppercase tracking-widest mb-6">Services</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Construction Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Engineering Consulting</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Inspections & Testing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Stormwater Planning</a></li>
              </ul>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-white font-bold uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Previous Work</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Client Portal</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-white font-bold uppercase tracking-widest mb-6">Contact</h4>
              <ul className="space-y-4 w-full flex flex-col items-center">
                <li className="flex items-center gap-3 w-max">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center shadow-inner border-t border-white/10">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a href="tel:4156894428" className="text-slate-400 hover:text-cyan-400 transition-colors">(415) 689-4428</a>
                </li>
                <li className="flex items-center gap-3 w-max">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center shadow-inner border-t border-white/10">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a href="mailto:info@pacificengineering.com" className="text-slate-400 hover:text-cyan-400 transition-colors">info@pacificengineering.com</a>
                </li>
                <li className="flex items-center gap-3 w-max text-left">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center shadow-inner border-t border-white/10 shrink-0">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-slate-400 max-w-[200px]">San Francisco Bay Area, CA</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Pacific Engineering & Construction Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-3 sm:hidden safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <a href="tel:4156894428" className="flex-1 py-3 rounded-sm bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-white/20 transition-colors">
          <Phone className="w-4 h-4 text-cyan-400" /> Call Now
        </a>
        <button className="flex-1 py-3 rounded-sm bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-orange-500 transition-colors shadow-md">
          <PhoneCall className="w-4 h-4" /> Get Quote
        </button>
      </div>

      {/* Back to top - ALWAYS visible past fold, fixed, z-50 */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 w-12 h-12 rounded-sm bg-slate-900 text-cyan-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:text-cyan-300 transition-all duration-300 ${
          showBackToTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

    </div>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}
