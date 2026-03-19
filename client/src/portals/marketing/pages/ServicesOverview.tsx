import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import {
  ClipboardCheck,
  Building2,
  Shield,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { ServiceCardsGrid } from "../components/ServiceCards";
import SEO from "../components/SEO";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import BlueprintBackground from "../components/BlueprintBackground";
import CTASection from "../components/CTASection";

export default function ServicesOverview() {

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-services-overview">
      <SEO 
        title="Our Services - Engineering & Construction Solutions | Pacific Engineering"
        description="Complete civil and structural engineering, construction, SWPPP, inspections, and testing services. Integrated solutions for residential, commercial, and infrastructure projects."
        keywords="engineering services, construction services, SWPPP, inspections testing, structural engineering, civil engineering, integrated solutions"
        url="/services-overview"
      />
      
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-950 overflow-hidden" data-testid="section-services-hero">
        <div className="absolute inset-0 opacity-[0.6]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-transparent to-blue-950/15 opacity-50" />
        <AnimatedGridBackground baseOpacity={0.5} gridSize={40} triggerInterval={500} animationDuration={2500} className="hidden sm:block z-[1] opacity-30" />
        <BlueprintBackground className="z-[2] opacity-50" />
        <div className="absolute top-1/3 left-1/5 w-48 md:w-72 h-48 md:h-72 bg-cyan-500/8 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[1]" />
        <div className="absolute bottom-1/4 right-1/5 w-40 md:w-64 h-40 md:h-64 bg-blue-500/6 rounded-full blur-[60px] md:blur-[100px] pointer-events-none z-[1]" />

        <div className="relative z-[5] max-w-5xl mx-auto text-center">
          <AnimatedSection direction="up" blur>
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-cyan-500/5 rounded-2xl blur-sm hidden sm:block" />
              <div className="relative bg-slate-950/30 sm:bg-slate-950/40 backdrop-blur-[6px] rounded-lg sm:rounded-xl border border-white/[0.06] shadow-2xl overflow-hidden px-5 py-8 sm:p-10 md:p-12">
                <div className="h-0.5 sm:h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80 absolute top-0 left-0 right-0" />
                <h1 className="text-white mb-6 text-3xl font-bold sm:text-5xl md:text-6xl tracking-tight" data-testid="text-services-hero-title">
                  Our Services
                </h1>
                <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
                  Local SF Bay Area experts delivering superior vertically integrated services from in-depth environmental compliance to civil and structural engineering at any scale. No matter the project, our teams of highly skilled professionals have your back.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80" />
      </section>

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
