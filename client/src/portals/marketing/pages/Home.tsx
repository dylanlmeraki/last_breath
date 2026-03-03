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
  Mail,
} from "lucide-react";
import { ShinyButton } from "../components/ShinyButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-500 py-12 sm:py-16 md:py-20 lg:py-24" data-testid="section-hero">
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
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-xl opacity-5 blur-sm" />

              <div className="relative bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-600" />

                <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                  <h1 className="text-white font-bold tracking-tighter leading-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 md:mb-8" data-testid="text-hero-title">
                    <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text">
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
                    <p className="text-gray-300 mx-auto font-light tracking-wide text-base sm:text-lg md:text-2xl" data-testid="text-hero-subtitle">
                      Consulting Engineers & Contractors
                    </p>
                  </div>

                  <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10 sm:mb-12 md:mb-16">
                    <Link to={createPageUrl("ServicesOverview")} data-testid="link-hero-services">
                      <ShinyButton
                        className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-10 py-6 rounded-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                        style={{
                          "--shiny-cta-bg": "#ea580c",
                          "--shiny-cta-bg-subtle": "rgba(234, 88, 12, 0.2)",
                          "--shiny-cta-highlight": "#f97316",
                          "--shiny-cta-highlight-subtle": "#fb923c",
                          "--shiny-cta-shadow": "rgba(249, 115, 22, 0.4)",
                          "--shiny-cta-glow": "rgba(251, 146, 60, 0.55)",
                        }}
                      >
                        Our Services{" "}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </ShinyButton>
                    </Link>

                    <Link to={createPageUrl("Consultation")} data-testid="link-hero-consultation">
                      <ShinyButton
                        className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-10 py-6 rounded-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                        style={{
                          "--shiny-cta-bg": "#0ea5e9",
                          "--shiny-cta-bg-subtle": "rgba(14, 165, 233, 0.2)",
                          "--shiny-cta-highlight": "#2563eb",
                          "--shiny-cta-highlight-subtle": "#38bdf8",
                          "--shiny-cta-shadow": "rgba(59, 130, 246, 0.4)",
                          "--shiny-cta-glow": "rgba(56, 189, 248, 0.55)",
                        }}
                      >
                        Free Consultation{" "}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </ShinyButton>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="group relative rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:bg-white/10 p-4 sm:p-5 md:p-6" data-testid="stat-experience">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="text-white font-bold mb-1 bg-clip-text text-xl sm:text-2xl md:text-3xl">
                          40+
                        </div>
                        <div className="text-orange-400 tracking-tight font-bold text-sm sm:text-md">
                          Years Experience
                        </div>
                      </div>
                    </div>

                    <div className="group relative rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:bg-white/10 p-4 sm:p-5 md:p-6" data-testid="stat-full-service">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="text-white font-bold mb-1 bg-clip-text text-xl sm:text-2xl md:text-3xl">
                          Full-Service
                        </div>
                        <div className="text-orange-400 tracking-tight font-bold text-sm sm:text-md">
                          Vertically Integrated
                        </div>
                      </div>
                    </div>

                    <div className="group relative rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:bg-white/10 p-4 sm:p-5 md:p-6" data-testid="stat-full-scale">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="text-white font-bold mb-1 bg-clip-text text-xl sm:text-2xl md:text-3xl">
                          Full-Scale
                        </div>
                        <div className="text-orange-400 tracking-tight font-bold text-sm sm:text-md">
                          Res, Comm & Infrastructure
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

      <section className="h-4 bg-gradient-to-b from-cyan-500/90 to-orange-400/90 relative overflow-hidden" />

      <section className="py-20 px-6 bg-slate-50 border-t-4 border-orange-400" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight" data-testid="text-services-title">
              Consulting Engineers & Contractors
            </h2>
            <div className="w-56 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-2 mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Full-scale civil and structural engineering and construction plans
              developed and implemented by our teams of in-house Engineers,
              QSD/QSPs, and construction experts. Helping you ensure on-time, on
              budget, full compliance, and with maximum creative outlook for
              your project. Keep everything on track.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Link
              to={createPageUrl("Construction")}
              className="block group h-full"
              data-testid="link-construction-service"
            >
              <AnimatedSection direction="right" delay={0.2} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-orange-400 group-hover:to-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/40 transition-all duration-300">
                      <Shield className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide group-hover:text-orange-600 transition-colors">
                      Construction Service
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      We are fully licensed and ready to take on any and all
                      work from residential additions, multi-unit residential,
                      commercial mixed-use, up to public and governmental
                      infrastructure.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-orange-600 transition-colors">
                          Class A License
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-orange-600 transition-colors">
                          Class B License
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-orange-600 transition-colors">
                          Infrastructure & Public Works
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-orange-600 transition-colors">
                          Residential, Commercial, and Municipal Infrastructure
                        </span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>

            <Link
              to={createPageUrl("StructuralEngineering")}
              className="block group h-full"
              data-testid="link-engineering-consulting"
            >
              <AnimatedSection direction="right" delay={0.4} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-amber-400 to-yellow-400" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-yellow-400 group-hover:to-amber-500 group-hover:shadow-lg group-hover:shadow-yellow-500/40 transition-all duration-300">
                      <ClipboardCheck className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide group-hover:text-yellow-400 transition-colors">
                      Engineering Consulting
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      Professional engineering expertise across civil and
                      structural disciplines, providing innovative solutions and
                      implementation to meet the unique needs of your project -
                      from large-scale infrastructure to single family
                      residential additions.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-amber-500 transition-colors">
                          Civil Engineering Consulting
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-amber-500 transition-colors">
                          Structural Consulting
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-amber-500 transition-colors">
                          Site Assessment & Design
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-amber-500 transition-colors">
                          Development Management & Support
                        </span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>

            <Link
              to={createPageUrl("InspectionsTesting")}
              className="block group h-full"
              data-testid="link-inspections-testing"
            >
              <AnimatedSection direction="left" delay={0.3} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-emerald-300 to-teal-500" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-teal-400 group-hover:to-cyan-500 group-hover:shadow-lg group-hover:shadow-cyan-500/40 transition-all duration-300">
                      <ClipboardCheck className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide group-hover:text-cyan-500 transition-colors">
                      Inspections & Testing
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      Thorough inspections to ensure ongoing compliance with
                      recommendation and implementation of areas for
                      improvement.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">
                          Structural Systems Inspections
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">
                          Stormwater Testing and Inspections
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">
                          Materials Sampling & Testing
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">
                          Environmental Compliance
                        </span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>

            <Link to={createPageUrl("Services")} className="block group h-full" data-testid="link-stormwater-planning">
              <AnimatedSection direction="left" delay={0.1} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-green-500 to-cyan-500" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-teal-400 group-hover:to-green-600 group-hover:shadow-lg group-hover:shadow-teal-500/40 transition-all duration-300">
                      <FileText className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide group-hover:text-teal-500 transition-colors">
                      Stormwater Planning
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      Custom plans from initial assessments, tailored practical
                      BMP designs, and full local, state, and federal regulatory
                      compliance assurance and permitting walkthroughs.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">
                          In-house PE/QSD/QSP site assessment
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">
                          BMP design and maintenance
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">
                          Clear documentation with action items
                        </span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">
                          Full local, state, and Federal compliance assurance
                        </span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>
          </div>

          <AnimatedSection
            direction="up"
            delay={0.5}
            className="text-center mt-16"
          >
            <Link to={createPageUrl("Services")} data-testid="link-view-all-services">
              <ShinyButton
                className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 sm:px-12 py-7 rounded-md shadow-lg hover:shadow-orange-600/60 hover:-translate-y-1 active:scale-95 transition-all duration-300"
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

      <section className="py-20 px-6 bg-gradient-to-b from-slate-100 to-slate-50 relative overflow-hidden" data-testid="section-why-choose">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-slate-900 mb-6 text-4xl font-bold text-center tracking-tight md:text-5xl" data-testid="text-why-title">
                Why Pacific Engineering?
              </h2>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 mx-auto my-8 px-32 w-16 h-1"></div>

              <p className="text-slate-600 mb-10 text-xl text-center leading-relaxed">
                With over 40 years of experience in private, commercial, and
                institutional full-scale civil engineering and construction
                contractiong, we deliver comprehensive solutions and
                deliverables keeping projects on track with the utmost
                professional efficiency.
              </p>

              <div className="flex-items-center group-justify-center">
                <div className="space mb-12">
                  <div className="mx-auto py-2 group flex gap-5 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-md flex items-center justify-center shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-slate-900 mb-1 text-xl font-bold text-left uppercase tracking-wide">
                        EXPERT KNOWLEDGE
                      </h3>
                      <p className="text-slate-600 text-left">
                        Complete understanding of federal, state, and local
                        stormwater regulations
                      </p>
                    </div>
                  </div>

                  <div className="mx-auto py-2 group flex gap-5 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-md flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-slate-900 mb-1 text-xl font-bold text-left uppercase tracking-wide">
                        PROVEN TRACK RECORD
                      </h3>
                      <p className="text-slate-600 text-center">
                        100% client satisfaction across 2,5K+ projects
                      </p>
                    </div>
                  </div>

                  <div className="mx-auto py-2 group flex gap-5 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center shadow-lg shadow-orange-600/40 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-slate-900 mb-1 text-xl font-bold text-left uppercase tracking-wide">
                        RESPONSIVE SERVICE
                      </h3>
                      <p className="text-slate-600 text-left">
                        Quick turnaround times and dedicated project support
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link to={createPageUrl("About")} data-testid="link-about-us">
                  <Button
                    size="lg"
                    className="bg-slate-900 hover:bg-gradient-to-br from-orange-500 to-amber-600 text-white px-10 py-6 text-sm font-bold tracking-tight rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 duration-300 group"
                  >
                    About Us
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="relative">
              <div className="aspect-[4/3] rounded-md overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
                  alt="San Francisco construction projects"
                  className="w-full h-full object-cover"
                  data-testid="img-sf-projects"
                />
              </div>
              <div className="p-10 bg-gradient-to-br mt-1 mx-auto px-10 py-10 rounded-xl absolute -bottom-8 -left-8 from-orange-500 via-orange-600 to-amber-600 shadow-2xl border-4 border-white transform-all hover:scale-105">
                <div className="text-white mb-2 text-5xl font-bold text-center tracking-tight" data-testid="text-projects-count">
                  2.5K+
                </div>
                <div className="text-orange-50 font-bold uppercase tracking-widest text-sm">
                  Successful Projects
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden border-t-4 border-orange-500" data-testid="section-cta">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/images/bay-bridge-sunrise.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight" data-testid="text-cta-title">
              How Can We Help?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-10"></div>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
              Let's discuss your Projects' unique needs and develop a
              comprehensive solution to keep your ideas on schedule, under
              budget, allowing you to maximize your capabilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to={createPageUrl("ServicesOverview")} data-testid="link-cta-services">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-7 text-lg font-bold tracking-tight rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 duration-300 group"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")} data-testid="link-cta-contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-7 text-lg font-bold tracking-tight rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1 active:scale-95 duration-300 group"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Get In Touch
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
