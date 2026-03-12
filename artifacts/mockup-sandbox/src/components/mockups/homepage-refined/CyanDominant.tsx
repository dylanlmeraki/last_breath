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
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { useState } from "react";

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 h-20">
        <div className="flex items-center gap-3">
          <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-12 w-12 rounded-md object-contain" />
          <span className="text-white font-bold text-lg">Pacific Engineering</span>
        </div>
        <button onClick={onClose} className="text-white p-2" data-testid="btn-close-menu">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex flex-col px-8 py-6 space-y-1">
        {["Home", "Services", "About Us", "Previous Work", "Gallery", "Contact"].map((item) => (
          <a key={item} href="#" className="text-lg text-slate-200 hover:text-cyan-400 py-3 border-b border-slate-800 transition-colors font-medium">{item}</a>
        ))}
        <div className="pt-6 space-y-3">
          <button className="w-full py-4 rounded-lg bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2">
            <PhoneCall className="w-5 h-5" /> Request a Quote
          </button>
          <button className="w-full py-4 rounded-lg bg-cyan-600 text-white font-bold text-lg flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" /> (415) 555-0100
          </button>
        </div>
      </nav>
    </div>
  );
}

function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-2">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Pacific Engineering</div>
              <div className="text-cyan-100 text-xs">Typically replies within 1 hour</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="bg-slate-100 rounded-xl rounded-tl-sm p-4 text-sm text-slate-700 mb-4">
              Hi! How can we help with your project? We're here to answer questions about our engineering, inspection, or construction services.
            </div>
            <div className="flex gap-2">
              <input placeholder="Type a message..." className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" />
              <button className="bg-cyan-600 text-white rounded-lg px-3 py-2 text-sm font-medium">Send</button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center transition-all hover:scale-105"
        data-testid="btn-chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}

export default function CyanDominant() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans" data-testid="page-home-cyan-dominant">
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <ChatBubble />

      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm shadow-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-12 w-12 rounded-md object-contain" />
            <div>
              <div className="font-bold text-white text-lg tracking-tight">Pacific Engineering</div>
              <div className="text-xs font-medium text-cyan-300 tracking-wide">Consulting Engineers & Contractors</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {["Home", "Services", "About", "Projects", "Contact"].map((item) => (
              <a key={item} href="#" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-md">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:4155550100" className="hidden md:inline-flex items-center gap-2 text-cyan-400 font-bold text-sm hover:text-cyan-300 transition-colors">
              <Phone className="w-4 h-4" /> (415) 555-0100
            </a>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white p-2" data-testid="btn-hamburger">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-20" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-transparent to-orange-950/10 opacity-60" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/12 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 w-full px-4 sm:px-10 py-12">
          <div className="mx-auto w-full max-w-5xl text-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-2xl opacity-5 blur-sm" />

              <div className="relative bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400" />

                <div className="p-6 sm:p-10 md:p-12 lg:p-16">
                  <div className="flex justify-center mb-8">
                    <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-contain shadow-lg border-2 border-cyan-500/20" />
                  </div>

                  <h1 className="text-white font-bold tracking-tighter leading-[1.1] text-3xl sm:text-5xl md:text-7xl lg:text-8xl mb-6" data-testid="text-hero-title">
                    <span className="text-white">Pacific Engineering</span>{" "}
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      & Construction Inc.
                    </span>
                  </h1>

                  <div className="flex items-center justify-center gap-4 my-6 sm:my-8">
                    <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-cyan-500" />
                    <div className="w-3 h-3 rotate-45 bg-orange-400" />
                    <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-cyan-500" />
                  </div>

                  <p className="text-slate-300 mx-auto font-light tracking-wide text-base sm:text-lg md:text-2xl mb-10" data-testid="text-hero-subtitle">
                    Consulting Engineers & Contractors
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6">
                    <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 py-5 rounded-lg bg-orange-600 hover:bg-orange-500 shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300" data-testid="btn-hero-quote">
                      <PhoneCall className="w-5 h-5" />
                      Request a Quote
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-lg px-8 py-5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-600/20 hover:shadow-cyan-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300" data-testid="btn-hero-consultation">
                      <Clock className="w-5 h-5" />
                      Schedule a Consult
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  <p className="text-slate-400 text-sm md:text-base tracking-wide mb-12" data-testid="text-hero-trust">
                    Same-day response · No obligations · 40+ years Bay Area expertise
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="group relative rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:bg-white/10 p-6 flex flex-col items-center justify-center" data-testid="stat-experience">
                      <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">40+</div>
                      <div className="text-cyan-400 tracking-tight font-medium text-sm sm:text-base">Years Experience</div>
                    </div>

                    <div className="group relative rounded-xl bg-slate-800/80 border-2 border-cyan-500/40 shadow-xl p-6 md:scale-105 flex flex-col items-center justify-center z-10" data-testid="stat-full-service">
                      <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">Full-Service</div>
                      <div className="text-cyan-400 tracking-tight font-medium text-sm sm:text-base">Vertically Integrated</div>
                    </div>

                    <div className="group relative rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:bg-white/10 p-6 flex flex-col items-center justify-center" data-testid="stat-full-scale">
                      <div className="text-white font-bold mb-2 text-3xl sm:text-4xl">Full-Scale</div>
                      <div className="text-cyan-400 tracking-tight font-medium text-sm sm:text-base">Res, Comm & Infrastructure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-400" />

      <section className="py-24 sm:py-32 px-6 bg-white border-b border-slate-200" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight" data-testid="text-services-title">
              Consulting Engineers & Contractors
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 to-orange-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Full-scale civil and structural engineering and construction plans
              developed and implemented by our teams of in-house Engineers,
              QSD/QSPs, and construction experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="group h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-200 transition-all duration-300 overflow-hidden relative z-10 cursor-pointer hover:-translate-y-2" data-testid="card-construction">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-orange-100 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-orange-400 group-hover:to-orange-600 group-hover:shadow-lg transition-all duration-300">
                  <Shield className="w-12 h-12 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-orange-600 transition-colors">Construction Service</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">We are fully licensed and ready to take on any and all work from residential additions to public and governmental infrastructure.</p>
                <ul className="space-y-4 w-full flex flex-col items-center">
                  {["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"].map((item, i) => (
                    <li key={i} className="flex items-center justify-center gap-3 text-slate-700 w-full">
                      <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group h-full bg-slate-50/50 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2" data-testid="card-engineering">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-80" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-cyan-50 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-blue-600 group-hover:shadow-lg transition-all duration-300">
                  <ClipboardCheck className="w-12 h-12 text-cyan-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-cyan-600 transition-colors">Engineering Consulting</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">Professional engineering expertise across civil and structural disciplines, providing innovative solutions for your project.</p>
                <ul className="space-y-4 w-full flex flex-col items-center">
                  {["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management & Support"].map((item, i) => (
                    <li key={i} className="flex items-center justify-center gap-3 text-slate-600 w-full">
                      <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group h-full bg-slate-50/50 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2" data-testid="card-inspections">
              <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-80" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-blue-50 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-cyan-600 group-hover:shadow-lg transition-all duration-300">
                  <ClipboardCheck className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Inspections & Testing</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">Thorough inspections to ensure ongoing compliance with recommendation and implementation of areas for improvement.</p>
                <ul className="space-y-4 w-full flex flex-col items-center">
                  {["Structural Systems Inspections", "Stormwater Testing and Inspections", "Materials Sampling & Testing", "Environmental Compliance"].map((item, i) => (
                    <li key={i} className="flex items-center justify-center gap-3 text-slate-600 w-full">
                      <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-200 transition-all duration-300 overflow-hidden relative z-10 cursor-pointer hover:-translate-y-2" data-testid="card-stormwater">
              <div className="h-2 bg-gradient-to-r from-cyan-600 to-cyan-500" />
              <div className="p-10 flex flex-col items-center text-center">
                <div className="bg-cyan-50 rounded-2xl w-24 h-24 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-blue-700 group-hover:shadow-lg transition-all duration-300">
                  <FileText className="w-12 h-12 text-cyan-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wider group-hover:text-cyan-700 transition-colors">Stormwater Planning</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance assurance.</p>
                <ul className="space-y-4 w-full flex flex-col items-center">
                  {["In-house PE/QSD/QSP site assessment", "BMP design and maintenance", "Clear documentation with action items", "Full local, state, Federal compliance"].map((item, i) => (
                    <li key={i} className="flex items-center justify-center gap-3 text-slate-700 w-full">
                      <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-6 bg-cyan-50/40 relative overflow-hidden" data-testid="section-why-choose">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-slate-900 mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl" data-testid="text-why-title">
                Why Pacific Engineering?
              </h2>
              <div className="bg-gradient-to-r from-cyan-500 to-orange-400 my-8 w-24 h-1.5 rounded-full"></div>
              <p className="text-slate-700 mb-10 text-xl leading-relaxed">
                With over 40 years of experience in private, commercial, and institutional full-scale civil engineering and construction contracting, we deliver comprehensive solutions keeping projects on track.
              </p>
              <div className="space-y-8 mb-12">
                {[
                  { title: "EXPERT KNOWLEDGE", desc: "Complete understanding of federal, state, and local stormwater regulations." },
                  { title: "PROVEN TRACK RECORD", desc: "100% client satisfaction across 2.5K+ successful projects." },
                  { title: "RESPONSIVE SERVICE", desc: "Quick turnaround times and dedicated project support to keep you moving." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-cyan-100">
                        <CheckCircle className="w-8 h-8 text-cyan-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-slate-900 mb-2 text-xl font-bold tracking-wide">{item.title}</h3>
                      <p className="text-slate-600 text-lg">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center gap-2 text-white font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid="btn-scope-project">
                  <FileText className="w-5 h-5" />
                  Scope Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 text-slate-700 font-bold tracking-tight text-lg px-8 py-4 rounded-lg bg-transparent border-2 border-slate-300 hover:border-slate-400 hover:bg-white transition-all duration-300 group" data-testid="btn-about-team">
                  <Users className="w-5 h-5" /> About Our Team
                </button>
              </div>
            </div>

            <div className="relative mt-12 lg:mt-0 px-4 sm:px-8">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800" alt="San Francisco construction projects" className="w-full h-full object-cover" data-testid="img-sf-projects" />
              </div>
              <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-2xl shadow-xl border-4 border-white flex flex-col items-center justify-center z-20">
                <div className="text-white mb-1 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter" data-testid="text-projects-count">2.5K+</div>
                <div className="text-cyan-50 font-bold uppercase tracking-widest text-xs sm:text-sm">Successful Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900 relative border-t-4 border-cyan-500 overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888082416-a711bc141c2c?w=1600')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950/90"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm sm:text-base mb-4">Ready to move?</p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-8 tracking-tighter leading-[1.1]" data-testid="text-cta-title">
            Get Your Project on Track
          </h2>
          <div className="w-48 h-1.5 bg-gradient-to-r from-cyan-500 to-orange-400 mx-auto mb-10 rounded-full"></div>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-light px-4 max-w-3xl mx-auto">
            Engineering, inspections, construction, and stormwater — one team, one call. We respond same-day to keep your timeline intact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-10 py-5 rounded-xl bg-orange-600 hover:bg-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid="btn-cta-quote">
              <PhoneCall className="w-6 h-6" />
              Request a Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold tracking-tight text-xl px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid="btn-cta-call">
              <Phone className="w-6 h-6" /> (415) 555-0100
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 text-sm sm:text-base font-medium">
            <span className="inline-flex items-center gap-2"><CheckCircle className="w-5 h-5 text-cyan-500" /> Licensed PE/QSD/QSP</span>
            <span className="inline-flex items-center gap-2"><CheckCircle className="w-5 h-5 text-cyan-500" /> Class A & B Contractor</span>
            <span className="inline-flex items-center gap-2"><CheckCircle className="w-5 h-5 text-cyan-500" /> 2,500+ Projects Delivered</span>
          </div>
        </div>
      </section>
    </div>
  );
}