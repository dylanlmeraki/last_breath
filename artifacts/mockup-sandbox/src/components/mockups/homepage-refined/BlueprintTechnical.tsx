import React, { useState, useEffect, useRef } from "react";
import { 
  PhoneCall, 
  Clock, 
  ArrowRight, 
  Crosshair, 
  Map, 
  Ruler, 
  Settings2, 
  ChevronRight 
} from "lucide-react";

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

const TechnicalGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-slate-950" />
    {/* Major grid lines (60px) */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
    {/* Minor grid lines (12px) */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:12px_12px]" />
    
    {/* Ambient radial gradients */}
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-800/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
  </div>
);

const DimensionLine = ({ 
  orientation, 
  length, 
  label, 
  className = "" 
}: { 
  orientation: 'horizontal' | 'vertical', 
  length: string, 
  label: string, 
  className?: string 
}) => {
  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-2 w-px bg-cyan-500/50" />
        <div className="flex-1 h-px bg-cyan-500/30 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2 font-mono text-[10px] text-cyan-400/80 tracking-widest">
            {label}
          </div>
        </div>
        <div className="h-2 w-px bg-cyan-500/50" />
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center gap-2 h-full ${className}`}>
      <div className="w-2 h-px bg-cyan-500/50" />
      <div className="w-px flex-1 bg-cyan-500/30 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 py-2 font-mono text-[10px] text-cyan-400/80 tracking-widest [writing-mode:vertical-rl]">
          {label}
        </div>
      </div>
      <div className="w-2 h-px bg-cyan-500/50" />
    </div>
  );
};

export default function BlueprintTechnical() {
  return (
    <div className="relative min-h-[100svh] bg-slate-950 flex flex-col font-sans overflow-hidden" data-testid="blueprint-technical-hero">
      <TechnicalGrid />
      
      {/* Top border technical markings */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-cyan-500/20 z-10 flex items-center px-4 justify-between font-mono text-[10px] text-cyan-600/60 hidden md:flex">
        <div className="flex items-center gap-4">
          <span>DWG NO: PE-2024-X1</span>
          <span className="w-px h-4 bg-cyan-500/20" />
          <span>SCALE: NTS</span>
        </div>
        <div className="flex items-center gap-4">
          <span>REV: 03</span>
          <span className="w-px h-4 bg-cyan-500/20" />
          <span>DATE: {new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-24 pb-12">
        
        {/* Left Column: Title Block & Content */}
        <div className="w-full lg:w-3/5 xl:w-1/2 flex flex-col justify-center">
          
          {/* Section Marker */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center relative">
              <div className="w-full h-px bg-cyan-500/40 absolute top-1/2 -translate-y-1/2" />
              <div className="w-px h-full bg-cyan-500/40 absolute left-1/2 -translate-x-1/2" />
            </div>
            <span className="font-mono text-xs text-cyan-400 tracking-[0.2em] uppercase">Sec A-A / Elevation</span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent ml-4" />
          </div>

          <div className="mb-6">
            <img 
              src="/images/pe-logo.png" 
              alt="Pacific Engineering Logo" 
              className="h-16 w-16 md:h-20 md:w-20 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-900/20 mb-8"
            />
            
            <h1 className="text-white font-bold tracking-tighter leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4" data-testid="hero-title">
              Pacific Engineering
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">
                & Construction Inc.
              </span>
            </h1>
            
            <p className="text-cyan-100/70 font-mono text-sm sm:text-base md:text-lg mb-8 max-w-xl leading-relaxed border-l-2 border-cyan-500/30 pl-4" data-testid="hero-subtitle">
              Bay Area Consulting Engineers & Contractors
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-wide transition-all overflow-hidden" data-testid="btn-quote">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-no-repeat [background-position:-100%_0,0_0] group-hover:[transition:background-position_2s_ease-in-out] group-hover:[background-position:200%_0,0_0]" />
              <span className="relative flex items-center justify-center gap-2">
                <PhoneCall className="w-5 h-5" />
                Request a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="group px-8 py-4 border border-cyan-500/50 hover:bg-cyan-950/50 text-cyan-400 hover:text-cyan-300 font-bold tracking-wide transition-all flex items-center justify-center gap-2 backdrop-blur-sm" data-testid="btn-consult">
              <Clock className="w-5 h-5" />
              Schedule a Consult
            </button>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs text-cyan-500/60 uppercase tracking-wider" data-testid="hero-trust">
            <Crosshair className="w-4 h-4" />
            <span>Same-day response</span>
            <span className="text-cyan-500/30">•</span>
            <span>No obligations</span>
            <span className="text-cyan-500/30">•</span>
            <span>40+ years Bay Area expertise</span>
          </div>
        </div>

        {/* Right Column: Technical Details & Stats */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative mt-16 lg:mt-0 pl-12 flex-col justify-center">
          
          {/* Vertical Dimension Line */}
          <div className="absolute left-0 top-0 bottom-0 py-8">
            <DimensionLine orientation="vertical" length="100%" label="SPECIFICATION SHEET" />
          </div>

          <div className="w-full border border-cyan-500/20 bg-slate-900/40 backdrop-blur-md relative overflow-hidden">
            {/* Spec Sheet Header */}
            <div className="border-b border-cyan-500/20 bg-cyan-950/30 px-6 py-3 flex justify-between items-center">
              <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">Performance Specifications</span>
              <Settings2 className="w-4 h-4 text-cyan-500/50" />
            </div>

            {/* Spec Table */}
            <div className="divide-y divide-cyan-500/10 font-mono text-sm" data-testid="hero-stats">
              <div className="flex group hover:bg-cyan-900/20 transition-colors">
                <div className="w-1/3 p-4 border-r border-cyan-500/10 text-cyan-600/70 uppercase text-xs flex items-center">
                  Experience
                </div>
                <div className="w-2/3 p-4 text-cyan-100 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white"><AnimatedCounter target={40} />+</span>
                  <span className="text-xs text-cyan-500/70">Years</span>
                </div>
              </div>
              
              <div className="flex group hover:bg-cyan-900/20 transition-colors">
                <div className="w-1/3 p-4 border-r border-cyan-500/10 text-cyan-600/70 uppercase text-xs flex items-center">
                  Capability
                </div>
                <div className="w-2/3 p-4">
                  <span className="text-white font-bold block mb-1">Full-Service</span>
                  <span className="text-xs text-cyan-500/70">Vertically Integrated</span>
                </div>
              </div>
              
              <div className="flex group hover:bg-cyan-900/20 transition-colors">
                <div className="w-1/3 p-4 border-r border-cyan-500/10 text-cyan-600/70 uppercase text-xs flex items-center">
                  Scope
                </div>
                <div className="w-2/3 p-4">
                  <span className="text-white font-bold block mb-1">Full-Scale</span>
                  <span className="text-xs text-cyan-500/70">Residential, Commercial & Infrastructure</span>
                </div>
              </div>
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
          </div>

          {/* Coordinate Annotation */}
          <div className="absolute right-0 bottom-4 flex items-center gap-2 text-cyan-500/40 font-mono text-[10px]">
            <Map className="w-3 h-3" />
            <span>N 37.7749° W 122.4194°</span>
          </div>

        </div>

      </main>
      
      {/* Bottom border dimension line */}
      <div className="absolute bottom-8 left-8 right-8 hidden md:block z-0">
        <DimensionLine orientation="horizontal" length="100%" label="BAY AREA REGION" />
      </div>

    </div>
  );
}
