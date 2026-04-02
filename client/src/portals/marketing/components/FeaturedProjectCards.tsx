import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import {
  marketingFeaturedProjectSlugs,
  marketingGalleryProjects,
} from "@shared/marketing-content";

const featuredProjects = marketingFeaturedProjectSlugs
  .map((slug) =>
    marketingGalleryProjects.find((project) => project.slug === slug),
  )
  .filter((project): project is NonNullable<typeof project> => Boolean(project));

export default function FeaturedProjectCards() {
  return (
    <div className="featured-work-grid">
      {featuredProjects.map((project) => (
        <Link
          key={project.id}
          to={`/project/${project.slug}`}
          className="pe-card project-card"
          data-testid={`featured-project-${project.slug}`}
        >
          <div className="project-card-media">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
          <div className="project-card-body">
            <div className="flex items-center justify-between gap-3">
              <span className="pe-pill">{project.category}</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {project.date}
              </span>
            </div>
            <h3 className="project-card-title">{project.title}</h3>
            <div className="project-card-location inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-600" />
              <span>{project.location}</span>
            </div>
            <p className="pe-copy text-sm">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.services.slice(0, 2).map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {service}
                </span>
              ))}
            </div>
            <span className="pe-link-inline text-sm">
              View project
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
