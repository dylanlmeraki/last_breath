import { Link } from "react-router-dom";
import { ArrowRight, Building2, ClipboardCheck, HardHat, Shield, Users } from "lucide-react";
import { createPageUrl } from "../lib/utils";
import AnimatedSection from "../components/AnimatedSection";
import AboutTeamGrid from "../components/AboutTeamGrid";
import { ServiceCardsGrid } from "../components/ServiceCards";
import SEO from "../components/SEO";
import CTASection from "../components/CTASection";
import MarketingPageHero from "../components/MarketingPageHero";
import bayBridgeImg from "@assets/bay-bridge-sunrise_1773821710974.jpg";

const ABOUT_STATS = [
  {
    value: "Founded 2001",
    label: "Long-running Bay Area delivery support",
  },
  {
    value: "PE / QSD / QSP",
    label: "In-house engineering and compliance depth",
  },
  {
    value: "Class A & B",
    label: "Contractor-backed field execution coverage",
  },
  {
    value: "Public + Private",
    label: "Infrastructure, civic, commercial, and utility scopes",
  },
] as const;

const OPERATING_PRINCIPLES = [
  {
    icon: Building2,
    title: "Engineering + construction in one workflow",
    body: "Project teams work with one aligned group instead of separate silos for design, compliance, field support, and closeout.",
  },
  {
    icon: ClipboardCheck,
    title: "Documentation built for active delivery",
    body: "Submittals, inspection records, and coordination notes are treated as project-control tools, not paperwork after the fact.",
  },
  {
    icon: HardHat,
    title: "Field conditions stay in the decision loop",
    body: "Site logistics, sequencing, permitting realities, and contractor needs shape the technical response from the start.",
  },
  {
    icon: Shield,
    title: "Credentials that hold up under scrutiny",
    body: "Pacific Engineering brings PE, QSD, QSP, surveying, inspection, and contractor perspective into the same delivery conversation.",
  },
  {
    icon: Users,
    title: "Clear communication across the full team",
    body: "Owners, architects, agencies, contractors, and superintendents get direct answers and practical next steps without inflated language.",
  },
] as const;

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-about">
      <SEO
        title="About Pacific Engineering & Construction Inc."
        description="Pacific Engineering & Construction Inc. brings engineering, construction, inspections, surveying, and compliance support together for Bay Area and Northern California project teams."
        keywords="Pacific Engineering about, Bay Area engineering team, construction leadership, PE certified engineers, project delivery support, Northern California engineering"
        url="/about"
      />

      <MarketingPageHero
        title="About Pacific Engineering"
        description="Pacific Engineering & Construction Inc. supports Bay Area and Northern California project teams with engineering, surveying, inspections, stormwater compliance, and construction-minded coordination shaped by real field conditions."
        backgroundImage={bayBridgeImg}
        eyebrow="Pacific Engineering"
        sectionTestId="section-about-hero"
        titleTestId="text-about-title"
      />

      <section className="pe-section pe-section-tight section-surface-solid" data-testid="section-company-story">
        <div className="pe-container-wide pe-stack">
          <div className="about-overview-grid pe-grid-2">
            <AnimatedSection direction="left">
              <div className="pe-stack-sm about-overview-copy">
                <span className="eyebrow">Who We Are</span>
                <h2 className="pe-heading-2">Engineering judgment built to stay useful in the field.</h2>
                <p className="pe-lead">
                  Founded in 2001, Pacific Engineering & Construction Inc. has supported civil,
                  environmental, surveying, inspection, stormwater, and construction scopes across
                  Bay Area and Northern California municipal, institutional, utility, waterfront,
                  aviation, and private-sector projects.
                </p>
                <p className="pe-copy">
                  The firm is structured around practical delivery support. That means design,
                  compliance, field verification, coordination, and documentation stay connected so
                  project teams can move through approvals, active work, and closeout with steadier
                  judgment and fewer handoff gaps.
                </p>
                <p className="pe-copy">
                  Pacific Engineering is not built around abstract promises. It is built around
                  technical capability, contractor awareness, QA/QC discipline, and the kind of
                  project fluency that comes from decades of wide-ranging field experience.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="about-overview-panel pe-card pe-card-pad">
                <span className="eyebrow cool">Operating Snapshot</span>
                <div className="about-stat-grid">
                  {ABOUT_STATS.map((item) => (
                    <div key={item.value} className="about-stat-card">
                      <h3 className="about-stat-value">{item.value}</h3>
                      <p className="about-stat-label">{item.label}</p>
                    </div>
                  ))}
                </div>
                <Link to={createPageUrl("Consultation")} className="pe-link-inline">
                  Review project scope
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="pe-container-wide" aria-hidden="true">
        <div className="pe-section-divider" />
      </div>

      <section className="pe-section pe-section-tight section-surface-soft" data-testid="section-team">
        <div className="pe-container-wide pe-stack">
          <div className="pe-stack-sm about-team-intro">
            <span className="eyebrow cool">Our Team</span>
            <h2 className="pe-heading-2">Leadership and field specialists who keep work moving.</h2>
            <p className="pe-lead">
              Engineering, surveying, geology, construction supervision, estimating, and project controls
              represented in one practical bench so teams can work with people who understand both
              technical scope and live jobsite conditions.
            </p>
          </div>
          <AboutTeamGrid />
        </div>
      </section>

      <div className="pe-container-wide" aria-hidden="true">
        <div className="pe-section-divider" />
      </div>

      <section className="pe-section pe-section-tight section-surface-solid" data-testid="section-how-we-work">
        <div className="pe-container-wide pe-grid-2 about-operating-grid">
          <AnimatedSection direction="left">
            <div className="pe-stack-sm">
              <span className="eyebrow">How Pacific Engineering Works</span>
              <h2 className="pe-heading-2">A delivery model shaped by schedule, documentation, and field conditions.</h2>
              <p className="pe-lead">
                Pacific Engineering keeps technical work close to the realities that affect cost,
                sequencing, approvals, inspection readiness, and closeout. That gives project teams
                clearer decision support earlier and keeps the work easier to act on once the site is active.
              </p>
              <p className="pe-copy">
                Bay Area and Northern California jurisdictional familiarity, contractor-backed
                coordination, and disciplined reporting are part of the operating model, not add-ons.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="about-principles">
              {OPERATING_PRINCIPLES.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="about-principle-card pe-card">
                    <div className="about-principle-icon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="about-principle-copy">
                      <h3 className="about-principle-title">{item.title}</h3>
                      <p className="about-principle-body">{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pe-section pe-section-tight section-surface-soft" data-testid="section-what-we-do">
        <div className="pe-container-wide pe-stack">
          <div className="pe-stack-sm" style={{ maxWidth: "54rem" }}>
            <span className="eyebrow">What We Do</span>
            <h2 className="pe-heading-2">Service coverage built around project delivery, not category language.</h2>
            <p className="pe-lead">
              Engineering consulting, construction support, inspections, and stormwater planning
              kept in one connected service stack so scope, compliance, and execution stay aligned.
            </p>
          </div>
          <ServiceCardsGrid />
        </div>
      </section>

      <section className="pe-section pe-section-tight section-surface-dark pe-inverse" data-testid="section-service-areas">
        <div className="pe-container-wide pe-grid-2 about-region-grid">
          <AnimatedSection direction="left">
            <div className="pe-stack-sm">
              <span className="eyebrow cool">Bay Area Coverage</span>
              <h2 className="pe-heading-2 text-white">Regional familiarity that reduces friction once work is live.</h2>
              <p className="pe-lead text-slate-300">
                From San Francisco waterfront work to East Bay infrastructure, Silicon Valley
                commercial scopes, and institutional projects across Northern California, Pacific
                Engineering works with local permitting, inspection, sequencing, and closeout realities in mind.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="about-region-list">
              <div className="about-region-item">
                <span className="about-region-label">Core geographies</span>
                <p className="about-region-copy">San Francisco, East Bay, Peninsula, South Bay, and broader Northern California project corridors.</p>
              </div>
              <div className="about-region-item">
                <span className="about-region-label">Typical scopes</span>
                <p className="about-region-copy">Municipal facilities, utility work, aviation, institutional campuses, waterfront improvements, and private development support.</p>
              </div>
              <div className="about-region-item">
                <span className="about-region-label">Typical value to the team</span>
                <p className="about-region-copy">Clearer approvals, steadier documentation, faster field answers, and stronger alignment between technical decisions and real jobsite constraints.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        headline="Need a practical engineering and construction partner?"
        body="Pacific Engineering can review the scope, identify permitting or field coordination pressure points, and help the team decide on a workable next step."
        primaryButtonText="Talk With Pacific Engineering"
        primaryButtonLink={createPageUrl("Contact")}
        testIdPrefix="about-cta"
      />
    </div>
  );
}
