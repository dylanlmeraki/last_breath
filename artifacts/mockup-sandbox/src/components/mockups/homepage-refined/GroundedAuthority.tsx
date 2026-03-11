import React from "react";
import {
  CheckCircle,
  FileText,
  ClipboardCheck,
  Shield,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";

export default function GroundedAuthority() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans" data-testid="page-home-refined">
      {/* 1. HERO - Full screen, min-h-screen, dark */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 py-12 sm:py-16 md:py-20 lg:py-24 border-b border-slate-200" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-10">
          <div className="mx-auto w-full max-w-5xl text-center">
            
            <div className="relative bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden mt-10">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              
              <div className="p-6 sm:p-10 md:p-12 lg:p-16">
                <h1 className="text-white font-bold tracking-tighter leading-[1.1] text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-6" data-testid="text-hero-title">
                  <span className="text-white">
                    Pacific Engineering
                  </span>{" "}
                  <br />
                  <span className="text-amber-400">
                    & Construction Inc.
                  </span>
                </h1>

                <div className="flex items-center justify-center gap-4 my-8">
                  <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-slate-600" />
                  <div className="w-3 h-3 rotate-45 bg-orange-500" />
                  <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-slate-600" />
                </div>

                <div className="mb-12">
                  <p className="text-slate-300 mx-auto font-light tracking-wide text-lg sm:text-xl md:text-2xl" data-testid="text-hero-subtitle">
                    Consulting Engineers & Contractors
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
                  <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-orange-600 hover:bg-orange-500 shadow-lg hover:shadow-xl transition-all duration-300" data-testid="btn-hero-services">
                    Our Services
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-slate-700 hover:bg-slate-600 shadow-lg hover:shadow-xl transition-all duration-300" data-testid="btn-hero-consultation">
                    Free Consultation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Stat 1 */}
                  <div className="relative rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center" data-testid="stat-experience">
                    <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">40+</div>
                    <div className="text-slate-400 tracking-tight font-medium text-sm sm:text-base">Years Experience</div>
                  </div>

                  {/* Stat 2 - Center */}
                  <div className="relative rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center" data-testid="stat-full-service">
                    <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">Full-Service</div>
                    <div className="text-amber-400 tracking-tight font-medium text-sm sm:text-base">Vertically Integrated</div>
                  </div>

                  {/* Stat 3 */}
                  <div className="relative rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center" data-testid="stat-full-scale">
                    <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">Full-Scale</div>
                    <div className="text-slate-400 tracking-tight font-medium text-sm sm:text-base">Res, Comm & Infrastructure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID - More vertical space (py-32) and white background */}
      <section className="py-32 px-6 bg-white border-b border-slate-200" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight" data-testid="text-services-title">
              Consulting Engineers & Contractors
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 to-amber-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Full-scale civil and structural engineering and construction plans
              developed and implemented by our teams of in-house Engineers,
              QSD/QSPs, and construction experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Top-Left Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="card-construction">
              <div className="h-2 bg-orange-500" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-orange-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8">
                  <Shield className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider">
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

            {/* Top-Right Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="card-engineering">
              <div className="h-2 bg-amber-500" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-amber-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8">
                  <ClipboardCheck className="w-12 h-12 text-amber-600" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider">
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
                    <li key={i} className="flex items-center justify-center gap-3 text-slate-700 w-full">
                      <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom-Left Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="card-inspections">
              <div className="h-2 bg-green-500" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-green-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8">
                  <ClipboardCheck className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider">
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
                    <li key={i} className="flex items-center justify-center gap-3 text-slate-700 w-full">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom-Right Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="card-stormwater">
              <div className="h-2 bg-gradient-to-r from-teal-600 to-teal-700" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-teal-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8">
                  <FileText className="w-12 h-12 text-teal-700" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider">
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
                      <CheckCircle className="w-6 h-6 text-teal-700 flex-shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY PACIFIC - Less padding (py-16), warm off-white */}
      <section className="py-16 px-6 bg-amber-50/40 border-b border-slate-200 relative overflow-hidden" data-testid="section-why-choose">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-slate-900 mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl" data-testid="text-why-title">
                Why Pacific Engineering?
              </h2>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 my-8 w-24 h-1.5 rounded-full"></div>

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
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                      <CheckCircle className="w-8 h-8 text-orange-600" />
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
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                      <CheckCircle className="w-8 h-8 text-orange-600" />
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
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                      <CheckCircle className="w-8 h-8 text-orange-600" />
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

              <div>
                <button className="inline-flex items-center justify-center gap-2 text-white font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid="btn-about-us">
                  About Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            <div className="relative mt-12 lg:mt-0 px-4 sm:px-8">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
                  alt="San Francisco construction projects"
                  className="w-full h-full object-cover"
                  data-testid="img-sf-projects"
                />
              </div>
              
              {/* Badge positioned cleanly overlapping the bottom right */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-gradient-to-br from-orange-600 to-amber-600 p-8 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center z-20">
                <div className="text-white mb-1 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter" data-testid="text-projects-count">
                  2.5K+
                </div>
                <div className="text-orange-50 font-bold uppercase tracking-widest text-xs sm:text-sm">
                  Successful Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION - Clean, authoritative, no bg image */}
      <section className="py-20 px-6 bg-slate-900 relative border-t-8 border-orange-500 overflow-hidden" data-testid="section-cta">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tighter leading-[1.1]" data-testid="text-cta-title">
            How Can We Help?
          </h2>
          <div className="w-48 h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 mx-auto mb-10 rounded-full"></div>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed font-light px-4">
            Let's discuss your Projects' unique needs and develop a
            comprehensive solution to keep your ideas on schedule, under
            budget, allowing you to maximize your capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-10 py-5 rounded-xl bg-orange-600 hover:bg-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid="btn-cta-contact">
              <Phone className="w-6 h-6" />
              Get In Touch
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-10 py-5 rounded-xl bg-slate-800 hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid="btn-cta-services">
              <Mail className="w-6 h-6" />
              Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
