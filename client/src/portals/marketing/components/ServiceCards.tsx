import { useRef } from "react";
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
    title: "Construction Services",
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
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
    >
      <Link to={createPageUrl(svc.page)} className="block group h-full" data-testid={`link-${svc.title.toLowerCase().replace(/\s+/g, "-")}`}>
        <div
          className="h-full rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 group-hover:border-slate-300 group-hover:shadow-md sm:p-7 lg:p-8"
        >
          <div className="flex h-full flex-col items-start text-left">
            <div className={`${c.bg} mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg`}>
              <Icon
                className={`h-6 w-6 ${c.icon}`}
              />
            </div>
            <h3 className="mb-3 text-xl font-bold tracking-tight text-slate-900 sm:text-[1.35rem]">
              {svc.title}
            </h3>
            <p className="mb-6 text-sm leading-7 text-slate-600 sm:text-[0.98rem]">{svc.desc}</p>
            <ul className="w-full space-y-2.5 border-t border-slate-200 pt-5">
              {svc.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${c.check}`} />
                  <span className="text-sm font-medium leading-6 sm:text-[0.96rem]">{item}</span>
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
