import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { Beaker, CheckCircle, BadgeCheck, ShieldCheck, Droplets, FlaskConical, ArrowRight, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import CTASection from "../components/CTASection";
import MarketingPageHero from "../components/MarketingPageHero";

export default function InspectionsTesting() {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-inspections-testing">
      <SEO 
        title="Inspections & Testing Services - Materials & Environmental | PECI"
        description="Comprehensive construction inspections and materials testing: stormwater testing, concrete testing, structural inspections, environmental compliance. Fast turnaround times."
        keywords="construction inspections, materials testing, stormwater testing, concrete testing, structural inspections, environmental testing, quality control testing"
        url="/inspections-testing"
      />
      <MarketingPageHero
        title="Testing & Inspection Services"
        description="Pacific Engineering provides field and lab testing support that keeps compliance visible, documentation organized, and active work moving with fewer surprises."
        backgroundImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600"
        sectionTestId="section-inspections-hero"
        titleTestId="text-inspections-title"
      />

      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
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
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Fast Turnaround</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  We prioritize quick lab processing and same-day field results when possible. We aim to minimize and ideally negate any downtime caused by testing and sampling delays.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-cyan-700 shadow-md">
                  <BadgeCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Certified & Accredited</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Our technicians hold current certifications from ACI, ICC, and other recognized bodies. Our partner labs are NELAC and EPA-certified.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.3}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-teal-700 shadow-md">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Clear Reporting</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  You get streamlined reports that inspectors and engineers can act on quickly, keeping project teams moving with less waiting and less confusion.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Testing Services
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              We provide comprehensive and extensive testing keeping all facets of your project compliant and on track including stormwater, concrete, structural materials, foundational integrity, full environmental pollution panels and much more.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection direction="left" delay={0.1}>
              <Card className="group h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg" data-testid="card-stormwater-testing">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
                <div className="p-8 flex flex-col items-center">
                  <div className="mx-auto my-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-slate-900 mx-auto my-4 text-2xl font-bold text-center tracking-tight">Stormwater Testing & Inspections</h3>
                  <p className="text-slate-600 mb-8 text-center leading-relaxed">
                    NPDES permit compliance testing, pH monitoring, turbidity analysis, and pollutant screening ensuring you're meeting standards.
                  </p>
                  <ul className="space-y-4 w-full flex flex-col items-center">
                    {[
                      { text: "Pre-storm, During, and post-storm sampling", color: "blue" },
                      { text: "Visual observations monitored during, pre, and post QPE.", color: "blue" },
                      { text: "NAL exceedance response planning", color: "blue" },
                      { text: "Comprehensive lab analysis coordination", color: "blue" }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700 max-w-md w-full group">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium group-hover:text-blue-600 transition-colors">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <Card className="group h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg" data-testid="card-materials-testing">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-teal-500" />
                <div className="p-8 flex flex-col items-center">
                  <div className="mx-auto my-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-cyan-300 to-cyan-600 shadow-md">
                    <FlaskConical className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-slate-900 mx-auto my-4 text-2xl font-bold text-center tracking-tight">Materials Sampling & Testing</h3>
                  <p className="text-slate-600 mb-8 text-center leading-relaxed">
                    Comprehensive field and laboratory testing to ensure compliance with local, state, and federal requirements and engineering specifications.
                  </p>
                  <ul className="space-y-4 w-full flex flex-col items-center">
                    {[
                      "Concrete field strength testing",
                      "Hazardous Materials Sampling and Testing",
                      "Reinforced steel, bolts, tiedowns, wood-framed structure, and anchorage system testing",
                      "Welding and structural connection strength testing"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700 max-w-md w-full group">
                        <CheckCircle className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium group-hover:text-cyan-600 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.3}>
              <Card className="group h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg" data-testid="card-structural-inspections">
                <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500" />
                <div className="p-8 flex flex-col items-center">
                  <div className="mx-auto my-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-teal-300 to-teal-600 shadow-md">
                    <Beaker className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-slate-900 mx-auto my-4 text-2xl font-bold text-center tracking-tight">Structural Systems Inspections</h3>
                  <p className="text-slate-600 mb-8 text-center leading-relaxed">
                    Field and laboratory testing of concrete, asphalt, aggregates, and other construction materials to ensure quality and code compliance
                  </p>
                  <ul className="space-y-4 w-full flex flex-col items-center">
                    {[
                      "Concrete cylinder testing (compression)",
                      "Slump, air content, and temperature resistance checks",
                      "Asphalt core sampling and density testing",
                      "Aggregate gradation and quality validation"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700 max-w-md w-full group">
                        <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium group-hover:text-teal-600 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.4}>
              <Card className="group h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg" data-testid="card-environmental-compliance">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="p-8 flex flex-col items-center">
                  <div className="mx-auto my-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-cyan-600 shadow-md">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-slate-900 mx-auto my-4 text-2xl font-bold text-center tracking-tight">Environmental Compliance</h3>
                  <p className="text-slate-600 mb-8 text-center leading-relaxed">
                    Specialized testing to support environmental permits, remediation projects, and hazardous material management
                  </p>
                  <ul className="space-y-4 w-full flex flex-col items-center">
                    {[
                      "Phase 1 and Phase 2 Groundwater and well monitoring",
                      "Hazardous material screening",
                      "Soil contamination assessments",
                      "Air and water quality testing"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700 max-w-md w-full group">
                        <CheckCircle className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium group-hover:text-cyan-600 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </AnimatedSection>
          </div>
          
          <AnimatedSection direction="up" delay={0.5} className="flex justify-center mt-16">
            <Link to={createPageUrl("Contact")} data-testid="link-get-testing">
              <Button size="lg" className="group rounded-md bg-slate-900 px-10 py-7 text-lg font-bold tracking-tight text-white shadow-md transition-colors duration-200 hover:bg-slate-800">
                Get Testing Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up" className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight"> 
              Testing That Matters
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
            <div className="space-y-6 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              <p>
                Managing necessary, mitigating, and anticipatory testing and sampling scheduling and compliance can be a headache especially when you've already got enough people to manage and a company to grow. However, proper testing ensures compliance and avoidance of costly mistakes down the line.
              </p>
              <p>
                Whether you're monitoring stormwater plans, verifying ongoing structural integrity, or checking the many other environmental and engineering conditions - we streamline the process. Our team handles everything from sample collection to lab coordination, so you can retain integrity while staying outcome-focused.
              </p>
              <p>
                Our teams are well versed in what to look for and how to keep your project on schedule and compliant with foresight backed by decades of extensive experience.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        headline="Stay On Time & In Compliance"
        body="We have you covered - from stormwater compliance, engineered structural materials verification, or environmental analysis and assessments."
        primaryButtonText="Book Your Inspection Now"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="inspections-testing-cta"
      />
    </div>
  );
}
