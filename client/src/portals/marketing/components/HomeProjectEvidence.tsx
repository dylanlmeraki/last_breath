import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import ProjectSnippetRotator from "./ProjectSnippetRotator";
import ProjectMiniMap from "./ProjectMiniMap";
import { homeProjectSnippets } from "../data/homeProjectSnippets";
import { projectMarkers } from "../data/projectMarkers";

export default function HomeProjectEvidence() {
  const [activeId, setActiveId] = useState<string>(homeProjectSnippets[0]?.id ?? "");
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  const activeItem = useMemo(
    () =>
      homeProjectSnippets.find((item) => item.id === activeId) ??
      homeProjectSnippets[0],
    [activeId],
  );

  const activeIndex = useMemo(
    () => homeProjectSnippets.findIndex((item) => item.id === activeId),
    [activeId],
  );

  const setActiveProject = (id: string, source: "auto" | "user" = "user") => {
    if (source === "user") {
      setIsAutoPaused(true);
    }
    setActiveId(id);
  };

  const stepProject = (direction: -1 | 1) => {
    if (!homeProjectSnippets.length) return;

    const currentIndex = activeIndex >= 0 ? activeIndex : 0;
    const nextIndex =
      (currentIndex + direction + homeProjectSnippets.length) %
      homeProjectSnippets.length;

    setActiveProject(homeProjectSnippets[nextIndex].id);
  };

  useEffect(() => {
    if (!activeItem || homeProjectSnippets.length <= 1 || isAutoPaused) return;

    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const index = homeProjectSnippets.findIndex((item) => item.id === current);
        const next = (index + 1) % homeProjectSnippets.length;
        return homeProjectSnippets[next].id;
      });
    }, 6500);

    return () => window.clearInterval(timer);
  }, [activeItem, isAutoPaused]);

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
          <div className="project-evidence-panel">
            <div className="project-evidence-toolbar">
              <div className="project-evidence-status">
                <span className="project-evidence-kicker">Interactive project proof</span>
                <span className="project-evidence-note">
                  {isAutoPaused
                    ? "Rotation paused after your interaction"
                    : "Auto-rotating through featured case-study snapshots"}
                </span>
              </div>

              <div className="project-evidence-controls" aria-label="Project evidence controls">
                <button
                  type="button"
                  className="project-evidence-control"
                  onClick={() => stepProject(-1)}
                  aria-label="Show previous project"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  className="project-evidence-control"
                  onClick={() => stepProject(1)}
                  aria-label="Show next project"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <ProjectSnippetRotator
              items={homeProjectSnippets}
              activeId={activeId}
              onActivate={setActiveProject}
            />
          </div>

          <ProjectMiniMap
            markers={projectMarkers}
            activeMarkerId={activeItem.markerId}
            onActivate={(markerId) => {
              const match = homeProjectSnippets.find(
                (item) => item.markerId === markerId,
              );
              if (match) setActiveProject(match.id);
            }}
          />
        </div>

        <div className="project-evidence-cta-row">
          <p className="project-evidence-cta-copy">
            Tap a card or map marker to explore real project proof tied to field
            conditions, permitting context, and delivery outcomes.
          </p>
          <Link to={createPageUrl("ProjectGallery")} className="pe-link-inline">
            View all project experience
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
