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
  "Public, institutional, utility, and waterfront scopes",
  "PE / QSD / QSP and contractor-backed support",
  "Documentation, inspection, and closeout discipline",
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/74 via-slate-950/82 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/12 via-transparent to-orange-950/6" />
        <AnimatedGridBackground
          baseOpacity={0.18}
          gridSize={40}
          triggerInterval={500}
          animationDuration={2500}
          className="hidden opacity-15 sm:block"
        />
        <BlueprintBackground className="opacity-22" />

        <div className="relative z-10 pe-container-wide py-16 sm:py-20 lg:py-24">
          <div className="home-hero-shell">
            <div className="home-hero-copy pe-inverse">
              <div className="max-w-3xl pe-stack-sm">
                <span className="eyebrow warm text-orange-300">
                  Bay Area Engineering + Construction Partner
                </span>
                <motion.h1
                  className="pe-heading-1 text-white"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7 }}
                >
                  Pacific Engineering & Construction Inc.
                </motion.h1>
                <motion.p
                  className="pe-lead text-slate-200"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.08 }
                  }
                >
                  Engineering, inspections, stormwater compliance, permitting
                  coordination, and construction-minded support shaped around
                  how Bay Area projects move from preconstruction through
                  closeout.
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
              <div className="home-hero-aside-header hidden lg:grid">
                <span className="eyebrow cool">Credentials + Coverage</span>
                <p className="home-hero-aside-copy">
                  One working partner for engineering, compliance, inspections,
                  and contractor-backed project support.
                </p>
              </div>
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

      <div className="pe-container-wide" aria-hidden="true">
        <div className="pe-section-divider" />
      </div>

      <HomeProjectEvidence />

      <div className="pe-container-wide" aria-hidden="true">
        <div className="pe-section-divider" />
      </div>

      <section className="pe-section pe-section-tight section-surface-soft">
        <div className="pe-container-wide pe-stack">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="pe-stack-sm" style={{ maxWidth: "50rem" }}>
              <span className="eyebrow">Selected Work</span>
              <h2 className="pe-heading-3">
                Representative project work tied to actual Bay Area delivery
                conditions.
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

      <div className="pe-container-wide" aria-hidden="true">
        <div className="pe-section-divider" />
      </div>

      <section className="pe-section pe-section-tight section-surface-solid" data-testid="section-services">
        <div className="pe-container-wide pe-stack">
          <div className="pe-stack-sm" style={{ maxWidth: "56rem" }}>
            <span className="eyebrow cool">Service Coverage</span>
            <h2 className="pe-heading-2">
              Support coverage built for active project delivery.
            </h2>
            <p className="pe-lead">
              Civil and structural consulting, inspections, stormwater
              compliance, and project coordination aligned so scope,
              permitting, documentation, and field execution stay connected.
            </p>
          </div>
          <ServiceCardsGrid />
        </div>
      </section>

      <section className="pe-section pe-section-tight section-surface-dark pe-inverse">
        <div className="pe-container-wide pe-stack">
          <div className="pe-stack-sm" style={{ maxWidth: "44rem" }}>
            <span className="eyebrow cool">How We Work</span>
            <h2 className="pe-heading-2 text-white">
              Practical support built around schedule, permitting, and field
              conditions.
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

      <div className="pe-container-wide" aria-hidden="true">
        <div className="pe-section-divider" />
      </div>

      <section className="pe-section pe-section-tight section-surface-soft overflow-hidden">
        <div className="pe-container-wide pe-grid-2">
          <AnimatedSection direction="left">
            <div className="pe-stack-sm">
              <span className="eyebrow">Why Pacific Engineering</span>
              <h2 className="pe-heading-2">
                Engineering judgment that stays useful in the field.
              </h2>
              <p className="pe-lead">
                Pacific Engineering keeps engineering, compliance, and construction
                coordination in one conversation so teams get a practical path
                forward instead of disconnected handoffs.
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
