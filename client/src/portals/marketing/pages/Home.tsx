import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import {
  CheckCircle,
  FileText,
  ClipboardCheck,
  Shield,
  ArrowRight,
  Phone,
  PhoneCall,
  Users,
  Star,
  Award,
  Building2,
  HardHat,
  Ruler,
  Droplets,
  MapPin,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import SectionDivider from "../components/SectionDivider";
import SEO from "../components/SEO";
import ParticleField from "../components/ParticleField";
import FloatingElements from "../components/FloatingElements";

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

function BlueprintGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:12px_12px]" />
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `pe-float ${4 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      <style>{`@keyframes pe-float { 0% { transform: translateY(0px) scale(1); opacity: 0.3; } 100% { transform: translateY(-30px) scale(1.5); opacity: 0.6; } }`}</style>
    </div>
  );
}

function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-3 sm:hidden" data-testid="mobile-sticky-bar">
      <a href="tel:+14156894428" className="flex-1 py-3 rounded-lg bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-white/20 transition-colors" data-testid="btn-sticky-call">
        <Phone className="w-4 h-4 text-cyan-400" /> Call Now
      </a>
      <Link to={createPageUrl("Consultation")} className="flex-1 py-3 rounded-lg bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-orange-500 transition-colors shadow-md" data-testid="btn-sticky-quote">
        Free Consultation <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

const SERVICES = [
  {
    icon: Shield,
    title: "Construction Service",
    desc: "Fully licensed for any project from residential additions to public and governmental infrastructure.",
    items: ["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"],
    color: "orange" as const,
    page: "Construction",
  },
  {
    icon: Ruler,
    title: "Engineering Consulting",
    desc: "Professional expertise across civil and structural disciplines with innovative project solutions.",
    items: ["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management"],
    color: "cyan" as const,
    page: "StructuralEngineering",
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Testing",
    desc: "Thorough inspections ensuring ongoing compliance with actionable improvement recommendations.",
    items: ["Structural Systems Inspections", "Stormwater Testing", "Materials Sampling & Testing", "Environmental Compliance"],
    color: "blue" as const,
    page: "InspectionsTesting",
  },
  {
    icon: Droplets,
    title: "Stormwater Planning",
    desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance.",
    items: ["PE/QSD/QSP site assessment", "BMP design & maintenance", "Clear documentation", "Federal/state/local compliance"],
    color: "teal" as const,
    page: "Services",
  },
];

const colorMap = {
  orange: {
    bg: "bg-orange-100", hoverBg: "group-hover:from-orange-400 group-hover:to-orange-600",
    icon: "text-orange-600", check: "text-orange-500", border: "from-orange-500 to-amber-500",
    titleHover: "group-hover:text-orange-600", h: "h-2",
  },
  cyan: {
    bg: "bg-cyan-50", hoverBg: "group-hover:from-cyan-400 group-hover:to-blue-600",
    icon: "text-cyan-700", check: "text-cyan-600", border: "from-cyan-500 to-blue-500",
    titleHover: "group-hover:text-cyan-600", h: "h-1",
  },
  blue: {
    bg: "bg-blue-50", hoverBg: "group-hover:from-blue-400 group-hover:to-cyan-600",
    icon: "text-blue-600", check: "text-blue-500", border: "from-blue-600 to-cyan-500",
    titleHover: "group-hover:text-blue-600", h: "h-1",
  },
  teal: {
    bg: "bg-cyan-50", hoverBg: "group-hover:from-cyan-500 group-hover:to-blue-700",
    icon: "text-cyan-700", check: "text-cyan-600", border: "from-cyan-600 to-cyan-500",
    titleHover: "group-hover:text-cyan-700", h: "h-2",
  },
};

const PROCESS_STEPS = [
  { icon: Phone, title: "Initial Contact", desc: "Call or request a quote — we respond same-day to discuss your project needs." },
  { icon: Target, title: "Site Assessment", desc: "Our licensed engineers evaluate your site conditions and project requirements." },
  { icon: FileText, title: "Proposal & Plans", desc: "Detailed scope, timeline, and engineering plans tailored to your project." },
  { icon: HardHat, title: "Execution", desc: "Our integrated team handles engineering, inspections, and construction." },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = false;
    video.playbackRate = 1;

    let rafId: number | null = null;
    let reversing = false;
    let lastTs: number | null = null;
    let targetTime = 0;

    const reverseSpeed = 0.8;
    const stepSize = 1 / 30;

    const reverseFrame = (ts: number) => {
      if (!reversing) return;

      if (lastTs === null) {
        lastTs = ts;
        targetTime = video.currentTime;
      }

      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      targetTime = Math.max(0, targetTime - dt * reverseSpeed);

      if (Math.abs(video.currentTime - targetTime) > stepSize) {
        video.currentTime = targetTime;
      }

      if (targetTime <= 0.05) {
        reversing = false;
        lastTs = null;
        targetTime = 0;
        video.currentTime = 0;

        setTimeout(() => {
          video.play().catch(() => {});
        }, 50);
        return;
      }

      rafId = window.requestAnimationFrame(reverseFrame);
    };

    const handleEnded = () => {
      reversing = true;
      lastTs = null;
      targetTime = video.duration;
      video.pause();

      rafId = window.requestAnimationFrame(reverseFrame);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      reversing = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased" data-testid="page-home">
      <SEO
        title="Pacific Engineering & Construction Inc. - Consulting Engineers and Contractors"
        description="SF Bay structural engineering, special inspections, materials testing & SWPPP stormwater compliance—supporting permit-ready construction with fast, reliable service."
        keywords="SF Bay structural engineering, structural engineer San Francisco, special inspections Bay Area, special inspections SF, construction materials testing Bay Area, materials testing San Francisco, SWPPP Bay Area, SWPPP San Francisco, stormwater compliance Bay Area, QSD QSP Bay Area, consulting engineers Bay Area, Pacific Engineering & Construction"
        url="/"
      />
      <MobileStickyBar />
      <section className="relative min-h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden bg-slate-950 py-8 sm:py-12 md:py-16 lg:py-20" data-testid="section-hero">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            preload="auto"
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.72]"
          >
            <source src="/images/hero-ggbridge.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-orange-950/15 opacity-50" />
        </div>

        <ParticleField className="z-[1] opacity-15 hidden md:block" particleCount={35} />
        <FloatingElements className="z-[3] opacity-50" />
        <FloatingParticles />

        <div className="absolute top-1/3 left-1/5 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/8 rounded-full blur-[100px] md:blur-[140px] pointer-events-none z-[1]" />
        <div className="absolute bottom-1/4 right-1/5 w-48 md:w-80 h-48 md:h-80 bg-orange-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[1]" />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <AnimatedSection direction="up" duration={1.1} className="text-center">
              <div className="relative">
                <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-cyan-500/5 rounded-2xl sm:rounded-3xl blur-sm hidden sm:block" />

                <div className="relative bg-slate-950/30 sm:bg-slate-950/40 lg:bg-slate-950/35 backdrop-blur-[6px] rounded-2xl sm:rounded-3xl border border-white/[0.06] shadow-2xl overflow-hidden">
                  <div className="h-0.5 sm:h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-cyan-400/80" />

                  <div className="px-5 py-8 sm:p-10 md:p-12 lg:p-16">
                    <h1 className="text-white font-bold tracking-tight leading-[1.08] text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-3 sm:mb-5" data-testid="text-hero-title">
                      <span className="text-white">Pacific Engineering</span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        & Construction Inc.
                      </span>
                    </h1>

                    <div className="flex items-center justify-center gap-3 sm:gap-4 my-4 sm:my-6">
                      <div className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-cyan-500/60" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rotate-45 bg-orange-400" />
                      <div className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-cyan-500/60" />
                    </div>

                    <p className="text-slate-300/90 mx-auto font-light tracking-wide text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl" data-testid="text-hero-subtitle">
                      Consulting Engineers & Contractors
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-5 sm:mb-6">
                      <Link
                        to={createPageUrl("ServicesOverview")}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 rounded-xl bg-orange-600 hover:bg-orange-500 shadow-xl shadow-orange-600/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 pe-glow-orange"
                        data-testid="link-hero-quote"
                      >
                        Our Services
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                      <Link
                        to={createPageUrl("Consultation")}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-600/15 hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 pe-glow-cyan"
                        data-testid="link-hero-consultation"
                      >
                        Free Consultation
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>

                    <p className="text-slate-400/80 text-xs sm:text-sm md:text-base tracking-wide mb-8 sm:mb-12" data-testid="text-hero-trust">
                      Same-day response · No obligations · 40+ years Bay Area expertise
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                      <div className="group relative rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.07] p-3 sm:p-5 md:p-6 flex flex-col items-center justify-center" data-testid="stat-experience">
                        <div className="text-white font-bold mb-0.5 sm:mb-2 text-2xl sm:text-3xl md:text-4xl">
                          <AnimatedCounter target={40} suffix="+" />
                        </div>
                        <div className="text-cyan-400/90 tracking-tight font-medium text-[10px] sm:text-sm">Years Experience</div>
                      </div>
                      <div className="group relative rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.07] p-3 sm:p-5 md:p-6 flex flex-col items-center justify-center" data-testid="stat-full-service">
                        <div className="text-white font-bold mb-0.5 sm:mb-2 text-lg sm:text-2xl md:text-3xl lg:text-4xl">Full-Service</div>
                        <div className="text-cyan-400/90 tracking-tight font-medium text-[10px] sm:text-sm">Vertically Integrated</div>
                      </div>
                      <div className="group relative rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.07] p-3 sm:p-5 md:p-6 flex flex-col items-center justify-center" data-testid="stat-full-scale">
                        <div className="text-white font-bold mb-0.5 sm:mb-2 text-lg sm:text-2xl md:text-3xl lg:text-4xl">Full-Scale</div>
                        <div className="text-cyan-400/90 tracking-tight font-medium text-[10px] sm:text-sm leading-tight text-center">Res, Comm & Infrastructure</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>
      <SectionDivider variant="gradient" from="dark" to="light" />
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 bg-white" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-10 sm:mb-14 lg:mb-20">
            <p className="text-cyan-600 font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">What We Do</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 sm:mb-6 tracking-tight" data-testid="text-services-title">
              Consulting Engineers & Contractors
            </h2>
            <div className="w-20 sm:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-cyan-500 to-orange-400 mx-auto mb-4 sm:mb-8 rounded-full" />
            <p className="text-base sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Full-scale engineering and construction by our in-house teams of Engineers, QSD/QSPs, and construction experts.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {SERVICES.map((svc, idx) => {
              const c = colorMap[svc.color];
              const Icon = svc.icon;
              return (
                <AnimatedSection key={svc.title} direction={idx % 2 === 0 ? "right" : "left"} delay={0.1 + idx * 0.1} className="h-full">
                  <Link to={createPageUrl(svc.page)} className="block group h-full" data-testid={`link-${svc.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className={`h-full bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-2`}>
                      <div className={`${c.h} bg-gradient-to-r ${c.border}`} />
                      <div className="p-5 sm:p-8 lg:p-10 flex flex-col items-center text-center">
                        <div className={`${c.bg} rounded-xl sm:rounded-2xl w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 group-hover:bg-gradient-to-br ${c.hoverBg} group-hover:shadow-lg transition-all duration-300`}>
                          <Icon className={`w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${c.icon} group-hover:text-white transition-colors`} />
                        </div>
                        <h3 className={`text-slate-900 text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 uppercase tracking-wider ${c.titleHover} transition-colors`}>
                          {svc.title}
                        </h3>
                        <p className="text-slate-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">{svc.desc}</p>
                        <ul className="space-y-2 sm:space-y-3 w-full">
                          {svc.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 sm:gap-3 text-slate-600 text-left">
                              <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${c.check} flex-shrink-0`} />
                              <span className="font-medium text-sm sm:text-base">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection direction="up" delay={0.5} className="text-center mt-8 sm:mt-12 lg:mt-16">
            <Link
              to={createPageUrl("ServicesOverview")}
              className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
              data-testid="link-view-all-services"
            >
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
      <SectionDivider variant="wave" from="light" to="light" />
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-slate-50 relative overflow-hidden" data-testid="section-process">
        <BlueprintGrid />
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection direction="up" className="text-center mb-10 sm:mb-14 lg:mb-16">
            <p className="text-cyan-600 font-bold uppercase tracking-widest text-xs sm:text-sm mb-3">How It Works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              From First Call to Final Inspection
            </h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-200" />

            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={step.title} direction="up" delay={0.1 + idx * 0.15} className="h-full">
                  <div className="relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm sm:shadow-md border border-slate-100 hover:shadow-lg hover:border-cyan-200 transition-all duration-300 text-center group h-full" data-testid={`step-${idx + 1}`}>
                    <div className="relative z-10 mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl mb-4 sm:mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                      {idx + 1}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 text-cyan-600 group-hover:text-cyan-500 transition-colors">
                      <Icon className="w-full h-full" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-base sm:text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
      <SectionDivider variant="blueprint" />
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-cyan-50/40 relative overflow-hidden" data-testid="section-why-choose">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-cyan-600 font-bold uppercase tracking-widest text-xs sm:text-sm mb-3">Why Choose Us</p>
              <h2 className="text-slate-900 mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight text-center" data-testid="text-why-title">
                Why Pacific Engineering?
              </h2>
              <div className="bg-gradient-to-r from-cyan-500 to-orange-400 my-5 sm:my-8 w-16 sm:w-24 h-1 sm:h-1.5 rounded-full" />

              <p className="text-slate-700 mb-6 sm:mb-10 text-base sm:text-lg lg:text-xl leading-relaxed">
                With over 40 years of experience in full-scale civil engineering and construction contracting, we deliver comprehensive solutions keeping projects on track with professional efficiency.
              </p>

              <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8 sm:mb-12">
                {[
                  { icon: Award, title: "EXPERT KNOWLEDGE", desc: "Complete understanding of federal, state, and local stormwater regulations." },
                  { icon: TrendingUp, title: "PROVEN TRACK RECORD", desc: "100% client satisfaction across 2.5K+ successful projects." },
                  { icon: Zap, title: "RESPONSIVE SERVICE", desc: "Quick turnaround times and dedicated project support to keep you moving." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 sm:gap-6 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm sm:shadow-md border border-cyan-100">
                        <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-slate-900 mb-1 sm:mb-2 text-base sm:text-lg lg:text-xl font-bold tracking-wide">{item.title}</h3>
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={createPageUrl("ServicesOverview")}
                  className="group inline-flex items-center justify-center gap-2 text-white font-bold tracking-tight text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97]"
                  data-testid="link-scope-project"
                >
                  <FileText className="w-5 h-5" />
                  Scope Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link to={createPageUrl("About")} className="inline-flex items-center justify-center gap-2 text-slate-700 font-bold tracking-tight text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-transparent border-2 border-slate-200 hover:border-cyan-300 hover:bg-white transition-all duration-200 group active:scale-[0.97]" data-testid="link-about-team">
                    <Users className="w-5 h-5" /> About Our Team
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="mt-4 lg:mt-0">
              <div className="relative px-0 sm:px-4 lg:px-8">
                <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl border-2 sm:border-4 border-white bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80"
                    alt="San Francisco Bay Area construction projects"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    data-testid="img-sf-projects"
                  />
                </div>
                <div className="absolute -bottom-4 sm:-bottom-6 right-0 sm:-right-2 lg:-right-6 bg-gradient-to-br from-cyan-500 to-blue-600 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-xl border-2 sm:border-4 border-white flex flex-col items-center justify-center z-20">
                  <div className="text-white mb-0.5 sm:mb-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter" data-testid="text-projects-count">
                    <AnimatedCounter target={2500} suffix="+" />
                  </div>
                  <div className="text-cyan-50 font-bold uppercase tracking-widest text-[9px] sm:text-xs">Successful Projects</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      <SectionDivider variant="angled" from="light" to="dark" />
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-slate-900 overflow-hidden" data-testid="section-trust-badges">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: Shield, label: "Licensed PE/QSD/QSP", value: "Certified" },
              { icon: Building2, label: "Class A & B", value: "Contractor" },
              { icon: MapPin, label: "Bay Area", value: "40+ Years" },
              { icon: Star, label: "Client Rating", value: "5-Star" },
            ].map((badge, idx) => (
              <AnimatedSection key={badge.label} direction="up" delay={idx * 0.1}>
                <div className="text-center p-3 sm:p-6 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors" data-testid={`trust-${badge.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <badge.icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
                  <div className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-0.5">{badge.value}</div>
                  <div className="text-slate-400 text-xs sm:text-sm font-medium">{badge.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      <SectionDivider variant="gradient" from="dark" to="light" />
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-white relative overflow-hidden" data-testid="section-testimonial">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <div className="flex justify-center gap-1 mb-4 sm:mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />)}
            </div>
            <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-800 font-medium leading-relaxed mb-6 sm:mb-8 italic" data-testid="text-testimonial">
              "Pacific Engineering's team was incredibly responsive and thorough. They handled our structural assessment, inspections, and stormwater planning — all under one roof. Saved us weeks of coordination."
            </blockquote>
            <div>
              <div className="text-slate-900 font-bold text-base sm:text-lg">Mike Torres</div>
              <div className="text-slate-500 text-sm sm:text-base">Senior PM · Bay Area Commercial Development</div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <SectionDivider variant="angled" from="light" to="dark" />
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-slate-900 relative overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888082416-a711bc141c2c?w=1600')] bg-cover bg-center opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-950/90" />
        <BlueprintGrid />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">Ready to move?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-5 sm:mb-8 tracking-tight leading-[1.08]" data-testid="text-cta-title">
              Get Your Project<br className="sm:hidden" /> on Track
            </h2>
            <div className="w-32 sm:w-48 h-1 sm:h-1.5 bg-gradient-to-r from-cyan-500 to-orange-400 mx-auto mb-6 sm:mb-10 rounded-full" />
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-12 leading-relaxed font-light max-w-3xl mx-auto">
              Engineering, inspections, construction, and stormwater — one team, one call. We respond same-day to keep your timeline intact.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <Link
                to={createPageUrl("Consultation")}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 text-white font-bold tracking-tight text-base sm:text-lg lg:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 pe-glow-orange"
                data-testid="link-cta-quote"
              >
                <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
                Request a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a href="tel:+14156894428" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 text-white font-bold tracking-tight text-base sm:text-lg lg:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-200 group active:scale-[0.97]" data-testid="link-cta-call">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" /> (415) 689-4428
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 text-slate-400 text-xs sm:text-sm font-medium">
              <span className="inline-flex items-center gap-1.5 sm:gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> Licensed PE/QSD/QSP</span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> Class A & B Contractor</span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> 2,500+ Projects</span>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <SectionDivider variant="gradient" from="dark" to="dark" />
    </div>
  );
}