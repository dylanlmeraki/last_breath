import React, { useState } from "react";
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
  Building2,
  HardHat,
  Ruler
} from "lucide-react";

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col">
      <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-8 w-8 rounded object-contain" />
          <span className="text-white font-bold text-sm tracking-wide uppercase">Pacific Engineering</span>
        </div>
        <button onClick={onClose} className="text-white p-2" data-testid="btn-close-menu">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex flex-col px-6 py-6 space-y-4 flex-1">
        {["Home", "Services", "About Us", "Previous Work", "Contact"].map((item) => (
          <a key={item} href="#" className="text-xl text-slate-200 hover:text-orange-400 py-2 border-b border-slate-800/50 transition-colors font-medium">
            {item}
          </a>
        ))}
        <div className="mt-auto pb-8 space-y-3">
          <button className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20">
            <FileText className="w-5 h-5" /> Request a Quote
          </button>
          <button className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold text-lg flex items-center justify-center gap-2 border border-slate-700">
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
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-2 flex flex-col">
          <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Pacific Engineering</div>
              <div className="text-slate-400 text-xs">Typically replies within 1 hour</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 bg-slate-50 flex-1">
            <div className="bg-white rounded-xl rounded-tl-sm p-4 text-sm text-slate-700 mb-4 shadow-sm border border-slate-100">
              Hi! How can we help with your project? We're here to answer questions about our engineering, inspection, or construction services.
            </div>
          </div>
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input placeholder="Type a message..." className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40 bg-slate-50" />
            <button className="bg-orange-600 text-white rounded-lg px-4 py-2 text-sm font-bold shadow-sm hover:bg-orange-500 transition-colors">Send</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 flex items-center justify-center transition-all hover:scale-105 border border-slate-700"
        data-testid="btn-chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}

export function BentoDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col" data-testid="page-home-bento">
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <ChatBubble />

      {/* COMPACT HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-9 w-9 rounded-md object-contain border border-slate-100 shadow-sm" />
            <div className="flex flex-col">
              <div className="font-extrabold text-slate-900 text-sm md:text-base leading-none tracking-tight uppercase">Pacific Engineering</div>
              <div className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-wider">Consulting Engineers & Contractors</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {["Home", "Services", "About", "Projects"].map((item) => (
              <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors uppercase tracking-wide">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:4155550100" className="hidden md:flex items-center gap-2 text-slate-700 font-bold text-sm hover:text-orange-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50">
              <Phone className="w-4 h-4" /> (415) 555-0100
            </a>
            <button className="hidden sm:flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-500 transition-colors shadow-sm" data-testid="header-btn-quote">
              Request Quote
            </button>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-slate-800 p-2 hover:bg-slate-100 rounded-md" data-testid="btn-hamburger">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* BENTO GRID DASHBOARD */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {/* Sub-header context */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight" data-testid="text-hero-title">
              Bay Area Engineering & Construction
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm md:text-base" data-testid="text-hero-trust">
              Same-day response · No obligations · 40+ years Bay Area expertise
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available for new projects
            </span>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-auto lg:auto-rows-[340px]">
          
          {/* TILE 1: Services (Large) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 lg:row-span-2 overflow-hidden flex flex-col" data-testid="tile-services">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                Our Core Services
              </h2>
              <button className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 overflow-y-auto">
              {/* Service 1 */}
              <div className="space-y-3" data-testid="card-construction">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg"><HardHat className="w-5 h-5 text-orange-600" /></div>
                  <h3 className="font-bold text-slate-900 leading-tight">Construction Service</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Fully licensed for residential additions to public infrastructure.</p>
                <ul className="space-y-1.5">
                  {["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"].map((li, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> {li}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service 2 */}
              <div className="space-y-3" data-testid="card-engineering">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg"><Ruler className="w-5 h-5 text-slate-700" /></div>
                  <h3 className="font-bold text-slate-900 leading-tight">Engineering Consulting</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Professional engineering expertise across civil and structural disciplines.</p>
                <ul className="space-y-1.5">
                  {["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management & Support"].map((li, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /> {li}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service 3 */}
              <div className="space-y-3" data-testid="card-inspections">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg"><ClipboardCheck className="w-5 h-5 text-slate-700" /></div>
                  <h3 className="font-bold text-slate-900 leading-tight">Inspections & Testing</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Thorough inspections to ensure ongoing compliance and implementation.</p>
                <ul className="space-y-1.5">
                  {["Structural Systems Inspections", "Stormwater Testing and Inspections", "Materials Sampling & Testing", "Environmental Compliance"].map((li, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /> {li}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service 4 */}
              <div className="space-y-3" data-testid="card-stormwater">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg"><FileText className="w-5 h-5 text-slate-700" /></div>
                  <h3 className="font-bold text-slate-900 leading-tight">Stormwater Planning</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Custom plans, tailored BMP designs, and full regulatory compliance.</p>
                <ul className="space-y-1.5">
                  {["In-house PE/QSD/QSP site assessment", "BMP design and maintenance", "Clear documentation with action items", "Full local, state, Federal compliance"].map((li, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /> {li}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* TILE 2: Stats/Credentials (Medium) */}
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 lg:col-span-2 lg:row-span-1 p-6 relative overflow-hidden flex flex-col justify-center" data-testid="tile-credentials">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-white font-bold text-lg mb-6 tracking-wide flex items-center gap-2 relative z-10">
              <Shield className="w-5 h-5 text-orange-500" /> Trusted Credentials
            </h2>
            
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 relative z-10">
              <div data-testid="stat-experience">
                <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tighter">40<span className="text-orange-500">+</span></div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Years Experience</div>
              </div>
              <div data-testid="stat-projects">
                <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tighter">2.5K<span className="text-orange-500">+</span></div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Successful Projects</div>
              </div>
              <div data-testid="stat-full-service">
                <div className="text-xl md:text-2xl font-black text-white mb-1 tracking-tight leading-none">Full-Service</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Vertically Integrated</div>
              </div>
              <div data-testid="stat-full-scale">
                <div className="text-xl md:text-2xl font-black text-white mb-1 tracking-tight leading-none">Full-Scale</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Res, Comm & Infra</div>
              </div>
            </div>
          </div>

          {/* TILE 3: Why Choose (Medium - Tall) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 lg:row-span-2 p-6 flex flex-col relative overflow-hidden" data-testid="tile-why-choose">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-6 mt-2" data-testid="text-why-title">
              Why Pacific Engineering?
            </h2>
            
            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              We deliver comprehensive solutions keeping private, commercial, and institutional projects on track.
            </p>

            <div className="space-y-6 flex-1">
              {[
                { title: "Expert Knowledge", desc: "Complete understanding of federal, state, and local regulations." },
                { title: "Proven Track Record", desc: "100% client satisfaction across our extensive portfolio." },
                { title: "Responsive Service", desc: "Quick turnaround times and dedicated project support." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-2 rounded-full border border-slate-100 shrink-0">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2" data-testid="btn-about-team">
              <Users className="w-4 h-4" /> Meet Our Team
            </button>
          </div>

          {/* TILE 4: Featured Project Image (Medium - Tall) */}
          <div className="bg-slate-200 rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 lg:row-span-2 relative overflow-hidden group min-h-[300px]" data-testid="tile-project-image">
            <img src="https://images.unsplash.com/photo-1541888082416-a711bc141c2c?w=800" alt="Construction Project" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-testid="img-sf-projects" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6">
              <div className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block mb-3">Featured Work</div>
              <h3 className="text-white font-bold text-lg leading-tight mb-2">Bay Area Commercial Infrastructure</h3>
              <p className="text-slate-300 text-xs">Full-scale civil engineering & execution</p>
              <button className="mt-4 flex items-center gap-2 text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                View Gallery <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TILE 5: Phone / Quick Contact (Small) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 lg:row-span-1 p-6 flex flex-col justify-center items-center text-center group hover:border-orange-500/50 transition-colors cursor-pointer" data-testid="tile-phone">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Direct Line</h3>
            <a href="tel:4155550100" className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
              (415) 555-0100
            </a>
          </div>

          {/* TILE 6: Quote CTA (Small) */}
          <div className="bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/20 border border-orange-500 lg:col-span-1 lg:row-span-1 p-6 flex flex-col justify-center items-center text-center group hover:bg-orange-500 transition-colors cursor-pointer relative overflow-hidden" data-testid="tile-quote-cta">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <button className="text-2xl font-black text-white tracking-tight flex items-center gap-2" data-testid="btn-hero-quote">
              Request Quote
            </button>
            <div className="text-orange-200 text-xs font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
              Start your project <ArrowRight className="w-3 h-3" />
            </div>
          </div>

        </div>
      </main>

      {/* SIMPLE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-6 w-6 rounded-sm grayscale opacity-50" />
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pacific Engineering & Construction Inc.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Licensing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
