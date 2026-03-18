import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion";
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
  Award,
  Ruler,
  Droplets,
  Zap,
  TrendingUp,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import ParticleField from "../components/ParticleField";
import FloatingElements from "../components/FloatingElements";
import BlueprintBackground from "../components/BlueprintBackground";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import bayBridgeImg from "@assets/bay-bridge-sunrise_1773821710974.jpg";

function useInViewOnce(threshold = 0.15) {
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
  const { ref, inView } = useInViewOnce(0.3);
  const [count, setCount] = useState(0);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) { setCount(target); return; }
    const startTime = performance.now();
    let rafId: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration, reducedMotion]);
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
      <style>{`@keyframes pe-float { 0% { transform: translateY(0px) scale(1); opacity: 0.3; } 100% { transform: translateY(-30px) scale(1.5); opacity: 0.6; } } @media (prefers-reduced-motion: reduce) { .pe-float, [style*="pe-float"] { animation: none !important; } }`}</style>
    </div>
  );
}

function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-3 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }} data-testid="mobile-sticky-bar">
      <a href="tel:+14156894428" className="flex-1 py-3 rounded-sm bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-white/20 transition-colors" data-testid="btn-sticky-call">
        <Phone className="w-4 h-4 text-cyan-400" /> Call Now
      </a>
      <Link to={createPageUrl("Consultation")} className="flex-1 py-3 rounded-sm bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-orange-500 transition-colors shadow-md" data-testid="btn-sticky-quote">
        <PhoneCall className="w-4 h-4" /> Get Quote
      </Link>
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const springScale = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const scaleX = reducedMotion ? scrollYProgress : springScale;
  return (
    <motion.div
      className="fixed top-20 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #3b82f6, #06b6d4 50%, #3b82f6)",
      }}
    />
  );
}

function DiagonalDivider({ topColor = "#ffffff", bottomColor = "#ffffff", accentGradient = "svc-why" }: { topColor?: string; bottomColor?: string; accentGradient?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(28px, 3.5vw, 52px)", marginTop: "-1px", marginBottom: "-1px" }}
    >
      <div className="absolute inset-0" style={{ background: topColor }} />
      <div className="absolute inset-0" style={{ background: bottomColor, clipPath: "polygon(0 45%, 100% 0, 100% 55%, 0 100%)" }} />
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 100" fill="none">
        <line
          x1="0" y1="45" x2="1440" y2="0"
          stroke={`url(#${accentGradient}-top)`}
          strokeWidth="2"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: reducedMotion || isInView ? 0 : 2000,
            transition: reducedMotion ? "none" : "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s",
          }}
        />
        <line
          x1="0" y1="100" x2="1440" y2="55"
          stroke={`url(#${accentGradient}-bot)`}
          strokeWidth="2"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: reducedMotion || isInView ? 0 : -2000,
            transition: reducedMotion ? "none" : "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          }}
        />
        <defs>
          <linearGradient id={`${accentGradient}-top`} x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="0.25" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="0.75" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id={`${accentGradient}-bot`} x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="0.25" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="0.75" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const SERVICES = [
  {
    icon: Shield,
    title: "Construction Service",
    desc: "Fully licensed for any project from residential additions to public and governmental infrastructure.",
    items: ["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"],
    color: "darkblue" as const,
    page: "Construction",
  },
  {
    icon: Ruler,
    title: "Engineering Consulting",
    desc: "Professional expertise across civil and structural disciplines with innovative project solutions.",
    items: ["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management"],
    color: "bluecyan" as const,
    page: "StructuralEngineering",
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Testing",
    desc: "Thorough inspections ensuring ongoing compliance with actionable improvement recommendations.",
    items: ["Structural Systems Inspections", "Stormwater Testing", "Materials Sampling & Testing", "Environmental Compliance"],
    color: "cyan" as const,
    page: "InspectionsTesting",
  },
  {
    icon: Droplets,
    title: "Stormwater Planning",
    desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance.",
    items: ["PE/QSD/QSP site assessment", "BMP design & maintenance", "Clear documentation", "Federal/state/local compliance"],
    color: "cyanteal" as const,
    page: "Services",
  },
];

const colorMap = {
  darkblue: {
    bg: "bg-blue-100", hoverBg: "group-hover:from-blue-500 group-hover:to-blue-700",
    icon: "text-blue-700", check: "text-blue-600", border: "from-blue-700 to-blue-500",
    titleHover: "group-hover:text-blue-500", textHover: "group-hover:text-blue-500/80",
    checkHover: "group-hover:text-blue-400", cardBgHover: "group-hover:bg-blue-50/60", h: "h-1.5",
    glowColor: "rgba(59,130,246,0.15)",
  },
  bluecyan: {
    bg: "bg-sky-50", hoverBg: "group-hover:from-sky-400 group-hover:to-cyan-500",
    icon: "text-sky-700", check: "text-sky-600", border: "from-sky-500 to-cyan-500",
    titleHover: "group-hover:text-cyan-500", textHover: "group-hover:text-cyan-600/80",
    checkHover: "group-hover:text-cyan-400", cardBgHover: "group-hover:bg-sky-50/60", h: "h-1.5",
    glowColor: "rgba(14,165,233,0.15)",
  },
  cyan: {
    bg: "bg-cyan-50", hoverBg: "group-hover:from-cyan-400 group-hover:to-teal-500",
    icon: "text-cyan-700", check: "text-cyan-600", border: "from-cyan-500 to-teal-500",
    titleHover: "group-hover:text-teal-500", textHover: "group-hover:text-teal-600/80",
    checkHover: "group-hover:text-teal-400", cardBgHover: "group-hover:bg-cyan-50/60", h: "h-1.5",
    glowColor: "rgba(6,182,212,0.15)",
  },
  cyanteal: {
    bg: "bg-teal-50", hoverBg: "group-hover:from-teal-400 group-hover:to-cyan-500",
    icon: "text-teal-700", check: "text-teal-600", border: "from-teal-500 to-cyan-600",
    titleHover: "group-hover:text-cyan-500", textHover: "group-hover:text-cyan-600/80",
    checkHover: "group-hover:text-cyan-400", cardBgHover: "group-hover:bg-teal-50/60", h: "h-1.5",
    glowColor: "rgba(20,184,166,0.15)",
  },
};

function ServiceCard({ svc, idx, reducedMotion }: { svc: typeof SERVICES[number]; idx: number; reducedMotion: boolean }) {
  const c = colorMap[svc.color];
  const Icon = svc.icon;
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    el.style.boxShadow = `0 20px 40px -12px ${c.glowColor}, 0 8px 20px -8px rgba(0,0,0,0.08)`;
  }, [c.glowColor, reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50, scale: 0.92 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={reducedMotion ? { duration: 0 } : {
        type: "tween",
        duration: 0.7,
        delay: 0.1 + idx * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
      style={{ perspective: reducedMotion ? undefined : "800px" }}
    >
      <Link to={createPageUrl(svc.page)} className="block group h-full" data-testid={`link-${svc.title.toLowerCase().replace(/\s+/g, "-")}`}>
        <div
          ref={cardRef}
          className={`h-full bg-white ${c.cardBgHover} rounded-md sm:rounded-lg shadow-md sm:shadow-lg group-hover:shadow-2xl border border-slate-100 group-hover:border-slate-200 transition-all duration-500 overflow-hidden cursor-pointer`}
          style={{
            transition: reducedMotion ? "border-color 0.5s ease, background-color 0.5s ease" : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, border-color 0.5s ease, background-color 0.5s ease",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`${c.h} bg-gradient-to-r ${c.border}`} />
          <div className="p-5 sm:p-8 lg:p-10 flex flex-col items-center text-center">
            <div className={`${c.bg} rounded-xl sm:rounded-2xl w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 group-hover:bg-gradient-to-br ${c.hoverBg} group-hover:shadow-lg transition-all duration-300`}>
              <Icon className={`w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${c.icon} group-hover:text-white transition-colors`} />
            </div>
            <h3 className={`text-slate-900 ${c.titleHover} text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 uppercase tracking-wider transition-colors`}>
              {svc.title}
            </h3>
            <p className="text-slate-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">{svc.desc}</p>
            <ul className="space-y-2 sm:space-y-3 w-full">
              {svc.items.map((item, i) => (
                <li key={i} className={`flex items-center justify-center gap-2 sm:gap-3 text-slate-600 ${c.textHover} transition-colors`}>
                  <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${c.check} ${c.checkHover} transition-colors`} />
                  <span className="font-medium text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


function HeroServicesDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(28px, 3vw, 48px)", marginTop: "-1px", marginBottom: "-1px" }}
    >
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-white" style={{ clipPath: "polygon(0 60%, 100% 0, 100% 100%, 0 100%)" }} />
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 60" fill="none">
        <line
          x1="0" y1="36" x2="1440" y2="0"
          stroke="url(#hero-svc-line)"
          strokeWidth="2.5"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: reducedMotion || isInView ? 0 : 2000,
            transition: reducedMotion ? "none" : "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.05s",
          }}
        />
        <defs>
          <linearGradient id="hero-svc-line" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="0.2" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="0.5" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="0.8" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const prefersReducedMotion = useReducedMotion();
  const rm = !!prefersReducedMotion;

  const entrance = (init: Record<string, number>, dur: number, del: number) =>
    rm
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, ...init }, animate: { opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1 }, transition: { duration: dur, delay: del, ease: [0.22, 1, 0.36, 1] as const } };

  const heroOpacity = useTransform(heroProgress, [0, 0.7, 1], prefersReducedMotion ? [1, 1, 1] : [1, 1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.7, 1], prefersReducedMotion ? [1, 1, 1] : [1, 1, 0.95]);
  const heroBlur = useTransform(heroProgress, [0, 0.7, 1], prefersReducedMotion ? [0, 0, 0] : [0, 0, 8]);
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`);

  const ctaRef = useRef<HTMLElement>(null);
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });
  const ctaBgY = useTransform(ctaProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "20%"]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = false;
    video.playbackRate = 1;

    let rafId: number | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    let reversing = false;
    let lastTs: number | null = null;
    let targetTime = 0;
    let disposed = false;

    const reverseSpeed = 1;
    const stepSize = 1 / 30;
    const endPause = 1200;
    const startPause = 800;

    const reverseFrame = (ts: number) => {
      if (!reversing || disposed) return;

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

        pauseTimer = setTimeout(() => {
          if (!disposed) video.play().catch(() => {});
        }, startPause);
        return;
      }

      rafId = window.requestAnimationFrame(reverseFrame);
    };

    const handleEnded = () => {
      video.pause();
      pauseTimer = setTimeout(() => {
        if (disposed) return;
        reversing = true;
        lastTs = null;
        targetTime = video.duration;
        rafId = window.requestAnimationFrame(reverseFrame);
      }, endPause);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      disposed = true;
      video.removeEventListener("ended", handleEnded);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (pauseTimer !== null) clearTimeout(pauseTimer);
      reversing = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased pb-[4.5rem] sm:pb-0" data-testid="page-home">
      <SEO
        title="Pacific Engineering & Construction Inc. - Consulting Engineers and Contractors"
        description="SF Bay structural engineering, special inspections, materials testing & SWPPP stormwater compliance—supporting permit-ready construction with fast, reliable service."
        keywords="SF Bay structural engineering, structural engineer San Francisco, special inspections Bay Area, special inspections SF, construction materials testing Bay Area, materials testing San Francisco, SWPPP Bay Area, SWPPP San Francisco, stormwater compliance Bay Area, QSD QSP Bay Area, consulting engineers Bay Area, Pacific Engineering & Construction"
        url="/"
      />
      <ScrollProgress />
      <MobileStickyBar />
      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden bg-slate-950 py-8 sm:py-12 md:py-16 lg:py-20"
        data-testid="section-hero"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          filter: heroFilter,
        }}
      >
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            preload="auto"
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.84]"
          >
            <source src="/images/hero-ggb-draft.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-transparent to-orange-950/20 opacity-50" />
        </div>

        <AnimatedGridBackground baseOpacity={0.5} gridSize={40} triggerInterval={500} animationDuration={2500} className="hidden sm:block z-[1] opacity-30" />
        <BlueprintBackground className="z-[2] opacity-70" />
        <ParticleField className="z-[3] opacity-15 hidden md:block" particleCount={35} />
        <FloatingElements className="z-[4] opacity-60" />
        <FloatingParticles />

        <div className="absolute top-1/3 left-1/5 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/8 rounded-full blur-[100px] md:blur-[140px] pointer-events-none z-[1]" />
        <div className="absolute bottom-1/4 right-1/5 w-48 md:w-80 h-48 md:h-80 bg-orange-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[1]" />

        <div className="relative z-[5] w-full px-4 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <AnimatedSection direction="up" duration={1.1} className="text-center" blur>
              <div className="relative">
                <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-cyan-500/5 rounded-2xl sm:rounded-3xl blur-sm hidden sm:block" />

                <div className="relative bg-slate-950/30 sm:bg-slate-950/40 lg:bg-slate-950/35 backdrop-blur-[6px] rounded-lg sm:rounded-xl border border-white/[0.06] shadow-2xl overflow-hidden">
                  <div className="h-0.5 sm:h-2 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80" />

                  <div className="px-5 py-8 sm:p-10 md:p-12 lg:p-16">
                    <motion.h1
                      className="text-white font-bold tracking-tight leading-[1.08] text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-3 sm:mb-5"
                      data-testid="text-hero-title"
                      {...entrance({ y: 30 }, 0.8, 0.2)}
                    >
                      <span className="text-white">Pacific Engineering</span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        & Construction Inc.
                      </span>
                    </motion.h1>

                    <motion.div
                      className="flex items-center justify-center gap-4 my-6 sm:my-8 md:my-10"
                      {...entrance({ scaleX: 0 }, 0.6, 0.5)}
                    >
                      <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-cyan-500" />
                      <div className="w-3 h-3 rotate-45 bg-orange-400" />
                      <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-cyan-500" />
                    </motion.div>

                    <motion.p
                      className="text-slate-300/90 mx-auto font-light tracking-wide text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl"
                      data-testid="text-hero-subtitle"
                      {...entrance({ y: 20 }, 0.7, 0.6)}
                    >
                      Consulting Engineers & Contractors
                    </motion.p>

                    <motion.div
                      className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-5 sm:mb-6"
                      {...entrance({ y: 20 }, 0.7, 0.75)}
                    >
                      <Link
                        to={createPageUrl("Consultation")}
                        className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-[18px] bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(249,115,22,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none"
                        data-testid="link-hero-quote"
                      >
                        <PhoneCall className="w-5 h-5" />
                        Request a Quote
                      </Link>
                      <Link
                        to={createPageUrl("ServicesOverview")}
                        className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-[18px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(6,182,212,0.45)] active:scale-[0.97]"
                        data-testid="link-hero-consultation"
                      >
                        Our Services
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </motion.div>

                    <motion.p
                      className="text-slate-400/80 text-xs sm:text-sm md:text-base tracking-wide mb-8 sm:mb-12"
                      data-testid="text-hero-trust"
                      {...entrance({}, 0.6, 0.9)}
                    >
                      Same-day response · No obligations · 40+ years Bay Area expertise
                    </motion.p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                      {[
                        { content: <AnimatedCounter target={40} suffix="+" />, label: "Years Experience", testId: "stat-experience" },
                        { content: "Full-Service", label: "Vertically Integrated", testId: "stat-full-service", textClass: "text-lg sm:text-2xl md:text-3xl lg:text-4xl" },
                        { content: "Full-Scale", label: "Res, Comm & Infrastructure", testId: "stat-full-scale", textClass: "text-lg sm:text-2xl md:text-3xl lg:text-4xl" },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.testId}
                          className="group relative rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.07] p-3 sm:p-5 md:p-6 flex flex-col items-center justify-center"
                          data-testid={stat.testId}
                          {...entrance({ y: 30 }, 0.6, 1.0 + i * 0.1)}
                        >
                          <div className={`text-white font-bold mb-0.5 sm:mb-2 ${stat.textClass || "text-2xl sm:text-3xl md:text-4xl"}`}>
                            {stat.content}
                          </div>
                          <div className="text-orange-400/90 tracking-tight font-medium text-[10px] sm:text-sm leading-tight text-center">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center p-2"
            {...entrance({ y: -10 }, 0.6, 1.5)}
          >
            <div className={`w-1 h-3 bg-white/40 rounded-full ${rm ? '' : 'animate-bounce'}`} />
          </motion.div>
        </div>
      </motion.section>
      {/* ── HERO → SERVICES DIVIDER ── */}
      <div className="w-full h-px bg-gradient-to-r from-cyan-50 via-orange-300 to-cyan-50" style={{ backgroundImage: "linear-gradient(to right, #ecfeff, #fdba74 25%, #3b82f6 50%, #fdba74 75%, #ecfeff)" }} />
      {/* ── SERVICES ── */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 bg-white relative" data-testid="section-services">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900/[0.06] to-transparent pointer-events-none z-[1]" aria-hidden="true" />
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-10 sm:mb-14 lg:mb-20" parallax blur ease="tween">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 sm:mb-6 tracking-tight mb-[44px]" data-testid="text-services-title">
              Consulting Engineers & Contractors
            </h2>
            <div className="w-32 sm:w-54 h-1 sm:h-1.5 bg-gradient-to-r from-cyan-100 to-cyan-100 via-blue-500 mx-auto mb-4 sm:mb-8 rounded-full pl-[142px] pr-[142px]" />
            <p className="text-base sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Full-scale engineering and construction by our in-house teams of Engineers, QSD/QSPs, and construction experts.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {SERVICES.map((svc, idx) => (
              <ServiceCard key={svc.title} svc={svc} idx={idx} reducedMotion={!!prefersReducedMotion} />
            ))}
          </div>

          <AnimatedSection direction="up" delay={0.5} className="text-center mt-8 sm:mt-12 lg:mt-16" ease="tween">
            <Link
              to={createPageUrl("ServicesOverview")}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base sm:text-lg px-10 sm:px-14 py-4 sm:py-[18px] rounded-sm sm:rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_8px_25px_rgba(6,182,212,0.3)] hover:shadow-[0_12px_35px_rgba(6,182,212,0.45)] hover:-translate-y-1 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              data-testid="link-view-all-services"
            >
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </AnimatedSection>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-100/60 to-transparent pointer-events-none z-[1]" aria-hidden="true" />
        </div>
      </section>
      {/* ── SERVICES → WHY CHOOSE DIVIDER ── */}
      <DiagonalDivider topColor="#ffffff" bottomColor="rgb(236 254 255 / 0.4)" accentGradient="svc-why" />
      {/* ── WHY CHOOSE ── */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-cyan-50/40 relative overflow-hidden" data-testid="section-why-choose">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-[1]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/[0.08] to-transparent pointer-events-none z-[1]" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <AnimatedSection direction="up" ease="tween" blur>
                <div className="text-center">
                  <h2 className="text-slate-900 mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight" data-testid="text-why-title">
                    Why Pacific Engineering?
                  </h2>
                  <div className="bg-gradient-to-r from-cyan-100 to-cyan-100 via-blue-500 my-5 sm:my-8 w-24 sm:w-36 h-1 sm:h-1.5 rounded-full mx-auto ml-[232px] mr-[232px] pl-[54px] pr-[54px]" />
                  <p className="text-slate-700 mb-6 sm:mb-10 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                    With over 40 years of experience in full-scale civil engineering and construction contracting, we deliver comprehensive solutions keeping projects on track with professional efficiency.
                  </p>
                </div>
              </AnimatedSection>

              <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8 sm:mb-12 w-full">
                {[
                  { icon: Award, title: "EXPERT KNOWLEDGE", desc: "Complete understanding of federal, state, and local stormwater regulations." },
                  { icon: TrendingUp, title: "PROVEN TRACK RECORD", desc: "100% client satisfaction across 2.5K+ successful projects." },
                  { icon: Zap, title: "RESPONSIVE SERVICE", desc: "Quick turnaround times and dedicated project support to keep you moving." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="flex items-start gap-4 sm:gap-5"
                    initial={rm ? { opacity: 1 } : { opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={rm ? { duration: 0 } : {
                      type: "tween",
                      duration: 0.6,
                      delay: 0.15 + i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="flex-shrink-0 w-11 sm:w-14">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm sm:shadow-md border border-cyan-100">
                        <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-600" />
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <h3 className="text-slate-900 mb-1 sm:mb-2 text-base sm:text-lg lg:text-xl font-bold tracking-wide">{item.title}</h3>
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg">{item.desc}</p>
                    </div>
                    <div className="flex-shrink-0 w-11 sm:w-14" aria-hidden="true" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center w-full"
                initial={rm ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={rm ? { duration: 0 } : { duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={createPageUrl("ServicesOverview")}
                  className="group flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base px-6 py-3.5 sm:py-4 rounded-sm sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
                  data-testid="link-scope-project"
                >
                  <FileText className="w-5 h-5" />
                  Scope Your Project
                </Link>
                <Link to={createPageUrl("About")} className="group flex-1 inline-flex items-center justify-center gap-2 text-slate-800 font-bold tracking-tight text-base px-6 py-3.5 sm:py-4 rounded-sm sm:rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none" data-testid="link-about-team">
                  <Users className="w-5 h-5" /> About Our Team
                </Link>
              </motion.div>
            </div>

            <AnimatedSection direction="right" delay={0.2} className="mt-4 lg:mt-0" parallax ease="tween">
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
                <motion.div
                  className="absolute -bottom-4 sm:-bottom-6 right-0 sm:-right-2 lg:-right-6 bg-gradient-to-br from-cyan-500 to-blue-600 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-xl border-2 sm:border-4 border-white flex flex-col items-center justify-center z-20"
                  initial={rm ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={rm ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 15, delay: 0.4 }}
                >
                  <div className="text-white mb-0.5 sm:mb-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter" data-testid="text-projects-count">
                    <AnimatedCounter target={2500} suffix="+" />
                  </div>
                  <div className="text-cyan-50 font-bold uppercase tracking-widest text-[9px] sm:text-xs">Successful Projects</div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      {/* ── CTA ── */}
      <section
        ref={ctaRef}
        className="relative bg-slate-900 overflow-hidden -mt-[clamp(30px,4vw,60px)]"
        style={{ clipPath: "polygon(0 clamp(30px,4vw,60px), 100% 0, 100% 100%, 0 100%)" }}
        data-testid="section-cta"
      >
        <svg className="absolute top-0 left-0 w-full z-20 pointer-events-none" style={{ height: "clamp(30px,4vw,60px)" }} preserveAspectRatio="none" viewBox="0 0 1440 60" fill="none">
          <line x1="0" y1="60" x2="1440" y2="0" stroke="url(#cta-diag-bar)" strokeWidth="2.5" />
          <defs>
            <linearGradient id="cta-diag-bar" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="0.2" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="0.4" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="0.6" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="0.8" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="1" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div className="absolute inset-0 hidden sm:block opacity-80" style={{ y: ctaBgY }}>
          <img src={bayBridgeImg} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 35%", transform: "scale(1.15)" }} />
        </motion.div>
        <div className="absolute inset-0 bg-slate-900/50 hidden sm:block mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-950/95 sm:from-slate-900/20 sm:to-slate-950/60" />
        <BlueprintGrid />
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none z-[2]" aria-hidden="true">
          <AnimatedGridBackground />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-[calc(clamp(30px,4vw,60px)+2rem)] sm:pt-[calc(clamp(30px,4vw,60px)+3rem)] pb-8 sm:pb-12 md:pb-16 lg:pb-20">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-5 sm:mb-8 tracking-tight leading-[1.08]"
            data-testid="text-cta-title"
            initial={rm ? { opacity: 1 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={rm ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Get Your Project<br className="sm:hidden" /> on Track
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-12 leading-relaxed font-light max-w-3xl mx-auto"
            initial={rm ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={rm ? { duration: 0 } : { duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Engineering, inspections, construction, and stormwater — one team, one call. We respond same-day to keep your timeline intact.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-8 justify-center items-center mb-8 sm:mb-12"
            initial={rm ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={rm ? { duration: 0 } : { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={createPageUrl("Consultation")}
              className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-[18px] bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(249,115,22,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              data-testid="link-cta-quote"
            >
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
              Free Consultation
            </Link>
            <a href="tel:+14156894428" className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-[18px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(6,182,212,0.45)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none" data-testid="link-cta-call">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" /> (415) 689-4428
            </a>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 text-slate-400 text-xs sm:text-sm font-medium"
            initial={rm ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={rm ? { duration: 0 } : { duration: 0.6, delay: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 sm:gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> Licensed PE/QSD/QSP</span>
            <span className="inline-flex items-center gap-1.5 sm:gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> Class A & B Contractor</span>
            <span className="inline-flex items-center gap-1.5 sm:gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> 2,500+ Projects</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
