import {
  CheckCircle,
  FileText,
  ClipboardCheck,
  Shield,
  ArrowRight,
  Phone,
  PhoneCall,
  Clock,
  Menu,
  MessageCircle,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center text-center">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white p-2" data-testid="btn-close-menu">
        <X className="w-8 h-8" />
      </button>
      <nav className="flex flex-col space-y-6 text-2xl sm:text-3xl font-light tracking-wide w-full px-6">
        {["Home", "Services", "About Us", "Previous Work", "Gallery", "Contact"].map((item) => (
          <a key={item} href="#" className="text-white/80 hover:text-orange-500 transition-colors">{item}</a>
        ))}
        <div className="pt-10 space-y-4 max-w-sm mx-auto w-full">
          <button className="w-full py-4 rounded-none bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors">
            <PhoneCall className="w-5 h-5" /> Request a Quote
          </button>
          <button className="w-full py-4 rounded-none bg-white/10 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
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
        <div className="absolute bottom-20 right-0 w-80 bg-white shadow-2xl border border-slate-200 mb-2">
          <div className="bg-black px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Pacific Engineering</div>
              <div className="text-white/60 text-xs">Typically replies within 1 hour</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5">
            <div className="bg-slate-100 p-4 text-sm text-slate-800 mb-4 font-medium">
              Hi! How can we help with your project? We're here to answer questions about our engineering, inspection, or construction services.
            </div>
            <div className="flex gap-2">
              <input placeholder="Type a message..." className="flex-1 text-sm border-b-2 border-slate-200 px-2 py-2 focus:outline-none focus:border-orange-500 bg-transparent rounded-none" />
              <button className="bg-orange-600 text-white px-4 py-2 text-sm font-bold hover:bg-orange-500 transition-colors">SEND</button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black hover:bg-slate-900 text-white flex items-center justify-center transition-transform hover:scale-105"
        data-testid="btn-chatbot"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}

export function NarrativeScroll() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-slate-100 overflow-x-hidden" data-testid="page-home-narrative-scroll">
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <ChatBubble />

      {/* Floating Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? "bg-black/90 backdrop-blur-md py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/__mockup/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            <div className="hidden sm:block">
              <div className="font-bold text-white text-lg tracking-wide uppercase">Pacific Eng.</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:4155550100" className="hidden md:flex items-center gap-2 text-white/80 hover:text-white font-medium text-sm tracking-widest uppercase transition-colors">
              <Phone className="w-4 h-4" /> (415) 555-0100
            </a>
            <button onClick={() => setMenuOpen(true)} className="text-white hover:text-orange-500 transition-colors" data-testid="btn-hamburger">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* WE ARE (Hero) */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12" data-testid="section-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-orange-500 tracking-[0.2em] uppercase text-sm sm:text-base font-bold mb-8" data-testid="text-hero-subtitle">
            Consulting Engineers & Contractors
          </p>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold text-white tracking-tighter leading-[0.9] mb-12" data-testid="text-hero-title">
            PACIFIC<br />ENGINEERING
            <span className="block text-3xl sm:text-5xl md:text-6xl text-white/50 font-light mt-4 tracking-normal">& Construction Inc.</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-black font-bold tracking-widest uppercase text-sm px-10 py-5 bg-orange-500 hover:bg-orange-400 transition-all duration-300" data-testid="btn-hero-quote">
              <PhoneCall className="w-5 h-5" />
              Request a Quote
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-black font-bold tracking-widest uppercase text-sm px-10 py-5 bg-cyan-500 hover:bg-cyan-400 transition-all duration-300" data-testid="btn-hero-consultation">
              <Clock className="w-5 h-5" />
              Schedule a Consult
            </button>
          </div>

          <p className="text-white/40 text-sm sm:text-base tracking-widest uppercase" data-testid="text-hero-trust">
            Same-day response · No obligations · 40+ years Bay Area expertise
          </p>
        </div>
      </section>

      {/* Narrative Interstitial 1 */}
      <section className="py-24 bg-white text-black text-center px-6">
        <div className="max-w-4xl mx-auto" data-testid="stat-experience">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">40+ YEARS</h2>
          <p className="text-2xl md:text-4xl font-light text-slate-500 tracking-tight">of Bay Area civil engineering and construction excellence.</p>
        </div>
      </section>

      {/* WE DO (Services Flow) */}
      <div data-testid="section-services">
        {/* Service 1: Construction */}
        <section className="min-h-[80vh] flex items-center py-24 px-6 relative bg-slate-900 border-t border-white/5" data-testid="card-construction">
          <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6">CONSTRUCTION<br/><span className="text-orange-500">SERVICE</span></h3>
              <p className="text-xl sm:text-2xl text-slate-400 font-light mb-12 max-w-2xl leading-relaxed">
                We are fully licensed and ready to take on any and all work from residential additions to public and governmental infrastructure.
              </p>
              <ul className="space-y-6">
                {["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-xl sm:text-2xl text-slate-200 font-light">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <Shield className="w-48 h-48 sm:w-64 sm:h-64 text-white/5" />
            </div>
          </div>
        </section>

        {/* Narrative Interstitial 2: Why Choose 1 */}
        <section className="py-32 bg-orange-600 text-black text-center px-6" data-testid="section-why-choose">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase">Expert Knowledge</h2>
            <p className="text-2xl md:text-3xl font-medium tracking-tight">Complete understanding of federal, state, and local stormwater regulations.</p>
          </div>
        </section>

        {/* Service 2: Engineering */}
        <section className="min-h-[80vh] flex items-center py-24 px-6 relative bg-black border-t border-white/5" data-testid="card-engineering">
          <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-start">
              <ClipboardCheck className="w-48 h-48 sm:w-64 sm:h-64 text-white/5" />
            </div>
            <div>
              <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6">ENGINEERING<br/><span className="text-cyan-500">CONSULTING</span></h3>
              <p className="text-xl sm:text-2xl text-slate-400 font-light mb-12 max-w-2xl leading-relaxed">
                Professional engineering expertise across civil and structural disciplines, providing innovative solutions for your project.
              </p>
              <ul className="space-y-6">
                {["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management & Support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-xl sm:text-2xl text-slate-200 font-light">
                    <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Narrative Interstitial 3 */}
        <section className="py-32 bg-white text-black text-center px-6">
          <div className="max-w-5xl mx-auto" data-testid="stat-full-service">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase">Full-Service</h2>
            <p className="text-2xl md:text-4xl font-light text-slate-500 tracking-tight uppercase">Vertically Integrated Solutions</p>
          </div>
        </section>

        {/* Service 3: Inspections */}
        <section className="min-h-[80vh] flex items-center py-24 px-6 relative bg-slate-900 border-t border-white/5" data-testid="card-inspections">
          <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6">INSPECTIONS<br/><span className="text-orange-500">& TESTING</span></h3>
              <p className="text-xl sm:text-2xl text-slate-400 font-light mb-12 max-w-2xl leading-relaxed">
                Thorough inspections to ensure ongoing compliance with recommendation and implementation of areas for improvement.
              </p>
              <ul className="space-y-6">
                {["Structural Systems Inspections", "Stormwater Testing and Inspections", "Materials Sampling & Testing", "Environmental Compliance"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-xl sm:text-2xl text-slate-200 font-light">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <ClipboardCheck className="w-48 h-48 sm:w-64 sm:h-64 text-white/5" />
            </div>
          </div>
        </section>

        {/* Narrative Interstitial 4: Why Choose 2 & Stats */}
        <section className="py-32 bg-cyan-600 text-black text-center px-6">
          <div className="max-w-5xl mx-auto space-y-24">
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase">Proven Track Record</h2>
              <p className="text-2xl md:text-3xl font-medium tracking-tight">100% client satisfaction.</p>
            </div>
            <div data-testid="text-projects-count">
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter mb-4">2.5K+</h2>
              <p className="text-2xl md:text-4xl font-medium tracking-tight uppercase">Successful Projects</p>
            </div>
          </div>
        </section>

        {/* Service 4: Stormwater */}
        <section className="min-h-[80vh] flex items-center py-24 px-6 relative bg-black border-t border-white/5" data-testid="card-stormwater">
          <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-start">
              <FileText className="w-48 h-48 sm:w-64 sm:h-64 text-white/5" />
            </div>
            <div>
              <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6">STORMWATER<br/><span className="text-cyan-500">PLANNING</span></h3>
              <p className="text-xl sm:text-2xl text-slate-400 font-light mb-12 max-w-2xl leading-relaxed">
                Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance assurance.
              </p>
              <ul className="space-y-6">
                {["In-house PE/QSD/QSP site assessment", "BMP design and maintenance", "Clear documentation with action items", "Full local, state, Federal compliance"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-xl sm:text-2xl text-slate-200 font-light">
                    <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Narrative Interstitial 5: Why Choose 3 & Stats */}
        <section className="py-32 bg-white text-black text-center px-6">
          <div className="max-w-5xl mx-auto space-y-24">
            <div data-testid="stat-full-scale">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase">Full-Scale</h2>
              <p className="text-2xl md:text-4xl font-light text-slate-500 tracking-tight uppercase">Res, Comm & Infrastructure</p>
            </div>
            <div className="border-t border-slate-200 pt-24">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase">Responsive Service</h2>
              <p className="text-2xl md:text-3xl font-medium tracking-tight">Quick turnaround times and dedicated project support to keep you moving.</p>
            </div>
          </div>
        </section>
      </div>

      {/* LET'S START (Footer CTA) */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 bg-black text-center relative" data-testid="section-cta">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.1)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-7xl md:text-[6rem] font-black text-white tracking-tighter leading-none mb-12 uppercase" data-testid="text-cta-title">
            Let's Start<br />Building.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-black font-bold tracking-widest uppercase text-sm px-12 py-6 bg-orange-500 hover:bg-orange-400 transition-all duration-300" data-testid="btn-cta-quote">
              <FileText className="w-6 h-6" />
              Request a Quote
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white border-2 border-white/20 font-bold tracking-widest uppercase text-sm px-12 py-6 hover:bg-white hover:text-black transition-all duration-300" data-testid="btn-cta-call">
              <Phone className="w-6 h-6" />
              Call Us Now
            </button>
          </div>
          
          <p className="text-slate-500 font-light tracking-widest uppercase text-sm" data-testid="text-cta-phone">
            Direct Line: (415) 555-0100
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10 px-6 text-center text-slate-500 text-sm font-light tracking-widest uppercase">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/__mockup/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-8 w-8 object-contain opacity-50 grayscale" />
            <span>&copy; {new Date().getFullYear()} Pacific Engineering & Construction Inc.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
