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
  ChevronRight,
  MousePointerClick,
  Info
} from "lucide-react";

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

function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
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
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
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

function BlueprintGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:12px_12px]" />
    </div>
  );
}

const SERVICES = [
  {
    icon: Shield,
    title: "Construction Service",
    desc: "Fully licensed for any project from residential additions to public and governmental infrastructure.",
    items: [
      "Class A License",
      "Class B License",
      "Infrastructure & Public Works",
      "Residential, Commercial & Municipal",
    ],
    color: "blue" as const,
  },
  {
    icon: Ruler,
    title: "Engineering Consulting",
    desc: "Professional expertise across civil and structural disciplines with innovative project solutions.",
    items: [
      "Civil Engineering Consulting",
      "Structural Consulting",
      "Site Assessment & Design",
      "Development Management",
    ],
    color: "cyan" as const,
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Testing",
    desc: "Thorough inspections ensuring ongoing compliance with actionable improvement recommendations.",
    items: [
      "Structural Systems Inspections",
      "Stormwater Testing",
      "Materials Sampling & Testing",
      "Environmental Compliance",
    ],
    color: "teal" as const,
  },
  {
    icon: Droplets,
    title: "Stormwater Planning",
    desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance.",
    items: [
      "PE/QSD/QSP site assessment",
      "BMP design & maintenance",
      "Clear documentation",
      "Federal/state/local compliance",
    ],
    color: "emerald" as const,
  },
];

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    hoverBg: "group-hover:from-blue-500 group-hover:to-blue-700",
    icon: "text-blue-600",
    check: "text-blue-500",
    border: "border-blue-200 group-hover:border-blue-500",
    btn: "bg-blue-600 hover:bg-blue-700 border-blue-700",
    btnText: "text-blue-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    hoverBg: "group-hover:from-cyan-500 group-hover:to-blue-600",
    icon: "text-cyan-600",
    check: "text-cyan-500",
    border: "border-cyan-200 group-hover:border-cyan-500",
    btn: "bg-cyan-600 hover:bg-cyan-700 border-cyan-700",
    btnText: "text-cyan-600",
  },
  teal: {
    bg: "bg-teal-50",
    hoverBg: "group-hover:from-teal-500 group-hover:to-cyan-600",
    icon: "text-teal-600",
    check: "text-teal-500",
    border: "border-teal-200 group-hover:border-teal-500",
    btn: "bg-teal-600 hover:bg-teal-700 border-teal-700",
    btnText: "text-teal-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    hoverBg: "group-hover:from-emerald-500 group-hover:to-teal-600",
    icon: "text-emerald-600",
    check: "text-emerald-500",
    border: "border-emerald-200 group-hover:border-emerald-500",
    btn: "bg-emerald-600 hover:bg-emerald-700 border-emerald-700",
    btnText: "text-emerald-600",
  },
};

const PROCESS_STEPS = [
  {
    icon: Phone,
    title: "Initial Contact",
    desc: "Call or request a quote — we respond same-day to discuss your project needs.",
  },
  {
    icon: Target,
    title: "Site Assessment",
    desc: "Our licensed engineers evaluate your site conditions and project requirements.",
  },
  {
    icon: FileText,
    title: "Proposal & Plans",
    desc: "Detailed scope, timeline, and engineering plans tailored to your project.",
  },
  {
    icon: HardHat,
    title: "Execution",
    desc: "Our integrated team handles engineering, inspections, and construction.",
  },
];

export function AffordanceForward() {
  const [activeSection, setActiveSection] = useState("hero");
  const [processOpen, setProcessOpen] = useState<number | null>(null);
  
  // Track scroll for floating nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "services", "process", "why-us", "cta"];
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-500/30">
      {/* Floating Side Nav */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {[
          { id: "hero", label: "Home" },
          { id: "services", label: "Services" },
          { id: "process", label: "Process" },
          { id: "why-us", label: "Why Us" },
          { id: "cta", label: "Contact" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center justify-end"
            aria-label={`Scroll to ${item.label}`}
          >
            <span className="absolute right-8 px-2 py-1 rounded bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Click to go to {item.label}
            </span>
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                activeSection === item.id
                  ? "bg-cyan-500 border-cyan-500 scale-125"
                  : "bg-transparent border-slate-400 hover:border-cyan-400"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Header Context Indicator */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-transform">
              <img
                src="/__mockup/images/pe-logo.png"
                alt="Pacific Engineering"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBFPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs text-cyan-400 font-bold tracking-wider uppercase mb-0.5">You are here: Home</div>
              <div className="text-white font-bold text-lg leading-none">Pacific Engineering & Construction Inc.</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="tel:4156894428"
              className="group hidden sm:flex items-center gap-2 text-white hover:text-cyan-400 transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5"
            >
              <div className="bg-cyan-500/20 p-2 rounded-full group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-bold border-b border-dashed border-cyan-500/50 group-hover:border-cyan-400 pb-0.5">
                (415) 689-4428
              </span>
            </a>
            
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 shadow-md transition-all hover:scale-105 active:scale-95 group">
              <Menu className="w-5 h-5 group-hover:text-cyan-400" />
              <span className="font-bold uppercase text-sm group-hover:underline underline-offset-4">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply z-10" />
          <BlueprintGrid />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 z-10" />
        </div>

        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-sm mb-8 cursor-help hover:bg-cyan-500/20 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              40+ Years Bay Area Expertise
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Consulting Engineers <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                & Contractors
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-medium">
              Same-day response · No obligations · Expert solutions
            </p>

            {/* HERO CTAS - Affordance Forward */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="group relative inline-flex items-center justify-center gap-3 bg-orange-600 text-white font-black text-lg md:text-xl py-5 px-10 rounded-xl border-2 border-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:bg-orange-500 hover:shadow-[0_12px_40px_rgba(249,115,22,0.6)] hover:-translate-y-1 active:translate-y-1 active:scale-95 transition-all overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <div className="absolute -inset-2 rounded-xl bg-orange-400/30 animate-pulse" />
                <PhoneCall className="w-6 h-6 relative z-10" />
                <span className="relative z-10 underline decoration-2 underline-offset-4 decoration-orange-300/50 group-hover:decoration-white">Request a Quote</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>

              <button className="group inline-flex items-center justify-center gap-3 bg-slate-800 text-white font-bold text-lg md:text-xl py-5 px-10 rounded-xl border-2 border-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-slate-700 hover:border-cyan-400 hover:text-cyan-50 hover:-translate-y-1 active:translate-y-1 active:scale-95 transition-all cursor-pointer">
                <Clock className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
                <span className="underline decoration-2 underline-offset-4 decoration-slate-500 group-hover:decoration-cyan-400">Schedule a Consult</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
              {[
                { label: "Years Experience", val: 40, suffix: "+" },
                { label: "Vertically Integrated", text: "Full-Service", highlight: true },
                { label: "Res/Comm/Infra", text: "Full-Scale" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`group p-6 rounded-2xl border-2 flex flex-col items-center justify-center cursor-default transition-all hover:-translate-y-2 hover:shadow-xl ${
                    stat.highlight
                      ? "bg-slate-800/80 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:bg-slate-800"
                      : "bg-slate-900/60 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    {stat.val ? <AnimatedCounter target={stat.val} suffix={stat.suffix} /> : stat.text}
                  </div>
                  <div className="text-sm font-bold text-cyan-400 uppercase tracking-widest text-center group-hover:text-cyan-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Prominent Scroll Indicator */}
        <button 
          onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group z-20"
        >
          <span className="text-white font-bold text-sm tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity bg-slate-900/50 px-4 py-1.5 rounded-full border border-white/10 group-hover:border-cyan-400/50">
            Scroll to Explore
          </span>
          <div className="w-10 h-16 rounded-full border-2 border-white/30 group-hover:border-cyan-400 flex items-start justify-center p-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all bg-slate-900/30">
            <div className="w-2 h-4 bg-cyan-400 rounded-full animate-bounce mt-1 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </button>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-24 px-4 sm:px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">What We Do</h2>
            <div className="w-24 h-2 bg-cyan-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Full-scale engineering and construction by our in-house teams.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {SERVICES.map((svc, idx) => {
              const c = colorMap[svc.color];
              const Icon = svc.icon;
              return (
                <AnimatedSection key={idx} delay={idx * 0.1}>
                  <div className={`group relative bg-white rounded-2xl border-2 border-slate-200 hover:${c.border} shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 h-full flex flex-col cursor-pointer overflow-hidden transform hover:-translate-y-2`}>
                    
                    {/* Visual affordance for clickability */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 p-2 rounded-full">
                      <MousePointerClick className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <div className={`w-20 h-20 rounded-2xl ${c.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white`}>
                        <Icon className={`w-10 h-10 ${c.icon} group-hover:animate-bounce`} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-cyan-700 transition-colors flex items-center gap-2">
                        {svc.title}
                      </h3>
                      
                      <p className="text-slate-600 mb-8 text-lg leading-relaxed flex-1">
                        {svc.desc}
                      </p>
                      
                      <ul className="space-y-3 mb-8">
                        {svc.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className={`w-6 h-6 ${c.check} shrink-0`} />
                            <span className="font-medium text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Explicit Button Affordance */}
                    <div className="p-6 bg-slate-50 border-t-2 border-slate-100 group-hover:bg-slate-100 transition-colors mt-auto">
                      <button className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${c.btnText} bg-white border-2 ${c.border} group-hover:${c.btn} group-hover:text-white shadow-sm`}>
                        Learn More About {svc.title.split(" ")[0]}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PROCESS SECTION */}
      <section id="process" className="py-24 px-4 sm:px-6 bg-slate-100 border-y-2 border-slate-200">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Our Process</h2>
            <div className="w-24 h-2 bg-blue-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Click any step to reveal detailed information about how we work.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-2 bg-slate-300 rounded-full z-0 overflow-hidden">
              <div className="h-full w-full bg-[linear-gradient(90deg,transparent_50%,rgba(6,182,212,0.5)_50%)] bg-[length:20px_100%] animate-[flow_1s_linear_infinite]" />
              <style>{`@keyframes flow { to { background-position: -20px 0; } }`}</style>
            </div>

            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isOpen = processOpen === idx;
              return (
                <AnimatedSection key={idx} delay={idx * 0.1} className="relative z-10">
                  <button 
                    onClick={() => setProcessOpen(isOpen ? null : idx)}
                    className={`w-full text-left bg-white rounded-2xl p-6 border-2 transition-all duration-300 group shadow-md hover:shadow-xl ${
                      isOpen ? "border-cyan-500 ring-4 ring-cyan-500/20 scale-105" : "border-slate-200 hover:border-cyan-300 hover:-translate-y-1"
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto transition-colors border-4 ${
                      isOpen ? "bg-cyan-500 border-cyan-100 text-white" : "bg-slate-100 border-white text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-600"
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">Step {idx + 1}</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                      
                      <div className="inline-flex items-center justify-center gap-2 text-sm font-bold text-cyan-600 bg-cyan-50 px-4 py-2 rounded-full border border-cyan-100 group-hover:bg-cyan-100">
                        {isOpen ? "Close Details" : "Tap for Details"}
                        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : "group-hover:translate-x-1"}`} />
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <div className={`grid transition-all duration-300 overflow-hidden ${isOpen ? "grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t-2 border-slate-100" : "grid-rows-[0fr] opacity-0 mt-0 pt-0 border-transparent"}`}>
                      <div className="min-h-0">
                        <p className="text-slate-600 font-medium leading-relaxed text-center">{step.desc}</p>
                      </div>
                    </div>
                  </button>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section id="why-us" className="py-24 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Why Partner With <br/>
                <span className="text-cyan-600">Pacific Engineering?</span>
              </h2>
              <p className="text-xl text-slate-600 mb-10 font-medium leading-relaxed">
                We combine the technical precision of an engineering firm with the practical execution capabilities of a licensed contractor.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  "Single point of contact for design and build",
                  "In-house materials testing and special inspections",
                  "Faster permitting with permit-ready designs"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-colors group cursor-default">
                    <div className="bg-cyan-500 p-1.5 rounded-full text-white mt-1 shadow-sm group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="relative group inline-flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500 hover:shadow-[0_8px_25px_rgba(6,182,212,0.5)] border-2 border-cyan-400 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer">
                  <FileText className="w-5 h-5" />
                  <span className="underline decoration-2 underline-offset-4 decoration-cyan-300 group-hover:decoration-white">Scope Your Project</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  
                  {/* Tooltip affordance */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    <Info className="w-3 h-3 text-cyan-400" />
                    Free consultation
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                </button>
                <button className="group inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold text-lg py-4 px-8 rounded-xl shadow-sm border-2 border-slate-300 hover:border-slate-500 hover:bg-slate-50 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer">
                  <span className="underline decoration-2 underline-offset-4 decoration-slate-300 group-hover:decoration-slate-500">About Our Team</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white group cursor-pointer">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop" 
                  alt="Construction Site" 
                  className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Visual click affordance on image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur px-6 py-3 rounded-full font-bold text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <MousePointerClick className="w-5 h-5 text-cyan-600" />
                  View Gallery
                </div>

                <div className="absolute bottom-8 -left-8 z-20 bg-white p-6 rounded-2xl shadow-2xl border-2 border-slate-100 animate-[bounce_4s_infinite] group-hover:border-cyan-400 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-slate-900">2,500+</div>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Projects Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 5. TRUST BADGES */}
      <section className="py-16 bg-slate-900 border-y-4 border-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, label: "Licensed Engineers" },
              { icon: Shield, label: "Fully Insured" },
              { icon: Building2, label: "Class A & B" },
              { icon: Droplets, label: "QSD / QSP Certified" },
            ].map((badge, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <div className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border-2 border-white/10 hover:border-cyan-400 hover:bg-white/10 transition-all cursor-default">
                  <badge.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform group-hover:text-white" />
                  <span className="text-white font-bold text-center uppercase tracking-wider text-sm group-hover:text-cyan-200">{badge.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section id="cta" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Ready to start your project?
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              Contact us today for a free consultation and project scope assessment.
            </p>
            
            <button className="group relative inline-flex items-center justify-center gap-3 bg-cyan-600 text-white font-black text-xl py-6 px-12 rounded-2xl border-4 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:bg-cyan-500 hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-2 active:translate-y-1 active:scale-95 transition-all overflow-hidden cursor-pointer w-full sm:w-auto">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <PhoneCall className="w-8 h-8 relative z-10 animate-pulse" />
              <span className="relative z-10 underline decoration-4 underline-offset-8 decoration-cyan-300/50 group-hover:decoration-white uppercase tracking-wider">
                Call (415) 689-4428
              </span>
            </button>

            <div className="mt-8 inline-flex items-center gap-2 text-cyan-300 bg-cyan-900/50 px-6 py-3 rounded-full border border-cyan-500/30">
              <Clock className="w-5 h-5" />
              <span className="font-bold tracking-wide uppercase text-sm">We respond within 24 hours</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* MOBILE STICKY BAR - Haptic focus */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-slate-700 p-4 sm:hidden pb-safe animate-[slideUp_0.3s_ease-out]">
        <div className="flex gap-3">
          <a href="tel:4156894428" className="flex-1 py-4 rounded-xl bg-slate-800 border-2 border-slate-600 text-white font-bold text-center flex justify-center items-center gap-2 active:bg-slate-700 active:scale-95 transition-all">
            <Phone className="w-5 h-5 text-cyan-400" />
            <span className="underline decoration-slate-500">Call</span>
          </a>
          <button className="flex-[2] py-4 rounded-xl bg-orange-600 border-2 border-orange-400 text-white font-bold text-center flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] active:bg-orange-700 active:scale-95 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <PhoneCall className="w-5 h-5 relative z-10" />
            <span className="relative z-10 underline decoration-orange-300">Get Quote</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
      `}</style>
    </div>
  );
}
