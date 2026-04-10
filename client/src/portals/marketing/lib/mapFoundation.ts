import L from "leaflet";
import type { MarketingProjectStatus } from "@shared/marketing-content";

type MarkerProfile = "home" | "gallery";

interface CreateMarketingMapOptions {
  zoomControl?: boolean;
  zoomPosition?: L.ControlPosition;
  scrollWheelZoom?: boolean;
}

export function createMarketingMap(
  container: HTMLElement,
  options: CreateMarketingMapOptions = {},
): L.Map {
  const {
    zoomControl = true,
    zoomPosition = "bottomright",
    scrollWheelZoom = false,
  } = options;

  const map = L.map(container, {
    zoomControl: false,
    scrollWheelZoom,
    attributionControl: false,
    preferCanvas: true,
  });

  if (zoomControl) {
    L.control.zoom({ position: zoomPosition }).addTo(map);
  }

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    detectRetina: true,
    className: "pe-map-tiles",
  }).addTo(map);

  return map;
}

export function markerStyle(
  status: MarketingProjectStatus,
  isActive: boolean,
  profile: MarkerProfile,
): L.CircleMarkerOptions {
  const palette =
    status === "completed"
      ? { fill: "#13c5a5", stroke: "#bff6ec" }
      : status === "ongoing"
        ? { fill: "#f5751f", stroke: "#ffd8b5" }
        : { fill: "#2253da", stroke: "#cedbff" };

  if (profile === "home") {
    return {
      color: palette.stroke,
      fillColor: palette.fill,
      fillOpacity: isActive ? 1 : 0.88,
      opacity: 1,
      radius: isActive ? 7.5 : 5.8,
      weight: isActive ? 2.5 : 2,
    };
  }

  return {
    color: palette.stroke,
    fillColor: palette.fill,
    fillOpacity: isActive ? 1 : 0.9,
    opacity: 1,
    radius: isActive ? 9.5 : 7,
    weight: isActive ? 3.5 : 3,
  };
}

export function fitMapToMarkers(
  map: L.Map,
  markers: readonly { lat: number; lng: number }[],
  padding = 0.22,
) {
  if (!markers.length) return;

  const bounds = L.latLngBounds(
    markers.map((marker) => [marker.lat, marker.lng] as L.LatLngTuple),
  );
  map.fitBounds(bounds.pad(padding), { animate: false });
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
