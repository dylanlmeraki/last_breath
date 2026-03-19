import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import {
  Droplets,
  HardHat,
  ClipboardCheck,
  Building2,
  Shield,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import BlueprintBackground from "../components/BlueprintBackground";
import CTASection from "../components/CTASection";
import type { LucideIcon } from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  bgGradient: string;
  link: string;
  features: string[];
}

export default function ServicesOverview() {
  const services: ServiceItem[] = [
  {
    id: 1,
    title: "Stormwater Planning (SWPPP)",
    description: "Comprehensive stormwater pollution prevention plans developed by certified QSDs and Professional Engineers.",
    icon: Droplets,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    link: "Services",
    features: [
    "QSD/QSP Services",
    "Site Assessment & Analysis",
    "BMP Design & Implementation",
    "Regulatory Compliance"]
  },
  {
    id: 2,
    title: "Construction Services",
    description: "Full-scale construction expertise with Class A & B licenses for infrastructure and residential projects.",
    icon: HardHat,
    gradient: "from-cyan-500 to-teal-500",
    bgGradient: "from-cyan-50 to-teal-50",
    link: "Construction",
    features: [
    "Class A & B Licensed",
    "Public Infrastructure",
    "Commercial & Residential",
    "Project Management"]
  },
  {
    id: 3,
    title: "Inspections & Testing",
    description: "Certified testing and sampling services ensuring code compliance and project quality across all phases.",
    icon: ClipboardCheck,
    gradient: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-50 to-cyan-50",
    link: "InspectionsTesting",
    features: [
    "Stormwater Testing",
    "Materials Testing",
    "Soil & Geotechnical",
    "Lab Coordination"]
  },
  {
    id: 4,
    title: "Structural Engineering",
    description: "Licensed PE-certified structural design, analysis, and seismic retrofit services for all project types.",
    icon: Building2,
    gradient: "from-sky-500 to-blue-500",
    bgGradient: "from-sky-50 to-blue-50",
    link: "StructuralEngineering",
    features: [
    "Seismic Retrofits",
    "Foundation Design",
    "Structural Analysis",
    "Building Design"]
  },
  {
    id: 5,
    title: "Special Inspections",
    description: "PE-backed verification services for structural materials, welding, seismic systems, and building envelope.",
    icon: BadgeCheck,
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
    link: "SpecialInspections",
    features: [
    "Structural Materials",
    "Welding Inspection",
    "Seismic Systems",
    "Building Envelope"]
  }];

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

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-32">
            <Link to={createPageUrl("Services")} className="block group h-full" data-testid="link-services-stormwater">
              <AnimatedSection direction="left" delay={0.1} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-blue-600 group-hover:shadow-lg transition-all duration-300">
                      <FileText className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide">Stormwater Planning</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">Custom plans from initial assessments, tailored practical BMP designs, and full local, state, and federal regulatory compliance assurance and permitting walkthroughs.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">In-house PE/QSD/QSP site assessment</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">BMP design and maintenance</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">Clear documentation with action items</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">Full local, state, and Federal compliance assurance</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>

            <Link to={createPageUrl("Construction")} className="block group h-full" data-testid="link-services-construction">
              <AnimatedSection direction="right" delay={0.2} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-teal-500" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-cyan-300 group-hover:to-cyan-600 group-hover:shadow-lg transition-all duration-300">
                      <Shield className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide">Construction Service</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">We are fully licensed and ready to take on any and all work from residential additions, multi-unit residential, commercial mixed-use, up to public and governmental infrastructure.
                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">Class A License</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">Class B License</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">Infrastructure & Public Works</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-cyan-600 transition-colors">Residential, Commercial, and Municipal Infrastructure</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>

            <Link to={createPageUrl("InspectionsTesting")} className="block group h-full" data-testid="link-services-inspections">
              <AnimatedSection direction="left" delay={0.3} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-teal-300 group-hover:to-teal-600 group-hover:shadow-lg transition-all duration-300">
                      <ClipboardCheck className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide">Inspections & Testing</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">Thorough inspections to ensure ongoing compliance with recommendation and implementation of areas for improvement.

                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">Structural Systems Inspections</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">Stormwater Testing and Inspections</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">Materials Sampling & Testing</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-teal-600 transition-colors">Environmental Compliance</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>
            
            <Link to={createPageUrl("StructuralEngineering")} className="block group h-full" data-testid="link-services-engineering">
              <AnimatedSection direction="right" delay={0.4} className="h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 bg-white cursor-pointer group-hover:-translate-y-2 rounded-md">
                  <div className="h-1.5 bg-gradient-to-r from-sky-500 to-blue-600" />
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-md w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-sky-300 group-hover:to-blue-600 group-hover:shadow-lg transition-all duration-300">
                      <ClipboardCheck className="w-10 h-10 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-900 text-2xl font-bold mb-4 uppercase tracking-wide">Engineering Consulting</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">Professional engineering expertise across civil and structural disciplines, providing innovative solutions and implementation to meet the unique needs of your project - from large-scale infrastructure to single family residential additions.

                    </p>
                    <ul className="space-y-4 w-full flex flex-col items-center">
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">Civil Engineering Consulting</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">Structural Consulting</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">Site Assessment & Design</span>
                      </li>
                      <li className="flex items-center justify-center gap-3 text-slate-700 max-w-md">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-center group-hover:text-blue-600 transition-colors">Development Management & Support</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            </Link>
          </div>
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
