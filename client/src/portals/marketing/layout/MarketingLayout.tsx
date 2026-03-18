import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, PhoneCall, Send, Linkedin } from "lucide-react";
import ChatBot from "../components/ChatBot";
import BackToTop from "../components/BackToTop";
import FooterBackground from "../components/FooterBackground";
import { ShinyButton } from "../components/ShinyButton";

const consultationShinyVars: Record<string, string> = {
  "--shiny-cta-bg": "#f97316",
  "--shiny-cta-bg-subtle": "rgba(249, 115, 22, 0.2)",
  "--shiny-cta-fg": "#ffffff",
  "--shiny-cta-highlight": "#ea580c",
  "--shiny-cta-highlight-subtle": "#fb923c",
  "--shiny-cta-shadow": "rgba(249, 115, 22, 0.4)",
  "--shiny-cta-glow": "rgba(251, 146, 60, 0.55)",
};

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setAboutDropdownOpen(false);
    setMobileServicesOpen(false);
    setMobileAboutOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const servicesItems = [
    { name: "Stormwater Planning", path: createPageUrl("Services") },
    { name: "Inspections & Testing", path: createPageUrl("InspectionsTesting") },
    { name: "Special Inspections", path: createPageUrl("SpecialInspections") },
    { name: "Engineering Consulting", path: createPageUrl("StructuralEngineering") },
    { name: "Construction Services", path: createPageUrl("Construction") },
  ];

  const aboutItems = [
    { name: "About Us", path: createPageUrl("About") },
    { name: "Previous Work", path: createPageUrl("PreviousWork") },
    { name: "Project Gallery", path: createPageUrl("ProjectGallery") },
    { name: "Blog", path: createPageUrl("Blog") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="marketing-portal min-h-screen bg-white overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-xl" : "bg-slate-900 shadow-xl"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-[2px] pb-[2px]">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group" data-testid="link-logo">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-md opacity-10 group-hover:opacity-20 transition-opacity" />
                <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="rounded-md h-14 w-14 object-contain relative z-10" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="font-bold text-white tracking-tight text-base sm:text-lg lg:text-xl xl:text-[24px] truncate">Pacific Engineering & Construction Inc.</div>
                <div className="text-xs font-medium text-blue-200 tracking-wide hidden sm:block">Consulting Engineers & Contractors</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 h-full" data-testid="nav-main">
              <Link to={createPageUrl("Home")} className="font-bold text-sm uppercase tracking-wide text-white transition-all flex items-center h-full px-4 hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400" data-testid="nav-home">Home</Link>

              <div className="relative group h-full flex items-center" onMouseEnter={() => setServicesDropdownOpen(true)} onMouseLeave={() => setServicesDropdownOpen(false)}>
                <Link to={createPageUrl("ServicesOverview")} className="font-bold text-sm uppercase tracking-wide text-white transition-all flex items-center gap-1 h-full px-4 hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400" data-testid="nav-services">
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? "rotate-180" : ""}`} />
                </Link>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0">
                    <div className="w-64 bg-slate-900 shadow-2xl border-t-4 border-blue-600 py-0 overflow-hidden rounded-b-sm">
                      <Link to={createPageUrl("ServicesOverview")} className="block px-6 py-4 text-white hover:bg-white/10 font-bold text-sm uppercase tracking-wide text-center border-b border-white/10" data-testid="nav-services-overview">Our Services</Link>
                      {servicesItems.map((item) => (
                        <Link key={item.path} to={item.path} className="block px-6 py-3 text-gray-300 hover:bg-blue-600 hover:text-white transition-all text-sm font-medium text-center" data-testid={`nav-service-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group h-full flex items-center" onMouseEnter={() => setAboutDropdownOpen(true)} onMouseLeave={() => setAboutDropdownOpen(false)}>
                <Link to={createPageUrl("About")} className="font-bold text-sm uppercase tracking-wide text-white transition-all flex items-center gap-1 h-full px-4 hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400" data-testid="nav-about">
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform ${aboutDropdownOpen ? "rotate-180" : ""}`} />
                </Link>
                {aboutDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0">
                    <div className="w-56 bg-slate-900 shadow-2xl border-t-4 border-blue-600 py-0 overflow-hidden rounded-b-sm">
                      {aboutItems.map((item) => (
                        <Link key={item.path} to={item.path} className="block px-6 py-3 text-gray-300 hover:bg-blue-600 hover:text-white transition-all font-medium text-sm text-center" data-testid={`nav-about-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to={createPageUrl("Contact")} className="font-bold text-sm uppercase tracking-wide text-white transition-all flex items-center h-full px-4 hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400" data-testid="nav-contact">Contact</Link>

              <div className="flex items-center gap-3 ml-4 h-full">
                <Link to={createPageUrl("SWPPPChecker")} data-testid="nav-consultation">
                  <ShinyButton
                    className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-xs h-9 px-4 rounded-md shadow-lg shadow-orange-900/20 hover:shadow-orange-500/50 active:scale-95 transition-all duration-300"
                    style={consultationShinyVars as React.CSSProperties}
                  >
                    Start Consultation
                  </ShinyButton>
                </Link>
              </div>
            </nav>

            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="tel:+14156894428"
                className="flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-full transition-colors shadow-lg shadow-orange-500/30"
                data-testid="btn-header-call"
                aria-label="Call Pacific Engineering"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 mt-[2px]" />
      </header>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md lg:hidden" data-testid="mobile-menu">
          <div className="flex items-center justify-between px-6 h-20 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="h-12 w-12 rounded-md object-contain" />
              <span className="text-white font-bold text-lg">Pacific Engineering</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2" data-testid="btn-close-menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col px-6 py-4 space-y-0 overflow-y-auto" style={{ maxHeight: "calc(100vh - 5rem)" }}>
            <Link to={createPageUrl("Home")} className="text-lg text-slate-200 hover:text-cyan-400 py-3.5 border-b border-slate-800 transition-colors font-medium" data-testid="mobile-nav-home">Home</Link>

            <div className="border-b border-slate-800">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between text-lg text-slate-200 hover:text-cyan-400 py-3.5 transition-colors font-medium"
                data-testid="mobile-nav-services-toggle"
              >
                <span>Services</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileServicesOpen && (
                <div className="pb-2 space-y-0">
                  <Link to={createPageUrl("ServicesOverview")} className="block py-2.5 pl-4 text-base text-cyan-400 font-medium" data-testid="mobile-nav-services-overview">All Services</Link>
                  {servicesItems.map((item) => (
                    <Link key={item.path} to={item.path} className="block py-2.5 pl-4 text-base text-slate-400 hover:text-white transition-colors" data-testid={`mobile-nav-service-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-slate-800">
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between text-lg text-slate-200 hover:text-cyan-400 py-3.5 transition-colors font-medium"
                data-testid="mobile-nav-about-toggle"
              >
                <span>About</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileAboutOpen && (
                <div className="pb-2 space-y-0">
                  {aboutItems.map((item) => (
                    <Link key={item.path} to={item.path} className="block py-2.5 pl-4 text-base text-slate-400 hover:text-white transition-colors" data-testid={`mobile-nav-about-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link to={createPageUrl("Contact")} className="text-lg text-slate-200 hover:text-cyan-400 py-3.5 border-b border-slate-800 transition-colors font-medium" data-testid="mobile-nav-contact">Contact</Link>

            <div className="pt-6 space-y-3">
              <Link to={createPageUrl("SWPPPChecker")} className="w-full py-4 rounded-lg bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors" data-testid="mobile-nav-consultation">
                <PhoneCall className="w-5 h-5" /> Request a Quote
              </Link>
              <a href="tel:+14156894428" className="w-full py-4 rounded-lg bg-slate-700 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-600 transition-colors" data-testid="mobile-nav-call">
                <Phone className="w-5 h-5" /> (415) 689-4428
              </a>
            </div>
          </nav>
        </div>
      )}
      <main className="pt-20">
        {children}
      </main>
      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600" />
      <footer className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-orange-900/15" />
        <FooterBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="relative p-1.5 rounded-lg bg-[#27a0d1]">
                    <img src="/images/pe-logo.png" alt="Pacific Engineering" className="h-10 w-10 rounded object-contain" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-lg text-white">Pacific Engineering</div>
                  <div className="text-xs text-cyan-400 tracking-wide font-medium">Consulting Engineers & Contractors</div>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed border-l-4 border-cyan-500 pl-4 font-medium mb-5">
                Pacific Engineering & Construction Inc. provides full-scale civil and structural engineering, construction consulting, and plan implementation in a vertically integrated business model working on projects of all sizes from residential remodels to public utility and infrastructure projects. Through decades of deep in-field knowledge and network fostering and growth - Pacific Engineering & Construction truly has earned its polished and professional reputation.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/a-mark-waldman-814b119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all flex-shrink-0"
                  aria-label="LinkedIn"
                  data-testid="link-linkedin-footer"
                >
                  <Linkedin className="w-4 h-4 text-gray-400" />
                </a>
                <p className="text-xs text-gray-500 font-medium">Contractor Lic. #: 1351235425</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base uppercase tracking-wider text-cyan-400 mb-5 text-center border-b border-cyan-500/20 pb-3">Services</h4>
              <ul className="space-y-2.5 text-center">
                {servicesItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-sm text-gray-300 hover:text-cyan-400 transition-colors font-medium">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base uppercase tracking-wider text-cyan-400 mb-5 text-center border-b border-cyan-500/20 pb-3">Company</h4>
              <ul className="space-y-2.5 text-center">
                {aboutItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-sm text-gray-300 hover:text-cyan-400 transition-colors font-medium">{item.name}</Link>
                  </li>
                ))}
                <li>
                  <Link to={createPageUrl("Contact")} className="text-sm text-gray-300 hover:text-cyan-400 transition-colors font-medium">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base uppercase tracking-wider text-cyan-400 mb-5 text-center border-b border-cyan-500/20 pb-3">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors flex-shrink-0">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a href="tel:+14156894428" className="hover:text-cyan-400 transition-colors text-sm font-medium">(415)-689-4428</a>
                </li>
                <li className="flex items-center gap-3 text-gray-300 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors flex-shrink-0">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a href="mailto:amwaldman@sbcglobal.net" className="hover:text-cyan-400 transition-colors whitespace-nowrap text-sm font-medium">amwaldman@sbcglobal.net</a>
                </li>
                <li className="flex items-center gap-3 text-gray-300 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors flex-shrink-0">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm font-medium">470 3rd St.<br />San Francisco, CA 94107</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-10 max-w-md mx-auto">
            <p className="text-center text-sm text-gray-400 font-medium mb-3">Stay updated with project insights & industry news</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-0 rounded-full overflow-hidden border border-white/10 focus-within:border-cyan-500/50 transition-colors bg-white/5" data-testid="form-newsletter">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 px-5 py-3 outline-none font-medium"
                data-testid="input-newsletter-email"
              />
              <button
                type="submit"
                className="px-5 py-3 text-white transition-all flex items-center gap-2 text-sm font-bold [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-medium">
              <p>&copy; {new Date().getFullYear()} Pacific Engineering. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
                <a
                  href="https://www.linkedin.com/in/a-mark-waldman-814b119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all"
                  aria-label="LinkedIn"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ChatBot />
      <BackToTop />
    </div>
  );
}
