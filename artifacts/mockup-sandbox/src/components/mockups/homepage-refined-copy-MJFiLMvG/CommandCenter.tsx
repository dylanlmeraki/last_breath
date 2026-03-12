import React, { useState, useEffect } from "react";
import {
  Activity,
  ChevronRight,
  Crosshair,
  Database,
  MapPin,
  ShieldAlert,
  Terminal,
  Cpu,
  Radio,
  Clock,
  ArrowRight
} from "lucide-react";

const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] overflow-hidden">
    <div className="w-full h-[200%] bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] animate-[scroll_20s_linear_infinite]" />
    <style>{`
      @keyframes scroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
      }
    `}</style>
  </div>
);

const StatusDot = ({ color = "green", pulse = true }) => {
  const colorClasses = {
    green: "bg-green-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div className="relative flex items-center justify-center h-2 w-2">
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colorClasses[color as keyof typeof colorClasses]}`}
        ></span>
      )}
      <span
        className={`relative inline-flex rounded-full h-2 w-2 ${colorClasses[color as keyof typeof colorClasses]}`}
      ></span>
    </div>
  );
};

const Panel = ({ title, children, delay = 0, className = "" }: { title: string, children: React.ReactNode, delay?: number, className?: string }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative border border-cyan-500/20 bg-slate-900/40 backdrop-blur-sm transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
      
      <div className="border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between bg-cyan-950/20">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/80 uppercase tracking-widest">
          <Terminal size={12} className="opacity-70" />
          {title}
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};

export default function CommandCenter() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toISOString().replace("T", " ").substring(0, 19) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-900 selection:text-cyan-100 relative overflow-hidden flex flex-col pt-12 sm:pt-16 pb-20" data-testid="page-home-command-center">
      <Scanlines />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="fixed top-0 left-0 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/pe-logo.png" alt="PE Logo" className="h-6 w-auto opacity-90 sepia-[.2] hue-rotate-[180deg] saturate-[2]" />
            <div className="flex items-center gap-3 border-l border-cyan-500/20 pl-4">
              <span className="font-mono text-sm tracking-widest text-white uppercase">Pacific Engineering</span>
              <span className="hidden sm:inline-block font-mono text-xs text-cyan-600 tracking-wider">SYS.01</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-500">
              <Clock size={12} />
              {time}
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <span className="hidden sm:inline">SYS_STATUS:</span>
              <span className="text-green-400 uppercase tracking-wider">Online</span>
              <StatusDot color="green" />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-4">
        
        <div className="w-full mb-8">
          <div className="font-mono text-xs text-cyan-500/60 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Radio size={14} className="animate-pulse" />
            Global Overview Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight uppercase" style={{ textShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
            Command <span className="text-cyan-400 font-light">Center</span>
          </h1>
          <div className="h-px w-full max-w-2xl bg-gradient-to-r from-cyan-500/50 to-transparent mt-4 mb-2" />
          <div className="font-mono text-xs sm:text-sm text-slate-400 tracking-wider">
            ENG // CONST // INSP // WTR // OP_DATA_STREAM
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 mb-8">
          
          {/* Panel 1: Capabilities */}
          <Panel title="SYS.CAPABILITIES" delay={100} className="lg:col-span-4">
            <ul className="space-y-4">
              {[
                { label: "Engineering Consulting", id: "ENG-01" },
                { label: "Construction Services", id: "CON-01" },
                { label: "Inspections & Testing", id: "INS-01" },
                { label: "Stormwater Planning", id: "STM-01" },
              ].map((item, i) => (
                <li key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-cyan-500/70">{item.id}</span>
                      <StatusDot color="cyan" pulse={false} />
                    </div>
                  </div>
                  <div className="h-1 w-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-500/40 w-full" style={{ width: `${85 + Math.random() * 15}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Panel 2: Credentials */}
          <Panel title="SEC.CREDENTIALS" delay={200} className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "PE License", val: "ACTIVE", type: "LIC" },
                { label: "QSD Cert", val: "ACTIVE", type: "CERT" },
                { label: "QSP Cert", val: "ACTIVE", type: "CERT" },
                { label: "Class A", val: "VERIFIED", type: "LIC" },
                { label: "Class B", val: "VERIFIED", type: "LIC" },
                { label: "OSHA 30", val: "ACTIVE", type: "SFTY" },
              ].map((cred, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-700 p-2 flex flex-col justify-between group hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] text-slate-500">{cred.type}</span>
                    <ShieldAlert size={10} className="text-cyan-500/50 group-hover:text-cyan-400" />
                  </div>
                  <div className="text-xs font-bold text-white mb-1 uppercase tracking-wider">{cred.label}</div>
                  <div className="font-mono text-[10px] text-green-400 flex items-center gap-1">
                    <CheckIcon /> {cred.val}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Panel 3: Metrics & Coverage */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            <Panel title="OP.METRICS" delay={300} className="flex-1">
              <div className="flex flex-col justify-around h-full gap-4">
                <div className="flex items-end justify-between border-b border-slate-800 pb-2">
                  <div className="text-slate-400 text-xs uppercase tracking-widest">Experience</div>
                  <div className="font-mono text-2xl text-white flex items-baseline gap-1">
                    40<span className="text-cyan-500 text-sm">+ YRS</span>
                  </div>
                </div>
                <div className="flex items-end justify-between border-b border-slate-800 pb-2">
                  <div className="text-slate-400 text-xs uppercase tracking-widest">Projects</div>
                  <div className="font-mono text-2xl text-white flex items-baseline gap-1">
                    2500<span className="text-cyan-500 text-sm">+</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-slate-400 text-xs uppercase tracking-widest">Scale</div>
                  <div className="font-mono text-lg text-cyan-400 uppercase tracking-widest">
                    Full-Scale
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="GEO.COVERAGE" delay={400}>
              <div className="relative h-24 bg-slate-900/80 border border-cyan-500/10 overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <Crosshair className="absolute text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors" size={64} strokeWidth={1} />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-cyan-400 mb-1">
                    <MapPin size={14} />
                    <span className="font-bold text-sm uppercase tracking-widest">SF Bay Area</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    LAT: 37.7749 // LNG: -122.4194
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {/* Action Bar */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white font-mono uppercase tracking-widest text-sm font-bold flex items-center justify-between gap-6 transition-all border border-orange-400 hover:shadow-[0_0_15px_rgba(234,88,12,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-orange-200">CMD_01:</span>
                Request Quote
              </div>
              <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group relative px-6 py-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono uppercase tracking-widest text-sm font-bold flex items-center justify-between gap-6 transition-all border border-cyan-500/30 hover:border-cyan-400">
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-slate-500">CMD_02:</span>
                Schedule Consult
              </div>
              <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-widest flex-wrap">
            <span className="flex items-center gap-1.5"><Activity size={12} className="text-cyan-500" /> Same-Day Response</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5"><Database size={12} className="text-cyan-500" /> No Obligations</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5"><Cpu size={12} className="text-cyan-500" /> Bay Area Coverage Active</span>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
