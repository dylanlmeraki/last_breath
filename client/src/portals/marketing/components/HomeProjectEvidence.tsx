import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import ProjectSnippetRotator from "./ProjectSnippetRotator";
import ProjectMiniMap from "./ProjectMiniMap";
import { homeProjectSnippets } from "../data/homeProjectSnippets";
import { projectMarkers } from "../data/projectMarkers";

export default function HomeProjectEvidence() {
  const [activeId, setActiveId] = useState(homeProjectSnippets[0]?.id ?? "");

  const activeItem = useMemo(
    () =>
      homeProjectSnippets.find((item) => item.id === activeId) ??
      homeProjectSnippets[0],
    [activeId],
  );

  useEffect(() => {
    if (!activeItem || homeProjectSnippets.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const index = homeProjectSnippets.findIndex((item) => item.id === current);
        const next = (index + 1) % homeProjectSnippets.length;
        return homeProjectSnippets[next].id;
      });
    }, 6500);

    return () => window.clearInterval(timer);
  }, [activeItem]);

  return (
    <section className="pe-section section-surface-soft">
      <div className="pe-container-wide pe-stack">
        <div className="pe-stack-sm" style={{ maxWidth: "56rem" }}>
          <span className="eyebrow">Project Experience</span>
          <h2 className="pe-heading-2">Selected Work Across Northern California</h2>
          <p className="pe-lead">
            Representative infrastructure, institutional, and utility work showing
            how Pacific supports constructability, compliance, and coordinated
            delivery.
          </p>
        </div>

        <div className="project-evidence">
          <ProjectSnippetRotator
            items={homeProjectSnippets}
            activeId={activeId}
            onActivate={setActiveId}
          />
          <ProjectMiniMap
            markers={projectMarkers}
            activeMarkerId={activeItem.markerId}
            onActivate={(markerId) => {
              const match = homeProjectSnippets.find(
                (item) => item.markerId === markerId,
              );
              if (match) setActiveId(match.id);
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to={createPageUrl("ProjectGallery")} className="pe-link-inline">
            View all project experience
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
