import { useState } from "react";
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
  ChevronDown,
  Building2,
  HardHat,
  Droplets,
  LineChart
} from "lucide-react";

function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden mb-2 flex flex-col">
          <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Pacific Engineering</div>
              <div className="text-slate-300 text-xs">Typically replies in 10 mins</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 flex-1 bg-slate-50">
            <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-3 text-sm text-slate-700 mb-4">
              Hello. How can we assist with your engineering or construction needs today?
            </div>
          </div>
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input placeholder="Type your message..." className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400" />
            <button className="bg-orange-600 hover:bg-orange-700 text-white rounded px-4 py-2 text-sm font-medium transition-colors">Send</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        data-testid="btn-chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}

function AccordionItem({ 
  title, 
  description, 
  bullets, 
  icon: Icon,
  isOpen,
  onClick,
  testId
}: { 
  title: string; 
  description: string; 
  bullets: string[]; 
  icon: any;
  isOpen: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <div className="border-b border-slate-200 last:border-0" data-testid={testId}>
      <button 
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-md transition-colors ${isOpen ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className={`text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-orange-600' : 'text-slate-900 group-hover:text-orange-600'}`}>
            {title}
          </h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
        <div className="pl-14 pr-4">
          <p className="text-slate-600 mb-4 leading-relaxed">{description}</p>
          <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-4">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SplitCommand() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number>(0);

  const services = [
    {
      title: "Construction Service",
      icon: HardHat,
      description: "We are fully licensed and ready to take on any and all work from residential additions to public and governmental infrastructure.",
      bullets: ["Class A License", "Class B License", "Infrastructure & Public Works", "Residential, Commercial & Municipal"],
      testId: "card-construction"
    },
    {
      title: "Engineering Consulting",
      icon: Building2,
      description: "Professional engineering expertise across civil and structural disciplines, providing innovative solutions for your project.",
      bullets: ["Civil Engineering Consulting", "Structural Consulting", "Site Assessment & Design", "Development Management & Support"],
      testId: "card-engineering"
    },
    {
      title: "Inspections & Testing",
      icon: LineChart,
      description: "Thorough inspections to ensure ongoing compliance with recommendation and implementation of areas for improvement.",
      bullets: ["Structural Systems Inspections", "Stormwater Testing and Inspections", "Materials Sampling & Testing", "Environmental Compliance"],
      testId: "card-inspections"
    },
    {
      title: "Stormwater Planning",
      icon: Droplets,
      description: "Custom plans from initial assessments, tailored BMP designs, and full regulatory compliance assurance.",
      bullets: ["In-house PE/QSD/QSP site assessment", "BMP design and maintenance", "Clear documentation with action items", "Full local, state, Federal compliance"],
      testId: "card-stormwater"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-orange-200 selection:text-orange-900" data-testid="page-home-split-command">
      <ChatBubble />

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950 text-white flex items-center justify-between px-4 h-16 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/__mockup/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-8 w-8 object-contain bg-white rounded-sm p-0.5" />
          <span className="font-bold text-lg tracking-tight">Pacific Engineering</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:4155550100" className="text-orange-400">
            <Phone className="w-5 h-5" />
          </a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-slate-300 hover:text-white" data-testid="btn-hamburger">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-slate-900 overflow-y-auto">
          <nav className="flex flex-col p-6 space-y-6">
            <div className="space-y-1">
              {["Services", "Projects", "About", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-xl text-slate-300 hover:text-white py-2 font-medium">
                  {item}
                </a>
              ))}
            </div>
            
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">40+</div>
                  <div className="text-xs text-orange-400 font-medium uppercase tracking-wider">Years Exp</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">2.5K+</div>
                  <div className="text-xs text-orange-400 font-medium uppercase tracking-wider">Projects</div>
                </div>
              </div>
              
              <button className="w-full py-4 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                <PhoneCall className="w-5 h-5" /> Request a Quote
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* DESKTOP SIDEBAR COMMAND STRIP */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[35%] xl:w-[30%] bg-slate-950 text-white overflow-y-auto border-r border-slate-800 z-20">
        <div className="p-8 xl:p-12 flex-1 flex flex-col">
          {/* Brand */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <img src="/__mockup/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-16 w-16 object-contain bg-white rounded-md p-1 shadow-lg" />
              <div>
                <h1 className="font-extrabold text-2xl xl:text-3xl tracking-tight leading-tight">Pacific Engineering</h1>
                <div className="text-orange-500 font-semibold text-sm xl:text-base tracking-wide mt-1">& Construction Inc.</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium border-l-2 border-slate-700 pl-3">
              Consulting Engineers & Contractors
            </p>
          </div>

          {/* Navigation */}
          <nav className="mb-12 flex-1">
            <ul className="space-y-2">
              {["Services", "Projects", "About", "Contact"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="flex items-center justify-between py-3 text-slate-300 hover:text-white hover:pl-2 transition-all group font-medium text-lg border-b border-slate-800/50">
                    {item}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-orange-500" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4" data-testid="stat-experience">
              <div className="text-2xl xl:text-3xl font-bold text-white mb-1">40+</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Years Exp</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4" data-testid="stat-projects">
              <div className="text-2xl xl:text-3xl font-bold text-white mb-1">2.5K+</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Projects</div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="mt-auto space-y-3">
            <a href="tel:4155550100" className="w-full flex items-center justify-center gap-3 py-4 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition-colors">
              <Phone className="w-5 h-5 text-slate-400" /> (415) 555-0100
            </a>
            <button className="w-full flex items-center justify-center gap-3 py-4 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/20 transition-colors" data-testid="btn-hero-quote">
              <PhoneCall className="w-5 h-5" /> Request a Quote
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 lg:ml-[35%] xl:ml-[30%] min-h-screen">
        
        {/* HERO SECTION (Simplified) */}
        <section className="px-6 py-16 sm:py-24 lg:py-32 lg:px-12 xl:px-20 border-b border-slate-200 bg-white" data-testid="section-hero">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest mb-8 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Bay Area's Trusted Firm
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6" data-testid="text-hero-title">
              Full-Scale Engineering <br className="hidden sm:block" />
              <span className="text-slate-400">&</span> Construction
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl" data-testid="text-hero-subtitle">
              We deliver vertically integrated solutions for residential, commercial, and infrastructure projects across the Bay Area.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-cyan-700 hover:bg-cyan-800 text-white font-bold transition-colors shadow-sm" data-testid="btn-hero-consultation">
                <Clock className="w-5 h-5" /> Schedule a Consult
              </button>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <CheckCircle className="w-5 h-5 text-orange-500" />
                No obligations
              </div>
            </div>

            <p className="text-sm text-slate-400 font-medium border-l-2 border-orange-500 pl-3 py-1" data-testid="text-hero-trust">
              Same-day response · No obligations · 40+ years Bay Area expertise
            </p>

            {/* Mobile Trust Signals (Hidden on Desktop since they are in sidebar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 lg:hidden">
               <div className="bg-slate-50 border border-slate-100 p-5 rounded-lg flex items-center gap-4" data-testid="stat-full-service">
                 <div className="bg-white p-3 rounded shadow-sm"><ClipboardCheck className="w-6 h-6 text-slate-700" /></div>
                 <div>
                   <div className="font-bold text-slate-900">Full-Service</div>
                   <div className="text-xs text-slate-500 font-medium">Vertically Integrated</div>
                 </div>
               </div>
               <div className="bg-slate-50 border border-slate-100 p-5 rounded-lg flex items-center gap-4" data-testid="stat-full-scale">
                 <div className="bg-white p-3 rounded shadow-sm"><Building2 className="w-6 h-6 text-slate-700" /></div>
                 <div>
                   <div className="font-bold text-slate-900">Full-Scale</div>
                   <div className="text-xs text-slate-500 font-medium">Res, Comm & Infrastructure</div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* SERVICES ACCORDION SECTION */}
        <section id="services" className="px-6 py-16 sm:py-24 lg:px-12 xl:px-20 bg-slate-50" data-testid="section-services">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight" data-testid="text-services-title">Core Services</h2>
            <p className="text-slate-600 mb-10">Select a discipline to view our specific capabilities.</p>
            
            <div className="bg-white border border-slate-200 rounded-xl px-6 shadow-sm">
              {services.map((service, idx) => (
                <AccordionItem
                  key={idx}
                  {...service}
                  isOpen={openAccordion === idx}
                  onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US - COMPACT LIST */}
        <section className="px-6 py-16 sm:py-24 lg:px-12 xl:px-20 bg-white border-y border-slate-200" data-testid="section-why-choose">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-10 tracking-tight" data-testid="text-why-title">Why Pacific Engineering?</h2>
            
            <div className="grid sm:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  num: "01",
                  title: "Expert Knowledge", 
                  desc: "Complete understanding of federal, state, and local stormwater regulations." 
                },
                { 
                  num: "02",
                  title: "Proven Track Record", 
                  desc: "100% client satisfaction across 2.5K+ successful projects." 
                },
                { 
                  num: "03",
                  title: "Responsive Service", 
                  desc: "Quick turnaround times and dedicated project support to keep you moving." 
                }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="text-5xl font-black text-slate-100 absolute -top-6 -left-2 z-0">{item.num}</div>
                  <div className="relative z-10 pt-2">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
               <button className="px-6 py-3 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors inline-flex items-center gap-2" data-testid="btn-scope-project">
                 <FileText className="w-4 h-4" /> Scope Your Project
               </button>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="px-6 py-20 lg:px-12 xl:px-20 bg-slate-950 text-white relative overflow-hidden" data-testid="section-cta">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight" data-testid="text-cta-title">Ready to get started?</h2>
            <p className="text-slate-400 mb-10 text-lg">Contact our team today to discuss your engineering or construction needs.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors shadow-lg flex items-center justify-center gap-2" data-testid="btn-footer-quote">
                <PhoneCall className="w-5 h-5" /> Request a Quote
              </button>
              <button className="px-8 py-4 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors flex items-center justify-center gap-2" data-testid="btn-footer-consultation">
                <Clock className="w-5 h-5" /> Schedule Consult
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
