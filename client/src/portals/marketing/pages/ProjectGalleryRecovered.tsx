import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Filter, Loader2, MapPin, X } from "lucide-react";
import type { MarketingGalleryProject } from "@shared/marketing-content";
import { createPageUrl } from "../lib/utils";
import { fetchMarketingJson } from "../lib/stubApi";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
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

  const filteredCountyCount = useMemo(
    () => new Set(filteredProjects.map((project) => project.county)).size,
    [filteredProjects],
  );

  const filteredServiceCount = useMemo(
    () => new Set(filteredProjects.flatMap((project) => project.services)).size,
    [filteredProjects],
  );

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

      <section className="pe-section pe-section-tight section-surface-solid">
        <div className="pe-container-wide">
          <AnimatedSection direction="up">
            <div className="project-gallery-intro">
              <div className="project-gallery-intro-copy pe-stack-sm">
                <span className="eyebrow">Project Experience</span>
                <h1 className="pe-heading-2" data-testid="text-gallery-title">
                  Relevant Work
                </h1>
                <p className="pe-lead">
                  Representative Pacific Engineering project work across Bay
                  Area infrastructure, institutional, aviation, utility, and
                  civic scopes. Review the map, shortlist, and project records
                  by county, service, and scope.
                </p>
              </div>

              <div className="project-gallery-intro-aside">
                <div className="project-gallery-intro-stats">
                  <div className="project-gallery-intro-stat">
                    <span className="project-gallery-intro-stat-value">
                      {filteredProjects.length || projects.length || 6}
                    </span>
                    <span className="project-gallery-intro-stat-label">Representative projects</span>
                  </div>
                  <div className="project-gallery-intro-stat">
                    <span className="project-gallery-intro-stat-value">
                      {filteredCountyCount || new Set(projects.map((project) => project.county)).size || 3}
                    </span>
                    <span className="project-gallery-intro-stat-label">County coverage</span>
                  </div>
                  <div className="project-gallery-intro-stat">
                    <span className="project-gallery-intro-stat-value">
                      {filteredServiceCount || new Set(projects.flatMap((project) => project.services)).size || 10}
                    </span>
                    <span className="project-gallery-intro-stat-label">Service threads</span>
                  </div>
                </div>

                <div className="project-gallery-intro-actions">
                  <Link to={createPageUrl("Contact")} className="pe-button-ghost">
                    Discuss Project Fit
                  </Link>
                  <Link to={createPageUrl("Consultation")} className="pe-link-inline">
                    Review Project Scope
                    <ArrowRight className="h-4 w-4" />
                  </Link>
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
                  <h2 className="pe-heading-3">Review project experience by scope, service, and county.</h2>
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
                        <span className="eyebrow cool">County Coverage</span>
                        <h2 className="pe-heading-3">
                          Trace Pacific Engineering project work across the Bay Area.
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

                  <aside className="project-gallery-sidebar pe-card">
                    {selectedProject ? (
                      <>
                        <div className="project-gallery-sidebar-summary">
                          <div className="project-gallery-sidebar-summary-top">
                            <span className={`pe-pill pe-pill-dot status-${selectedProject.status}`}>
                              {statusLabel(selectedProject.status)}
                            </span>
                            <span className="pe-pill">{selectedProject.category}</span>
                            <span className="project-gallery-sidebar-summary-date">
                              {selectedProject.date}
                            </span>
                          </div>
                          <h3 className="pe-heading-3">{selectedProject.title}</h3>
                          <div className="project-gallery-sidebar-summary-location">
                            <MapPin className="h-4 w-4 text-cyan-600" />
                            <span>{selectedProject.location}</span>
                          </div>
                          <p className="project-gallery-sidebar-summary-copy">
                            {selectedProject.popupSummary}
                          </p>
                          <p className="project-gallery-sidebar-summary-proof">
                            {selectedProject.homeProof}
                          </p>
                          <Link
                            to={`/project/${selectedProject.slug}`}
                            className="pe-link-inline"
                            data-testid={`link-project-${selectedProject.slug}`}
                          >
                            Open project record
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>

                        <div className="project-gallery-sidebar-list" data-testid="gallery-shortlist">
                          {filteredProjects.map((project) => {
                            const isSelected = project.slug === selectedProject.slug;

                            return (
                              <button
                                key={project.slug}
                                type="button"
                                className={`project-gallery-sidebar-item ${isSelected ? "is-active" : ""}`}
                                onClick={() => handleSelectProject(project.slug)}
                                data-testid={`button-project-shortlist-${project.slug}`}
                              >
                                <div className="project-gallery-sidebar-item-top">
                                  <span className={`pe-pill pe-pill-dot status-${project.status}`}>
                                    {statusLabel(project.status)}
                                  </span>
                                  <span className="project-gallery-sidebar-item-county">
                                    {project.county}
                                  </span>
                                </div>
                                <h4 className="project-gallery-sidebar-item-title">
                                  {project.title}
                                </h4>
                                <p className="project-gallery-sidebar-item-meta">
                                  {project.homeMeta}
                                </p>
                              </button>
                            );
                          })}
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
                  </aside>
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
                          <span className="pe-pill">{project.category}</span>
                          <span className={`pe-pill pe-pill-dot status-${project.status}`}>
                            {statusLabel(project.status)}
                          </span>
                        </div>
                      </div>
                      <div className="project-gallery-card-body">
                        <div className="project-gallery-card-meta">
                          <span className="project-gallery-card-location">
                            <MapPin className="h-4 w-4" />
                            {project.location}
                          </span>
                          <span className="project-gallery-card-date">{project.date}</span>
                        </div>
                        <p className="project-gallery-card-role">{project.homeMeta}</p>
                        <h3
                          className="project-gallery-card-title"
                          data-testid={`text-project-title-${project.id}`}
                        >
                          {project.title}
                        </h3>
                        <p className="project-gallery-card-description">
                          {project.homeProof}
                        </p>
                        <span className="project-gallery-card-link">
                          Open project record
                          <ArrowRight className="h-4 w-4" />
                        </span>
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
                Clear the filters to return to the full Pacific Engineering project sample.
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
        body="Let's discuss how Pacific Engineering can bring the same level of technical coordination, compliance discipline, and delivery support to your next scope."
        primaryButtonText="Get Your Project Moving"
        primaryButtonLink={createPageUrl("Consultation")}
        testIdPrefix="gallery-cta"
      />
    </div>
  );
}
