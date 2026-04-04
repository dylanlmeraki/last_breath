import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  marketingFeaturedProjectSlugs,
  marketingGalleryProjects,
} from "@shared/marketing-content";

function statusLabel(status: (typeof marketingGalleryProjects)[number]["status"]) {
  switch (status) {
    case "completed":
      return "Completed";
    case "ongoing":
      return "Ongoing";
    default:
      return "Featured";
  }
}

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
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="project-card-media-top">
              <span className="pe-pill">{project.category}</span>
              <span className={`pe-pill pe-pill-dot status-${project.status}`}>
                {statusLabel(project.status)}
              </span>
            </div>
          </div>
          <div className="project-card-body">
            <p className="project-card-kicker">{project.county} County · {project.date}</p>
            <h3 className="project-card-title">{project.title}</h3>
            <p className="project-card-proof">{project.homeProof}</p>
            <dl className="project-card-facts">
              <div className="project-card-fact">
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
              <div className="project-card-fact">
                <dt>Responsibility</dt>
                <dd>{project.homeMeta}</dd>
              </div>
            </dl>
            <span className="project-card-link">
              Open project record
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
