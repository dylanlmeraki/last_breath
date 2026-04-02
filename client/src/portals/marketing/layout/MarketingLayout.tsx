import { useState, useEffect, ReactNode, CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, PhoneCall, Send, Linkedin } from "lucide-react";
import ChatBot from "../components/ChatBot";
import BackToTop from "../components/BackToTop";
import FooterBackground from "../components/FooterBackground";
import { ShinyButton } from "../components/ShinyButton";

const MOBILE_STICKY_CTA_STORAGE_KEY = "peci_marketing_mobile_cta_collapsed";
type MarketingStyleVars = CSSProperties & Record<string, string>;
type ShellProfile = "mobile" | "tablet-touch" | "compact-desktop" | "full-desktop";

interface ShellState {
  profile: ShellProfile;
  isTouchLike: boolean;
  isCrampedLandscapeTouch: boolean;
  showStickyCta: boolean;
}

function supportsMediaQuery(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

function getShellState(): ShellState {
  if (typeof window === "undefined") {
    return {
      profile: "full-desktop",
      isTouchLike: false,
      isCrampedLandscapeTouch: false,
      showStickyCta: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchLike =
    supportsMediaQuery("(pointer: coarse)") || supportsMediaQuery("(hover: none)");

  let profile: ShellProfile;
  if (width < 768) {
    profile = "mobile";
  } else if (width < 1280 && isTouchLike) {
    profile = "tablet-touch";
  } else if (width >= 1280 && !isTouchLike) {
    profile = "full-desktop";
  } else {
    profile = "compact-desktop";
  }

  const isCrampedLandscapeTouch =
    isTouchLike && width > height && height <= 560;
  const showStickyCta = profile === "mobile" || profile === "tablet-touch";

  return {
    profile,
    isTouchLike,
    isCrampedLandscapeTouch,
    showStickyCta,
  };
}

const consultationShinyVars: MarketingStyleVars = {
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
  const [isStickyCtaCollapsed, setIsStickyCtaCollapsed] = useState(false);
  const [shellState, setShellState] = useState<ShellState>(() => getShellState());
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
    const updateShellState = () => setShellState(getShellState());
    updateShellState();

    const coarseMq = window.matchMedia("(pointer: coarse)");
    const hoverNoneMq = window.matchMedia("(hover: none)");

    window.addEventListener("resize", updateShellState);
    window.addEventListener("orientationchange", updateShellState);
    coarseMq.addEventListener("change", updateShellState);
    hoverNoneMq.addEventListener("change", updateShellState);

    return () => {
      window.removeEventListener("resize", updateShellState);
      window.removeEventListener("orientationchange", updateShellState);
      coarseMq.removeEventListener("change", updateShellState);
      hoverNoneMq.removeEventListener("change", updateShellState);
    };
  }, []);

  useEffect(() => {
    try {
      const storedValue = window.sessionStorage.getItem(MOBILE_STICKY_CTA_STORAGE_KEY);
      if (storedValue === "true" || storedValue === "false") {
        setIsStickyCtaCollapsed(storedValue === "true");
        return;
      }
    } catch {
      // If storage is unavailable, we fall back to profile-based defaults.
    }

    setIsStickyCtaCollapsed(shellState.isCrampedLandscapeTouch);
  }, [shellState.isCrampedLandscapeTouch]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        MOBILE_STICKY_CTA_STORAGE_KEY,
        String(isStickyCtaCollapsed),
      );
    } catch {
      // Ignore session storage failures and keep the current in-memory state.
    }
  }, [isStickyCtaCollapsed]);

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

  const isFullDesktop = shellState.profile === "full-desktop";
  const isCompactDesktop = shellState.profile === "compact-desktop";
  const usesMenuShell = !isFullDesktop;
  const mobileStickyHeight =
    shellState.showStickyCta && !isMobileMenuOpen
      ? isStickyCtaCollapsed
        ? 28
        : 88
      : 0;

  const shellStyle: MarketingStyleVars = {
    "--pe-shell-sticky-height": `${mobileStickyHeight}px`,
    "--pe-chatbot-mobile-bottom": `${mobileStickyHeight > 0 ? mobileStickyHeight + 28 : 24}px`,
    "--pe-chatbot-mobile-panel-bottom": `${mobileStickyHeight > 0 ? mobileStickyHeight + 40 : 24}px`,
    "--pe-shell-has-sticky-dock": mobileStickyHeight > 0 ? "1" : "0",
  };

  return (
    <div
      className="marketing-portal min-h-screen bg-white"
      style={shellStyle}
      data-shell-profile={shellState.profile}
      data-shell-touch={shellState.isTouchLike ? "true" : "false"}
    >
      <header className={`fixed top-0 left-0 right-0 z-40 border-b border-white/10 transition-all duration-300 ${isScrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-xl" : "bg-slate-900/98 shadow-lg"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group" data-testid="link-logo">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-md opacity-10 group-hover:opacity-20 transition-opacity" />
                <img src="/images/pe-logo.png" alt="Pacific Engineering Logo" className={`rounded-md object-contain relative z-10 transition-all duration-300 ${isScrolled ? "h-11 w-11" : "h-12 w-12"}`} />
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className={`font-bold text-white tracking-tight truncate transition-all duration-300 ${isScrolled ? "text-[15px] sm:text-base lg:text-[1.05rem]" : "text-[20px] sm:text-lg lg:text-[1.2rem] xl:text-[1.45rem]"}`}>
                  {isScrolled ? "Pacific Engineering" : "Pacific Engineering & Construction Inc."}
                </div>
                <div className={`font-medium text-blue-200 tracking-[0.08em] hidden sm:block transition-all duration-300 ${isScrolled ? "text-[11px]" : "text-[12px]"}`}>Consulting Engineers & Contractors</div>
              </div>
            </Link>

            {isFullDesktop ? (
              <nav className="flex h-full items-center gap-0.5" data-testid="nav-main">
                <Link to={createPageUrl("Home")} className="flex h-full items-center rounded-t-lg px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400 xl:px-4" data-testid="nav-home">Home</Link>

                <div className="relative group h-full flex items-center" onMouseEnter={() => setServicesDropdownOpen(true)} onMouseLeave={() => setServicesDropdownOpen(false)}>
                  <Link to={createPageUrl("ServicesOverview")} className="flex h-full items-center gap-1 rounded-t-lg px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400 xl:px-4" data-testid="nav-services">
                    Services
                    <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? "rotate-180" : ""}`} />
                  </Link>
                  {servicesDropdownOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                      <div className="w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/98 py-1 shadow-2xl shadow-slate-950/45 backdrop-blur-md">
                        <Link to={createPageUrl("ServicesOverview")} className="block border-b border-white/10 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-white/10" data-testid="nav-services-overview">Our Services</Link>
                        {servicesItems.map((item) => (
                          <Link key={item.path} to={item.path} className="block px-6 py-3 text-center text-sm font-medium text-gray-300 transition-all hover:bg-blue-600 hover:text-white" data-testid={`nav-service-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group h-full flex items-center" onMouseEnter={() => setAboutDropdownOpen(true)} onMouseLeave={() => setAboutDropdownOpen(false)}>
                  <Link to={createPageUrl("About")} className="flex h-full items-center gap-1 rounded-t-lg px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400 xl:px-4" data-testid="nav-about">
                    About
                    <ChevronDown className={`w-4 h-4 transition-transform ${aboutDropdownOpen ? "rotate-180" : ""}`} />
                  </Link>
                  {aboutDropdownOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                      <div className="w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/98 py-1 shadow-2xl shadow-slate-950/45 backdrop-blur-md">
                        {aboutItems.map((item) => (
                          <Link key={item.path} to={item.path} className="block px-6 py-3 text-center text-sm font-medium text-gray-300 transition-all hover:bg-blue-600 hover:text-white" data-testid={`nav-about-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>{item.name}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link to={createPageUrl("Contact")} className="flex h-full items-center rounded-t-lg px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10 hover:text-blue-200 border-b-2 border-transparent hover:border-blue-400 xl:px-4" data-testid="nav-contact">Contact</Link>

                <div className="ml-3 flex h-full items-center gap-3">
                  <Link to={createPageUrl("SWPPPChecker")} data-testid="nav-consultation">
                    <ShinyButton
                      className="group inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-[11px] font-bold tracking-[0.12em] text-white shadow-lg shadow-orange-900/20 transition-all duration-300 hover:shadow-orange-500/50 active:scale-95"
                      style={consultationShinyVars}
                    >
                      Start Consultation
                    </ShinyButton>
                  </Link>
                </div>
              </nav>
            ) : (
              <div className="flex items-center gap-2" data-testid="nav-compact-shell">
                {isCompactDesktop ? (
                  <Link
                    to={createPageUrl("SWPPPChecker")}
                    className="inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-400 active:bg-orange-600"
                    data-testid="btn-header-consult-compact"
                  >
                    Start Consultation
                  </Link>
                ) : (
                  <a
                    href="tel:+14156894428"
                    className="flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-full transition-colors shadow-lg shadow-orange-500/30"
                    data-testid="btn-header-call"
                    aria-label="Call Pacific Engineering"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
                <button
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen((current) => !current)}
                  data-testid="button-mobile-menu"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 hidden h-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 sm:block" />
      </header>
      {usesMenuShell && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md" data-testid="mobile-menu">
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
      {shellState.showStickyCta && !isMobileMenuOpen && (
        <div
          data-testid="mobile-sticky-bar"
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div
            data-testid="mobile-sticky-content"
            className={`pointer-events-auto relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/94 text-white shadow-[0_-12px_32px_rgba(2,8,23,0.38)] backdrop-blur-md transition-all duration-300 ${
              isStickyCtaCollapsed ? "px-4 py-2.5" : "px-4 pt-4 pb-3"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsStickyCtaCollapsed((current) => !current)}
              className="absolute -top-3 left-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-md transition-colors hover:border-cyan-400 hover:text-white"
              aria-expanded={!isStickyCtaCollapsed}
              aria-controls="marketing-mobile-sticky-actions"
              data-testid="btn-sticky-toggle"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isStickyCtaCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>

            {isStickyCtaCollapsed ? (
              <div className="flex min-h-6 items-center justify-between gap-4 pl-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
                  Quick Actions
                </span>
                <span className="text-xs text-slate-400">Tap to reopen</span>
              </div>
            ) : (
              <div id="marketing-mobile-sticky-actions" className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+14156894428"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white transition-colors active:bg-white/20"
                  data-testid="btn-sticky-call"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <Link
                  to={createPageUrl("Consultation")}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/25 transition-colors active:bg-orange-500"
                  data-testid="btn-sticky-quote"
                >
                  <PhoneCall className="h-4 w-4" />
                  Start Consultation
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <main className="pe-shell-main">
        {children}
      </main>
      <div className="h-1.5" style={{ background: "linear-gradient(to right, #1e293b, #2563eb 30%, #06b6d4 50%, #2563eb 70%, #1e293b)" }} />
      <footer className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-orange-900/15" />
        <FooterBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                  <div className="relative rounded-lg p-1.5" style={{ backgroundColor: "#27a0d1" }}>
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
              <h4 className="font-bold text-base uppercase tracking-wider text-cyan-400 mb-5 text-center border-b border-cyan-500/20 pb-3" style={{ textShadow: "0 0 20px rgba(6,182,212,0.2)" }}>Services</h4>
              <ul className="space-y-2.5 text-center">
                {servicesItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-sm text-gray-300 hover:text-cyan-400 transition-colors font-medium">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base uppercase tracking-wider text-cyan-400 mb-5 text-center border-b border-cyan-500/20 pb-3" style={{ textShadow: "0 0 20px rgba(6,182,212,0.2)" }}>Company</h4>
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
              <h4 className="font-bold text-base uppercase tracking-wider text-cyan-400 mb-5 text-center border-b border-cyan-500/20 pb-3" style={{ textShadow: "0 0 20px rgba(6,182,212,0.2)" }}>Contact</h4>
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
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-500 px-5 py-3 text-sm font-bold text-white transition-all hover:from-cyan-500 hover:to-blue-600"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-8 border-t border-transparent relative">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(6,182,212,0.3) 30%, rgba(59,130,246,0.4) 50%, rgba(6,182,212,0.3) 70%, transparent)" }} />
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
