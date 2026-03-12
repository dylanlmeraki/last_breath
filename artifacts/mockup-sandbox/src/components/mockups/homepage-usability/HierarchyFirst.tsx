import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Phone,
  PhoneCall,
  Clock,
  Shield,
  Ruler,
  ClipboardCheck,
  Droplets,
  Target,
  FileText,
  HardHat,
  CheckCircle,
  Award,
  Star,
  Building2,
  Check,
  Menu,
  X
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
  direction?: "up" | "left" | "right" | "none";
}) {
  const { ref, inView } = useInView(0.1);
  const transform =
    direction === "up"
      ? "translateY(40px)"
      : direction === "left"
      ? "translateX(-40px)"
      : direction === "right"
      ? "translateX(40px)"
      : "none";
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

const SERVICES = [
  {
    icon: Shield,
    title: "Construction Service",
    desc: "Fully licensed for any project from residential additions to public and governmental infrastructure.",
    items: ["Class A & B Licenses", "Public Works & Infrastructure"],
    color: "blue" as const,
    href: "/construction",
  },
  {
    icon: Ruler,
    title: "Engineering Consulting",
    desc: "Professional expertise across civil and structural disciplines with innovative project solutions.",
    items: ["Civil & Structural Design", "Site Assessment & Planning"],
    color: "cyan" as const,
    href: "/structural-engineering",
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Testing",
    desc: "Thorough inspections ensuring ongoing compliance with actionable improvement recommendations.",
    items: ["Structural Systems", "Materials Sampling"],
    color: "teal" as const,
    href: "/inspections-testing",
  },
  {
    icon: Droplets,
    title: "Stormwater Planning",
    desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance.",
    items: ["PE/QSD/QSP Assessment", "Federal/State Compliance"],
    color: "emerald" as const,
    href: "/services",
  },
];

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    check: "text-blue-500",
    border: "border-blue-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    check: "text-cyan-500",
    border: "border-cyan-600",
  },
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    check: "text-teal-500",
    border: "border-teal-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    check: "text-emerald-500",
    border: "border-emerald-600",
  },
};

const PROCESS_STEPS = [
  {
    title: "Initial Contact",
    desc: "Call or request a quote — we respond same-day.",
  },
  {
    title: "Site Assessment",
    desc: "Engineers evaluate conditions & requirements.",
  },
  {
    title: "Proposal & Plans",
    desc: "Detailed scope, timeline, and engineering plans.",
  },
  {
    title: "Execution",
    desc: "Our team handles engineering, inspections, and construction.",
  },
];

export function HierarchyFirst() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md border-b border-slate-200" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20 sm:h-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xl overflow-hidden">
              <img src="/__mockup/images/pe-logo.png" alt="PE Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = 'PE'; }} />
            </div>
            <div>
              <div className={`font-bold tracking-tight text-lg sm:text-xl ${scrolled ? "text-slate-900" : "text-white"}`}>
                Pacific Engineering
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {["Services", "Process", "Why Us", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-sm font-semibold tracking-wide hover:text-cyan-500 transition-colors ${
                  scrolled ? "text-slate-700" : "text-white/90"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="tel:4156894428"
              className={`hidden md:flex items-center gap-2 font-bold ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              <Phone className="w-4 h-4 text-cyan-500" />
              (415) 689-4428
            </a>
            <button className="lg:hidden text-slate-900 p-2">
              <Menu className={`w-6 h-6 ${scrolled ? "text-slate-900" : "text-white"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-slate-950 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/80" />
          <img 
            src="https://images.unsplash.com/photo-1541888086925-920a0f9b6b72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Construction site" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimatedSection direction="none" className="max-w-4xl">
            {/* Tagline / Subtitle */}
            <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6">
              Bay Area Consulting Engineers & Contractors
            </p>
            
            {/* Title */}
            <h1 className="text-white font-extrabold tracking-tight leading-[1.1] text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-12">
              Pacific Engineering <br />
              <span className="text-slate-400">& Construction</span>
            </h1>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <button className="inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-5 rounded-sm transition-colors">
                <PhoneCall className="w-5 h-5" />
                Request a Quote
              </button>
              <button className="inline-flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg px-10 py-5 rounded-sm transition-colors">
                <Clock className="w-5 h-5 text-cyan-600" />
                Schedule a Consult
              </button>
            </div>

            {/* Trust Line */}
            <p className="text-slate-300 font-medium text-lg border-l-4 border-cyan-500 pl-4 mb-16">
              Same-day response · No obligations · 40+ years Bay Area expertise
            </p>
            
            {/* Stats (Subordinate) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter target={40} suffix="+" />
                </div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">Full-Service</div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">Vertically Integrated</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-white mb-1">Full-Scale</div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">Res / Comm / Infra</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-24 lg:py-32 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Comprehensive engineering and construction delivered by our in-house experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {SERVICES.map((svc, idx) => {
              const c = colorMap[svc.color];
              const Icon = svc.icon;
              return (
                <div key={svc.title} className="flex flex-col h-full bg-slate-50 rounded-sm p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-sm ${c.bg}`}>
                      <Icon className={`w-6 h-6 ${c.icon}`} />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                      {svc.title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    {svc.desc}
                  </p>
                  
                  <ul className="space-y-4 mb-10 flex-1">
                    {svc.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 mt-0.5 ${c.icon}`} />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <a href={svc.href} className={`inline-flex items-center gap-2 font-bold text-lg ${c.icon} hover:opacity-80 transition-opacity`}>
                      Learn more <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PROCESS SECTION */}
      <section className="py-24 lg:py-32 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-slate-600">From first call to final inspection in four steps.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-1 bg-slate-200" />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {PROCESS_STEPS.map((step, idx) => (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white border-4 border-cyan-500 rounded-full flex items-center justify-center text-2xl font-black text-slate-900 mb-6 z-10">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION */}
      <section className="py-24 lg:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-12">
                Why Partner With Us?
              </h2>
              
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Decades of Local Expertise</h3>
                    <p className="text-lg text-slate-600">Over 40 years of navigating Bay Area regulations, soil conditions, and construction challenges.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Integrated Solutions</h3>
                    <p className="text-lg text-slate-600">One team for engineering, inspection, and construction means no finger-pointing and fewer delays.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Unmatched Responsiveness</h3>
                    <p className="text-lg text-slate-600">We prioritize clear communication and same-day responses to keep your project moving forward.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image / Stats Side */}
            <div className="flex flex-col gap-8">
              <img 
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Engineering blueprint" 
                className="w-full h-80 object-cover rounded-sm shadow-lg"
              />
              <div className="bg-slate-900 text-center p-10 rounded-sm">
                <div className="text-5xl font-black text-cyan-400 mb-2">2,500+</div>
                <div className="text-xl font-bold text-white uppercase tracking-wider">Completed Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST BADGES SECTION */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-cyan-500 mb-6" />
              <div className="text-2xl font-bold text-white mb-2">Licensed</div>
              <div className="text-slate-400">Class A & B Contractor</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-12 h-12 text-cyan-500 mb-6" />
              <div className="text-2xl font-bold text-white mb-2">Certified</div>
              <div className="text-slate-400">Professional Engineers</div>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-cyan-500 mb-6" />
              <div className="text-2xl font-bold text-white mb-2">Compliant</div>
              <div className="text-slate-400">QSD / QSP Certified</div>
            </div>
            <div className="flex flex-col items-center">
              <Building2 className="w-12 h-12 text-cyan-500 mb-6" />
              <div className="text-2xl font-bold text-white mb-2">Trusted</div>
              <div className="text-slate-400">Bay Area Authority</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541888086925-920a0f9b6b72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-8">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Get expert engineering and construction services tailored to your exact needs.
          </p>
          
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-12 py-6 rounded-sm transition-colors mb-8 shadow-xl">
            Request a Free Quote
          </button>
          
          <div>
            <p className="text-slate-400 text-lg">
              Or call us directly at <a href="tel:4156894428" className="text-white font-bold hover:text-cyan-400 transition-colors">(415) 689-4428</a>
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
