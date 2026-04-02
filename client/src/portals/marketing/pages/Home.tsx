export { default } from "./HomeRecovered";

/*
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useInView, useReducedMotion } from "framer-motion";
import { createPageUrl } from "../lib/utils";
import {
  CheckCircle,
  FileText,
  Shield,
  ArrowRight,
  ArrowUpRight,
  Phone,
  PhoneCall,
  Users,
  Award,
  Zap,
  TrendingUp,
  BookOpen,
  Target,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedCounter from "../components/AnimatedCounter";
import { ServiceCardsGrid } from "../components/ServiceCards";
import SEO from "../components/SEO";
import HomeProofRail from "../components/HomeProofRail";
import HomeProjectEvidence from "../components/HomeProjectEvidence";
import BlueprintBackground from "../components/BlueprintBackground";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import bayBridgeImg from "@assets/bay-bridge-sunrise_1773821710974.jpg";


function BlueprintGrid() {
  return (
    <div className= "absolute inset-0 overflow-hidden pointer-events-none" >
    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:12px_12px]" />
        </div>
  );
}

function MobileStickyBar() {
  return (
    <div className= "fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-3 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]" style = {{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }
} data - testid="mobile-sticky-bar" >
  <a href="tel:+14156894428" className = "flex-1 py-3 rounded-sm bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-white/20 transition-colors" data - testid="btn-sticky-call" >
    <Phone className="w-4 h-4 text-cyan-400" /> Call Now
      </a>
      < Link to = { createPageUrl("Consultation") } className = "flex-1 py-3 rounded-sm bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-orange-500 transition-colors shadow-md" data - testid="btn-sticky-quote" >
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
      className= "fixed top-20 left-0 right-0 h-[2px] z-50 origin-left"
  style = {{
    scaleX,
      background: "linear-gradient(90deg, #3b82f6, #06b6d4 50%, #3b82f6)",
      }
}
    />
  );
}





function DiagonalHatching() {
  return (
    <div
      className= "absolute inset-0 pointer-events-none"
  style = {{
    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(6,182,212,0.025) 14px, rgba(6,182,212,0.025) 15px)",
      }
}
aria - hidden="true"
  />
  );
}

function StructuralBeamReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div ref= { ref } className = "hidden sm:flex items-center justify-center h-10 relative pointer-events-none select-none" aria - hidden="true" >
      <style>{`
        @keyframes beam-draw { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        @keyframes tick-fade { 0% { opacity: 0; transform: scaleY(0); } 100% { opacity: 0.3; transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { [data-beam], [data-tick] { animation: none !important; opacity: 0.2 !important; transform: none !important; } }
      `} </style>
  < div
data - beam
className = "absolute h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"
style = {{
  width: "60%",
    animation: inView && !rm ? "beam-draw 1.2s cubic-bezier(0.22,1,0.36,1) forwards" : undefined,
      transform: inView || rm ? "scaleX(1)" : "scaleX(0)",
        opacity: 0.2,
        }}
      />
{
  [...Array(11)].map((_, i) => (
    <div
          key= { i }
          data - tick
          className = "absolute bg-slate-400"
          style = {{
    width: "1px",
    height: i % 5 === 0 ? "10px" : "5px",
    left: `${20 + i * 6}%`,
    top: "50%",
    transformOrigin: "top center",
    animation: inView && !rm ? `tick-fade 0.4s ${0.6 + i * 0.05}s cubic-bezier(0.22,1,0.36,1) forwards` : undefined,
    opacity: inView && rm ? 0.2 : inView ? undefined : 0,
  }}
        />
      ))}
</div>
  );
}

function LineSweep() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div ref= { ref } className = "absolute inset-0 overflow-hidden pointer-events-none" aria - hidden="true" >
      <style>{`
        @keyframes line-sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) { [data-sweep] { animation: none !important; opacity: 0 !important; } }
      `} </style>
{
  inView && !rm && (
    <div
          data - sweep
          className = "absolute inset-y-0 w-1/3"
  style = {{
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
      animation: "line-sweep 1.5s cubic-bezier(0.22,1,0.36,1) forwards",
          }
}
        />
      )}
</div>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const rm = !!prefersReducedMotion;

  const entrance = (init: Record<string, number>, dur: number, del: number) =>
    rm
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, ...init }, animate: { opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1 }, transition: { duration: dur, delay: del, ease: [0.22, 1, 0.36, 1] as const } };

  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = false;
    video.playbackRate = 0.5;

    let rafId: number | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    let reversing = false;
    let lastTs: number | null = null;
    let targetTime = 0;
    let disposed = false;

    const reverseSpeed = 0.5;
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
          if (!disposed) video.play().catch(() => { });
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
    <div
      className= "min-h-screen bg-white antialiased pb-[4.5rem] sm:pb-0"
  data - testid="page-home"
    >
    <SEO
        title="Pacific Engineering & Construction Inc. - Consulting Engineers and Contractors"
  description = "SF Bay structural engineering, special inspections, materials testing & SWPPP stormwater compliance—supporting permit-ready construction with fast, reliable service."
  keywords = "SF Bay structural engineering, structural engineer San Francisco, special inspections Bay Area, special inspections SF, construction materials testing Bay Area, materials testing San Francisco, SWPPP Bay Area, SWPPP San Francisco, stormwater compliance Bay Area, QSD QSP Bay Area, consulting engineers Bay Area, Pacific Engineering & Construction"
  url = "/"
    />
    <ScrollProgress />
    < MobileStickyBar />
    {/* ── HERO ── * / }
    < section
  className = "relative min-h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden bg-slate-950 py-8 sm:py-12 md:py-16 lg:py-20"
  data - testid="section-hero"
    >
    <div className="absolute inset-0" >
      <video
            ref={ videoRef }
  autoPlay
  muted
  preload = "auto"
  playsInline
  className = "absolute inset-0 w-full h-full object-cover opacity-[0.84]"
    >
    <source src="/images/hero-ggb-draft.mp4" type = "video/mp4" />
      </video>
      < div className = "absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-transparent to-orange-950/20 opacity-50" />
          </div>

          < AnimatedGridBackground
  baseOpacity = { 0.5}
  gridSize = { 40}
  triggerInterval = { 500}
  animationDuration = { 2500}
  className = "hidden sm:block z-[1] opacity-30"
    />
    <BlueprintBackground className="z-[2] opacity-70" />

      <div className="absolute top-1/3 left-1/5 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/8 rounded-full blur-[100px] md:blur-[140px] pointer-events-none z-[1]" />
        <div className="absolute bottom-1/4 right-1/5 w-48 md:w-80 h-48 md:h-80 bg-orange-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[1]" />

          <div className="relative z-[5] w-full px-4 sm:px-6 lg:px-10" >
            <div className="mx-auto w-full max-w-5xl" >
              <AnimatedSection
              direction="up"
  duration = { 1.1}
  className = "text-center"
  blur
    >
    <div className="relative" >
      <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-cyan-500/5 rounded-2xl sm:rounded-3xl blur-sm hidden sm:block" />

        <div className="relative bg-slate-950/30 sm:bg-slate-950/40 lg:bg-slate-950/35 backdrop-blur-[6px] rounded-lg sm:rounded-xl border border-white/[0.06] shadow-2xl overflow-hidden" >
          <div className="h-0.5 sm:h-1.5 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80" />

            <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-14 lg:py-12" >
              <motion.h1
                      className="text-white font-bold tracking-tight leading-[1.08] text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-2 sm:mb-3"
  data - testid="text-hero-title"
  {...entrance({ y: 30 }, 0.8, 0.2) }
                    >
    <span className="text-white" > Pacific Engineering </span>
      < br />
      <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent" >
                        & Construction Inc.
                      </span>
    </motion.h1>

    < motion.div
  className = "flex items-center justify-center gap-4 my-4 sm:my-5 md:my-6"
  {...entrance({ scaleX: 0 }, 0.6, 0.5) }
                    >
    <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-cyan-500" />
      <div className="w-3 h-3 rotate-45 bg-orange-400" />
        <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-cyan-500" />
          </motion.div>

          < motion.p
  className = "text-slate-300/90 mx-auto font-light tracking-wide text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-5 max-w-2xl"
  data - testid="text-hero-subtitle"
  {...entrance({ y: 20 }, 0.7, 0.6) }
                    >
    Consulting Engineers & Contractors
      </motion.p>

      < motion.div
  className = "flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center mb-4 sm:mb-5"
  {...entrance({ y: 20 }, 0.7, 0.75) }
                    >
    <Link
                        to={ createPageUrl("Consultation") }
  className = "w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-[18px] bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(249,115,22,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none"
  data - testid="link-hero-quote"
    >
    <PhoneCall className="w-5 h-5" />
      Review Project Scope
        </Link>
        < Link
  to = { createPageUrl("ServicesOverview") }
  className = "w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-[18px] text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(6,182,212,0.45)] active:scale-[0.97] [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
  data - testid="link-hero-consultation"
    >
    What we Offer
      < ArrowRight className = "w-5 h-5" />
        </Link>
        </motion.div>

        < motion.p
  className = "text-slate-400/80 text-xs sm:text-sm md:text-base tracking-wide mb-5 sm:mb-8"
  data - testid="text-hero-trust"
  {...entrance({}, 0.6, 0.9) }
                    >
    Same - day response · No obligations · 40 + years Bay Area
  expertise
    </motion.p>

    < div className = "grid grid-cols-3 gap-2 sm:gap-3 md:gap-5" >
    {
      [
        {
          content: <AnimatedCounter target={ 40} suffix="+" />,
      label: "Years Experience",
      testId: "stat-experience",
    },
    {
      content: "Full-Service",
      label: "Vertically Integrated",
      testId: "stat-full-service",
      textClass:
        "text-lg sm:text-2xl md:text-3xl lg:text-4xl",
    },
    {
      content: "Full-Scale",
      label: "Res, Comm & Infrastructure",
      testId: "stat-full-scale",
      textClass:
        "text-lg sm:text-2xl md:text-3xl lg:text-4xl",
    },
                      ].map((stat, i) => (
      <motion.div
                          key= { stat.testId }
                          className = "group relative rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.07] p-3 sm:p-4 md:p-5 flex flex-col items-center justify-center"
                          data - testid={ stat.testId }
                          { ...entrance({ y: 30 }, 0.6, 1.0 + i * 0.1) }
      >
      <div
                            className={`text-white font-bold mb-0.5 sm:mb-2 ${stat.textClass || "text-2xl sm:text-3xl md:text-4xl"}`}
                          >
  { stat.content }
  </div>
  < div className = "text-orange-400/90 tracking-tight font-medium text-[10px] sm:text-sm leading-tight text-center" >
    { stat.label }
    </div>
    </motion.div>
                      ))}
</div>
  </div>
  </div>
  </div>
  </AnimatedSection>
  </div>
  </div>

  < div className = "absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block" >
    <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center p-2"
{...entrance({ y: -10 }, 0.6, 1.5) }
          >
  <div
              className={ `w-1 h-3 bg-white/40 rounded-full ${rm ? "" : "animate-bounce"}` }
            />
  </motion.div>
  </div>
  </section>
{/* ── HERO → SERVICES TRANSITION ── * / }
<div className="relative w-full" style = {{ marginTop: "-1px" }} data - testid="divider-hero-services" >
  <div className="h-2 bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800" />
    <div className="h-[3px]" style = {{ background: "linear-gradient(to right, #1e293b, #0e7490 20%, #06b6d4 35%, #22d3ee 50%, #06b6d4 65%, #0e7490 80%, #1e293b)" }} />
      < div className = "h-px bg-gradient-to-r from-slate-300 via-cyan4200 to-slate-300" />
        </div>

        < HomeProofRail />
        <HomeProjectEvidence />

{/* ── SERVICES ── * / }
<section
        className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 bg-slate-50 relative pt-[84px] pb-[84px]"
data - testid="section-services"
  >
  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" aria - hidden="true" />
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(6,182,212,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.01)_1px,transparent_1px)] bg-[size:12px_12px]" aria - hidden="true" />
      <div
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900/[0.06] to-transparent pointer-events-none z-[1]"
aria - hidden="true"
  />
  <div className="max-w-7xl mx-auto" >
    <StructuralBeamReveal />
    < AnimatedSection
direction = "up"
className = "text-center mb-10 sm:mb-14 lg:mb-20"
parallax
blur
ease = "tween"
  >
  <h2
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 sm:mb-8 tracking-tight mb-[44px]"
data - testid="text-services-title"
  >
  Consulting Engineers & Contractors
    </h2>
    < div className = "w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-50 via-blue-600 to-cyan-50 mx-auto mb-6 sm:mb-8 rounded-full pl-[244px] pr-[244px]" />
      <p className="sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto text-[22px]" > Full - scale civil and structural engineering and construction plans developed and implemented by our teams of in -house Engineers, QSD / QSPs, and construction experts.Helping you ensure on - time, on budget, full compliance, and with maximum creative outlook for your project.Keep everything on track.</p>

        </AnimatedSection>

        < ServiceCardsGrid />

        <AnimatedSection
            direction="up"
delay = { 0.5}
className = "text-center mt-8 sm:mt-12 lg:mt-16"
ease = "tween"
  >
  <Link
              to={ createPageUrl("ServicesOverview") }
className = "group w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base sm:text-lg px-10 sm:px-14 py-4 sm:py-[18px] rounded-sm sm:rounded-full shadow-[0_8px_25px_rgba(6,182,212,0.3)] hover:shadow-[0_12px_35px_rgba(6,182,212,0.45)] hover:-translate-y-1 active:scale-[0.97] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
data - testid="link-view-all-services"
  >
  View Capabilities
    < ArrowRight className = "w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
      </AnimatedSection>
      < div
className = "absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-100/60 to-transparent pointer-events-none z-[1]"
aria - hidden="true"
  />
  </div>
  </section>
{/* ── SERVICES → VALUES TRANSITION ── * / }
<div className="relative w-full" data - testid="divider-services-values" >
  <div className="h-1.5 relative overflow-hidden" style = {{ background: "linear-gradient(to right, #e2e8f0, #3b82f6 25%, #06b6d4 50%, #3b82f6 75%, #e2e8f0)" }}>
    <LineSweep />
    </div>
    < div className = "h-px bg-gradient-to-r from-slate-200 via-cyan-200 to-slate-200" />
      </div>
{/* ── WHAT DRIVES US ── * / }
<section
        className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-slate-950 overflow-hidden pt-[32px] pb-[32px]"
data - testid="section-values"
  >
  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-cyan-950/20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10" >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" >
        {
          [
            { icon: Award, title: "Technical Excellence", desc: "Precision engineering, rigorous testing, and PE-certified work that stands up to scrutiny and performs as designed", gradient: "from-blue-400 to-blue-600", key: "excellence" },
            { icon: Target, title: "Results-Focused", desc: "Delivering outcomes that matter — compliance achieved, structures built right, projects completed on schedule", gradient: "from-cyan-400 to-cyan-600", key: "results" },
            { icon: Users, title: "Collaborative", desc: "Working closely with your team, communicating clearly, and coordinating seamlessly across all project phases", gradient: "from-teal-400 to-teal-600", key: "collaborative" },
            { icon: Shield, title: "Accountable", desc: "Taking ownership of our work, standing behind our designs, and delivering what we promise", gradient: "from-blue-400 to-cyan-600", key: "accountable" },
            ].map((item, i) => (
              <AnimatedSection direction= "up" delay = { i * 0.1} key = { item.key } >
              <div className="group relative h-full" data - testid={`card-value-${item.key}`} >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] to-blue-500/[0.06] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 sm:p-8 text-center hover:border-cyan-500/25 motion-safe:hover:-translate-y-1 transition-all duration-300" >
              <div className={ `bg-gradient-to-br ${item.gradient} w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg motion-safe:group-hover:scale-110 transition-transform duration-300` }>
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  < h3 className = "text-sm sm:text-base font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide" data - testid={ `text-value-title-${item.key}` }> { item.title } </h3>
                    < p className = "text-slate-400 text-xs sm:text-sm leading-relaxed" data - testid={ `text-value-desc-${item.key}` }> { item.desc } </p>
                      </div>
                      </div>
                      </AnimatedSection>
            ))}
</div>
  </div>
  </section>
{/* ── VALUES → WHY CHOOSE TRANSITION ── * / }
<div className="relative w-full" data - testid="divider-values-whychoose" >
  <div className="h-1.5" style = {{ background: "linear-gradient(to right, #0f172a, #2563eb 30%, #06b6d4 50%, #2563eb 70%, #0f172a)" }} />
    < div className = "h-px bg-gradient-to-r from-slate-300 via-cyan-200 to-slate-300" />
      </div>
{/* ── WHY CHOOSE ── * / }
<section
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-slate-100 relative overflow-hidden"
data - testid="section-why-choose"
  >
  <DiagonalHatching />
  < div
className = "absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-[1]"
aria - hidden="true"
  />
  <div className="max-w-7xl mx-auto relative z-10" >
    <div className="grid lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] gap-8 sm:gap-12 lg:gap-16 items-center" >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 lg:p-10 border border-slate-100" >
        <AnimatedSection direction="up" ease = "tween" blur >
          <div className="text-left sm:text-center lg:text-left" >
            <span className="inline-flex items-center gap-3 text-[0.76rem] font-extrabold tracking-[0.22em] uppercase text-cyan-700" >
              <span className="h-px w-9 bg-cyan-500/60" />
                Why Pacific
                  </span>
                  < h2
className = "text-slate-900 mt-4 mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight"
data - testid="text-why-title"
  >
  Engineering judgment shaped by field reality.
                  </h2>
    < p className = "text-slate-700 mb-6 sm:mb-10 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl" >
      We do not just hand over drawings.We align engineering, compliance,
        construction coordination, and project delivery so your team gets a
                    practical path through permitting, field conditions, and execution.
                  </p>
  </div>
  </AnimatedSection>

  < div className = "space-y-4 sm:space-y-5 lg:space-y-6 mb-8 sm:mb-12 w-full" >
  {
    [
      {
        icon: BookOpen,
        title: "Engineering informed by field conditions",
        desc: "Design and documentation shaped by how crews, inspectors, and approvals actually move in the field.",
      },
      {
        icon: TrendingUp,
        title: "Bay Area jurisdictional familiarity",
        desc: "Local review patterns, agency coordination, and approval realities understood before they become schedule risk.",
      },
      {
        icon: Zap,
        title: "Compliance-minded documentation",
        desc: "Stormwater, special inspections, and construction records handled with the discipline needed to keep projects moving.",
      },
      {
        icon: Shield,
        title: "Integrated engineering and construction perspective",
        desc: "One team thinking through scope, buildability, and delivery tradeoffs together instead of in silos.",
      },
                ].map((item, i) => (
        <motion.div
                    key= { item.title }
                    className = "flex items-start gap-4 sm:gap-5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 sm:px-5 sm:py-5"
                    initial = { rm? { opacity: 1 } : { opacity: 0, x: -30 }}
whileInView = {{ opacity: 1, x: 0 }}
viewport = {{ once: true, amount: 0.3 }}
transition = {
  rm
  ? { duration: 0 }
                        : {
  type: "tween",
    duration: 0.6,
      delay: 0.12 + i * 0.12,
        ease: [0.22, 1, 0.36, 1],
                          }
                    }
                  >
  <div className="flex-shrink-0" >
    <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm sm:shadow-md border border-cyan-100" >
      <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-600" />
        </div>
        </div>
        < div className = "text-left flex-1" >
          <h3 className="text-slate-900 mb-1.5 sm:mb-2 text-base sm:text-lg lg:text-xl font-bold tracking-tight" >
            { item.title }
            </h3>
            < p className = "text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed" >
              { item.desc }
              </p>
              </div>
              </motion.div>
                ))}
</div>

  < motion.div
className = "flex flex-col sm:flex-row gap-3 justify-center lg:justify-start w-full"
initial = { rm? { opacity: 1 } : { opacity: 0, y: 20 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true }}
transition = {
  rm
  ? { duration: 0 }
                    : { duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }
                }
              >
  <Link
                  to={ createPageUrl("ServicesOverview") }
className = "group flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base px-6 py-3.5 sm:py-4 rounded-sm sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
data - testid="link-scope-project"
  >
  <FileText className="w-5 h-5" />
    Scope Your Project
      </Link>
      < Link
to = { createPageUrl("About") }
className = "group flex-1 inline-flex items-center justify-center gap-2 text-slate-800 font-bold tracking-tight text-base px-6 py-3.5 sm:py-4 rounded-sm sm:rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none"
data - testid="link-about-team"
  >
  <Users className="w-5 h-5" /> About Our Team
    </Link>
    </motion.div>
    </div>

    < AnimatedSection
direction = "right"
delay = { 0.2}
className = "mt-4 lg:mt-0"
parallax
ease = "tween"
  >
  <div className="relative px-0 sm:px-4 lg:px-2" >
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-900 shadow-2xl" >
      <img
                    src="/images/telegraph-hill.jpg"
alt = "Pacific Engineering project context in the Bay Area"
className = "h-full w-full object-cover"
loading = "lazy"
data - testid="img-sf-projects"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />
    <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4" >
      <div className="rounded-full border border-white/15 bg-slate-950/55 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md" >
        Bay Area project proof
          </div>
          < div className = "rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-right text-white backdrop-blur-md shadow-lg" >
            <div className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/80" > Established </div>
              < div className = "mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight" > 2001 </div>
                </div>
                </div>
                < div className = "absolute left-5 right-5 bottom-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" >
                  <div className="rounded-2xl border border-white/12 bg-slate-950/62 px-5 py-4 text-white backdrop-blur-md shadow-xl" >
                    <div className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/80" > Proof point </div>
                      < p className = "mt-2 text-sm sm:text-base leading-relaxed text-slate-100/92" >
                        Project teams get coordinated engineering, compliance support, and construction - aware problem solving instead of disconnected handoffs.
                      </p>
                          </div>
                          < div className = "rounded-2xl border border-white/12 bg-gradient-to-br from-cyan-500 to-blue-600 px-5 py-4 text-white shadow-xl" >
                            <div className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-50/90" > Delivered </div>
                              < div
className = "mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight"
data - testid="text-projects-count"
  >
  <AnimatedCounter target={ 2500 } suffix = "+" />
    </div>
    < div className = "mt-1 text-[0.72rem] sm:text-xs font-bold uppercase tracking-[0.18em] text-cyan-50/90" >
      Successful Projects
        </div>
        </div>
        </div>
        </div>

        < div className = "mt-5 grid gap-3 sm:grid-cols-2" >
        {
          [
            "Permit-aware coordination",
            "Construction-minded decisions",
            "Stormwater and compliance discipline",
            "Faster path from scope to field execution",
                  ].map((item) => (
              <div
                      key= { item }
                      className = "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold tracking-tight text-slate-700 shadow-sm"
              >
              { item }
              </div>
            ))
        }
          </div>
          </div>
          </AnimatedSection>
          </div>
          </div>
          </section>
{/* ── WHY CHOOSE → CTA TRANSITION ── * / }
<div className="relative w-full" style = {{ marginTop: "3px" }} data - testid="divider-whychoose-cta" >
  <div className="h-1.5 bg-gradient-to-r from-slate-800 via-blue-600 to-cyan-500 bg-[length:200%] bg-center" style = {{ background: "linear-gradient(to right, #1e293b, #2563eb 30%, #06b6d4 50%, #2563eb 70%, #1e293b)" }} />
    < div className = "h-2px bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800" />
      </div>
{/* ── CTA ── * / }
<section
        ref={ ctaRef }
className = "relative bg-slate-900 overflow-hidden"
data - testid="section-cta"
  >
  <div
          className="absolute inset-0 hidden sm:block opacity-80"
  >
  <img
            src={ bayBridgeImg }
alt = ""
className = "w-full h-full object-cover"
style = {{ objectPosition: "center 35%", transform: "scale(1.15)" }}
          />
  </div>
  < div className = "absolute inset-0 bg-slate-900/50 hidden sm:block mix-blend-multiply" />
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-950/95 sm:from-slate-900/20 sm:to-slate-950/60" />
      <BlueprintGrid />
      < div
className = "absolute inset-0 opacity-[0.12] pointer-events-none z-[2]"
aria - hidden="true"
  >
  <AnimatedGridBackground />
  </div>

  < div className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-cyan-500/[0.06] rounded-full blur-[120px] pointer-events-none z-[3] animate-[cta-glow-pulse_6s_ease-in-out_infinite]" />
    <style>{`@keyframes cta-glow-pulse { 0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.08); } } @media (prefers-reduced-motion: reduce) { .animate-\\[cta-glow-pulse_6s_ease-in-out_infinite\\] { animation: none !important; } }`}</style>

      < div className = "relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24" >
        <motion.h2
            className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 sm:mb-8 tracking-tight text-[64px] font-semibold"
style = {{ textShadow: "0 0 40px rgba(6,182,212,0.15), 0 0 80px rgba(6,182,212,0.08)" }}
data - testid="text-cta-title"
initial = { rm? { opacity: 1 } : { opacity: 0, y: 40, filter: "blur(8px)" }}
whileInView = {{ opacity: 1, y: 0, filter: "blur(0px)" }}
viewport = {{ once: true, amount: 0.3 }}
transition = {
  rm? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
            }
          >
  Partner with Us
  < br className = "sm:hidden" />
    </motion.h2>
    < motion.p
className = "sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-8 sm:mb-12 font-light max-w-3xl mx-auto text-[22px]"
initial = { rm? { opacity: 1 } : { opacity: 0, y: 30 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true, amount: 0.3 }}
transition = {
  rm
  ? { duration: 0 }
                : { duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
            }
          >
  Engineering, inspections, construction, and stormwater — one team,
    one call.We respond same - day to keep your timeline intact.
          </motion.p>

      < motion.div
className = "inline-flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-8 justify-center items-center mb-8 sm:mb-12 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-lg sm:rounded-full px-4 sm:px-6 py-4 sm:py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
initial = { rm? { opacity: 1 } : { opacity: 0, y: 30 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true, amount: 0.3 }}
transition = {
  rm
  ? { duration: 0 }
                : { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
            }
          >
  <Link
              to={ createPageUrl("Consultation") }
className = "w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-[18px] bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(249,115,22,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none"
data - testid="link-cta-quote"
  >
  <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
    Talk to our Team
      </Link>
      < a
href = "tel:+14156894428"
className = "w-full sm:hidden px-10 py-4 text-white font-bold tracking-tight text-base rounded-sm flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(6,182,212,0.12)] transition-all duration-300 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)]"
data - testid="link-cta-call-mobile"
  >
  <Phone className="w-5 h-5" /> (415) 689 - 4428
    </a>
    < Link
to = { createPageUrl("Contact") }
className = "hidden sm:flex w-auto px-14 py-[18px] text-white font-bold tracking-tight text-lg rounded-full items-center justify-center gap-3 shadow-[0_4px_12px_rgba(6,182,212,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(6,182,212,0.45)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
data - testid="link-cta-contact"
  >
  Get in Touch
  < ArrowUpRight className = "w-5 h-5" />
    </Link>
    </motion.div>

    < div className = "flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 text-slate-300 text-xs sm:text-sm font-medium" >
    {
      [
        { icon: CheckCircle, label: "Licensed PE/QSD/QSP" },
        { icon: CheckCircle, label: "Class A & B Contractor" },
        { icon: CheckCircle, label: "2,500+ Projects" },
            ].map((badge, i) => (
          <motion.span
                key= { badge.label }
                className = "inline-flex items-center gap-1.5 sm:gap-2"
                initial = { rm? { opacity: 1 } : { opacity: 0, y: 12 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true, amount: 0.3 }}
transition = { rm? { duration: 0 } : { duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
  <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> { " "}
{ badge.label }
</motion.span>
            ))}
</div>
  </div>
  </section>
  </div>
  );
}
*/

// Canonical export moved to file top.
