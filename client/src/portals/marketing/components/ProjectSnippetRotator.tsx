import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type ProjectSnippet = {
  id: string;
  slug: string;
  category: string;
  title: string;
  location: string;
  meta: string;
  proof: string;
  markerId: string;
  tone: "current" | "completed" | "ongoing";
};

type Props = {
  items: readonly ProjectSnippet[];
  activeId: string;
  onActivate: (id: string) => void;
};

export default function ProjectSnippetRotator({
  items,
  activeId,
  onActivate,
}: Props) {
  return (
    <div className="project-rotator">
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <article
            key={item.id}
            className={`project-snippet ${isActive ? "is-active" : ""}`}
            onMouseEnter={() => onActivate(item.id)}
            onFocus={() => onActivate(item.id)}
          >
            <div className="project-snippet-top">
              <span
                className={`pe-pill ${
                  item.tone === "completed"
                    ? "status-completed"
                    : item.tone === "ongoing"
                      ? "status-ongoing"
                      : "status-active"
                }`}
              >
                {item.category}
              </span>

              <span className="pe-pill">
                <MapPin size={14} />
                {item.location}
              </span>
            </div>

            <h3 className="project-snippet-title">{item.title}</h3>
            <p className="project-snippet-meta">{item.meta}</p>
            <p className="project-snippet-proof">{item.proof}</p>

            <div className="project-snippet-footer">
              <Link to={`/project/${item.slug}`} className="pe-link-inline">
                View case study
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
