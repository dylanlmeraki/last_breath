import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileText,
  PhoneCall,
  Shield,
  Users,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedCounter from "../components/AnimatedCounter";
import BlueprintBackground from "../components/BlueprintBackground";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import CTASection from "../components/CTASection";
import FeaturedProjectCards from "../components/FeaturedProjectCards";
import HomeProjectEvidence from "../components/HomeProjectEvidence";
import HomeProofRail from "../components/HomeProofRail";
import SEO from "../components/SEO";
import { ServiceCardsGrid } from "../components/ServiceCards";
import WhyPacific from "../components/WhyPacific";
import { createPageUrl } from "../lib/utils";
import bayBridgeImg from "@assets/bay-bridge-sunrise_1773821710974.jpg";

const HERO_TRUST_POINTS = [
  "Bay Area engineering and compliance support",
  "Field-aware planning across public and private scopes",
  "Permit-minded coordination from preconstruction forward",
];

const VALUE_CARDS = [
  {
    icon: Award,
    title: "Technical Excellence",
    body: "PE-led judgment, disciplined documentation, and clear technical communication.",
  },
  {
    icon: Shield,
    title: "Compliance Discipline",
    body: "Stormwater, inspections, and field requirements treated as delivery work, not afterthoughts.",
  },
  {
    icon: Users,
    title: "Collaborative Delivery",
    body: "Owners, design partners, agencies, and field teams kept aligned through one practical workflow.",
  },
  {
    icon: FileText,
    title: "Project Momentum",
    body: "Scope, timing, and documentation staged early so project teams can keep moving.",
  },
] as const;

export default function HomeRecovered() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-white antialiased" data-testid="page-home">
      <SEO
        title="Pacific Engineering & Construction Inc. - Consulting Engineers and Contractors"
        description="Bay Area engineering, inspections, stormwater compliance, and construction-minded coordination for project teams that need practical delivery support."
        keywords="Pacific Engineering, Bay Area engineering, stormwater compliance, special inspections, structural engineering, construction coordination"
        url="/"
      />

      <section
        className="relative isolate overflow-hidden bg-slate-950"
        data-testid="section-hero"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        >
          <source src="/images/hero-ggb-draft.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/75 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/25 via-transparent to-orange-950/15" />
        <AnimatedGridBackground
          baseOpacity={0.45}
          gridSize={40}
          triggerInterval={500}
          animationDuration={2500}
          className="hidden opacity-30 sm:block"
        />
        <BlueprintBackground className="opacity-60" />

        <div className="relative z-10 pe-container-wide py-16 sm:py-20 lg:py-24">
          <div className="home-hero-shell">
            <div className="home-hero-copy pe-inverse">
              <div className="max-w-3xl pe-stack-sm">
                <span className="eyebrow warm text-orange-300">
                  Bay Area Field-Proven Partner
                </span>
                <motion.h1
                  className="pe-heading-1 text-white"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7 }}
                >
                  Pacific Engineering and Construction.
                </motion.h1>
                <motion.p
                  className="pe-lead text-slate-200"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.08 }
                  }
                >
                  Engineering, inspections, stormwater compliance, and
                  construction-minded coordination shaped around how Bay Area
                  projects actually move from scope through field execution.
                </motion.p>
              </div>

              <motion.div
                className="home-hero-actions mt-8 flex flex-col gap-3 sm:flex-row"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.65, delay: 0.16 }
                }
              >
                <Link to={createPageUrl("Consultation")} className="pe-button">
                  <PhoneCall className="h-5 w-5" />
                  Review Project Scope
                </Link>
                <Link to={createPageUrl("ServicesOverview")} className="pe-button-secondary">
                  Explore Services
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <div className="home-hero-trust mt-8 flex flex-wrap gap-4 text-sm text-slate-200">
                {HERO_TRUST_POINTS.map((point) => (
                  <div key={point} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <AnimatedSection className="home-hero-metrics-wrap" direction="up" delay={0.18}>
              <div className="home-hero-metrics">
                <div className="home-hero-metric-card">
                  <p className="text-3xl font-bold text-white sm:text-4xl">
                    <AnimatedCounter target={40} suffix="+" />
                  </p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-cyan-200">
                    Years of Bay Area experience
                  </p>
                </div>
                <div className="home-hero-metric-card">
                  <p className="text-3xl font-bold text-white sm:text-4xl">
                    <AnimatedCounter target={2500} suffix="+" />
                  </p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-cyan-200">
                    Projects supported
                  </p>
                </div>
                <div className="home-hero-metric-card">
                  <p className="text-3xl font-bold text-white sm:text-4xl">PE / QSD / QSP</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-cyan-200">
                    In-house technical coverage
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <HomeProofRail />

      <HomeProjectEvidence />

      <section className="pe-section pe-section-tight section-surface-soft">
        <div className="pe-container-wide pe-stack">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="pe-stack-sm" style={{ maxWidth: "50rem" }}>
              <span className="eyebrow">Selected Work</span>
              <h2 className="pe-heading-3">
                A tighter read on the kinds of scopes Pacific supports.
              </h2>
            </div>
            <Link to={createPageUrl("ProjectGallery")} className="pe-link-inline">
              Visit the project gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FeaturedProjectCards />
        </div>
      </section>

      <section className="pe-section section-surface-solid" data-testid="section-services">
        <div className="pe-container-wide pe-stack">
          <div className="pe-stack-sm" style={{ maxWidth: "56rem" }}>
            <span className="eyebrow cool">Service Coverage</span>
            <h2 className="pe-heading-2">
              Multi-discipline support designed around delivery, not silos.
            </h2>
            <p className="pe-lead">
              Civil and structural support, inspections, stormwater compliance, and
              project coordination aligned so scope, permitting, and field execution
              stay connected.
            </p>
          </div>
          <ServiceCardsGrid />
        </div>
      </section>

      <section className="pe-section section-surface-dark pe-inverse">
        <div className="pe-container-wide pe-stack">
          <div className="pe-stack-sm" style={{ maxWidth: "44rem" }}>
            <span className="eyebrow cool">How We Work</span>
            <h2 className="pe-heading-2 text-white">
              Pacific is built around accountable project support.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {VALUE_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pe-section section-surface-soft">
        <div className="pe-container-wide pe-grid-2">
          <AnimatedSection direction="left">
            <div className="pe-stack-sm">
              <span className="eyebrow">Why Pacific</span>
              <h2 className="pe-heading-2">
                Engineering judgment shaped by field reality.
              </h2>
              <p className="pe-lead">
                Pacific keeps engineering, compliance, and construction coordination
                in one conversation so teams get a practical path forward instead of
                disconnected handoffs.
              </p>
              <Link to={createPageUrl("About")} className="pe-link-inline">
                Meet the team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <WhyPacific />
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        headline="Ready to Get the Project Moving?"
        body="Let us align scope, permitting requirements, and field realities early so the project can move with clarity."
        primaryButtonText="Book Consultation"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="home-final-cta"
        backgroundImage={bayBridgeImg}
      />
    </div>
  );
}
