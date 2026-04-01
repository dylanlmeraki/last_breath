import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { createPageUrl } from "../lib/utils";
import {
  CheckCircle,
  ClipboardCheck,
  Compass,
  Droplets,
  HardHat,
} from "lucide-react";

export const SERVICES = [
  {
    icon: HardHat,
    title: "Construction Service",
    desc: "Field-driven construction support for site improvements, utility work, rehabilitation, and phased project delivery. We help teams move work forward with constructable planning, disciplined coordination, and execution aligned with real Bay Area field conditions.",
    items: ["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial, and Municipal Infrastructure"],
    color: "darkblue" as const,
    page: "Construction",
  },
  {
    icon: Compass,
    title: "Engineering Consulting",
    desc: "Civil and structural engineering support shaped by constructability, site realities, and jurisdictional requirements. Our approach helps bridge the gap between design intent, approvals, and what it actually takes to deliver the work.",
    items: ["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management & Support"],
    color: "bluecyan" as const,
    page: "StructuralEngineering",
  },
  {
    icon: ClipboardCheck,
    title: "Inspections & Testing",
    desc: "Inspection, observation, testing coordination, and quality documentation to support compliance, accountability, and closeout. We help teams maintain clear records and dependable field communication throughout active project delivery.",
    items: ["Structural Systems Inspections", "Stormwater Testing and Inspections", "Materials Sampling & Testing", "Environmental Compliance"],
    color: "cyan" as const,
    page: "InspectionsTesting",
  },
  {
    icon: Droplets,
    title: "Stormwater Planning",
    desc: "Stormwater planning and compliance support for projects that require practical drainage thinking, permit awareness, and coordinated documentation. We help teams address erosion control, runoff strategy, and submittal-related requirements with clarity.",
    items: ["In-house PE/QSD/QSP site assessment", "BMP design and maintenance", "Clear documentation with action items", "Full local, state, and Federal compliance assurance"],
    color: "cyanteal" as const,
    page: "Services",
  },
];

export const colorMap = {
  darkblue: {
    bg: "bg-slate-100", hoverBg: "group-hover:from-blue-400 group-hover:to-sky-500",
    icon: "text-slate-700", check: "text-blue-500", border: "from-blue-500 to-sky-500",
    titleHover: "group-hover:text-blue-600", textHover: "group-hover:text-blue-600/80",
    checkHover: "group-hover:text-sky-500", cardBgHover: "group-hover:bg-blue-50/40", h: "h-1.5",
    shadowColor: "rgba(30,58,138,0.22)",
    gradient: "linear-gradient(to right, #3b82f6, #0ea5e9, #06b6d4, #22d3ee)",
    iconGradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)",
    icon3dShadow: "0 6px 16px -2px rgba(29,78,216,0.5), 0 2px 6px -1px rgba(29,78,216,0.3), inset 0 1px 1px rgba(255,255,255,0.25)",
  },
  bluecyan: {
    bg: "bg-slate-100", hoverBg: "group-hover:from-cyan-400 group-hover:to-teal-500",
    icon: "text-slate-700", check: "text-teal-500", border: "from-cyan-500 to-teal-500",
    titleHover: "group-hover:text-teal-600", textHover: "group-hover:text-teal-600/80",
    checkHover: "group-hover:text-teal-400", cardBgHover: "group-hover:bg-teal-50/40", h: "h-1.5",
    shadowColor: "rgba(13,148,136,0.22)",
    gradient: "linear-gradient(to right, #22d3ee, #5eead4, #2dd4bf, #14b8a6)",
    iconGradient: "linear-gradient(135deg, #5eead4 0%, #14b8a6 40%, #0d9488 100%)",
    icon3dShadow: "0 6px 16px -2px rgba(13,148,136,0.5), 0 2px 6px -1px rgba(13,148,136,0.3), inset 0 1px 1px rgba(255,255,255,0.25)",
  },
  cyan: {
    bg: "bg-slate-100", hoverBg: "group-hover:from-teal-400 group-hover:to-cyan-500",
    icon: "text-slate-700", check: "text-teal-500", border: "from-teal-500 to-cyan-500",
    titleHover: "group-hover:text-teal-600", textHover: "group-hover:text-teal-600/80",
    checkHover: "group-hover:text-cyan-400", cardBgHover: "group-hover:bg-teal-50/40", h: "h-1.5",
    shadowColor: "rgba(13,148,136,0.22)",
    gradient: "linear-gradient(to right, #14b8a6, #2dd4bf, #22d3ee, #06b6d4)",
    iconGradient: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 40%, #0f766e 100%)",
    icon3dShadow: "0 6px 16px -2px rgba(15,118,110,0.5), 0 2px 6px -1px rgba(15,118,110,0.3), inset 0 1px 1px rgba(255,255,255,0.25)",
  },
  cyanteal: {
    bg: "bg-slate-100", hoverBg: "group-hover:from-cyan-500 group-hover:to-blue-500",
    icon: "text-slate-700", check: "text-cyan-600", border: "from-cyan-500 to-blue-500",
    titleHover: "group-hover:text-cyan-600", textHover: "group-hover:text-cyan-600/80",
    checkHover: "group-hover:text-blue-400", cardBgHover: "group-hover:bg-cyan-50/40", h: "h-1.5",
    shadowColor: "rgba(8,145,178,0.22)",
    gradient: "linear-gradient(to right, #06b6d4, #0ea5e9, #3b82f6, #3b82f6)",
    iconGradient: "linear-gradient(135deg, #22d3ee 0%, #0891b2 40%, #0e7490 100%)",
    icon3dShadow: "0 6px 16px -2px rgba(14,116,144,0.5), 0 2px 6px -1px rgba(14,116,144,0.3), inset 0 1px 1px rgba(255,255,255,0.25)",
  },
};

export function ServiceCard({ svc, idx, reducedMotion }: { svc: typeof SERVICES[number]; idx: number; reducedMotion: boolean }) {
  const c = colorMap[svc.color];
  const Icon = svc.icon;
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translateY(-0.5rem) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    el.style.boxShadow = `0 25px 50px -12px ${c.shadowColor}, 0 12px 24px -8px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.06)`;
  }, [c.shadowColor, reducedMotion]);

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
          className={`h-full bg-white ${c.cardBgHover} rounded-md shadow-md sm:shadow-lg border border-slate-200 group-hover:border-slate-300 group-hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer`}
          style={{
            transition: reducedMotion ? "border-color 0.5s ease, background-color 0.5s ease" : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, border-color 0.5s ease, background-color 0.5s ease",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className={c.h} style={{ background: c.gradient }} />
          <div className="p-5 sm:p-8 lg:p-10 flex flex-col items-center text-center">
            <div
              ref={iconRef}
              className={`${c.bg} rounded-md w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 transition-all duration-300 relative`}
            >
              <div
                className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: c.iconGradient, boxShadow: c.icon3dShadow }}
              />
              <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-white/20 via-transparent to-black/10" />
              <Icon className={`relative z-10 w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${c.icon} group-hover:text-white transition-colors duration-300`} style={{ filter: "var(--icon-drop)" }} />
              <style>{`.group:hover [data-icon-3d] { --icon-drop: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }`}</style>
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

export function ServiceCardsGrid() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
      {SERVICES.map((svc, idx) => (
        <ServiceCard
          key={svc.title}
          svc={svc}
          idx={idx}
          reducedMotion={!!prefersReducedMotion}
        />
      ))}
    </div>
  );
}
