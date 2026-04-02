import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createPageUrl } from "../lib/utils";
import SEO from "../components/SEO";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedCounter from "../components/AnimatedCounter";
import { ServiceCardsGrid } from "../components/ServiceCards";
import HomeProofRail from "../components/HomeProofRail";
import HomeProjectEvidence from "../components/HomeProjectEvidence";
import CTASection from "../components/CTASection";
import WhyPacific from "../components/WhyPacific";
import BlueprintBackground from "../components/BlueprintBackground";
import bayBridgeImg from "@assets/bay-bridge-sunrise_1773821710974.jpg";

interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  note: string;
}

const STATS: StatItem[] = [
  {
    icon: ShieldCheck,
    value: 2500,
    suffix: "+",
    label: "Projects Supported",
    note: "Infrastructure, utility, and institutional scopes across Northern California.",
  },
  {
    icon: FileCheck2,
    value: 25,
    suffix: "+",
    label: "Years in Practice",
    note: "Field-grounded delivery across planning, coordination, and compliance.",
  },
  {
    icon: Sparkles,
    value: 100,
    suffix: "%",
    label: "Compliance Focused",
    note: "Permit-aware documentation and disciplined site execution from day one.",
  },
];

const TRUST_POINTS = [
  "Licensed PE/QSD/QSP capabilities",
  "Class A and Class B contractor experience",
  "Integrated engineering and construction perspective",
];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const springScale = useSpring(scrollYProgress, { stiffness: 220, damping: 30 });
  const scaleX = prefersReducedMotion ? scrollYProgress : springScale;

  return (
    <motion.div
      className="fixed left-0 right-0 top-20 z-50 h-[2px] origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
      style={{ scaleX }}
    />
  );
}

function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.5)] sm:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      data-testid="mobile-sticky-bar"
    >
      <a
        href="tel:+14156894428"
        className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-white/10 py-3 text-sm font-bold text-white transition-colors active:bg-white/20"
        data-testid="btn-sticky-call"
      >
        <PhoneCall className="h-4 w-4 text-cyan-400" />
        Call Now
      </a>
      <Link
        to={createPageUrl("Consultation")}
        className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-orange-600 py-3 text-sm font-bold text-white shadow-md transition-colors active:bg-orange-500"
        data-testid="btn-sticky-quote"
      >
        Get Quote
      </Link>
    </div>
  );
}

function StatCard({ item }: { item: StatItem }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
      <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2.5">
        <Icon className="h-5 w-5 text-cyan-300" />
      </div>
      <p className="text-3xl font-bold text-white sm:text-4xl">
        <AnimatedCounter target={item.value} suffix={item.suffix} />
      </p>
      <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-cyan-200">
        {item.label}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">{item.note}</p>
    </div>
  );
}

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <SEO
        title="Pacific Engineering & Construction | Bay Area Civil, Structural, and Compliance Services"
        description="Civil and structural engineering, construction support, and compliance-first project delivery for Bay Area infrastructure and development teams."
        keywords="bay area engineering, civil engineering, structural consulting, inspections and testing, stormwater planning"
        url="/"
      />

      <ScrollProgress />

      <section className="relative isolate overflow-hidden bg-slate-950 pb-20 pt-20 sm:pb-24 lg:pt-24">
        <img
          src={bayBridgeImg}
          alt="San Francisco Bay Bridge at sunrise"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-950" />
        <BlueprintBackground className="opacity-60" />

        <div className="relative z-10 pe-container-wide">
          <div className="max-w-3xl pe-stack-sm">
            <span className="eyebrow warm text-orange-300">Bay Area Field-Proven Partner</span>
            <motion.h1
              className="pe-heading-1 text-white"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.65 }}
            >
              Engineering and Construction Support Built for Real Jobsite Conditions
            </motion.h1>
            <motion.p
              className="pe-lead text-slate-200"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.65, delay: 0.1 }}
            >
              Pacific helps owners, developers, and contractors move projects from
              permitting through closeout with practical coordination, compliance
              clarity, and dependable execution.
            </motion.p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link
              to={createPageUrl("Consultation")}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500"
              data-testid="btn-hero-consultation"
            >
              Start Project Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={createPageUrl("ProjectGallery")}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              data-testid="btn-hero-projects"
            >
              View Project Experience
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-200">
            {TRUST_POINTS.map((point) => (
              <div key={point} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <AnimatedSection className="mt-10 sm:mt-12" direction="up" delay={0.15}>
            <div className="grid gap-4 md:grid-cols-3">
              {STATS.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <HomeProofRail />

      <section className="pe-section">
        <div className="pe-container-wide pe-stack">
          <div className="pe-stack-sm" style={{ maxWidth: "56rem" }}>
            <span className="eyebrow cool">Service Coverage</span>
            <h2 className="pe-heading-2">
              Multi-Discipline Support for Complex Bay Area Delivery
            </h2>
            <p className="pe-lead">
              Explore focused service lanes built around constructability, permit
              readiness, and clear owner-contractor coordination.
            </p>
          </div>
          <ServiceCardsGrid />
        </div>
      </section>

      <HomeProjectEvidence />

      <section className="pe-section pe-section-tight bg-slate-50">
        <div className="pe-container-wide pe-grid-2">
          <AnimatedSection direction="left">
            <div className="pe-stack-sm">
              <span className="eyebrow">Why Teams Choose Pacific</span>
              <h2 className="pe-heading-3">
                We keep technical decisions connected to field realities.
              </h2>
              <p className="pe-copy">
                Our work style is practical and accountability-first: clear
                documentation, proactive coordination, and direct communication
                with project stakeholders at every phase.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <WhyPacific />
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        headline="Ready to De-Risk Your Next Project?"
        body="Let’s align scope, permitting requirements, and field execution early so delivery stays predictable."
        primaryButtonText="Book Consultation"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="home-final-cta"
        backgroundImage={bayBridgeImg}
      />

      <MobileStickyBar />
    </>
  );
}
