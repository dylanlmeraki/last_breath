import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createMarketingMap, escapeHtml, fitMapToMarkers, markerStyle } from "../lib/mapFoundation";

type EvidenceMarker = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  tone: "current" | "completed" | "ongoing";
  slug?: string;
  location?: string;
  category?: string;
};

type Props = {
  markers: readonly EvidenceMarker[];
  activeMarkerId: string;
  onActivate: (id: string) => void;
};

function buildPopupMarkup(marker: EvidenceMarker): string {
  const location = marker.location ? escapeHtml(marker.location) : "Bay Area, CA";
  const category = marker.category ? escapeHtml(marker.category) : "Project Record";
  const title = escapeHtml(marker.label);
  const projectLink = marker.slug
    ? `<a class="home-evidence-popup-link" href="/project/${marker.slug}">Open project record</a>`
    : "";

  return `
    <article class="home-evidence-popup">
      <div class="home-evidence-popup-eyebrow">${category}</div>
      <h3 class="home-evidence-popup-title">${title}</h3>
      <p class="home-evidence-popup-location">${location}</p>
      ${projectLink}
    </article>
  `;
}

export default function HomeEvidenceMap({
  markers,
  activeMarkerId,
  onActivate,
}: Props) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markerRefs = useRef<Map<string, L.CircleMarker>>(new Map());

  const validMarkers = useMemo(
    () =>
      markers.filter(
        (marker) =>
          Number.isFinite(marker.lat) && Number.isFinite(marker.lng),
      ),
    [markers],
  );

  const markerById = useMemo(
    () => new Map(validMarkers.map((marker) => [marker.id, marker])),
    [validMarkers],
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
    if (!map) return;

    layerRef.current?.remove();
    markerRefs.current.clear();

    const markerLayer = L.layerGroup();

    validMarkers.forEach((marker) => {
      const mapMarker = L.circleMarker(
        [marker.lat, marker.lng],
        markerStyle(marker.tone, marker.id === activeMarkerId, "home"),
      );

      mapMarker
        .bindPopup(buildPopupMarkup(marker), {
          className: "home-evidence-popup-shell",
          closeButton: false,
          maxWidth: 250,
          offset: [0, -8],
        })
        .on("click", () => onActivate(marker.id))
        .on("mouseover", () => mapMarker.openPopup());

      mapMarker.addTo(markerLayer);
      markerRefs.current.set(marker.id, mapMarker);
    });

    markerLayer.addTo(map);
    layerRef.current = markerLayer;

    fitMapToMarkers(map, validMarkers, 0.16);
  }, [validMarkers, onActivate]);

  useEffect(() => {
    markerRefs.current.forEach((mapMarker, markerId) => {
      const marker = markerById.get(markerId);
      if (!marker) return;

      mapMarker.setStyle(markerStyle(marker.tone, markerId === activeMarkerId, "home"));
    });

    if (!activeMarkerId) return;

    const activeMarker = markerRefs.current.get(activeMarkerId);
    const map = mapRef.current;
    if (!activeMarker || !map) return;

    const markerLatLng = activeMarker.getLatLng();
    if (!Number.isFinite(markerLatLng.lat) || !Number.isFinite(markerLatLng.lng)) {
      return;
    }

    const container = map.getContainer();
    const hasRenderableSize =
      container.clientWidth > 0 && container.clientHeight > 0;

    if (hasRenderableSize) {
      const currentZoom = map.getZoom();
      const targetZoom = Number.isFinite(currentZoom) ? Math.max(currentZoom, 9) : 9;
      map.setView(markerLatLng, targetZoom, { animate: false });
    }

    activeMarker.openPopup();
  }, [activeMarkerId, markerById]);

  return (
    <div className="home-evidence-map-shell pe-card">
      <div className="home-evidence-map-header">
        <span className="home-evidence-map-kicker">Bay Area map view</span>
        <span className="home-evidence-map-note">
          Select a marker to sync the active project record.
        </span>
      </div>
      <div ref={mapElementRef} className="home-evidence-map pe-map-toned" data-testid="home-evidence-map" />
    </div>
  );
}
