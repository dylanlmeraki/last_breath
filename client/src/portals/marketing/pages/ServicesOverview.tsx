import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import {
  ClipboardCheck,
  Building2,
  Shield,
  FileText,
  Images,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { ServiceCardsGrid } from "../components/ServiceCards";
import SEO from "../components/SEO";
import CTASection from "../components/CTASection";
import MarketingPageHero from "../components/MarketingPageHero";

export default function ServicesOverview() {

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-services-overview">
      <SEO 
        title="Our Services - Engineering & Construction Solutions | Pacific Engineering"
        description="Complete civil and structural engineering, construction, SWPPP, inspections, and testing services. Integrated solutions for residential, commercial, and infrastructure projects."
        keywords="engineering services, construction services, SWPPP, inspections testing, structural engineering, civil engineering, integrated solutions"
        url="/services-overview"
      />
      
      <MarketingPageHero
        title="Pacific Engineering Services"
        description="Engineering, construction, inspections, and compliance services organized around how Bay Area projects actually move from scope through field execution."
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"
        sectionTestId="section-services-hero"
        titleTestId="text-services-hero-title"
      />

      <section className="py-20 px-6 bg-slate-50" data-testid="section-services-grid">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight" data-testid="text-services-grid-title">
              Civil & Structural Engineering &<br/>Construction Consulting
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Full-scale civil and structural engineering and construction plans developed and implemented by our teams of in-house Engineers, QSD/QSPs, and construction experts. Helping you ensure on-time, on budget, full compliance, and with maximum creative outlook for your project. Keep everything on track.
            </p>
          </AnimatedSection>

          <ServiceCardsGrid />

          <AnimatedSection direction="up" delay={0.5} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10 sm:mt-14 max-w-xl mx-auto">
            <Link
              to={createPageUrl("ServicesOverview")}
              className="group flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base px-6 py-3.5 sm:py-4 rounded-sm sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
              data-testid="link-scope-project"
            >
              <FileText className="w-5 h-5" />
              Scope Your Project
            </Link>
            <Link
              to={createPageUrl("ProjectGallery")}
              className="group flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-bold tracking-tight text-base px-6 py-3.5 sm:py-4 rounded-sm sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
              data-testid="link-portfolio"
            >
              <Images className="w-5 h-5" />
              Portfolio
            </Link>
          </AnimatedSection>

        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200" data-testid="section-why-choose">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight" data-testid="text-why-choose-title">
              Why Choose Pacific Engineering
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto rounded-full"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
            <AnimatedSection direction="up" delay={0.1}>
              <div className="bg-white border border-slate-200 rounded-md px-5 py-5 sm:px-6 sm:py-6 text-center group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-400 to-blue-700 rounded-md w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 uppercase tracking-wide">Licensed & Certified</h3>
                <p className="text-slate-600 leading-relaxed font-light text-sm">
                  Professional Engineers, QSD/QSPs, and contractors with California licenses and certifications
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <div className="bg-white border border-slate-200 rounded-md px-5 py-5 sm:px-6 sm:py-6 text-center group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-700 rounded-md w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 uppercase tracking-wide">Integrated Solutions</h3>
                <p className="text-slate-600 leading-relaxed font-light text-sm">
                  Seamless coordination across engineering, construction, and compliance for streamlined projects
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.3}>
              <div className="bg-white border border-slate-200 rounded-md px-5 py-5 sm:px-6 sm:py-6 text-center group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-teal-400 to-teal-700 rounded-md w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 uppercase tracking-wide">Bay Area Experts</h3>
                <p className="text-slate-600 leading-relaxed font-light text-sm">
                  Deep knowledge of local jurisdictions, regulations, and conditions across the region
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTASection
        headline="Ready to Get Started?"
        body="Let's discuss your project needs and how we can help ensure its success"
        primaryButtonText="Get Your Free Consultation"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="services-cta"
      />
    </div>
  );
}
