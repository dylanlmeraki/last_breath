import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { Building2, PenTool, Layers, ArrowRight, CheckCircle, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import CTASection from "../components/CTASection";
import MarketingPageHero from "../components/MarketingPageHero";

export default function StructuralEngineering() {
  return (
    <div className="min-h-screen" data-testid="page-structural-engineering">
      <SEO 
        title="Civil & Structural Engineering Consulting - PE Certified | PECI"
        description="Professional civil and structural engineering services: site design, grading, foundations, seismic engineering, land development. Licensed PE team serving the Bay Area."
        keywords="structural engineering, civil engineering, site design, foundation engineering, seismic engineering, land development, PE certified engineers"
        url="/structural-engineering"
      />
      
      <MarketingPageHero
        title="Civil & Structural Engineering Consulting"
        description="Pacific Engineering provides civil and structural consulting informed by constructability, jurisdictional requirements, and the realities of delivery across Bay Area project types."
        backgroundImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600"
        sectionTestId="section-engineering-hero"
        titleTestId="text-engineering-title"
      />

      <section className="py-20 px-6 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                  Client-Centric Engineering Consulting & Development
                </h2>
                <div className="space-y-4 text-lg text-slate-600 leading-relaxed font-light">
                  <p>Through decades of deep, broad-reaching expertise, we've curated invaluable team members who are rooted in disciplined analysis and precision technical application, the most effective and practical solutions engineered to specification. Structural and Civil Engineering designs that satisfy all internal specifications and external regulations - keeping you on budget, on time, and with absolutely minimized stress.</p>
                  <p>Our in-house team of Professional Engineers (PEs) bring several decades of technical field experience in mixed-use commercial, municipal infrastructure and utilities, and even private residential projects of all scopes. We provide detailed design and development consultations tailored to your unique needs.</p>
                  <p>Our teams of in-house engineers, architects, contractors, specialized tradespeople, project managers, and more integrate seamlessly, bringing rigorous QA/QC and documentation, and proactive deployment coordination—minimizing delays, redesigns, and close guidance through permitting, bidding, and project-phasing.</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right" delay={0.2}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-md overflow-hidden shadow-2xl border-4 border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800"
                    alt="Structural engineering"
                    className="w-full h-full object-cover" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Our Engineering Services
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
              Pacific Engineering & Construction Inc. provides end-to-end engineering consulting services across public, private, and industrial sectors. Our team integrates design, analysis, field verification, and construction-phase support to deliver solutions that meet regulatory standards, reduce project risk, and accelerate execution.
            </p>
          </AnimatedSection>

          <div className="space-y-20">
          <AnimatedSection direction="up" delay={0.1}>
              <Card className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg" data-testid="card-structural-engineering">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
                <div className="p-8">
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-700 rounded-md w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                      <Building2 className="w-8 h-8 text-white" />  
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Structural Engineering & Consulting</h3>
                      <p className="text-slate-600 text-lg max-w-3xl mx-auto font-light">Structural analysis, detailing, retrofit strategy, and field support shaped around constructability and code compliance.</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Structural Design & Analysis</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Develop feasible, code-compliant structural systems for new and existing residential and commercial structures.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Inspections & Testing</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Conduct field evaluations for existing structural systems: identifying any deficiencies, and providing corrective action recommendations and implementations as needed.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Seismic Engineering</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Seismic load-withstanding structural designs on new and existing structures.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Structural Steel Systems</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Design and verification of welds, bolts, and connection integrity per AISC.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Forensic Structural Assessments</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Inspection of deteriorated or failed systems - determining root cause in order to provide repair recommendations and upgrades.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Wood-Framed Systems</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Design and verification of wood-framed elements including shear walls, collectors and other load-transferring systems.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

          <AnimatedSection direction="up" delay={0.2}>
              <Card className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg" data-testid="card-civil-engineering">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-teal-500" />
                <div className="p-8">
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="bg-gradient-to-br from-cyan-400 to-cyan-700 rounded-md w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                      <Layers className="w-8 h-8 text-white"/>                      
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Civil Engineering & Consulting</h3>
                      <p className="text-slate-600 text-lg max-w-3xl mx-auto font-light">Site planning, grading, drainage, utilities, and permit-ready civil coordination for active project delivery.</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Land Development</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Grading, drainage, and utility layouts optimizing site usage; coordinating zoning and permitting requirements with applicable regulatory bodies.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Stormwater Planning & Management</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Design and development of stormwater drainage systems to catch, contain, and release stormwater - minimizing flooding impacts.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Erosion Control & Environmental Compliance</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Provide SWPPP development and implementation, BMP design, water pollution control plans, and environmental mitigation strategies that support on-time completion and compliance.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Accessibility & Feasibility Studies</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Design and implementation of ADA accessible entries and pathways per regulatory guidelines as well as site analysis and data-driven research to determine project feasibility.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Land Surveying</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Boundary surveys, topographic surveys, subdivision mapping and planning, lot line adjustments, easements, construction staking, monument confirmation and preservation, and city or county map verification.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                      <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Construction Support & Project Management</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">Cost estimation, RFIs, submittals, field inspections, plan review, critical-path support, and schedule monitoring.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
     
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              What Makes Us Different
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto rounded-full"></div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection direction="up" delay={0.1}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 shadow-md">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Licensed in California</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Our Professional Engineers (PEs) are licensed by the California Board for Professional Engineers and carry full professional liability coverage
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-cyan-700 shadow-md">
                  <PenTool className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Designed for Efficiency</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  We prioritize value engineering and feasibility - integrating this mindset vertically by maximizing efficiency and practicality.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.3}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-teal-700 shadow-md">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Complete Compliance Guidance</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Thorough technical understanding of local, state, federal regulatory compliance standards for end-to-end permitting.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTASection
        headline="Get Engineering Assistance"
        body="Whether you're a Superintendent dealing with Public Works overload, or a safety professional trying to keep your company's head above compliance waters, we've got your back. Let's discuss your project."
        primaryButtonText="Get Your Engineering Quote"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="structural-cta"
      />
    </div>
  );
}
