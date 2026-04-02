import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { Award, Users, Target, Shield, ArrowRight, Building2, HardHat, ClipboardCheck, FileText, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedCounter from "../components/AnimatedCounter";
import { ServiceCardsGrid } from "../components/ServiceCards";
import SEO from "../components/SEO";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import BlueprintBackground from "../components/BlueprintBackground";
import CTASection from "../components/CTASection";
import bayBridgeImg from "@assets/bay-bridge-sunrise_1773821710974.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-about">
      <SEO 
        title="About Pacific Engineering - 20+ Years of Excellence | PECI"
        description="Founded in 2001, Pacific Engineering & Construction Inc. delivers expert civil engineering, construction, and compliance services across California and Nevada. Meet our PE-certified team."
        keywords="about pacific engineering, civil engineering company, construction firm bay area, PE certified engineers, engineering company history, PECI team"
        url="/about"
      />
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-950 overflow-hidden" data-testid="section-about-hero">
        <div className="absolute inset-0 opacity-[0.6]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bayBridgeImg})` }}
          />
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
                <h1 className="text-white mb-6 text-3xl font-bold sm:text-5xl md:text-6xl tracking-tight" data-testid="text-about-title">About Pacific Engineering</h1>
                <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
                  Engineering, consulting, and construction services backed by decades of experience and a commitment to getting projects done right
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80" />
      </section>

      <section className="py-20 px-6 bg-white border-b border-slate-200" data-testid="section-company-story">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <AnimatedSection direction="up" className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight" data-testid="text-who-we-are">
                Who We Are
              </h2>
              <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <AnimatedSection direction="left">
                <div className="space-y-4 text-lg text-slate-700 leading-relaxed font-light text-center lg:text-left">
                <p>
                 Founded in 2001, Pacific Engineering &amp; Construction, Inc. (PECI) has applied its surveying and
civil and environmental engineering, construction management, and infrastructure engineering
capabilities to sites across California, and Nevada, PECI provides site civil engineering design
and surveying services for municipal buildings, marinas, prisons, hospitals, schools,
condominiums, casinos and new residential land developments. PECI has developed construction
plans and specifications for site grading, paving, curb and gutter, and sidewalks, as well as water,
sewer, and storm drain utilities. PECI staff has extensive construction management and
construction administration experience. Master plans have been prepared for commercial, light
industrial and residential developments in multiple communities in Northern California. Recent
school projects that PECI has provided engineering services to include projects at the San
Francisco International Airport and schools in Marin, San Francisco, Daly City, and
Sacramento.</p>
<p>PECI continuously strives to improve quality by providing quality control and quality assurance
(QA/QC) on all deliverables and work products. Our firm has an established record of meeting
project and schedule commitments. PECI's engineers and technicians have hands-on experience
providing contract administration, as well as quality assurance/quality control monitoring and
material testing on a variety of public and private sector projects. Our wide range of in-house
capabilities enables us to provide high-quality, cost-effective services.</p>
<p>PECI's provides professional surveying, mapping, G.I.S., G.P.S., 3-D laser scanning, and
consulting services throughout California. Our staff has successfully completed projects of all
sizes for both the private, municipal, and public sector.</p>
<p>We are dedicated to providing our clients with quality surveying support for their projects.
Whether it is a small boundary line dispute or providing mapping services to a large utility
company, Pacific Engineering &amp; Construction, Inc. consistently delivers an economical product
in a timely manner.
                </p>
                </div>
                </AnimatedSection>

                <AnimatedSection direction="right" delay={0.2} className="relative lg:row-span-2">
                <div className="sticky pe-sticky-under-header aspect-[4/3] overflow-hidden rounded-xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
                    alt="Pacific Engineering team"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    data-testid="img-team"
                  />
                </div>
                <div className="hidden sm:block absolute -bottom-8 -right-8 bg-gradient-to-br from-blue-600 to-cyan-600 p-8 rounded-xl shadow-2xl max-w-xs border-4 border-white">
                  <div className="text-white font-bold text-xl tracking-tight mb-2">Committed to Excellence</div>
                  <div className="text-blue-100 text-sm">Since 2001</div>
                </div>
                </AnimatedSection>
                </div>
                </div>

            <div className="mb-14">
              <AnimatedSection direction="up" className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight" data-testid="text-what-we-do">
                  What We Do
                </h2>
                <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto rounded-full"></div>
              </AnimatedSection>

              <ServiceCardsGrid />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection direction="left" className="order-2 lg:order-1">
                <div className="aspect-[4/3] rounded-md overflow-hidden shadow-2xl border-4 border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"
                    alt="Engineering and construction expertise"
                    className="w-full h-full object-cover"
                    data-testid="img-expertise"
                  />
                </div>
              </AnimatedSection>
              
              <AnimatedSection direction="right" className="order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight" data-testid="text-how-we-work">
                  How We Work
                </h2>
                <div className="space-y-4 text-lg text-slate-700 leading-relaxed font-light">
                  <p>
                  Our in-house Professional Engineering and Construction teams operate as a unified team—tight, coordinated, and accountable. This integrated structure drives faster decisions, cleaner execution, and consistent technical accuracy on every project.
                  </p>
                  <p>
                  We navigate local SF Bay Area, California, and Federal regulatory compliance standards with precision backed by long-standing relationships with architects, contractors, and construction professionals streamlining approvals and keep schedules on track.
                </p>
                  <p>
                   When site issues surface, our teams identify them early and resolve them immediately. No bottlenecks, no unclear responsibility. We address it, document it, and keep the project moving.
                   </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      

      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200" data-testid="section-values">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight" data-testid="text-values-title">
              What Drives Us
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto rounded-full"></div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
            <AnimatedSection direction="up" delay={0.1}>
              <Card className="p-8 text-center border-r border-slate-200 shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition-all h-full rounded-none first:rounded-l-xl last:rounded-r-xl">
                <div className="bg-gradient-to-br from-blue-400 to-blue-700 w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight uppercase">Technical Excellence</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Precision engineering, rigorous testing, and PE-certified work that stands up to scrutiny and performs as designed
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <Card className="p-8 text-center border-r border-slate-200 shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition-all h-full rounded-none first:rounded-l-xl last:rounded-r-xl">
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-700 w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight uppercase">Results-Focused</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Delivering outcomes that matter — compliance achieved, structures built right, projects completed on schedule
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.3}>
              <Card className="p-8 text-center border-r border-slate-200 shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition-all h-full rounded-none first:rounded-l-xl last:rounded-r-xl">
                <div className="bg-gradient-to-br from-teal-400 to-teal-700 w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight uppercase">Collaborative</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Working closely with your team, communicating clearly, and coordinating seamlessly across all project phases
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.4}>
              <Card className="p-8 text-center shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition-all h-full rounded-none first:rounded-l-xl last:rounded-r-xl">
                <div className="bg-gradient-to-br from-blue-400 to-blue-700 w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight uppercase">Accountable</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Taking ownership of our work, standing behind our designs, and delivering what we promise
                </p>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section
        className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-slate-900 overflow-hidden"
        data-testid="section-stats"
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection direction="up" className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white" data-testid="text-stats-title">
              By the Numbers
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto rounded-full"></div>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { target: 40, suffix: "+", label: "Years", sub: "Combined experience", key: "years" },
              { target: 2500, suffix: "+", label: "Projects", sub: "Successfully completed", key: "projects" },
              { target: 100, suffix: "%", label: "Compliance", sub: "Track record", key: "compliance" },
              { target: 5, suffix: "B+", label: "Project Value", sub: "Total construction value", prefix: "$", key: "value" },
            ].map((stat, i) => (
              <AnimatedSection direction="up" delay={i * 0.1} key={stat.key}>
                <div className="relative group" data-testid={`card-stat-${stat.key}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] to-blue-500/[0.08] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 sm:p-8 hover:border-cyan-500/20 transition-all duration-300">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" data-testid={`text-stat-value-${stat.key}`}>
                      {stat.prefix || ""}<AnimatedCounter target={stat.target} suffix={stat.suffix} />
                    </div>
                    <div className="text-base sm:text-lg text-white font-bold tracking-tight mb-1" data-testid={`text-stat-label-${stat.key}`}>{stat.label}</div>
                    <p className="text-slate-400 text-xs sm:text-sm" data-testid={`text-stat-sub-${stat.key}`}>{stat.sub}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white" data-testid="section-service-areas">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight" data-testid="text-service-areas-title">
              Serving the Bay Area
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8 font-light">
              Based in San Francisco, we provide engineering, inspection, testing, and construction services throughout the Bay Area. Our teams are familiar with local jurisdictional requirements across San Francisco, Oakland, San Jose, and surrounding counties — streamlining approvals and keeping your project moving forward.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              From hillside developments in Oakland to commercial projects in Silicon Valley, waterfront construction in San Francisco to infrastructure work in the East Bay — we bring local expertise and proven results to every project.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        headline="We'd Love to Hear From You"
        body="If you are a local engineering or construction professional, let's chat. Our in-house engineering and construction teams can help streamline your current or future projects and bring your ideas to life."
        primaryButtonText="Let's Talk About Your Project"
        primaryButtonLink={createPageUrl("Contact")}
        testIdPrefix="about-cta"
      />
    </div>
  );
}
