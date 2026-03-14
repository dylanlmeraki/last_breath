import React from "react";
import {
  CheckCircle,
  FileText,
  ClipboardCheck,
  Shield,
  ArrowRight,
  ChevronRight,
  Award,
  TrendingUp,
  Clock,
  Phone
} from "lucide-react";

export default function TightenedHierarchy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-orange-500/30" data-testid="page-home">
      {/* 1. HERO SECTION */}
      <section 
        className="relative flex items-center justify-center pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950" 
        data-testid="section-hero"
      >
        {/* Subtle background gradient - replacing all the noise */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full px-6 max-w-5xl mx-auto text-center">
          {/* Glassmorphic focal point card */}
          <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-500" />
            
            <div className="p-8 md:p-12">
              <h1 className="text-white font-bold tracking-tight leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4" data-testid="text-hero-title">
                Pacific Engineering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  & Construction Inc.
                </span>
              </h1>

              {/* Tighter spacing around the divider */}
              <div className="flex items-center justify-center gap-3 my-5">
                <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
                <div className="w-2 h-2 rotate-45 bg-orange-500" />
                <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
              </div>

              <p className="text-slate-300 mx-auto font-light tracking-wide text-lg sm:text-xl md:text-2xl mb-8" data-testid="text-hero-subtitle">
                Consulting Engineers & Contractors
              </p>

              {/* Tighter button spacing */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <button 
                  data-testid="link-hero-services"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-semibold text-base px-8 py-3.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Our Services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                
                <button 
                  data-testid="link-hero-consultation"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-semibold text-base px-8 py-3.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Free Consultation
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                </button>
              </div>

              {/* Stats - Tighter layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                <div className="p-3" data-testid="stat-experience">
                  <div className="text-white font-bold text-2xl md:text-3xl mb-1">40+</div>
                  <div className="text-orange-400 font-medium text-sm">Years Experience</div>
                </div>
                <div className="p-3 sm:border-l sm:border-white/5" data-testid="stat-full-service">
                  <div className="text-white font-bold text-2xl md:text-3xl mb-1">Full-Service</div>
                  <div className="text-cyan-400 font-medium text-sm">Vertically Integrated</div>
                </div>
                <div className="p-3 sm:border-l sm:border-white/5" data-testid="stat-full-scale">
                  <div className="text-white font-bold text-2xl md:text-3xl mb-1">Full-Scale</div>
                  <div className="text-slate-400 font-medium text-sm">Res, Comm & Infrastructure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID SECTION */}
      {/* Clean section transition with orange top border */}
      <section className="py-24 px-6 bg-slate-50 border-t-4 border-orange-500 relative" data-testid="section-services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight" data-testid="text-services-title">
              Comprehensive Engineering Solutions
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">
              Full-scale civil and structural engineering and construction plans
              developed and implemented by our teams of in-house Engineers,
              QSD/QSPs, and construction experts. Keep everything on track, on budget, and fully compliant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* CONSTRUCTION - Flagship Service (Elevated Treatment) */}
            <div 
              className="group relative h-full bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden hover:-translate-y-1 transition-transform duration-300"
              data-testid="link-construction-service"
            >
              {/* Distinctive accent for flagship service */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="p-8 sm:p-10 relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Shield className="w-8 h-8" />
                  </div>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                    Flagship
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                  Construction Service
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                  We are fully licensed and ready to take on any and all
                  work from residential additions, multi-unit residential,
                  commercial mixed-use, up to public and governmental
                  infrastructure.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Class A License", 
                    "Class B License", 
                    "Infrastructure & Public Works", 
                    "Residential, Commercial, Municipal"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="flex items-center text-orange-600 font-semibold group/btn mt-auto">
                  Learn more <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* ENGINEERING CONSULTING */}
            <div 
              className="group relative h-full bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden hover:-translate-y-1 transition-all duration-300"
              data-testid="link-engineering-consulting"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
              
              <div className="p-8 sm:p-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-50 transition-colors duration-300">
                  <ClipboardCheck className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  Engineering Consulting
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-sm sm:text-base">
                  Professional engineering expertise across civil and
                  structural disciplines, providing innovative solutions and
                  implementation to meet the unique needs of your project.
                </p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    "Civil Engineering Consulting", 
                    "Structural Consulting", 
                    "Site Assessment & Design", 
                    "Development Management & Support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="flex items-center text-cyan-600 font-medium group/btn mt-auto text-sm sm:text-base">
                  Learn more <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* INSPECTIONS & TESTING */}
            <div 
              className="group relative h-full bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden hover:-translate-y-1 transition-all duration-300"
              data-testid="link-inspections-testing"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
              
              <div className="p-8 sm:p-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-50 transition-colors duration-300">
                  <Award className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  Inspections & Testing
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-sm sm:text-base">
                  Thorough inspections to ensure ongoing compliance with
                  recommendations and implementation of areas for
                  improvement.
                </p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    "Structural Systems Inspections", 
                    "Stormwater Testing and Inspections", 
                    "Materials Sampling & Testing", 
                    "Environmental Compliance"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="flex items-center text-cyan-600 font-medium group/btn mt-auto text-sm sm:text-base">
                  Learn more <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* STORMWATER PLANNING */}
            <div 
              className="group relative h-full bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden hover:-translate-y-1 transition-all duration-300"
              data-testid="link-stormwater-planning"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
              
              <div className="p-8 sm:p-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-50 transition-colors duration-300">
                  <FileText className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  Stormwater Planning
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-sm sm:text-base">
                  Comprehensive stormwater management and SWPPP development to keep your project compliant with environmental regulations.
                </p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {[
                    "SWPPP Development", 
                    "QSD/QSP Services", 
                    "SMARTS Filing", 
                    "Site Monitoring"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="flex items-center text-cyan-600 font-medium group/btn mt-auto text-sm sm:text-base">
                  Learn more <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY PACIFIC SECTION */}
      {/* Strict left-alignment for text elements */}
      <section className="py-24 px-6 bg-white border-t border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-left order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Why Choose Pacific Engineering?
              </h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                100% client satisfaction across 2.5K+ projects. We bring decades of expertise to every site we step onto.
              </p>

              <div className="space-y-8 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Expert Knowledge</h4>
                    <p className="text-slate-600">Our in-house team combines specialized technical knowledge with practical field experience.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Proven Track Record</h4>
                    <p className="text-slate-600">Delivering projects on time and on budget across residential, commercial, and public sectors.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Responsive Service</h4>
                    <p className="text-slate-600">Clear communication and agile problem-solving to keep your construction timeline intact.</p>
                  </div>
                </div>
              </div>

              <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-slate-900 font-semibold text-base px-8 py-3.5 rounded-lg bg-white border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-200">
                About Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Fallback image style representation since we can't use external assets easily */}
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#334155,#0f172a)]" />
                   {/* Abstract architectural representation */}
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0f172a_100%)]" />
                   <div className="absolute -left-10 top-20 w-40 h-[600px] bg-white/10 rotate-12" />
                   <div className="absolute left-40 top-40 w-20 h-[500px] bg-white/10 rotate-12" />
                   <div className="absolute left-80 top-10 w-60 h-[700px] bg-white/5 rotate-12" />
                   
                   <p className="relative z-10 text-white/50 font-bold text-2xl tracking-widest uppercase">SF BAY AREA</p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-[200px]">
                <div className="text-orange-500 font-black text-3xl mb-1">2.5K+</div>
                <div className="text-slate-800 font-bold leading-tight">Successful Projects Completed</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-24 px-6 bg-slate-900 text-center relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            How Can We Help?
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
            Ready to get started on your next project? Our team of engineers and contractors is ready to review your requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-semibold text-base px-8 py-3.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto">
              <Phone className="w-4 h-4" />
              Get In Touch
            </button>
            <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-white font-semibold text-base px-8 py-3.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto">
              View Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
