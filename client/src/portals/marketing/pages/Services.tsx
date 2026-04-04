import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { FileText, Shield, ArrowRight, Check, Droplets, ClipboardCheck, Users, Zap, CheckCircle, Info, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import CTASection from "../components/CTASection";
import MarketingPageHero from "../components/MarketingPageHero";

export default function Services() {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-services">
      <SEO 
        title="Stormwater Planning & SWPPP Services - QSD/QSP | Pacific Engineering"
        description="Professional SWPPP development and implementation by PE-certified QSD/QSP team. Full stormwater compliance for construction projects in the Bay Area."
        keywords="SWPPP services, QSD services, QSP services, stormwater planning, BMP design, erosion control, construction stormwater compliance"
        url="/services"
      />
      <MarketingPageHero
        title="Stormwater Planning & SWPPP Services"
        description="Pacific Engineering supports stormwater planning, implementation, and closeout with in-house PE, QSD, and QSP expertise shaped around compliance, sequencing, and field conditions."
        backgroundImage="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600"
        sectionTestId="section-services-hero"
        titleTestId="text-services-title"
      />
      <section className="py-16 px-6 bg-slate-50 border-b border-slate-200 pt-[24px] pb-[24px]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up">
            <div className="grid md:grid-cols-4 gap-2">
              <div className="rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md" data-testid="stat-compliance-rate">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 shadow-md">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">100%</h3>
                <p className="text-slate-600">Compliance Rate</p>
              </div>
              
              <div className="rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md" data-testid="stat-projects-completed">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-cyan-700 shadow-md">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">500+</h3>
                <p className="text-slate-600">Projects Completed</p>
              </div>
              
              <div className="rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md" data-testid="stat-support">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-teal-700 shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">24/7</h3>
                <p className="text-slate-600">Support Available</p>
              </div>
              
              <div className="rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md" data-testid="stat-turnaround">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-green-400 to-green-700 shadow-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Fast</h3>
                <p className="text-slate-600">Turnaround Time</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <AnimatedSection direction="up" delay={0.1}>
            <Card className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative order-2 lg:order-1 h-96 lg:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10" />
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
                    alt="San Francisco commercial construction planning" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="order-1 lg:order-2 p-8 lg:p-12">
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-md w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight" data-testid="text-qsd-title">Qualified SWPPP Developer (QSD) Services</h3>
                      <p className="text-slate-600 text-lg max-w-3xl mx-auto font-light">
                        Clear actionable Stormwater Plan development - tailored for your unique jobsite(s). Our QSDs come equipped with in-depth compliance and construction experience to delivering SWPPPs with consistent professional integrity with your goals in mind of anticipating issues and minimizing project sequencing delays.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <h4 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wide text-center">What We Do</h4>
                    <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-6 rounded-full"></div>
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Permit Coverage</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Verify CGP/NPDES applicability, complete NOI/permit filings, and define compliance responsibilities up front.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Site Assessment & Clear SWPPP Documentation</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Evaluate grading, soils, and drainage inlet/outlet flows to develop effective Water Pollution Control Plans and site Mapping.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Integrate Effective BMPs with Project Phasing</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Ensure erosion, sediment, and source control BMPs meet permit criteria and flow efficiently with your project phasing.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Provide Training and Ongoing Support</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Provide initial and as-needed site-specific procedure briefings for dewatering, concrete washout, fueling, and other non-stormwater spill response - minimizing non-compliance risk.</p>
                      </div>
                      
                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Certify and Deliver SWPPP(s)</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Deliver signed, stamped, and certified plans by our Professional Engineers and QSDs that satisfy all local, state, and federal requirements.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-blue-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-blue-600 transition-colors">Ongoing Plan Management</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Continue ongoing communication with QSPs and site management for any ammendments to the SWPPP as site logistics and/OR sequencing change.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Link to={createPageUrl("Consultation")} data-testid="link-start-swppp" className="pe-button">
                        Start Your SWPPP
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.2}>
            <Card className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-cyan-500 to-teal-500" />
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12">
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="bg-gradient-to-br from-cyan-300 to-cyan-600 rounded-md w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight" data-testid="text-qsp-title">Qualified SWPPP Practitioner (QSP) Services</h3>
                      <p className="text-slate-600 text-lg max-w-3xl mx-auto font-light">
                        Our QSPs ensure that BMP's and water pollution controls are installed and maintained. With hands-on experience and regulatory knowledge, we keep you in compliance and minimize any adverse sequencing impacts.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <h4 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wide text-center">What We Do</h4>
                    <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-6 rounded-full"></div>
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Implement SWPPP from QSDs</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Verify initial and ongoing BMP efficiency through scheduled weekly, pre-storm, during-storm, and post-storm inspections with photo documentation and action items as needed.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">    
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">As Needed Monitoring and Sampling</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Update site maps, BMP inventories, and narratives to reflect grading, drainage, or sequencing changes.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">BMP Maintenance and Repairs</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Assist in BMP maintenance and repairs in coordination with onsite crews to spot and correct potential issues early and to reduce any potential project timeline delays.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Keep SWPPPs Current and Organized</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Maintain and update mapping, inspection records, and ongoing BMP changes in order to minimize any timeline delays - keeping work on track.</p>
                      </div>
                      
                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Toolbox Talks and Crew Training</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Deliver actionable onsite training that equips crews to meet stormwater responsibilities and prevent delays deficiencies, by adhering to action items.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-md border border-slate-100 hover:border-cyan-300 transition-colors text-center group">
                        <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wide group-hover:text-cyan-600 transition-colors">Support Final Stabilization and Closeout</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">Verify permanent stabilization, oversee temporary BMP removal, and prepare documentation for Notice of Termination (NOT).</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Link to={createPageUrl("Consultation")} data-testid="link-get-swppp" className="pe-button-secondary">
                        Get Your SWPPP
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
                
                <div className="relative h-96 lg:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-teal-600/10" />
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"
                    alt="Bay Area construction site implementation"
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </Card>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.3}>
            <Card className="rounded-md border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-900 shadow-sm">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-wide">About SWPPP Requirements</h3>
                    {isInfoExpanded &&
                    <p className="text-slate-700 leading-relaxed mt-4">
                        A Stormwater Pollution Prevention Plan (SWPPP) is typically required for construction projects that disturb one acre or more of land, or are part of a larger common plan of development that disturbs one acre or more. Requirements may vary by location and project type. Please fill out form below fully, so that our licensed and certified professionals can best assist you.
                      </p>
                    }
                  </div>
                </div>
                <button
                  onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  data-testid="button-toggle-swppp-info"
                >
                  {isInfoExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <Card className="p-8 bg-white border border-slate-200 rounded-md shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center uppercase tracking-wide">When is a SWPPP Required?</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  <strong className="text-slate-900">Federal Requirements:</strong> Under the Clean Water Act's National Pollutant Discharge Elimination System (NPDES) program, a SWPPP is required for construction activities that disturb one acre or more of land surface, or are part of a larger common plan of development.
                </p>
                <p>
                  <strong className="text-slate-900">California Requirements:</strong> The California State Water Resources Control Board requires coverage under the Construction General Permit for qualifying projects throughout the state, including the San Francisco Bay Area.
                </p>
                <p>
                  <strong className="text-slate-900">Local Requirements:</strong> Many California municipalities have additional local stormwater requirements that may apply to smaller projects or have specific provisions. It is pertinent that you are in touch with locally trained and qualified professionals to work with you through nuanced local regulations.
                </p>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Why Choose Pacific Engineering
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              We deliver more than compliance — we deliver confidence and peace of mind
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-4">
            <AnimatedSection direction="up" delay={0.1}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 shadow-md">
                  <ClipboardCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">PE-Certified Team</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  All work performed and certified by our in-house Professional Engineers and QSD/QSP team with well-rounded Bay Area compliance expertise.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-cyan-700 shadow-md">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Fast Turnaround</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Quick response times and efficient processes keep your projects moving forward without delays
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.3}>
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-teal-700 shadow-md">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Compliance Expertise</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Deep knowledge of SF Bay Area as well as State and Federal regulatory compliance requirements
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      <CTASection
        headline="Streamline your testing."
        body="Every project is unique. Let's discuss your specific requirements and determine if a SWPPP is needed for your site."
        primaryButtonText="Get Your SWPPP Started"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="stormwater-cta"
      />
    </div>
  );
}
