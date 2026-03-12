import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Shield,
  Ruler,
  ClipboardCheck,
  Droplets,
  Phone,
  PhoneCall,
  Clock,
  Target,
  FileText,
  HardHat,
  ArrowRight,
  Menu,
  X,
  Award,
  Building2,
  Users
} from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
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
  direction = "up" 
}: {
  children: React.ReactNode; 
  className?: string; 
  delay?: number; 
  direction?: "up" | "left" | "right";
}) {
  const { ref, inView } = useInView(0.1);
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  
  const transform = direction === "up" ? "translateY(40px)" : direction === "left" ? "translateX(-40px)" : "translateX(40px)";
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView || prefersReducedMotion ? 1 : 0,
        transform: inView || prefersReducedMotion ? "none" : transform,
        transition: prefersReducedMotion ? "none" : `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
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
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

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

const SERVICES = [
  {
    icon: Shield,
    title: "Construction Service",
    desc: "Fully licensed for any project from residential additions to public and governmental infrastructure.",
    items: ["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"],
    color: "blue" as const,
  },
  {
    icon: Ruler,
    title: "Engineering Consulting",
    desc: "Professional expertise across civil and structural disciplines with innovative project solutions.",
    items: ["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management"],
    color: "cyan" as const,
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Testing",
    desc: "Thorough inspections ensuring ongoing compliance with actionable improvement recommendations.",
    items: ["Structural Systems Inspections", "Stormwater Testing", "Materials Sampling & Testing", "Environmental Compliance"],
    color: "teal" as const,
  },
  {
    icon: Droplets,
    title: "Stormwater Planning",
    desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance.",
    items: ["PE/QSD/QSP site assessment", "BMP design & maintenance", "Clear documentation", "Federal/state/local compliance"],
    color: "emerald" as const,
  },
];

const PROCESS_STEPS = [
  { icon: Phone, title: "Initial Contact", desc: "Call or request a quote — we respond same-day to discuss your project needs." },
  { icon: Target, title: "Site Assessment", desc: "Our licensed engineers evaluate your site conditions and project requirements." },
  { icon: FileText, title: "Proposal & Plans", desc: "Detailed scope, timeline, and engineering plans tailored to your project." },
  { icon: HardHat, title: "Execution", desc: "Our integrated team handles engineering, inspections, and construction." },
];

const TRUST_BADGES = [
  { icon: Award, value: 40, suffix: "+", label: "Years in Business" },
  { icon: Building2, value: 2500, suffix: "+", label: "Projects Completed" },
  { icon: Users, value: 50, suffix: "+", label: "Expert Professionals" },
  { icon: Shield, value: 100, suffix: "%", label: "Fully Licensed & Insured" },
];

const focusClasses = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500 focus-visible:ring-offset-4";
const focusClassesDark = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950";

export function ReadabilityMax() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-cyan-200 selection:text-cyan-900">
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <span className="font-bold text-xl tracking-tight">Menu</span>
            <button 
              onClick={() => setMenuOpen(false)} 
              className={`p-4 -mr-4 rounded-lg bg-slate-800 text-white hover:bg-slate-700 min-w-[48px] min-h-[48px] flex items-center justify-center ${focusClassesDark}`}
              aria-label="Close Menu"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          <nav className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
            {["Home", "Services", "Process", "Why Us", "Contact"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(" ", "-")}`} 
                className={`text-2xl font-bold text-slate-100 py-4 border-b border-slate-800 min-h-[48px] flex items-center ${focusClassesDark}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Header */}
      <header className="absolute top-0 w-full z-40 bg-slate-950 border-b border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-700">
              <img 
                src="/__mockup/images/pe-logo.png" 
                alt="Pacific Engineering Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-black text-slate-900">PE</span>';
                }}
              />
            </div>
            <div>
              <div className="text-white font-bold text-xl md:text-2xl">Pacific Engineering</div>
              <div className="text-cyan-400 font-medium text-base hidden sm:block">Consulting Engineers & Contractors</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="tel:4156894428" 
              className={`hidden lg:flex items-center gap-3 text-white font-bold text-lg px-6 py-4 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700 min-h-[48px] ${focusClassesDark}`}
              aria-label="Call us at (415) 689-4428"
            >
              <Phone className="w-6 h-6 text-cyan-400" aria-hidden="true" />
              (415) 689-4428
            </a>
            <button 
              className={`lg:hidden p-4 rounded-xl bg-slate-800 text-white hover:bg-slate-700 min-w-[48px] min-h-[48px] flex items-center justify-center ${focusClassesDark}`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
              aria-expanded={menuOpen}
            >
              <Menu className="w-8 h-8" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative pt-40 pb-20 sm:pt-48 sm:pb-28 md:pt-56 md:pb-36 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/90 z-10" />
          {/* Placeholder for video background to ensure contrast */}
          <div className="absolute inset-0 bg-slate-900 z-0" /> 
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-10">
          <AnimatedSection>
            <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 shadow-2xl max-w-5xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8">
                Pacific Engineering <br />
                <span className="text-cyan-400">& Construction Inc.</span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-slate-100 font-medium leading-relaxed mb-12 max-w-3xl">
                Bay Area Consulting Engineers & Contractors
              </p>
              
              <p className="text-lg sm:text-xl text-slate-300 font-bold leading-relaxed mb-12 flex flex-wrap gap-4 items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <span>Same-day response</span>
                <span className="hidden sm:inline" aria-hidden="true">•</span>
                <span>No obligations</span>
                <span className="hidden sm:inline" aria-hidden="true">•</span>
                <span>40+ years Bay Area expertise</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <a 
                  href="#contact"
                  className={`inline-flex items-center justify-center gap-4 text-white font-bold text-xl sm:text-2xl px-10 py-6 rounded-2xl bg-orange-600 hover:bg-orange-700 transition-colors shadow-lg min-h-[64px] ${focusClassesDark}`}
                >
                  <PhoneCall className="w-8 h-8" aria-hidden="true" />
                  Request a Quote
                </a>
                <a 
                  href="#services"
                  className={`inline-flex items-center justify-center gap-4 text-white font-bold text-xl sm:text-2xl px-10 py-6 rounded-2xl bg-cyan-700 hover:bg-cyan-800 transition-colors border-2 border-cyan-500 shadow-lg min-h-[64px] ${focusClassesDark}`}
                >
                  Explore Services
                  <ArrowRight className="w-8 h-8" aria-hidden="true" />
                </a>
              </div>

              {/* Stats within Hero */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list" aria-label="Company Statistics">
                <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-8 text-center" role="listitem">
                  <div className="text-white font-extrabold text-5xl mb-4">
                    <AnimatedCounter target={40} suffix="+" />
                  </div>
                  <div className="text-slate-100 font-bold text-xl">Years Experience</div>
                </div>
                <div className="bg-cyan-900 border-2 border-cyan-500 rounded-2xl p-8 text-center shadow-lg" role="listitem">
                  <div className="text-white font-extrabold text-3xl sm:text-4xl mb-4 leading-tight">Full-Service</div>
                  <div className="text-cyan-100 font-bold text-xl">Vertically Integrated</div>
                </div>
                <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-8 text-center" role="listitem">
                  <div className="text-white font-extrabold text-3xl sm:text-4xl mb-4 leading-tight">Full-Scale</div>
                  <div className="text-slate-100 font-bold text-xl">Res, Comm & Infra</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 2. Services Section */}
      <section id="services" className="py-20 sm:py-28 md:py-36 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimatedSection className="mb-16 md:mb-24 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
              Our Core Services
            </h2>
            <p className="text-xl sm:text-2xl text-slate-800 font-medium max-w-4xl mx-auto leading-relaxed">
              Full-scale engineering and construction by our in-house teams of Engineers, QSD/QSPs, and construction experts.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12" role="list" aria-label="Services List">
            {SERVICES.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <AnimatedSection key={svc.title} delay={idx * 0.1}>
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8 sm:p-12 hover:border-slate-400 hover:bg-slate-100 transition-colors h-full flex flex-col" role="listitem">
                    <div className="flex items-start gap-8 mb-8">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                        <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                          {svc.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-xl sm:text-2xl text-slate-800 leading-relaxed mb-10 flex-1">
                      {svc.desc}
                    </p>
                    
                    <ul className="space-y-6 bg-white p-8 border border-slate-200 rounded-2xl" aria-label={`Features of ${svc.title}`}>
                      {svc.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-6 text-slate-900">
                          <CheckCircle className="w-8 h-8 text-slate-700 shrink-0 mt-1" aria-hidden="true" />
                          <span className="font-bold text-xl leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Process Section */}
      <section id="process" className="py-20 sm:py-28 md:py-36 bg-slate-50 border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimatedSection className="mb-16 md:mb-24 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
              Our Simple Process
            </h2>
            <p className="text-xl sm:text-2xl text-slate-800 font-medium max-w-4xl mx-auto leading-relaxed">
              From First Call to Final Inspection, we keep things clear and professional.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" role="list" aria-label="Process Steps">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={step.title} delay={idx * 0.1}>
                  <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-10 h-full relative" role="listitem">
                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-slate-900 text-white font-extrabold text-3xl rounded-2xl flex items-center justify-center shadow-lg border-4 border-slate-50" aria-label={`Step ${idx + 1}`}>
                      {idx + 1}
                    </div>
                    
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-8 mx-auto mt-4">
                      <Icon className="w-10 h-10 text-slate-900" aria-hidden="true" />
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 text-center leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg sm:text-xl text-slate-800 leading-relaxed text-center font-medium">
                      {step.desc}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section id="why-us" className="py-20 sm:py-28 md:py-36 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-10 leading-tight">
                Why Partner With Pacific Engineering?
              </h2>
              
              <ul className="space-y-10" role="list">
                <li className="flex gap-8" role="listitem">
                  <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 mt-2">
                    <Shield className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Complete Accountability</h3>
                    <p className="text-xl text-slate-800 leading-relaxed font-medium">By keeping engineering and construction under one roof, we eliminate finger-pointing. We design it, we build it, we guarantee it.</p>
                  </div>
                </li>
                <li className="flex gap-8" role="listitem">
                  <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 mt-2">
                    <Clock className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Rapid Response</h3>
                    <p className="text-xl text-slate-800 leading-relaxed font-medium">Time is money in construction. We guarantee same-day responses to all inquiries and quick turnaround on documentation.</p>
                  </div>
                </li>
                <li className="flex gap-8" role="listitem">
                  <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 mt-2">
                    <Award className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Unmatched Expertise</h3>
                    <p className="text-xl text-slate-800 leading-relaxed font-medium">Over 40 years of specialized experience in the Bay Area handling complex soils, seismic requirements, and strict municipal codes.</p>
                  </div>
                </li>
              </ul>
            </AnimatedSection>
            
            <AnimatedSection direction="right" className="relative">
              <div className="bg-slate-200 rounded-3xl overflow-hidden border-4 border-slate-300 shadow-2xl relative aspect-[4/3]">
                {/* Fallback pattern if image is missing */}
                <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
                   <Building2 className="w-32 h-32 text-slate-400" aria-hidden="true" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1541888086225-2cb33be2447d?auto=format&fit=crop&q=80&w=1200" 
                  alt="Construction professionals looking at plans on a job site" 
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              </div>
              
              <div className="absolute -bottom-10 -left-10 sm:-left-16 bg-slate-900 border-4 border-white p-8 sm:p-10 rounded-3xl shadow-2xl z-20 max-w-xs">
                <div className="text-5xl sm:text-6xl font-extrabold text-white mb-4">2,500+</div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 leading-tight">Successful Projects in the Bay Area</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 5. Trust Badges Section */}
      <section className="py-20 sm:py-28 md:py-36 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8">Trusted by Bay Area Developers</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list" aria-label="Company Statistics">
            {TRUST_BADGES.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="bg-slate-800 border-2 border-slate-700 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center justify-center" role="listitem">
                  <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mb-8">
                    <Icon className="w-10 h-10 text-cyan-400" aria-hidden="true" />
                  </div>
                  <div className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
                    <AnimatedCounter target={badge.value} suffix={badge.suffix} />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-300">
                    {badge.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section id="contact" className="relative py-28 sm:py-36 md:py-48 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1600" 
            alt="Structural blueprints background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <AnimatedSection>
            <div className="bg-slate-900 border-4 border-slate-700 rounded-3xl p-10 sm:p-16 md:p-20 shadow-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-10 leading-tight">
                Ready to Start Your Project?
              </h2>
              <p className="text-2xl sm:text-3xl text-slate-200 mb-16 font-medium leading-relaxed">
                Call us today for a same-day response and consultation with a licensed expert.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                <a 
                  href="tel:4156894428" 
                  className={`inline-flex items-center justify-center gap-4 text-white font-bold text-2xl sm:text-3xl px-12 py-8 rounded-2xl bg-orange-600 hover:bg-orange-700 transition-colors shadow-lg min-h-[80px] w-full sm:w-auto ${focusClassesDark}`}
                >
                  <Phone className="w-8 h-8" aria-hidden="true" />
                  (415) 689-4428
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t-4 border-slate-800 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-700">
                  <img 
                    src="/__mockup/images/pe-logo.png" 
                    alt="Pacific Engineering Logo" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-black text-slate-900">PE</span>';
                    }}
                  />
                </div>
                <div className="text-white font-bold text-2xl">Pacific Engineering</div>
              </div>
              <p className="text-xl leading-relaxed font-medium mb-8 max-w-md">
                Bay Area Consulting Engineers & Contractors. Setting the standard for quality and reliability.
              </p>
              <p className="text-lg font-bold text-slate-400">
                California License #123456
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-white font-bold text-2xl mb-4">Contact Information</h3>
              <a href="tel:4156894428" className={`flex items-center gap-4 text-xl hover:text-white transition-colors w-fit ${focusClassesDark} rounded-lg`}>
                <Phone className="w-8 h-8 text-cyan-400" aria-hidden="true" />
                (415) 689-4428
              </a>
              <div className="flex items-center gap-4 text-xl">
                <Clock className="w-8 h-8 text-cyan-400" aria-hidden="true" />
                Mon-Fri: 8:00 AM - 5:00 PM
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-10 text-center">
            <p className="text-lg font-medium text-slate-500">
              © {new Date().getFullYear()} Pacific Engineering & Construction Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ReadabilityMax;