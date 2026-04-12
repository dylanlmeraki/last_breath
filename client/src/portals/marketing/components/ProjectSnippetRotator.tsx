import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type ProjectSnippet = {
  id: string;
  slug: string;
  category: string;
  title: string;
  location: string;
  image: string;
  meta: string;
  proof: string;
  markerId: string;
  tone: "current" | "completed" | "ongoing";
};

type Props = {
  items: readonly ProjectSnippet[];
  activeId: string;
  onActivate: (id: string) => void;
  density?: "default" | "compact";
};

export default function ProjectSnippetRotator({
  items,
  activeId,
  onActivate,
  density = "default",
}: Props) {
  return (
    <div className={`project-rotator ${density === "compact" ? "is-compact" : ""}`}>
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <article
            key={item.id}
            className={`project-snippet ${density === "compact" ? "is-compact" : ""} ${isActive ? "is-active" : ""}`}
          >
            <button
              type="button"
              className="project-snippet-surface"
              aria-pressed={isActive}
              onClick={() => onActivate(item.id)}
              onMouseEnter={() => onActivate(item.id)}
              onFocus={() => onActivate(item.id)}
            >
              <div className="project-snippet-top">
                <span
                  className={`project-snippet-status ${
                    item.tone === "completed"
                      ? "status-completed"
                      : item.tone === "ongoing"
                        ? "status-ongoing"
                        : "status-active"
                  }`}
                >
                  {item.category}
                </span>
                <div className="project-snippet-location">
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="project-snippet-layout">
                <div className="project-snippet-media">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="project-snippet-body">
                  <h3 className="project-snippet-title">{item.title}</h3>
                  <p className="project-snippet-meta-label">Responsibility</p>
                  <p className="project-snippet-meta">{item.meta}</p>
                  <p className="project-snippet-proof-label">Scope</p>
                  <p className="project-snippet-proof">{item.proof}</p>
                </div>
              </div>
            </button>

            <div className="project-snippet-footer">
              <Link to={`/project/${item.slug}`} className="pe-link-inline">
                Open full project record
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
