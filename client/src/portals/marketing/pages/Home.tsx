import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import {
  CheckCircle,
  FileText,
  ClipboardCheck,
  Shield,
  ArrowRight,
  Phone,
  PhoneCall,
  Clock,
  Users,
} from "lucide-react";
import { ShinyButton } from "../components/ShinyButton";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import BlueprintBackground from "../components/BlueprintBackground";
import ParticleField from "../components/ParticleField";
import FloatingElements from "../components/FloatingElements";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = false;
    video.playbackRate = 1;

    let rafId: number | null = null;
    let reversing = false;
    let lastTs: number | null = null;
    let targetTime = 0;

    const reverseSpeed = 0.8;
    const stepSize = 1 / 30;

    const reverseFrame = (ts: number) => {
      if (!reversing) return;

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

        setTimeout(() => {
          video.play().catch(() => {});
        }, 50);
        return;
      }

      rafId = window.requestAnimationFrame(reverseFrame);
    };

    const handleEnded = () => {
      reversing = true;
      lastTs = null;
      targetTime = video.duration;
      video.pause();

      rafId = window.requestAnimationFrame(reverseFrame);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      reversing = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" data-testid="page-home">
      <SEO
        title="Pacific Engineering & Construction Inc. - Consulting Engineers and Contractors"
        description="SF Bay structural engineering, special inspections, materials testing & SWPPP stormwater compliance—supporting permit-ready construction with fast, reliable service."
        keywords="SF Bay structural engineering, structural engineer San Francisco, special inspections Bay Area, special inspections SF, construction materials testing Bay Area, materials testing San Francisco, SWPPP Bay Area, SWPPP San Francisco, stormwater compliance Bay Area, QSD QSP Bay Area, consulting engineers Bay Area, Pacific Engineering & Construction"
        url="/"
      />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 py-12 sm:py-16 md:py-20 lg:py-24" data-testid="section-hero">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            preload="auto"
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-72"
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-transparent to-orange-950/20 opacity-50" />
        </div>

        <ParticleField className="z-[1] opacity-30" particleCount={60} />
        <BlueprintBackground className="z-[2]" />
        <FloatingElements className="z-[3] opacity-30" />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-[1]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none z-[1]" />

        <div className="relative z-10 w-full px-4 sm:px-10">
          <div className="mx-auto w-full max-w-5xl text-center">
            <AnimatedSection direction="up" duration={1.1} className="relative">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl opacity-5 blur-sm" />

                <div className="relative bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400" />

                  <div className="p-6 sm:p-10 md:p-12 lg:p-16">
                    <h1 className="text-white font-bold tracking-tighter leading-[1.1] text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-6" data-testid="text-hero-title">
                      <span className="text-white">
                        Pacific Engineering
                      </span>{" "}
                      <br />
                      <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        & Construction Inc.
                      </span>
                    </h1>

                    <div className="flex items-center justify-center gap-4 my-6 sm:my-8 md:my-10">
                      <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-cyan-500" />
                      <div className="w-3 h-3 rotate-45 bg-orange-400" />
                      <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-cyan-500" />
                    </div>

                    <div className="mb-8 sm:mb-10 md:mb-14">
                      <p className="text-slate-300 mx-auto font-light tracking-wide text-base sm:text-lg md:text-2xl" data-testid="text-hero-subtitle">
                        Consulting Engineers & Contractors
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6">
                      <Link to={createPageUrl("Consultation")} data-testid="link-hero-quote">
                        <ShinyButton
                          className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 py-5 rounded-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                          style={{
                            "--shiny-cta-bg": "#ea580c",
                            "--shiny-cta-bg-subtle": "rgba(234, 88, 12, 0.2)",
                            "--shiny-cta-highlight": "#f97316",
                            "--shiny-cta-highlight-subtle": "#fb923c",
                            "--shiny-cta-shadow": "rgba(249, 115, 22, 0.4)",
                            "--shiny-cta-glow": "rgba(251, 146, 60, 0.55)",
                          }}
                        >
                          <PhoneCall className="w-5 h-5" />
                          Request a Quote
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </ShinyButton>
                      </Link>

                      <Link to={createPageUrl("Consultation")} data-testid="link-hero-consultation">
                        <ShinyButton
                          className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 py-5 rounded-lg shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
                          style={{
                            "--shiny-cta-bg": "#334155",
                            "--shiny-cta-bg-subtle": "rgba(51, 65, 85, 0.2)",
                            "--shiny-cta-highlight": "#475569",
                            "--shiny-cta-highlight-subtle": "#64748b",
                            "--shiny-cta-shadow": "rgba(71, 85, 105, 0.4)",
                            "--shiny-cta-glow": "rgba(100, 116, 139, 0.55)",
                          }}
                        >
                          <Clock className="w-5 h-5" />
                          Schedule a Consult
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </ShinyButton>
                      </Link>
                    </div>

                    <p className="text-slate-400 text-sm md:text-base tracking-wide mb-12 sm:mb-16" data-testid="text-hero-trust">
                      Same-day response · No obligations · 40+ years Bay Area expertise
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div className="group relative rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:bg-white/10 p-6 flex flex-col items-center justify-center" data-testid="stat-experience">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">40+</div>
                          <div className="text-slate-400 tracking-tight font-medium text-sm sm:text-base">Years Experience</div>
                        </div>
                      </div>

                      <div className="group relative rounded-xl bg-slate-800/80 border-2 border-cyan-500/40 shadow-xl p-6 md:scale-105 flex flex-col items-center justify-center z-10" data-testid="stat-full-service">
                        <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">Full-Service</div>
                        <div className="text-cyan-400 tracking-tight font-medium text-sm sm:text-base">Vertically Integrated</div>
                      </div>

                      <div className="group relative rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:bg-white/10 p-6 flex flex-col items-center justify-center" data-testid="stat-full-scale">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">Full-Scale</div>
                          <div className="text-slate-400 tracking-tight font-medium text-sm sm:text-base">Res, Comm & Infrastructure</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <div className="h-1 bg-gradient-to-r from-cyan-500/90 to-orange-400/90" />

      <section className="py-24 sm:py-32 px-6 bg-white border-b border-slate-200" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight" data-testid="text-services-title">
              Consulting Engineers & Contractors
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 to-orange-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Full-scale civil and structural engineering and construction plans
              developed and implemented by our teams of in-house Engineers,
              QSD/QSPs, and construction experts.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <Link
              to={createPageUrl("Construction")}
              className="block group h-full"
              data-testid="link-construction-service"
            >
              <AnimatedSection direction="right" delay={0.2} className="h-full">
                <div className="h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-200 transition-all duration-300 overflow-hidden relative z-10 cursor-pointer group-hover:-translate-y-2">
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="bg-orange-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-orange-400 group-hover:to-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/40 transition-all duration-300">
                      <Shield className="w-12 h-12 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-orange-600 transition-colors">
                      Construction Service
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                      We are fully licensed and ready to take on any and all work from residential additions, multi-unit residential, commercial mixed-use, up to public and governmental infrastructure.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      {[
                        "Class A License",
                        "Class B License",
                        "Infrastructure & Public Works",
                        "Residential, Commercial, and Municipal Infrastructure"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-3 text-slate-700 w-full">
                          <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                          <span className="font-medium text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </Link>

            <Link
              to={createPageUrl("StructuralEngineering")}
              className="block group h-full"
              data-testid="link-engineering-consulting"
            >
              <AnimatedSection direction="right" delay={0.4} className="h-full">
                <div className="h-full bg-slate-50/50 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden cursor-pointer group-hover:-translate-y-2">
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-stone-400 opacity-80" />
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="bg-amber-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-amber-600 group-hover:shadow-lg group-hover:shadow-amber-500/40 transition-all duration-300">
                      <ClipboardCheck className="w-12 h-12 text-amber-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                      Engineering Consulting
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                      Professional engineering expertise across civil and structural disciplines, providing innovative solutions and implementation to meet the unique needs of your project.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      {[
                        "Civil Engineering Consulting",
                        "Structural Consulting",
                        "Site Assessment & Design",
                        "Development Management & Support"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-3 text-slate-600 w-full">
                          <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                          <span className="font-medium text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </Link>

            <Link
              to={createPageUrl("InspectionsTesting")}
              className="block group h-full"
              data-testid="link-inspections-testing"
            >
              <AnimatedSection direction="left" delay={0.3} className="h-full">
                <div className="h-full bg-slate-50/50 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden cursor-pointer group-hover:-translate-y-2">
                  <div className="h-1 bg-gradient-to-r from-cyan-600 to-blue-500 opacity-80" />
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="bg-cyan-50 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-cyan-600 group-hover:shadow-lg group-hover:shadow-cyan-500/40 transition-all duration-300">
                      <ClipboardCheck className="w-12 h-12 text-cyan-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-cyan-600 transition-colors">
                      Inspections & Testing
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                      Thorough inspections to ensure ongoing compliance with recommendation and implementation of areas for improvement.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      {[
                        "Structural Systems Inspections",
                        "Stormwater Testing and Inspections",
                        "Materials Sampling & Testing",
                        "Environmental Compliance"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-3 text-slate-600 w-full">
                          <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                          <span className="font-medium text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </Link>

            <Link
              to={createPageUrl("Services")}
              className="block group h-full"
              data-testid="link-stormwater-planning"
            >
              <AnimatedSection direction="left" delay={0.1} className="h-full">
                <div className="h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-200 transition-all duration-300 overflow-hidden relative z-10 cursor-pointer group-hover:-translate-y-2">
                  <div className="h-2 bg-gradient-to-r from-slate-600 to-slate-500" />
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-slate-500 group-hover:to-slate-700 group-hover:shadow-lg group-hover:shadow-slate-500/40 transition-all duration-300">
                      <FileText className="w-12 h-12 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-slate-600 transition-colors">
                      Stormwater Planning
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                      Custom plans from initial assessments, tailored practical BMP designs, and full local, state, and federal regulatory compliance assurance and permitting walkthroughs.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      {[
                        "In-house PE/QSD/QSP site assessment",
                        "BMP design and maintenance",
                        "Clear documentation with action items",
                        "Full local, state, and Federal compliance assurance"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-3 text-slate-700 w-full">
                          <CheckCircle className="w-6 h-6 text-slate-600 flex-shrink-0" />
                          <span className="font-medium text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </Link>
          </div>

          <AnimatedSection direction="up" delay={0.5} className="text-center mt-16">
            <Link to={createPageUrl("ServicesOverview")} data-testid="link-view-all-services">
              <ShinyButton
                className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 sm:px-12 py-7 rounded-lg shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300"
                style={{
                  "--shiny-cta-bg": "#0ea5e9",
                  "--shiny-cta-bg-subtle": "rgba(14, 165, 233, 0.2)",
                  "--shiny-cta-highlight": "#2563eb",
                  "--shiny-cta-highlight-subtle": "#38bdf8",
                  "--shiny-cta-shadow": "rgba(59, 130, 246, 0.4)",
                  "--shiny-cta-glow": "rgba(56, 189, 248, 0.55)",
                }}
              >
                View All Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </ShinyButton>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-6 bg-amber-50/40 relative overflow-hidden" data-testid="section-why-choose">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-slate-900 mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl" data-testid="text-why-title">
                Why Pacific Engineering?
              </h2>
              <div className="bg-gradient-to-r from-cyan-500 to-orange-400 my-8 w-24 h-1.5 rounded-full"></div>

              <p className="text-slate-700 mb-10 text-xl leading-relaxed">
                With over 40 years of experience in private, commercial, and
                institutional full-scale civil engineering and construction
                contracting, we deliver comprehensive solutions and
                deliverables keeping projects on track with the utmost
                professional efficiency.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
                      <CheckCircle className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-2 text-xl font-bold tracking-wide">
                      EXPERT KNOWLEDGE
                    </h3>
                    <p className="text-slate-600 text-lg">
                      Complete understanding of federal, state, and local stormwater regulations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
                      <CheckCircle className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-2 text-xl font-bold tracking-wide">
                      PROVEN TRACK RECORD
                    </h3>
                    <p className="text-slate-600 text-lg">
                      100% client satisfaction across 2.5K+ successful projects.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
                      <CheckCircle className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-2 text-xl font-bold tracking-wide">
                      RESPONSIVE SERVICE
                    </h3>
                    <p className="text-slate-600 text-lg">
                      Quick turnaround times and dedicated project support to keep you moving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("ServicesOverview")} data-testid="link-scope-project">
                  <ShinyButton
                    className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 py-4 rounded-lg shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    style={{
                      "--shiny-cta-bg": "#ea580c",
                      "--shiny-cta-bg-subtle": "rgba(234, 88, 12, 0.2)",
                      "--shiny-cta-highlight": "#f97316",
                      "--shiny-cta-highlight-subtle": "#fb923c",
                      "--shiny-cta-shadow": "rgba(249, 115, 22, 0.4)",
                      "--shiny-cta-glow": "rgba(251, 146, 60, 0.55)",
                    }}
                  >
                    <FileText className="w-5 h-5" />
                    Scope Your Project
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </ShinyButton>
                </Link>
                <Link to={createPageUrl("About")} data-testid="link-about-team">
                  <button className="inline-flex items-center justify-center gap-2 text-slate-700 font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-transparent border-2 border-slate-300 hover:border-slate-400 hover:bg-white transition-all duration-300 group">
                    <Users className="w-5 h-5" />
                    About Our Team
                  </button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="relative mt-12 lg:mt-0 px-4 sm:px-8">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
                  alt="San Francisco construction projects"
                  className="w-full h-full object-cover"
                  data-testid="img-sf-projects"
                />
              </div>

              <div className="hidden sm:flex absolute -bottom-6 -right-2 sm:-right-6 bg-gradient-to-br from-orange-500 to-amber-600 p-8 rounded-2xl shadow-xl border-4 border-white flex-col items-center justify-center z-20">
                <div className="text-white mb-1 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter" data-testid="text-projects-count">
                  2.5K+
                </div>
                <div className="text-orange-50 font-bold uppercase tracking-widest text-xs sm:text-sm">
                  Successful Projects
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900 relative border-t-4 border-cyan-500 overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/images/bay-bridge-sunrise.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950/90"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm sm:text-base mb-4">Ready to move?</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-white mb-8 tracking-tighter leading-[1.1]" data-testid="text-cta-title">
              Get Your Project on Track
            </h2>
            <div className="w-48 h-1.5 bg-gradient-to-r from-cyan-500 to-orange-400 mx-auto mb-10 rounded-full"></div>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-light px-4 max-w-3xl mx-auto">
              Engineering, inspections, construction, and stormwater — one team, one call. We respond same-day to keep your timeline intact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
              <Link to={createPageUrl("Consultation")} data-testid="link-cta-quote">
                <ShinyButton
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-10 py-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
                  style={{
                    "--shiny-cta-bg": "#ea580c",
                    "--shiny-cta-bg-subtle": "rgba(234, 88, 12, 0.2)",
                    "--shiny-cta-highlight": "#f97316",
                    "--shiny-cta-highlight-subtle": "#fb923c",
                    "--shiny-cta-shadow": "rgba(249, 115, 22, 0.4)",
                    "--shiny-cta-glow": "rgba(251, 146, 60, 0.55)",
                  }}
                >
                  <PhoneCall className="w-6 h-6" />
                  Request a Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </ShinyButton>
              </Link>
              <Link to={createPageUrl("Contact")} data-testid="link-cta-contact">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-10 py-5 rounded-xl bg-slate-800 hover:bg-slate-700 shadow-lg hover:shadow-xl border border-slate-700 transition-all duration-300 group">
                  <Phone className="w-6 h-6" />
                  (415) 555-0100
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 text-sm sm:text-base font-medium">
              <span className="inline-flex items-center gap-2"><CheckCircle className="w-5 h-5 text-orange-500" /> Licensed PE/QSD/QSP</span>
              <span className="inline-flex items-center gap-2"><CheckCircle className="w-5 h-5 text-orange-500" /> Class A & B Contractor</span>
              <span className="inline-flex items-center gap-2"><CheckCircle className="w-5 h-5 text-orange-500" /> 2,500+ Projects Delivered</span>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}