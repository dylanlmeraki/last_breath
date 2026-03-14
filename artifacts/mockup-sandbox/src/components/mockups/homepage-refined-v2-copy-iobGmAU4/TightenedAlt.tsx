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
  ChevronDown,
  HardHat,
  Ruler,
  Droplets,
  Target,
  ArrowUp,
  MapPin,
  Mail,
  Zap,
  Building2,
  Users,
  Compass,
  Award,
  TrendingUp
} from "lucide-react";

// --- HOOKS ---
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// --- COMPONENTS ---
function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up"
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const { ref, inView } = useInView(0.1);
  const transform =
    direction === "up"
      ? "translateY(40px)"
      : direction === "left"
      ? "translateX(-40px)"
      : "translateX(40px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transform,
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView(0.3);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else setCount(start);
    }, duration / 60);
    return () => clearInterval(interval);
  }, [inView, target, duration]);
  return (
    <span ref={ref}>
      {inView ? `${count.toLocaleString()}${suffix}` : `0${suffix}`}
    </span>
  );
}

// --- GLOBALS / STYLES ---
const G_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700;800&display=swap');
  
  .font-ibm {
    font-family: 'IBM Plex Sans', sans-serif;
  }
  
  @keyframes scrollBg {
    0% { background-position: 0 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes beamWaveRight {
    0% { transform: translateX(-100%) rotate(-5deg); opacity: 0; }
    20% { opacity: 0.8; }
    80% { opacity: 0.8; }
    100% { transform: translateX(200vw) rotate(5deg); opacity: 0; }
  }

  @keyframes beamWaveLeft {
    0% { transform: translateX(100vw) rotate(-5deg); opacity: 0; }
    20% { opacity: 0.8; }
    80% { opacity: 0.8; }
    100% { transform: translateX(-200vw) rotate(5deg); opacity: 0; }
  }

  @keyframes beamOscillate {
    0% { margin-top: 0; }
    100% { margin-top: 30px; }
  }
  
  @keyframes blueprintPulse {
    0% { opacity: 0.03; }
    50% { opacity: 0.08; }
    100% { opacity: 0.03; }
  }
  
  @keyframes floatParticles {
    0% { transform: translateY(0) scale(1); opacity: 0.2; }
    50% { transform: translateY(-40px) scale(1.3); opacity: 0.5; }
    100% { transform: translateY(0) scale(1); opacity: 0.2; }
  }

  .dropdown-content {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s ease-in-out;
  }
  
  .group:hover .dropdown-content {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- ICONS 3D UTILITY ---
function Icon3D({
  icon: IconComp,
  gradientClass,
  iconColorClass = "text-white"
}: {
  icon: any;
  gradientClass: string;
  iconColorClass?: string;
}) {
  return (
    <div
      className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border-t border-white/20 bg-gradient-to-br ${gradientClass}`}
    >
      <IconComp className={`w-7 h-7 ${iconColorClass}`} />
    </div>
  );
}

function Icon3DSmall({
  icon: IconComp,
  gradientClass,
  iconColorClass = "text-white w-5 h-5"
}: {
  icon: any;
  gradientClass: string;
  iconColorClass?: string;
}) {
  return (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md border-t border-white/20 bg-gradient-to-br ${gradientClass}`}
    >
      <IconComp className={iconColorClass} />
    </div>
  );
}

// --- HERO BACKGROUNDS ---
function SitePlanOverlay() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ animation: "blueprintPulse 12s infinite ease-in-out" }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="opacity-70 stroke-cyan-500">
        <pattern id="siteGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        <rect width="1000" height="1000" fill="url(#siteGrid)" />
        
        {/* Site Plan Elements */}
        <g strokeWidth="1" fill="none">
          {/* Property Boundary */}
          <path d="M 100,200 L 800,150 L 900,850 L 150,900 Z" strokeDasharray="10,5" strokeWidth="2" />
          
          {/* Building Footprint */}
          <rect x="300" y="350" width="400" height="300" />
          <path d="M 300,350 L 700,650 M 700,350 L 300,650" opacity="0.5" />
          
          {/* Dimensions */}
          <line x1="300" y1="320" x2="700" y2="320" />
          <path d="M 300,300 L 300,340 M 700,300 L 700,340" />
          <text x="500" y="300" fill="currentColor" fontSize="16" textAnchor="middle" className="font-ibm">120.00'</text>
          
          <line x1="270" y1="350" x2="270" y2="650" />
          <path d="M 250,350 L 290,350 M 250,650 L 290,650" />
          <text x="250" y="500" fill="currentColor" fontSize="16" textAnchor="middle" transform="rotate(-90, 250, 500)" className="font-ibm">85.50'</text>

          {/* Setbacks */}
          <path d="M 150,250 L 750,200 L 830,800 L 200,830 Z" strokeDasharray="4,4" opacity="0.5" />
          <text x="180" y="500" fill="currentColor" fontSize="14" className="font-ibm" opacity="0.7">15' SETBACK</text>

          {/* Utilities */}
          <path d="M 0,500 L 300,500" strokeDasharray="6,2,2,2" stroke="orange" strokeWidth="1.5" opacity="0.8" />
          <text x="100" y="480" fill="orange" fontSize="14" className="font-ibm">ELEC/COM</text>
          
          <path d="M 500,0 L 500,350" strokeDasharray="8,4" stroke="cyan" strokeWidth="1.5" opacity="0.8" />
          <text x="520" y="150" fill="cyan" fontSize="14" className="font-ibm">WATER/SS</text>
          
          {/* North Arrow */}
          <g transform="translate(500, 500)">
            <circle cx="0" cy="0" r="20" />
            <path d="M 0,-30 L 10,-10 L 0,-15 L -10,-10 Z" fill="currentColor" />
            <text x="0" y="10" fill="currentColor" fontSize="14" textAnchor="middle" className="font-ibm">N</text>
          </g>
          
          {/* Scale Bar */}
          <g transform="translate(500, 900)">
            <line x1="0" y1="0" x2="200" y2="0" strokeWidth="2" />
            <line x1="0" y1="-5" x2="0" y2="5" />
            <line x1="50" y1="-5" x2="50" y2="0" />
            <line x1="100" y1="-5" x2="100" y2="5" />
            <line x1="200" y1="-5" x2="200" y2="5" />
            <text x="0" y="-15" fill="currentColor" fontSize="14" textAnchor="middle">0</text>
            <text x="100" y="-15" fill="currentColor" fontSize="14" textAnchor="middle">20'</text>
            <text x="200" y="-15" fill="currentColor" fontSize="14" textAnchor="middle">40'</text>
            <text x="100" y="20" fill="currentColor" fontSize="14" textAnchor="middle">GRAPHIC SCALE</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

function Beams() {
  const beams = [
    { height: "8px", top: "15%", duration: "16s", delay: "0s", direction: "Right", blur: "4px", color: "linear-gradient(90deg, transparent, rgba(6,182,212,0.8), transparent)" },
    { height: "10px", top: "35%", duration: "22s", delay: "3s", direction: "Left", blur: "6px", color: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" },
    { height: "6px", top: "55%", duration: "18s", delay: "1s", direction: "Right", blur: "3px", color: "linear-gradient(90deg, transparent, rgba(6,182,212,0.9), transparent)" },
    { height: "12px", top: "70%", duration: "25s", delay: "5s", direction: "Left", blur: "5px", color: "linear-gradient(90deg, transparent, rgba(37,99,235,0.7), transparent)" },
    { height: "7px", top: "85%", duration: "15s", delay: "2s", direction: "Right", blur: "2px", color: "linear-gradient(90deg, transparent, rgba(249,115,22,0.8), transparent)" },
    { height: "9px", top: "25%", duration: "20s", delay: "7s", direction: "Left", blur: "4px", color: "linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent)" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {beams.map((beam, i) => (
        <div
          key={i}
          className="absolute w-[120vw]"
          style={{
            height: beam.height,
            top: beam.top,
            background: beam.color,
            animation: `beamWave${beam.direction} ${beam.duration} infinite ease-in-out ${beam.delay}, beamOscillate 8s infinite alternate ease-in-out`,
            filter: `blur(${beam.blur})`
          }}
        />
      ))}
    </div>
  );
}

function SubtitleParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animation: `floatParticles ${Math.random() * 5 + 5}s infinite alternate ease-in-out`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

function PE_Logo() {
  return (
    <div className="w-12 h-12 sm:w-16 sm:h-16 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-800 rounded-none sm:rounded-sm border border-cyan-400/30 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      <span className="text-white font-ibm font-bold text-xl sm:text-2xl leading-none relative z-10 tracking-tighter">PE</span>
    </div>
  );
}

// --- DATA ---
const SERVICES = [
  {
    icon: Shield,
    title: "Construction Service",
    desc: "Fully licensed for any project from residential additions to public and governmental infrastructure.",
    items: ["Class A License", "Class B License", "Infrastructure", "Commercial"],
    gradient: "from-blue-900 to-blue-600",
    accent: "bg-blue-600",
    href: "#"
  },
  {
    icon: Ruler,
    title: "Engineering Consulting",
    desc: "Professional expertise across civil and structural disciplines with innovative project solutions.",
    items: ["Civil Consulting", "Structural Consulting", "Site Assessment", "Dev. Management"],
    gradient: "from-blue-800 to-cyan-600",
    accent: "bg-cyan-600",
    href: "#"
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Testing",
    desc: "Thorough inspections ensuring ongoing compliance with actionable improvement recommendations.",
    items: ["Structural Inspections", "Stormwater Testing", "Materials Sampling", "Environmental"],
    gradient: "from-cyan-900 to-teal-500",
    accent: "bg-teal-500",
    href: "#"
  },
  {
    icon: Droplets,
    title: "Stormwater Planning",
    desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance.",
    items: ["PE/QSD/QSP", "BMP Design", "Documentation", "Compliance"],
    gradient: "from-teal-900 to-cyan-600",
    accent: "bg-cyan-500",
    href: "#"
  }
];

const PROCESS_STEPS = [
  {
    num: "1",
    title: "Consultation",
    desc: "In-depth project(s) overview with our engineering team."
  },
  {
    num: "2",
    title: "Client Portal Integration",
    desc: "Free enterprise-grade project management & internal communication software — easy to use.",
    hasPreview: true
  },
  {
    num: "3",
    title: "Proposal & Plans",
    desc: "Detailed scope, timeline, and engineering plans tailored to your project."
  },
  {
    num: "4",
    title: "Execution",
    desc: "Our integrated team handles engineering, inspections, and construction."
  }
];

export function TightenedAlt() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-ibm text-slate-800 antialiased selection:bg-cyan-500/30 selection:text-cyan-900">
      <style dangerouslySetInnerHTML={{ __html: G_STYLES }} />

      {/* --- MOBILE NAV OVERLAY --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <PE_Logo />
              <span className="text-white font-bold">Pacific Engineering</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {["Home", "Services", "Company", "Projects", "Contact"].map((item) => (
              <a key={item} href="#" className="block text-xl text-slate-300 font-medium py-2 border-b border-slate-800">
                {item}
              </a>
            ))}
          </div>
          <div className="p-4 space-y-3 bg-slate-900">
            <button className="w-full py-4 bg-slate-800 text-cyan-400 font-bold flex justify-center items-center gap-2 rounded-none">
              <Phone className="w-5 h-5" /> (415) 689-4428
            </button>
            <button className="w-full py-4 bg-orange-600 text-white font-bold flex justify-center items-center gap-2 rounded-none">
              Request a Quote
            </button>
          </div>
        </div>
      )}

      {/* --- DESKTOP NAV --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-white/10 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PE_Logo />
            <div className="hidden sm:block">
              <div className="font-bold text-white text-lg tracking-tight leading-tight">Pacific Engineering</div>
              <div className="text-[11px] text-cyan-400 font-medium tracking-wide uppercase">& Construction Inc.</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Home</a>
            
            <div className="relative group py-2">
              <a href="#" className="text-sm font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-1">
                Services <ChevronDown className="w-4 h-4" />
              </a>
              <div className="dropdown-content absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 border-t-2 border-t-cyan-500 shadow-xl rounded-none py-2">
                {SERVICES.map(s => (
                  <a key={s.title} href={s.href} className="group/item flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                    {s.title}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div className="relative group py-2">
              <a href="#" className="text-sm font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-1">
                Company <ChevronDown className="w-4 h-4" />
              </a>
              <div className="dropdown-content absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 border-t-2 border-t-cyan-500 shadow-xl rounded-none py-2">
                <a href="#" className="group/item flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                  About Us
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                </a>
                <a href="#" className="group/item flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                  Our Team
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                </a>
                <a href="#" className="group/item flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                  Careers
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            <a href="#" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Projects</a>
            <a href="#" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:4156894428" className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors">
              <Phone className="w-4 h-4" /> (415) 689-4428
            </a>
            <button className="hidden sm:flex bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-none font-bold text-sm transition-colors shadow-lg shadow-orange-600/20 items-center gap-2">
              Get Quote
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-white p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950 flex flex-col justify-center min-h-screen">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.6)_100%)] pointer-events-none" />
        </div>

        {/* Dynamic Elements */}
        <SitePlanOverlay />
        <SubtitleParticles />
        <Beams />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <AnimatedSection delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Bay Area Consulting Engineers & Contractors
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
              Pacific Engineering <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-200">
                & Construction Inc.
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Engineering precision meets construction execution. We handle everything from site assessment to final inspection with an integrated, highly-experienced team.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <button className="group flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-none font-bold text-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                <PhoneCall className="w-5 h-5" /> Request a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group flex items-center justify-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 text-white px-8 py-4 rounded-none font-bold text-lg transition-all backdrop-blur-sm">
                <Clock className="w-5 h-5" /> Schedule a Consult
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <p className="mt-8 text-sm text-slate-400/80 font-medium tracking-wide">
              Same-day response · No obligations · 40+ years Bay Area expertise
            </p>
          </AnimatedSection>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-16 lg:mt-24">
            <AnimatedSection delay={0.6}>
              <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md p-6 rounded-none flex flex-col items-center justify-center shadow-xl">
                <div className="text-4xl font-bold text-white mb-2 font-ibm">
                  <AnimatedCounter target={40} suffix="+" />
                </div>
                <div className="text-cyan-500 text-sm font-semibold uppercase tracking-wider">Years Experience</div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.7}>
              <div className="bg-slate-800/80 border border-slate-700 border-t-2 border-t-cyan-500 p-6 rounded-none flex flex-col items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] scale-105 z-10">
                <div className="text-3xl font-bold text-white mb-2 font-ibm">Full-Service</div>
                <div className="text-cyan-400 text-sm font-semibold uppercase tracking-wider text-center">Vertically Integrated</div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.8}>
              <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md p-6 rounded-none flex flex-col items-center justify-center shadow-xl">
                <div className="text-3xl font-bold text-white mb-2 font-ibm">Full-Scale</div>
                <div className="text-cyan-500 text-sm font-semibold uppercase tracking-wider text-center">Res, Comm & Infra</div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden lg:block">
          <div className="w-px h-16 bg-gradient-to-b from-cyan-500 to-transparent" />
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-slate-900 text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">Expertise Across Every Discipline</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-6" />
            <p className="text-lg text-slate-600 leading-relaxed">
              We deliver comprehensive engineering, testing, and construction solutions. From preliminary site assessments to final structural builds, our in-house teams ensure precision at every step.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((svc, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1} direction={idx % 2 === 0 ? "right" : "left"}>
                <div className="group relative bg-white border border-slate-200 p-8 sm:p-10 shadow-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300 h-full flex flex-col items-center text-center overflow-hidden">
                  {/* Subtle Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${svc.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
                  
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${svc.accent} opacity-80`} />
                  
                  <div className="mb-6 relative z-10">
                    <Icon3D icon={svc.icon} gradientClass={svc.gradient} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{svc.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed relative z-10">{svc.desc}</p>
                  
                  <div className="mt-auto w-full relative z-10">
                    <ul className="space-y-3 inline-block text-left mx-auto">
                      {svc.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                          <span className="text-slate-700 font-medium text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section className="py-24 bg-slate-900 relative border-y border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-2 block">Our Workflow</span>
            <h2 className="text-white text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">From First Call to Final Inspection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 max-w-5xl mx-auto relative">
            {/* Connecting line arrows for desktop */}
            <div className="hidden md:block absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500/40">
              <ArrowRight className="w-10 h-10" />
            </div>
            <div className="hidden md:block absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500/40">
              <ArrowRight className="w-10 h-10" />
            </div>
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500/40 rotate-[135deg]">
              <ArrowRight className="w-10 h-10" />
            </div>

            {PROCESS_STEPS.map((step, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <div className="relative bg-slate-800/50 border border-slate-700 p-8 backdrop-blur-sm group hover:border-cyan-500/50 transition-colors h-full flex flex-col justify-center">
                  <div className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-700/20 select-none group-hover:text-cyan-900/20 transition-colors pointer-events-none font-ibm">
                    {step.num}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-cyan-500 text-slate-900 font-bold text-xl flex items-center justify-center rounded-sm mb-6 shadow-lg">
                      {step.num}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{step.desc}</p>
                    
                    {step.hasPreview && (
                      <div className="mt-6 border border-slate-600 bg-slate-900/90 rounded-sm shadow-inner relative overflow-hidden flex flex-col h-40">
                        <div className="flex items-center justify-between border-b border-slate-700 p-2 bg-slate-800/50">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Dashboard</span>
                          <div className="w-4" />
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                          <div className="w-1/4 border-r border-slate-700 p-2 space-y-2 bg-slate-800/30">
                            <div className="h-2 bg-slate-700/50 rounded-sm w-full" />
                            <div className="h-2 bg-slate-700/50 rounded-sm w-3/4" />
                            <div className="h-2 bg-slate-700/50 rounded-sm w-5/6" />
                          </div>
                          <div className="w-3/4 p-3 space-y-3">
                            <div className="flex gap-2 border-b border-slate-700/50 pb-1">
                              <div className="h-1.5 bg-slate-600 rounded-sm w-1/3" />
                              <div className="h-1.5 bg-slate-600 rounded-sm w-1/3" />
                              <div className="h-1.5 bg-slate-600 rounded-sm w-1/3" />
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="h-2 bg-cyan-600/60 rounded-sm w-1/3" />
                              <div className="h-2 bg-slate-700 rounded-sm w-1/3" />
                              <div className="h-2 bg-slate-700 rounded-sm w-1/3" />
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="h-2 bg-slate-700 rounded-sm w-1/3" />
                              <div className="h-2 bg-slate-700 rounded-sm w-1/3" />
                              <div className="h-2 bg-slate-700 rounded-sm w-1/3" />
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="h-2 bg-slate-700 rounded-sm w-1/3" />
                              <div className="h-2 bg-slate-700 rounded-sm w-1/3" />
                              <div className="h-2 bg-cyan-600/60 rounded-sm w-1/3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-slate-900 text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Why Partner With Pacific Engineering?
            </h2>
            <p className="text-lg text-slate-600 mb-16 leading-relaxed max-w-4xl mx-auto">
              We eliminate the disconnect between design and execution. By housing structural engineering, civil engineering, inspections, and full construction services under one roof, we dramatically reduce project timelines and prevent costly miscommunications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
              <div className="flex flex-col items-center">
                <Icon3D icon={Award} gradientClass="from-cyan-600 to-blue-700" />
                <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">Expert Knowledge</h3>
                <p className="text-slate-600 leading-relaxed">Complete understanding of federal, state, and local stormwater regulations.</p>
              </div>
              <div className="flex flex-col items-center">
                <Icon3D icon={TrendingUp} gradientClass="from-cyan-600 to-blue-700" />
                <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">Proven Track Record</h3>
                <p className="text-slate-600 leading-relaxed">100% client satisfaction across 2,500+ successful projects.</p>
              </div>
              <div className="flex flex-col items-center">
                <Icon3D icon={Zap} gradientClass="from-cyan-600 to-blue-700" />
                <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">Responsive Service</h3>
                <p className="text-slate-600 leading-relaxed">Quick turnaround times and dedicated project support.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="min-w-[200px] px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg rounded-none shadow-lg transition-colors flex items-center justify-center gap-2">
                View Our Portfolio <ArrowRight className="w-5 h-5" />
              </button>
              <button className="min-w-[200px] px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-none shadow-lg transition-colors flex items-center justify-center gap-2">
                Meet The Team <Users className="w-5 h-5" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- TRUST BADGES --- */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Building2, value: "2,500+", label: "Projects Completed" },
              { icon: Award, value: "40+", label: "Years Experience" },
              { icon: Target, value: "100%", label: "Compliance Rate" },
              { icon: Users, value: "50+", label: "In-House Experts" }
            ].map((stat, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1} className="flex flex-col items-center justify-center text-center">
                <div className="mb-4">
                  <Icon3D icon={stat.icon} gradientClass="from-slate-800 to-slate-600" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1 font-ibm">{stat.value}</div>
                <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider">{stat.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-gradient-to-br from-cyan-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8">
              Get Your Project on Track
            </h2>
            <p className="text-xl text-cyan-100 mb-10 font-light max-w-2xl mx-auto">
              Don't let engineering bottlenecks delay your timeline. Contact us today for a comprehensive evaluation and fast-track your next build.
            </p>
            <div className="flex flex-col items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xl rounded-none shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                Request a Quote Now
              </button>
              <a href="tel:4156894428" className="text-cyan-200 hover:text-white transition-colors font-semibold mt-2 text-lg">
                Or call us directly at (415) 689-4428
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 text-center">
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <PE_Logo />
                <div className="text-left">
                  <div className="font-bold text-white text-xl tracking-tight">Pacific Engineering</div>
                  <div className="text-xs text-cyan-500 font-medium tracking-wide uppercase">& Construction Inc.</div>
                </div>
              </div>
              <p className="mb-6 max-w-sm leading-relaxed">
                Premium engineering, testing, and construction services for the San Francisco Bay Area. Licensed, integrated, and reliable.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 flex items-center justify-center rounded-sm transition-colors text-white">
                  <span className="font-ibm font-bold">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 flex items-center justify-center rounded-sm transition-colors text-white">
                  <span className="font-ibm font-bold">f</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col items-center">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-3 w-full">
                {["Home", "About Us", "Services", "Projects", "Client Portal", "Contact"].map(link => (
                  <li key={link}><a href="#" className="hover:text-cyan-400 transition-colors inline-block">{link}</a></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4 flex flex-col items-center">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
              <ul className="space-y-4 w-full flex flex-col items-center">
                <li className="flex flex-col items-center gap-2">
                  <Icon3DSmall icon={MapPin} gradientClass="from-cyan-600 to-blue-700" />
                  <span>1234 Engineering Blvd, Suite 100<br/>San Francisco, CA 94107</span>
                </li>
                <li className="flex flex-col items-center gap-2 mt-2">
                  <Icon3DSmall icon={Phone} gradientClass="from-cyan-600 to-blue-700" />
                  <a href="tel:4156894428" className="hover:text-cyan-400 text-lg font-medium">(415) 689-4428</a>
                </li>
                <li className="flex flex-col items-center gap-2 mt-2">
                  <Icon3DSmall icon={Mail} gradientClass="from-cyan-600 to-blue-700" />
                  <a href="mailto:info@pacificengineering.com" className="hover:text-cyan-400">info@pacificengineering.com</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Pacific Engineering & Construction Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- FLOATING ACTIONS --- */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
        <button className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-none shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:-translate-y-1 transition-transform border border-cyan-400/50">
          <MessageCircle className="w-6 h-6" />
        </button>
        
        <button 
          onClick={scrollToTop}
          className={`w-14 h-14 bg-slate-800 text-white rounded-none shadow-lg flex items-center justify-center hover:bg-slate-700 transition-all duration-300 border border-slate-600 ${
            showScrollTop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>

      {/* --- MOBILE STICKY BAR --- */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 flex shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <a href="tel:4156894428" className="flex-1 py-4 flex items-center justify-center gap-2 text-cyan-400 font-bold border-r border-slate-800">
          <Phone className="w-5 h-5" /> Call
        </a>
        <button className="flex-1 py-4 flex items-center justify-center gap-2 text-white bg-orange-600 font-bold">
          <PhoneCall className="w-5 h-5" /> Get Quote
        </button>
      </div>

    </div>
  );
}
