import React from "react";
import {
  CheckCircle,
  FileText,
  ClipboardCheck,
  Shield,
  ArrowRight,
  Phone,
  Zap,
  HardHat,
} from "lucide-react";

export default function FieldReady() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans" data-testid="page-home-field-ready">
      {/* 1. HERO - Full screen, min-h-screen, dark, urgent */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 py-12 sm:py-16 md:py-20 lg:py-24" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6">
          <div className="mx-auto w-full max-w-4xl text-center">
            
            <div className="relative bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden mt-8">
              {/* Thick 4px orange-500 top stripe */}
              <div className="h-1 bg-orange-500" style={{ height: '4px' }} />
              
              <div className="p-6 md:p-8">
                <h1 className="font-bold tracking-tighter leading-[1.1] text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-4" data-testid="text-hero-title">
                  <span className="text-white">
                    Pacific Engineering
                  </span>{" "}
                  <br />
                  <span className="text-amber-400">
                    & Construction Inc.
                  </span>
                </h1>

                <div className="flex items-center justify-center gap-4 my-6">
                  <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-500/50" />
                  <div className="w-2 h-2 rotate-45 bg-orange-500" />
                  <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-500/50" />
                </div>

                <div className="mb-8">
                  <p className="text-slate-300 mx-auto font-light tracking-wide text-base sm:text-lg md:text-xl" data-testid="text-hero-subtitle">
                    Consulting Engineers & Contractors
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
                  <button className="w-full md:w-auto group inline-flex items-center justify-center gap-3 whitespace-nowrap text-white font-bold tracking-tight text-base sm:text-lg px-6 py-4 rounded-lg bg-orange-600 hover:bg-orange-500 shadow-lg transition-all duration-300" data-testid="btn-hero-quote">
                    <Zap className="w-5 h-5 flex-shrink-0" />
                    <span>Get a Quote — Same Day Response</span>
                  </button>
                  <button className="w-full md:w-auto group inline-flex items-center justify-center gap-3 whitespace-nowrap text-white font-bold tracking-tight text-base sm:text-lg px-6 py-4 rounded-lg bg-slate-700 hover:bg-slate-600 shadow-lg transition-all duration-300" data-testid="btn-hero-call">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span>Call (415) 555-0100</span>
                  </button>
                </div>

                {/* Clean text-only stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 md:gap-6 pt-4 border-t border-white/5">
                  <div className="flex flex-col items-center justify-center" data-testid="stat-experience">
                    <div className="text-white font-bold mb-1 text-3xl sm:text-4xl">40+</div>
                    <div className="text-slate-400 tracking-tight font-medium text-xs sm:text-sm uppercase">Years Experience</div>
                  </div>

                  <div className="flex flex-col items-center justify-center" data-testid="stat-full-service">
                    <div className="text-amber-400 font-bold mb-1 text-3xl sm:text-4xl">Full-Service</div>
                    <div className="text-amber-400/80 tracking-tight font-medium text-xs sm:text-sm uppercase">Vertically Integrated</div>
                  </div>

                  <div className="flex flex-col items-center justify-center" data-testid="stat-full-scale">
                    <div className="text-white font-bold mb-1 text-3xl sm:text-4xl">Full-Scale</div>
                    <div className="text-slate-400 tracking-tight font-medium text-xs sm:text-sm uppercase">Res, Comm & Infra</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NO section divider strips */}

      {/* 2. SERVICES GRID - Compact, highly scannable, white bg */}
      <section className="py-32 px-4 sm:px-6 bg-white" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight" data-testid="text-services-title">
              Consulting Engineers & Contractors
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Full-scale civil and structural engineering and construction plans
              developed and implemented by our in-house experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Top-Left Card (Prominent - Z Pattern start) */}
            <div className="group h-full bg-white rounded-xl shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden relative z-10" data-testid="card-construction">
              <div className="h-1.5 bg-orange-500" />
              <div className="p-6 flex flex-col items-start text-left">
                <Shield className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-slate-900 text-xl font-bold mb-2 uppercase tracking-wide">
                  Construction Service
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed line-clamp-2">
                  Fully licensed for residential additions, multi-unit, commercial mixed-use, and public governmental infrastructure.
                </p>
                <a href="#" className="mt-auto text-orange-600 font-bold hover:text-orange-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4"/>
                </a>
              </div>
            </div>

            {/* Top-Right Card (Flatter) */}
            <div className="group h-full bg-slate-50 rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 overflow-hidden" data-testid="card-engineering">
              <div className="h-1 bg-amber-400 opacity-70 group-hover:opacity-100" />
              <div className="p-6 flex flex-col items-start text-left">
                <ClipboardCheck className="w-10 h-10 text-amber-600 mb-4" />
                <h3 className="text-slate-900 text-xl font-bold mb-2 uppercase tracking-wide">
                  Engineering Consulting
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed line-clamp-2">
                  Professional engineering expertise across civil and structural disciplines, providing innovative and practical solutions.
                </p>
                <a href="#" className="mt-auto text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4"/>
                </a>
              </div>
            </div>

            {/* Bottom-Left Card (Flatter) */}
            <div className="group h-full bg-slate-50 rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 overflow-hidden" data-testid="card-inspections">
              <div className="h-1 bg-orange-400 opacity-70 group-hover:opacity-100" />
              <div className="p-6 flex flex-col items-start text-left">
                <ClipboardCheck className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-slate-900 text-xl font-bold mb-2 uppercase tracking-wide">
                  Inspections & Testing
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed line-clamp-2">
                  Thorough inspections to ensure ongoing compliance, accurate material sampling, and environmental standards.
                </p>
                <a href="#" className="mt-auto text-orange-600 font-bold hover:text-orange-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4"/>
                </a>
              </div>
            </div>

            {/* Bottom-Right Card (Prominent - Z Pattern end) */}
            <div className="group h-full bg-white rounded-xl shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden relative z-10" data-testid="card-stormwater">
              <div className="h-1.5 bg-amber-500" />
              <div className="p-6 flex flex-col items-start text-left">
                <FileText className="w-10 h-10 text-amber-600 mb-4" />
                <h3 className="text-slate-900 text-xl font-bold mb-2 uppercase tracking-wide">
                  Stormwater Planning
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed line-clamp-2">
                  Custom plans from initial assessments, tailored practical BMP designs, and full regulatory compliance walkthroughs.
                </p>
                <a href="#" className="mt-auto text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY PACIFIC - Tighter spacing, amber-50/40 */}
      <section className="py-16 px-4 sm:px-6 bg-amber-50/40 relative overflow-hidden" data-testid="section-why-choose">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-slate-900 mb-4 text-3xl font-extrabold tracking-tight md:text-5xl" data-testid="text-why-title">
                Why Pacific Engineering?
              </h2>
              <div className="bg-orange-500 my-6 w-16 h-1 rounded-full"></div>

              <p className="text-slate-700 mb-8 text-lg leading-relaxed">
                With over 40 years of experience in private, commercial, and
                institutional full-scale civil engineering and construction
                contracting, we deliver comprehensive solutions.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-slate-900 mb-1 text-lg font-bold tracking-wide">
                      EXPERT KNOWLEDGE
                    </h3>
                    <p className="text-slate-600 text-base">
                      Complete understanding of federal, state, and local stormwater regulations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-slate-900 mb-1 text-lg font-bold tracking-wide">
                      PROVEN TRACK RECORD
                    </h3>
                    <p className="text-slate-600 text-base">
                      100% client satisfaction across 2.5K+ successful projects.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-slate-900 mb-1 text-lg font-bold tracking-wide">
                      RESPONSIVE SERVICE
                    </h3>
                    <p className="text-slate-600 text-base">
                      Quick turnaround times and dedicated project support to keep you moving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-orange-600 hover:bg-orange-500 shadow-lg transition-all duration-300 group" data-testid="btn-why-start">
                  <HardHat className="w-5 h-5" />
                  Start Your Project
                </button>
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-800 font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-transparent border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 group" data-testid="btn-why-credentials">
                  Our Credentials
                </button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
                  alt="San Francisco construction projects"
                  className="w-full h-full object-cover"
                  data-testid="img-sf-projects"
                />
              </div>
              
              {/* Badge positioned cleanly overlapping the bottom right */}
              <div className="absolute -bottom-4 -right-4 bg-orange-600 p-6 rounded-xl shadow-lg border-4 border-white flex flex-col items-center justify-center z-20">
                <div className="text-white mb-1 text-3xl md:text-5xl font-extrabold tracking-tighter" data-testid="text-projects-count">
                  2.5K+
                </div>
                <div className="text-orange-100 font-bold uppercase tracking-widest text-xs">
                  Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION - Punchy, full-width buttons stacked */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900 relative border-t-4 border-orange-500 overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888082416-a711bc141c2c?w=1600')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-slate-900/90"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tighter leading-tight" data-testid="text-cta-title">
            Need Engineering Support?
          </h2>
          
          <p className="text-amber-400 font-medium tracking-wide text-sm sm:text-base md:text-lg uppercase mb-10">
            Licensed PE · QSD/QSP · Class A & B Contractor
          </p>

          <div className="flex flex-col gap-4 max-w-md mx-auto mb-10">
            <button className="w-full inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-8 py-5 rounded-xl bg-orange-600 hover:bg-orange-500 shadow-lg transition-all duration-300" data-testid="btn-cta-quote">
              <Zap className="w-6 h-6" />
              Request a Quote Now
            </button>
            <button className="w-full inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-8 py-5 rounded-xl bg-slate-800 hover:bg-slate-700 shadow-lg border border-slate-700 hover:border-slate-600 transition-all duration-300" data-testid="btn-cta-call">
              <Phone className="w-6 h-6" />
              Call Us Direct: (415) 555-0100
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-slate-400 text-sm font-medium">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> Fast Response</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> Bay Area Local</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> Fully Licensed</span>
          </div>
        </div>
      </section>
    </div>
  );
}
