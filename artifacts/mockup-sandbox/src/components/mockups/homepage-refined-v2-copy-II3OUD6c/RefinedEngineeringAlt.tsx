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
  Award
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
  
  @keyframes beamWave {
    0% { transform: translateX(-100%) rotate(-15deg); opacity: 0; }
    30% { opacity: 0.6; }
    70% { opacity: 0.6; }
    100% { transform: translateX(200vw) rotate(15deg); opacity: 0; }
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

// --- HERO BACKGROUNDS ---
function SitePlanOverlay() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ animation: "blueprintPulse 12s infinite ease-in-out" }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-70 stroke-cyan-500">
        <pattern id="siteGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#siteGrid)" />
        
        {/* Site Plan Elements */}
        <g strokeWidth="1" fill="none">
          {/* Property Boundary */}
          <path d="M 10%,20% L 80%,15% L 90%,85% L 15%,90% Z" strokeDasharray="10,5" strokeWidth="2" />
          
          {/* Building Footprint */}
          <rect x="30%" y="35%" width="40%" height="30%" />
          <path d="M 30%,35% L 70%,65% M 70%,35% L 30%,65%" opacity="0.5" />
          
          {/* Dimensions */}
          <line x1="30%" y1="32%" x2="70%" y2="32%" />
          <path d="M 30%,30% L 30%,34% M 70%,30% L 70%,34%" />
          <text x="50%" y="30%" fill="currentColor" fontSize="12" textAnchor="middle" className="font-ibm">120.00'</text>
          
          <line x1="27%" y1="35%" x2="27%" y2="65%" />
          <path d="M 25%,35% L 29%,35% M 25%,65% L 29%,65%" />
          <text x="25%" y="50%" fill="currentColor" fontSize="12" textAnchor="middle" transform="rotate(-90, 25%, 50%)" className="font-ibm">85.50'</text>

          {/* Setbacks */}
          <path d="M 15%,25% L 75%,20% L 83%,80% L 20%,83% Z" strokeDasharray="4,4" opacity="0.5" />
          <text x="18%" y="50%" fill="currentColor" fontSize="10" className="font-ibm" opacity="0.7">15' SETBACK</text>

          {/* Utilities */}
          <path d="M 0%,50% L 30%,50%" strokeDasharray="6,2,2,2" stroke="orange" strokeWidth="1.5" opacity="0.8" />
          <text x="10%" y="48%" fill="orange" fontSize="10" className="font-ibm">ELEC/COM</text>
          
          <path d="M 50%,0% L 50%,35%" strokeDasharray="8,4" stroke="cyan" strokeWidth="1.5" opacity="0.8" />
          <text x="52%" y="15%" fill="cyan" fontSize="10" className="font-ibm">WATER/SS</text>
          
          {/* North Arrow */}
          <g transform="translate(50, 50)">
            <circle cx="0" cy="0" r="15" />
            <path d="M 0,-20 L 5,-5 L 0,-8 L -5,-5 Z" fill="currentColor" />
            <text x="0" y="5" fill="currentColor" fontSize="10" textAnchor="middle" className="font-ibm">N</text>
          </g>
          
          {/* Scale Bar */}
          <g transform="translate(50, 90%)">
            <line x1="0" y1="0" x2="100" y2="0" strokeWidth="2" />
            <line x1="0" y1="-3" x2="0" y2="3" />
            <line x1="25" y1="-3" x2="25" y2="0" />
            <line x1="50" y1="-3" x2="50" y2="3" />
            <line x1="100" y1="-3" x2="100" y2="3" />
            <text x="0" y="-8" fill="currentColor" fontSize="10" textAnchor="middle">0</text>
            <text x="50" y="-8" fill="currentColor" fontSize="10" textAnchor="middle">20'</text>
            <text x="100" y="-8" fill="currentColor" fontSize="10" textAnchor="middle">40'</text>
            <text x="50" y="12" fill="currentColor" fontSize="10" textAnchor="middle">GRAPHIC SCALE</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

function Beams() {
  const beams = [
    { height: "8px", top: "15%", duration: "16s", delay: "0s", color: "linear-gradient(90deg, transparent, rgba(6,182,212,0.8), transparent)" },
    { height: "10px", top: "35%", duration: "22s", delay: "3s", color: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" },
    { height: "6px", top: "55%", duration: "18s", delay: "1s", color: "linear-gradient(90deg, transparent, rgba(6,182,212,0.9), transparent)" },
    { height: "12px", top: "70%", duration: "25s", delay: "5s", color: "linear-gradient(90deg, transparent, rgba(37,99,235,0.7), transparent)" },
    { height: "7px", top: "85%", duration: "15s", delay: "2s", color: "linear-gradient(90deg, transparent, rgba(249,115,22,0.8), transparent)" }, // The single orange accent beam
    { height: "9px", top: "25%", duration: "20s", delay: "7s", color: "linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent)" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {beams.map((beam, i) => (
        <div
          key={i}
          className="absolute w-[80vw]"
          style={{
            height: beam.height,
            top: beam.top,
            background: beam.color,
            animation: `beamWave ${beam.duration} infinite ease-in-out ${beam.delay}`,
            filter: "blur(4px)"
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

export function RefinedEngineeringAlt() {
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
              <div className="dropdown-content absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 shadow-xl rounded-none py-2">
                {SERVICES.map(s => (
                  <a key={s.title} href={s.href} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                    {s.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="relative group py-2">
              <a href="#" className="text-sm font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-1">
                Company <ChevronDown className="w-4 h-4" />
              </a>
              <div className="dropdown-content absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 shadow-xl rounded-none py-2">
                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400">About Us</a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400">Our Team</a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400">Careers</a>
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
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950" />
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
              <div className="bg-slate-800/80 border-t-2 border-cyan-500 p-6 rounded-none flex flex-col items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] scale-105 z-10">
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
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
                <div className="group relative bg-white border border-slate-200 p-8 sm:p-10 shadow-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300 h-full flex flex-col items-center text-center">
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${svc.accent} opacity-80`} />
                  
                  <div className="mb-6">
                    <Icon3D icon={svc.icon} gradientClass={svc.gradient} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{svc.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">{svc.desc}</p>
                  
                  <div className="mt-auto w-full max-w-xs">
                    <ul className="space-y-3">
                      {svc.items.map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                          <span className="text-slate-700 font-medium text-sm text-left w-4/5">{item}</span>
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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-2 block">Our Workflow</span>
            <h2 className="text-white text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">From First Call to Final Inspection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 max-w-5xl mx-auto relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl pointer-events-none" />
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl pointer-events-none" />

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
                      <div className="mt-6 border border-slate-600 bg-slate-900/80 rounded-sm p-3 shadow-inner relative overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-[10px] text-slate-400 font-medium ml-2 uppercase tracking-wider">Client Portal</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-slate-700 rounded-full w-3/4" />
                          <div className="h-2 bg-slate-700 rounded-full w-1/2" />
                          <div className="h-2 bg-cyan-600/50 rounded-full w-full" />
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-slate-900 text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Why Partner With Pacific Engineering?
            </h2>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              We eliminate the disconnect between design and execution. By housing structural engineering, civil engineering, inspections, and full construction services under one roof, we dramatically reduce project timelines and prevent costly miscommunications. Your project stays on track, compliant, and structurally sound from day one.
            </p>
            
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
              { icon: Building2, value: "500+", label: "Projects Completed" },
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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8">
              Get Your Project on Track
            </h2>
            <p className="text-xl text-cyan-100 mb-10 font-light max-w-2xl mx-auto">
              Don't let engineering bottlenecks delay your timeline. Contact us today for a comprehensive evaluation and fast-track your next build.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xl rounded-none shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                Request a Quote Now
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-6">
                <PE_Logo />
                <div>
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

            <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-3 w-full">
                {["Home", "About Us", "Services", "Projects", "Client Portal", "Contact"].map(link => (
                  <li key={link}><a href="#" className="hover:text-cyan-400 transition-colors inline-block">{link}</a></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
              <ul className="space-y-4 w-full">
                <li className="flex items-start justify-center md:justify-start gap-3">
                  <div className="mt-1"><Icon3D icon={MapPin} gradientClass="from-cyan-600 to-blue-700" iconColorClass="text-white w-4 h-4" /></div>
                  <span>1234 Engineering Blvd, Suite 100<br/>San Francisco, CA 94107</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <Icon3D icon={Phone} gradientClass="from-cyan-600 to-blue-700" iconColorClass="text-white w-4 h-4" />
                  <a href="tel:4156894428" className="hover:text-cyan-400 text-lg font-medium">(415) 689-4428</a>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <Icon3D icon={Mail} gradientClass="from-cyan-600 to-blue-700" iconColorClass="text-white w-4 h-4" />
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
        
        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="w-14 h-14 bg-slate-800 text-white rounded-none shadow-lg flex items-center justify-center hover:bg-slate-700 transition-all border border-slate-600"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
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
