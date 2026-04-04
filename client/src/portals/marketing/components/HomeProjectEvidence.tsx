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

  const visibleItems = useMemo(() => {
    if (!homeProjectSnippets.length) return [];

    const shortlistLength = Math.min(3, homeProjectSnippets.length);
    const startIndex = activeIndex >= 0 ? activeIndex : 0;

    return Array.from({ length: shortlistLength }, (_, offset) => {
      const index = (startIndex + offset) % homeProjectSnippets.length;
      return homeProjectSnippets[index];
    });
  }, [activeIndex]);

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
    <section className="pe-section pe-section-tight section-surface-solid">
      <div className="pe-container-wide pe-stack">
        <div className="pe-stack-sm" style={{ maxWidth: "56rem" }}>
          <span className="eyebrow cool">Project Evidence</span>
          <h2 className="pe-heading-2">
            Representative Bay Area project records tied to real delivery conditions.
          </h2>
          <p className="pe-lead">
            Infrastructure, institutional, utility, and aviation work surfaced
            through location, responsibility, and field context so visitors can
            read Pacific Engineering through the work itself rather than
            through generic service language.
          </p>
        </div>

        <div className="project-evidence">
          <div className="project-evidence-panel">
            <div className="project-evidence-toolbar">
              <div className="project-evidence-status">
                <span className="project-evidence-kicker">Regional project shortlist</span>
                <span className="project-evidence-note">
                  {isAutoPaused
                    ? "Selection held on the project record you chose"
                    : "Rotating through representative Bay Area project records"}
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
              items={visibleItems}
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
            Review the shortlist, confirm the location on the map, and then open
            the full project record for the broader delivery story.
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
