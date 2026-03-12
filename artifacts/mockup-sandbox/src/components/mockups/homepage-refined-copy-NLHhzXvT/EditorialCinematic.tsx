import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        transition: `opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
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

export default function EditorialCinematic() {
  return (
    <div
      className="min-h-screen bg-slate-950 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-50 relative flex flex-col overflow-hidden"
      data-testid="page-home-editorial-cinematic"
    >
      {/* Background - Supreme restraint */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
      </div>

      <main className="flex-grow flex flex-col relative z-10 min-h-screen">
        <section
          className="relative flex-grow flex flex-col justify-between pt-12 sm:pt-16 pb-0"
          data-testid="section-hero"
        >
          {/* Top subtle branding */}
          <div className="w-full px-6 sm:px-12 md:px-24 flex justify-center items-start">
            <AnimatedSection delay={0} direction="none" className="flex flex-col items-center gap-6">
              <img
                src="/images/pe-logo.png"
                alt="Pacific Engineering Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
              <div className="w-1.5 h-1.5 rotate-45 bg-cyan-500/40"></div>
            </AnimatedSection>
          </div>

          {/* Main Typography Architecture */}
          <div className="w-full px-6 sm:px-12 md:px-24 flex-grow flex flex-col justify-center py-20 mt-8 sm:mt-16">
            <AnimatedSection delay={0.2} direction="up" className="max-w-full">
              <h1
                className="text-white tracking-tighter leading-[0.85] font-extrabold -ml-1 sm:-ml-2 md:-ml-3"
                style={{ fontSize: "clamp(4rem, 13vw, 13rem)" }}
                data-testid="text-hero-title"
              >
                PACIFIC
                <br />
                ENGINEERING
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.4} direction="up">
              <h2
                className="text-slate-400 font-light tracking-[0.2em] mt-8 sm:mt-12 pl-1 sm:pl-2 md:pl-4"
                style={{ fontSize: "clamp(1.25rem, 3vw, 2.5rem)" }}
              >
                & Construction Inc.
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.6} direction="up" className="mt-20 sm:mt-28 md:mt-36 max-w-2xl pl-1 sm:pl-2 md:pl-4">
              <p
                className="text-cyan-400 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-10"
                data-testid="text-hero-subtitle"
              >
                Bay Area Consulting Engineers & Contractors
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <button
                  className="group relative inline-flex items-center justify-center gap-3 whitespace-nowrap text-white text-[11px] sm:text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-full bg-orange-600 hover:bg-orange-500 transition-all duration-300"
                  data-testid="btn-hero-quote"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  className="group relative inline-flex items-center justify-center gap-3 whitespace-nowrap text-cyan-50 text-[11px] sm:text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-full bg-cyan-900/40 border border-cyan-500/30 hover:bg-cyan-800/60 hover:border-cyan-400/50 transition-all duration-300"
                  data-testid="btn-hero-consultation"
                >
                  <span>Schedule a Consult</span>
                </button>
              </div>
            </AnimatedSection>
          </div>

          {/* Bottom Data / Trust Architecture */}
          <div className="w-full px-6 sm:px-12 md:px-24 pb-10 sm:pb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mt-12">
            <AnimatedSection delay={0.8} direction="none">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-300 font-light tracking-widest text-xs sm:text-sm uppercase" data-testid="stats-container">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium text-base sm:text-lg"><AnimatedCounter target={40} />+</span>
                  <span className="text-slate-500 text-[10px] sm:text-xs">Years</span>
                </div>
                <div className="w-px h-3 bg-slate-800"></div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium text-base sm:text-lg">Full</span>
                  <span className="text-slate-500 text-[10px] sm:text-xs">Service</span>
                </div>
                <div className="w-px h-3 bg-slate-800"></div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium text-base sm:text-lg">Full</span>
                  <span className="text-slate-500 text-[10px] sm:text-xs">Scale</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={1.0} direction="none">
              <p
                className="text-slate-600 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium max-w-sm text-left lg:text-right leading-relaxed"
                data-testid="text-hero-trust"
              >
                Same-day response · No obligations · Res, Comm & Infra
              </p>
            </AnimatedSection>
          </div>

          {/* Bottom structural line */}
          <div className="w-full h-px bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-500 opacity-80"></div>
        </section>
      </main>
    </div>
  );
}
