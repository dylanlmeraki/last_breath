import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MarketingGalleryProject } from "@shared/marketing-content";
import { createMarketingMap, escapeHtml, fitMapToMarkers, markerStyle } from "../lib/mapFoundation";

type Props = {
  projects: MarketingGalleryProject[];
  activeSlug?: string;
  onSelectProject: (slug: string) => void;
};

function buildPopupMarkup(project: MarketingGalleryProject): string {
  return `
    <article class="project-gallery-popup-card">
      <img class="project-gallery-popup-image" src="${project.image}" alt="${escapeHtml(project.title)}" />
      <div class="project-gallery-popup-body">
        <div class="project-gallery-popup-eyebrow">${escapeHtml(project.category)}</div>
        <h3 class="project-gallery-popup-title">${escapeHtml(project.title)}</h3>
        <p class="project-gallery-popup-location">${escapeHtml(project.location)}</p>
        <p class="project-gallery-popup-summary">${escapeHtml(project.popupSummary)}</p>
        <a class="project-gallery-popup-link" href="/project/${project.slug}">View project</a>
      </div>
    </article>
  `;
}

export default function ProjectGalleryMap({
  projects,
  activeSlug,
  onSelectProject,
}: Props) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markerRefs = useRef<Map<string, L.CircleMarker>>(new Map());

  const projectBySlug = useMemo(
    () => new Map(projects.map((project) => [project.slug, project])),
    [projects],
  );

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return;
    }

    const map = createMarketingMap(mapElementRef.current, {
      zoomControl: true,
      zoomPosition: "bottomright",
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    return () => {
      markerRefs.current.clear();
      layerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    layerRef.current?.remove();
    markerRefs.current.clear();

    const markerLayer = L.layerGroup();

    projects.forEach((project) => {
      const marker = L.circleMarker(
        [project.coordinates.lat, project.coordinates.lng],
        markerStyle(project.status, project.slug === activeSlug, "gallery"),
      );

      marker
        .bindPopup(buildPopupMarkup(project), {
          className: "project-gallery-popup",
          closeButton: false,
          maxWidth: 280,
          offset: [0, -10],
        })
        .on("click", () => {
          onSelectProject(project.slug);
        })
        .on("mouseover", () => {
          marker.openPopup();
        });

      marker.addTo(markerLayer);
      markerRefs.current.set(project.slug, marker);
    });

    markerLayer.addTo(map);
    layerRef.current = markerLayer;

    fitMapToMarkers(
      map,
      projects.map((project) => ({
        lat: project.coordinates.lat,
        lng: project.coordinates.lng,
      })),
      0.24,
    );
  }, [projects, activeSlug, onSelectProject]);

  useEffect(() => {
    markerRefs.current.forEach((marker, slug) => {
      const project = projectBySlug.get(slug);
      if (!project) {
        return;
      }

      marker.setStyle(markerStyle(project.status, slug === activeSlug, "gallery"));
    });

    if (!activeSlug) {
      return;
    }

    const activeMarker = markerRefs.current.get(activeSlug);
    const map = mapRef.current;
    if (!activeMarker || !map) {
      return;
    }

    map.flyTo(activeMarker.getLatLng(), Math.max(map.getZoom(), 9), {
      animate: true,
      duration: 0.75,
    });
    activeMarker.openPopup();
  }, [activeSlug, projectBySlug]);

  return (
    <div className="project-gallery-map-shell pe-map-toned">
      <div ref={mapElementRef} className="project-gallery-map" data-testid="project-gallery-map" />
      <div className="project-gallery-map-overlay" aria-hidden="true" />
    </div>
  );
}
