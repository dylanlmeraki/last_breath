import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, PhoneCall } from "lucide-react";
import ChatBot from "../components/ChatBot";
import BackToTop from "../components/BackToTop";
import FooterBackground from "../components/FooterBackground";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group" data-testid="link-logo">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-md opacity-10 group-hover:opacity-20 transition-opacity" />
                <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className="rounded-md h-14 w-14 object-contain relative z-10" />
              </div>
              <div>
                <div className="font-bold text-white tracking-tight text-[24px]">Pacific Engineering</div>
                <div className="text-xs font-medium text-blue-200 tracking-wide">Consulting Engineers & Contractors</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" data-testid="nav-main">
              <Link to={createPageUrl("Home")} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/") ? "text-cyan-400" : "text-gray-300 hover:text-white"}`} data-testid="nav-home">Home</Link>

              <div className="relative" onMouseEnter={() => setServicesDropdownOpen(true)} onMouseLeave={() => setServicesDropdownOpen(false)}>
                <Link to={createPageUrl("ServicesOverview")} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${isActive(createPageUrl("ServicesOverview")) ? "text-cyan-400" : "text-gray-300 hover:text-white"}`} data-testid="nav-services">
                  Services <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180" : ""}`} />
                </Link>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                    {servicesItems.map((item) => (
                      <Link key={item.path} to={item.path} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors" data-testid={`nav-service-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" onMouseEnter={() => setAboutDropdownOpen(true)} onMouseLeave={() => setAboutDropdownOpen(false)}>
                <Link to={createPageUrl("About")} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${isActive(createPageUrl("About")) ? "text-cyan-400" : "text-gray-300 hover:text-white"}`} data-testid="nav-about">
                  About <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${aboutDropdownOpen ? "rotate-180" : ""}`} />
                </Link>
                {aboutDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                    {aboutItems.map((item) => (
                      <Link key={item.path} to={item.path} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors" data-testid={`nav-about-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to={createPageUrl("Contact")} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(createPageUrl("Contact")) ? "text-cyan-400" : "text-gray-300 hover:text-white"}`} data-testid="nav-contact">Contact</Link>

              <Link to={createPageUrl("SWPPPChecker")} className="ml-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-orange-500/25" data-testid="nav-consultation">
                Free Consultation
              </Link>
            </nav>

            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="tel:+14156894428"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md"
                data-testid="btn-header-call"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                className="text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
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
      <footer className="relative bg-slate-900 text-white overflow-hidden border-t-4 border-cyan-500">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-orange-900/15" />
        <FooterBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-lg opacity-50 blur-sm" />
                  <div className="relative bg-slate-900 p-1.5 rounded-lg">
                    <img src="/images/pe-logo.png" alt="Pacific Engineering" className="h-10 w-10 rounded object-contain" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-lg text-white">Pacific Engineering</div>
                  <div className="text-xs text-cyan-400 tracking-wide font-medium">Consulting Engineers & Contractors</div>
                </div>
              </div>
              <p className="text-sm text-gray-300/90 leading-relaxed border-l-4 border-cyan-500 pl-4">
                Full-scale civil and structural engineering and construction services across the San Francisco Bay Area.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-cyan-400 mb-4">Services</h4>
              <ul className="space-y-2">
                {servicesItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-cyan-400 mb-4">Company</h4>
              <ul className="space-y-2">
                {aboutItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">{item.name}</Link>
                  </li>
                ))}
                <li>
                  <Link to={createPageUrl("Contact")} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-cyan-400 mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a href="tel:+14156894428" className="hover:text-cyan-400 transition-colors text-sm">(415)-689-4428</a>
                </li>
                <li className="flex items-center gap-3 text-gray-300 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a href="mailto:amwaldman@sbcglobal.net" className="hover:text-cyan-400 transition-colors break-all text-sm">amwaldman@sbcglobal.net</a>
                </li>
                <li className="flex items-start gap-3 text-gray-300 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors flex-shrink-0">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm">470 3rd St.<br />San Francisco, CA 94107</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} Pacific Engineering. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
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
