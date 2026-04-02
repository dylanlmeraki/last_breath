import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Filter, Loader2, MapPin, X } from "lucide-react";
import type { MarketingGalleryProject } from "@shared/marketing-content";
import { createPageUrl } from "../lib/utils";
import { fetchMarketingJson } from "../lib/stubApi";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import BlueprintBackground from "../components/BlueprintBackground";
import CTASection from "../components/CTASection";
import ProjectGalleryMap from "../components/ProjectGalleryMap";

type GalleryFilters = {
  category: string;
  service: string;
  location: string;
};

const DEFAULT_FILTERS: GalleryFilters = {
  category: "all",
  service: "all",
  location: "all",
};

function statusLabel(status: MarketingGalleryProject["status"]): string {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "completed":
      return "Completed";
    default:
      return "Featured";
  }
}

export default function ProjectGalleryRecovered() {
  const [filters, setFilters] = useState<GalleryFilters>(DEFAULT_FILTERS);
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>();
  const deferredFilters = useDeferredValue(filters);

  const { data: projects = [], isLoading } = useQuery<MarketingGalleryProject[]>({
    queryKey: ["/api/gallery-projects"],
    queryFn: () =>
      fetchMarketingJson<MarketingGalleryProject[]>("/api/gallery-projects").then(
        (data) => data ?? [],
      ),
  });

  const categories = useMemo(
    () => ["all", ...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects],
  );

  const serviceTypes = useMemo(
    () => ["all", ...new Set(projects.flatMap((project) => project.services).filter(Boolean))],
    [projects],
  );

  const locations = useMemo(
    () => ["all", ...new Set(projects.map((project) => project.county).filter(Boolean))],
    [projects],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const categoryMatch =
          deferredFilters.category === "all" || project.category === deferredFilters.category;
        const locationMatch =
          deferredFilters.location === "all" || project.county === deferredFilters.location;
        const serviceMatch =
          deferredFilters.service === "all" ||
          project.services.includes(deferredFilters.service);

        return categoryMatch && locationMatch && serviceMatch;
      }),
    [projects, deferredFilters],
  );

  useEffect(() => {
    if (!filteredProjects.length) {
      setSelectedSlug(undefined);
      return;
    }

    if (!selectedSlug || !filteredProjects.some((project) => project.slug === selectedSlug)) {
      setSelectedSlug(filteredProjects[0].slug);
    }
  }, [filteredProjects, selectedSlug]);

  const selectedProject =
    filteredProjects.find((project) => project.slug === selectedSlug) ?? filteredProjects[0];

  const handleFilterChange = (key: keyof GalleryFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSelectProject = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="project-gallery-page">
      <SEO
        title="Project Gallery - Pacific Engineering Portfolio | 100+ Completed Projects"
        description="Explore Pacific Engineering's portfolio of civil engineering, SWPPP, and construction projects across California. Airports, infrastructure, schools, and commercial developments."
        keywords="engineering portfolio, construction projects bay area, SWPPP projects, civil engineering work, infrastructure projects, completed engineering projects"
        url="/project-gallery"
      />

      <section className="project-gallery-hero relative overflow-hidden pe-inverse">
        <AnimatedGridBackground
          baseOpacity={0.45}
          gridSize={40}
          triggerInterval={500}
          animationDuration={2500}
          className="hidden sm:block opacity-30"
        />
        <BlueprintBackground className="z-[2] opacity-50" />
        <div className="pe-container-wide relative z-[5] py-20 sm:py-24 lg:py-28">
          <AnimatedSection direction="up" blur>
            <div className="project-gallery-hero-card technical-frame">
              <div className="project-gallery-hero-copy pe-stack-sm">
                <span className="eyebrow cool">Northern California Project Proof</span>
                <h1 className="pe-heading-1 text-white" data-testid="text-gallery-title">
                  Project Gallery
                </h1>
                <p className="pe-lead text-slate-200">
                  Real Pacific project work across infrastructure, institutional,
                  aviation, utility, and civic scopes. Filter by service, location,
                  or project type and trace each project back to the delivery context
                  behind it.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to={createPageUrl("Consultation")} className="pe-button">
                    Review Project Scope
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link to={createPageUrl("Contact")} className="pe-button-secondary">
                    Talk to Pacific
                  </Link>
                </div>
              </div>

              <div className="project-gallery-metrics">
                <div className="project-gallery-metric pe-card-dark">
                  <span className="project-gallery-metric-value">{projects.length || 6}</span>
                  <span className="project-gallery-metric-label">Representative projects</span>
                </div>
                <div className="project-gallery-metric pe-card-dark">
                  <span className="project-gallery-metric-value">
                    {new Set(projects.map((project) => project.county)).size || 3}
                  </span>
                  <span className="project-gallery-metric-label">Core Bay Area counties</span>
                </div>
                <div className="project-gallery-metric pe-card-dark">
                  <span className="project-gallery-metric-value">
                    {new Set(projects.flatMap((project) => project.services)).size || 10}
                  </span>
                  <span className="project-gallery-metric-label">Service threads represented</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pe-section pe-section-tight section-surface-solid">
        <div className="pe-container-wide pe-stack">
          <AnimatedSection direction="up">
            <div className="project-gallery-filter-shell pe-card pe-card-pad">
              <div className="project-gallery-filter-header">
                <div className="pe-stack-sm">
                  <span className="eyebrow">Filter Project Experience</span>
                  <h2 className="pe-heading-3">Browse project proof by scope, service, and county.</h2>
                </div>
                <div className="project-gallery-results" data-testid="text-project-count">
                  <Filter className="h-4 w-4" />
                  <span>{filteredProjects.length}</span>
                  <span>projects shown</span>
                </div>
              </div>

              <div className="project-gallery-filter-grid">
                <div className="project-gallery-filter-group">
                  <label className="project-gallery-filter-label">Category</label>
                  <div className="project-gallery-chip-row">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleFilterChange("category", category)}
                        data-testid={`button-category-${category}`}
                        className={`project-gallery-chip ${
                          filters.category === category ? "is-active" : ""
                        }`}
                      >
                        {category === "all" ? "All work" : category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="project-gallery-filter-group">
                  <label className="project-gallery-filter-label" htmlFor="gallery-service-filter">
                    Service focus
                  </label>
                  <select
                    id="gallery-service-filter"
                    className="project-gallery-select"
                    value={filters.service}
                    onChange={(e) => handleFilterChange("service", e.target.value)}
                    data-testid="select-service-type"
                  >
                    {serviceTypes.map((service) => (
                      <option key={service} value={service}>
                        {service === "all" ? "All services" : service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="project-gallery-filter-group">
                  <label className="project-gallery-filter-label" htmlFor="gallery-location-filter">
                    County
                  </label>
                  <select
                    id="gallery-location-filter"
                    className="project-gallery-select"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    data-testid="select-location"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location === "all" ? "All counties" : location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(filters.category !== "all" ||
                filters.service !== "all" ||
                filters.location !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                  className="project-gallery-clear"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pe-section section-surface-soft">
        <div className="pe-container-wide">
          {isLoading ? (
            <div className="flex items-center justify-center py-20" data-testid="gallery-loading">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="pe-stack">
              <AnimatedSection direction="up">
                <div className="project-gallery-stage">
                  <div className="project-gallery-stage-map pe-card pe-card-pad">
                    <div className="project-gallery-stage-header">
                      <div className="pe-stack-sm">
                        <span className="eyebrow cool">Location Coverage</span>
                        <h2 className="pe-heading-3">
                          Trace Pacific project work across the Bay Area.
                        </h2>
                      </div>
                      <p className="project-gallery-stage-note">
                        Select a marker or project card to focus the map and preview the
                        project context before opening the full detail page.
                      </p>
                    </div>
                    <ProjectGalleryMap
                      projects={filteredProjects}
                      activeSlug={selectedProject?.slug}
                      onSelectProject={handleSelectProject}
                    />
                  </div>

                  <div className="project-gallery-spotlight pe-card">
                    {selectedProject ? (
                      <>
                        <div className="project-gallery-spotlight-media">
                          <img
                            src={selectedProject.image}
                            alt={selectedProject.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="project-gallery-spotlight-body">
                          <div className="project-gallery-spotlight-top">
                            <span className={`pe-pill pe-pill-dot status-${selectedProject.status}`}>
                              {statusLabel(selectedProject.status)}
                            </span>
                            <span className="pe-pill">{selectedProject.category}</span>
                            <span className="project-gallery-spotlight-date">
                              {selectedProject.date}
                            </span>
                          </div>
                          <h3 className="pe-heading-3">{selectedProject.title}</h3>
                          <div className="project-gallery-spotlight-location">
                            <MapPin className="h-4 w-4 text-cyan-600" />
                            <span>{selectedProject.location}</span>
                          </div>
                          <p className="pe-copy">{selectedProject.popupSummary}</p>
                          <p className="project-gallery-spotlight-proof">
                            {selectedProject.homeProof}
                          </p>
                          <div className="project-gallery-spotlight-services">
                            {selectedProject.services.map((service) => (
                              <span key={service} className="pe-pill">
                                {service}
                              </span>
                            ))}
                          </div>
                          <Link
                            to={`/project/${selectedProject.slug}`}
                            className="pe-link-inline"
                            data-testid={`link-project-${selectedProject.slug}`}
                          >
                            View full project detail
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="project-gallery-empty-shell">
                        <p className="pe-copy">
                          No project is currently selected. Adjust filters to restore the
                          map and project spotlight.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              <div className="project-gallery-grid">
                {filteredProjects.map((project, index) => (
                  <AnimatedSection key={project.id} direction="up" delay={index * 0.04}>
                    <Link
                      to={`/project/${project.slug}`}
                      className="project-gallery-card pe-card"
                      data-testid={`link-project-card-${project.slug}`}
                      onMouseEnter={() => handleSelectProject(project.slug)}
                      onFocus={() => handleSelectProject(project.slug)}
                    >
                      <div className="project-gallery-card-media">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                        />
                        <div className="project-gallery-card-top">
                          <span className={`pe-pill pe-pill-dot status-${project.status}`}>
                            {statusLabel(project.status)}
                          </span>
                          <span className="project-gallery-card-date">{project.date}</span>
                        </div>
                      </div>
                      <div className="project-gallery-card-body">
                        <div className="project-gallery-card-meta">
                          <span className="pe-pill">{project.category}</span>
                          <span className="project-gallery-card-location">
                            <MapPin className="h-4 w-4" />
                            {project.county}
                          </span>
                        </div>
                        <h3
                          className="project-gallery-card-title"
                          data-testid={`text-project-title-${project.id}`}
                        >
                          {project.title}
                        </h3>
                        <p className="project-gallery-card-description">
                          {project.description}
                        </p>
                        <div className="project-gallery-card-services">
                          {project.services.slice(0, 2).map((service) => (
                            <span key={service} className="pe-pill">
                              {service}
                            </span>
                          ))}
                          {project.services.length > 2 && (
                            <span className="pe-pill">+{project.services.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {!isLoading && filteredProjects.length === 0 && (
            <div className="project-gallery-empty" data-testid="gallery-empty">
              <p className="project-gallery-empty-title">
                No projects match the current filter set.
              </p>
              <p className="pe-copy">
                Clear the filters to return to the full Pacific project sample.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                data-testid="button-clear-filters-empty"
                className="pe-button-secondary"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CTASection
        headline="Ready to Start Your Project?"
        body="Let's discuss how Pacific can bring the same level of technical coordination, compliance discipline, and delivery support to your next scope."
        primaryButtonText="Get Your Project Moving"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="gallery-cta"
      />
    </div>
  );
}
