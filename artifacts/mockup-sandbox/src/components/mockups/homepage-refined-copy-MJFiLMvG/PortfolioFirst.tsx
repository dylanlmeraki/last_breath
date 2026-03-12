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
  X,
  ChevronRight,
  Filter
} from "lucide-react";
import { useState } from "react";

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src="/__mockup/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-10 w-10 object-contain" />
          <span className="text-slate-900 font-bold text-lg tracking-tight">Pacific Engineering</span>
        </div>
        <button onClick={onClose} className="text-slate-500 p-2" data-testid="btn-close-menu">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex flex-col px-8 py-6 space-y-1">
        {["Home", "Work", "Services", "About", "Contact"].map((item) => (
          <a key={item} href="#" className="text-2xl text-slate-800 hover:text-orange-600 py-4 border-b border-gray-100 transition-colors font-semibold tracking-tight">{item}</a>
        ))}
        <div className="pt-8 space-y-4">
          <button className="w-full py-4 rounded-lg bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2">
            <PhoneCall className="w-5 h-5" /> Request a Quote
          </button>
          <button className="w-full py-4 rounded-lg bg-slate-100 text-slate-800 font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
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
          <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Pacific Engineering</div>
              <div className="text-slate-300 text-xs">Typically replies in minutes</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="bg-slate-100 rounded-xl rounded-tl-sm p-4 text-sm text-slate-700 mb-4">
              Hi there. Looking at our recent projects? Let us know if you want to discuss your own project.
            </div>
            <div className="flex gap-2">
              <input placeholder="Type your message..." className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
              <button className="bg-orange-600 text-white rounded-lg px-3 py-2 text-sm font-medium">Send</button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
        data-testid="btn-chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}

const PROJECTS = [
  {
    id: 1,
    title: "Bay Bridge Seismic Retrofit",
    category: "Construction",
    desc: "Major structural upgrades to critical transportation infrastructure.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600"
  },
  {
    id: 2,
    title: "Transbay Terminal Development",
    category: "Engineering",
    desc: "Comprehensive civil consulting for multi-modal transit center.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600"
  },
  {
    id: 3,
    title: "Mission Bay Stormwater Plan",
    category: "Stormwater",
    desc: "Complete BMP design and federal compliance for mixed-use area.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112c4e5190?w=600"
  },
  {
    id: 4,
    title: "Downtown High-Rise Inspection",
    category: "Inspections",
    desc: "Materials sampling and structural systems inspection for 50-story tower.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600"
  },
  {
    id: 5,
    title: "Embarcadero Seawall Repair",
    category: "Construction",
    desc: "Public works infrastructure repair and reinforcement.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"
  },
  {
    id: 6,
    title: "SFO Terminal Expansion",
    category: "Engineering",
    desc: "Site assessment and design management for major airport addition.",
    image: "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?w=600"
  }
];

const SERVICES = [
  {
    id: "construction",
    title: "Construction Service",
    icon: Shield,
    desc: "Fully licensed and ready to take on work from residential additions to public and governmental infrastructure.",
    bullets: ["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"]
  },
  {
    id: "engineering",
    title: "Engineering Consulting",
    icon: ClipboardCheck,
    desc: "Professional engineering expertise across civil and structural disciplines, providing innovative solutions.",
    bullets: ["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management & Support"]
  },
  {
    id: "inspections",
    title: "Inspections & Testing",
    icon: ClipboardCheck,
    desc: "Thorough inspections to ensure ongoing compliance with recommendation and implementation.",
    bullets: ["Structural Systems Inspections", "Stormwater Testing and Inspections", "Materials Sampling & Testing", "Environmental Compliance"]
  },
  {
    id: "stormwater",
    title: "Stormwater Planning",
    icon: FileText,
    desc: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance assurance.",
    bullets: ["In-house PE/QSD/QSP site assessment", "BMP design and maintenance", "Clear documentation with action items", "Full local, state, Federal compliance"]
  }
];

export function PortfolioFirst() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900" data-testid="page-home-portfolio-first">
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <ChatBubble />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-24">
          <div className="flex items-center gap-4">
            <img src="/__mockup/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-12 w-12 object-contain" />
            <div className="hidden sm:block">
              <div className="font-bold text-slate-900 text-xl tracking-tight leading-none">Pacific Engineering</div>
              <div className="text-xs font-semibold text-slate-500 tracking-wide uppercase mt-1">& Construction Inc.</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {["Work", "Services", "About", "Contact"].map((item) => (
              <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:4155550100" className="hidden md:inline-flex items-center gap-2 text-slate-800 font-bold text-sm hover:text-orange-600 transition-colors">
              <Phone className="w-4 h-4" /> (415) 555-0100
            </a>
            <button className="hidden sm:flex items-center justify-center px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded transition-colors" data-testid="btn-header-quote">
              Request a Quote
            </button>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-slate-900 p-2" data-testid="btn-hamburger">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Compact Hero */}
      <section className="pt-36 pb-16 px-6 relative bg-gray-50" data-testid="section-hero">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <div className="md:flex md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] text-slate-900 mb-6" data-testid="text-hero-title">
                Building the Bay Area's Infrastructure.
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-2xl" data-testid="text-hero-subtitle">
                Consulting Engineers & Contractors delivering full-scale civil, structural, and construction solutions since 1983.
              </p>
            </div>
            
            <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4 shrink-0">
              <button className="inline-flex items-center justify-center gap-2 text-white font-bold tracking-tight text-lg px-8 py-4 bg-orange-600 hover:bg-orange-500 transition-all" data-testid="btn-hero-quote">
                Request a Quote
              </button>
              <button className="inline-flex items-center justify-center gap-2 text-white font-bold tracking-tight text-lg px-8 py-4 bg-cyan-600 hover:bg-cyan-500 transition-all" data-testid="btn-hero-consultation">
                Schedule Consult
              </button>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500 uppercase tracking-wider" data-testid="text-hero-trust">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> Same-day response</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> No obligations</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> 40+ years Bay Area expertise</span>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section className="py-16 md:py-24 px-6 bg-white" data-testid="section-portfolio">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Work</h2>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
              {["All", "Construction", "Engineering", "Inspections", "Stormwater"].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                    activeFilter === filter 
                      ? "bg-slate-900 text-white" 
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 rounded">
                    {project.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{project.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{project.desc}</p>
                <div className="flex items-center text-sm font-bold text-orange-600 uppercase tracking-wider">
                  View Project <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="inline-flex items-center justify-center border-2 border-slate-900 text-slate-900 font-bold px-8 py-3 hover:bg-slate-900 hover:text-white transition-colors uppercase tracking-wider text-sm">
              View All 2.5K+ Projects
            </button>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-slate-900 text-white py-16 px-6" data-testid="section-trust-stats">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="pt-8 sm:pt-0 sm:px-8 first:pl-0 flex flex-col items-center sm:items-start" data-testid="stat-experience">
              <div className="text-5xl font-black text-orange-500 mb-2">40+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Years Experience</div>
            </div>
            <div className="pt-8 sm:pt-0 sm:px-8 flex flex-col items-center sm:items-start" data-testid="stat-full-service">
              <div className="text-3xl font-black mb-2 mt-2">Full-Service</div>
              <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Vertically Integrated</div>
            </div>
            <div className="pt-8 sm:pt-0 sm:px-8 flex flex-col items-center sm:items-start" data-testid="stat-full-scale">
              <div className="text-3xl font-black mb-2 mt-2">Full-Scale</div>
              <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Res, Comm & Infra</div>
            </div>
            <div className="pt-8 sm:pt-0 sm:px-8 flex flex-col items-center sm:items-start">
              <div className="text-5xl font-black text-cyan-500 mb-2">2.5K+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Successful Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Services List */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-200" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:flex md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6" data-testid="text-services-title">
                Comprehensive Engineering & Construction
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Full-scale civil and structural engineering and construction plans developed and implemented by our in-house experts.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-16">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="flex gap-6" data-testid={`card-${service.id}`}>
                  <div className="shrink-0 mt-1">
                    <div className="w-16 h-16 bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{service.desc}</p>
                    <ul className="space-y-3">
                      {service.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                          <CheckCircle className="w-5 h-5 text-orange-600 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us (Compact variant) */}
      <section className="py-24 px-6 bg-white" data-testid="section-why-choose">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-16" data-testid="text-why-title">
            Why Pacific Engineering?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Expert Knowledge", desc: "Complete understanding of federal, state, and local stormwater regulations." },
              { title: "Proven Track Record", desc: "100% client satisfaction across 2.5K+ successful projects." },
              { title: "Responsive Service", desc: "Quick turnaround times and dedicated project support to keep you moving." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-900 py-24 px-6 relative overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888082416-a711bc141c2c?w=1600')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter" data-testid="text-cta-title">
            Ready to start your next project?
          </h2>
          <p className="text-xl text-slate-300 mb-12 font-light">
            Contact us today for a consultation or to request a quote. Our team is ready to deliver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 text-white font-bold tracking-tight text-lg px-8 py-4 bg-orange-600 hover:bg-orange-500 transition-all" data-testid="btn-cta-quote">
              <PhoneCall className="w-5 h-5" />
              Request a Quote
            </button>
            <button className="inline-flex items-center justify-center gap-2 text-slate-900 font-bold tracking-tight text-lg px-8 py-4 bg-white hover:bg-gray-100 transition-all" data-testid="btn-cta-call">
              <Phone className="w-5 h-5" />
              (415) 555-0100
            </button>
          </div>
        </div>
      </section>
      
      <footer className="bg-slate-950 text-slate-400 py-8 px-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Pacific Engineering & Construction Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
