import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Filter, Award, CheckCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import BlueprintBackground from "../components/BlueprintBackground";

interface GalleryProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  county: string;
  location: string;
  date: string;
  image: string;
  images: string[];
  services: string[];
  agencies?: string[];
  scope?: string;
  client_name?: string;
  contact_name?: string;
  budget?: string;
}

export default function ProjectGallery() {
  const [filters, setFilters] = useState({
    category: "all",
    service: "all",
    location: "all"
  });

  const { data: projects = [], isLoading } = useQuery<GalleryProject[]>({
    queryKey: ["/api/gallery-projects"],
  });

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p: GalleryProject) => p.category).filter(Boolean)));
    return [
      { value: "all", label: "All Categories" },
      ...unique.map(cat => ({ value: cat, label: cat }))
    ];
  }, [projects]);

  const serviceTypes = useMemo(() => {
    const unique = Array.from(new Set(projects.flatMap((p: GalleryProject) => p.services || []).filter(Boolean)));
    return [
      { value: "all", label: "All Services" },
      ...unique.map(service => ({ value: service, label: service }))
    ];
  }, [projects]);

  const locations = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p: GalleryProject) => p.county).filter(Boolean)));
    return [
      { value: "all", label: "All Locations" },
      ...unique.map(county => ({ value: county, label: county }))
    ];
  }, [projects]);

  const filteredProjects = projects.filter((p: GalleryProject) => {
    const categoryMatch = filters.category === "all" || p.category === filters.category;
    const locationMatch = filters.location === "all" || p.county === filters.location;
    const serviceMatch = filters.service === "all" || (p.services && p.services.some(s => s === filters.service));
    return categoryMatch && locationMatch && serviceMatch;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="project-gallery-page">
      <SEO 
        title="Project Gallery - Pacific Engineering Portfolio | 100+ Completed Projects"
        description="Explore Pacific Engineering's portfolio of civil engineering, SWPPP, and construction projects across California. Airports, infrastructure, schools, and commercial developments."
        keywords="engineering portfolio, construction projects bay area, SWPPP projects, civil engineering work, infrastructure projects, completed engineering projects"
        url="/project-gallery"
      />

      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-950 overflow-hidden">
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
                <h1 className="text-white mb-6 text-3xl font-bold sm:text-5xl md:text-6xl tracking-tight" data-testid="text-gallery-title">
                  Project Gallery
                </h1>
                <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
                  Explore our portfolio of successful projects across the Bay Area. From residential developments to major infrastructure, see how we deliver compliance and excellence.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80" />
      </section>

      <section className="py-16 px-6 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up" delay={0.1}>
            <Card className="p-10 border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 border-t-4 border-blue-600 rounded-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Excellence Since 2001</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed font-light mb-6">
                Founded in 2001, Pacific Engineering & Construction, Inc. (PECI) has applied its civil, environmental, construction management, surveying, and infrastructure engineering capabilities to sites across California and Nevada. We provide complete site civil and environmental engineering design and surveying services for airports, municipal buildings, marinas, prisons, hospitals, schools, condominiums, casinos and new residential land developments.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: CheckCircle, label: "Civil Engineering Design" },
                  { icon: CheckCircle, label: "Construction Management" },
                  { icon: CheckCircle, label: "Surveying & Mapping" },
                  { icon: CheckCircle, label: "Infrastructure Engineering" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                    <item.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 px-6 bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <div className="w-full md:w-auto">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => handleFilterChange("category", cat.value)}
                        data-testid={`button-category-${cat.value}`}
                        className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                          filters.category === cat.value
                            ? "bg-slate-900 text-white shadow-lg scale-105"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 w-full lg:w-auto items-center">
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Type</label>
                  <select 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={filters.service}
                    onChange={(e) => handleFilterChange("service", e.target.value)}
                    data-testid="select-service-type"
                  >
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                  <select 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    data-testid="select-location"
                  >
                    {locations.map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Filter className="w-4 h-4" />
              <span className="font-bold" data-testid="text-project-count">{filteredProjects.length}</span> projects found
              {(filters.category !== "all" || filters.service !== "all" || filters.location !== "all") && (
                <button 
                  onClick={() => setFilters({ category: "all", service: "all", location: "all" })}
                  data-testid="button-clear-filters"
                  className="text-blue-600 font-bold ml-4 text-xs uppercase tracking-wider flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear All Filters
                </button>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20" data-testid="gallery-loading">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project: GalleryProject, index: number) => (
                <AnimatedSection key={project.id} direction="up" delay={index * 0.05}>
                  <Link to={`/projects/${project.slug}`} data-testid={`link-project-${project.slug}`}>
                    <Card
                      className="group overflow-hidden border border-slate-200 shadow-md transition-all duration-300 cursor-pointer rounded-md bg-white h-full"
                    >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-white uppercase tracking-wider">
                          {project.date}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-2" data-testid={`text-project-title-${project.id}`}>
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-wide">{project.county}, CA</span>
                      </div>
                      <p className="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.services && project.services.slice(0, 2).map((service: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-md font-bold uppercase tracking-wider"
                          >
                            {service}
                          </span>
                        ))}
                        {project.services && project.services.length > 2 && (
                          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs px-3 py-1 rounded-md font-bold uppercase tracking-wider">
                            +{project.services.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
          
          {!isLoading && filteredProjects.length === 0 && (
            <div className="text-center py-20" data-testid="gallery-empty">
              <p className="text-xl font-bold text-slate-400 mb-4">No projects found matching your criteria</p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ category: "all", service: "all", location: "all" })}
                data-testid="button-clear-filters-empty"
                className="rounded-md"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900 border-t-4 border-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection direction="up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed font-light">
              Let's discuss how we can bring the same level of excellence and compliance to your construction project.
            </p>
            
            <Link to={createPageUrl("Contact")} data-testid="link-contact-cta">
              <Button size="lg" className="bg-white text-blue-600 px-10 py-7 text-lg font-bold tracking-tight rounded-md shadow-lg transition-all duration-300 group">
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
