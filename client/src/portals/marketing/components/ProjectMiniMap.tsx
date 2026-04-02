import { useMemo } from "react";

type Marker = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  tone: "current" | "completed" | "ongoing";
  slug?: string;
};

type Props = {
  markers: readonly Marker[];
  activeMarkerId: string;
  onActivate: (id: string) => void;
};

export default function ProjectMiniMap({
  markers,
  activeMarkerId,
  onActivate,
}: Props) {
  const positionedMarkers = useMemo(() => {
    if (!markers.length) {
      return [];
    }

    const latitudes = markers.map((marker) => marker.lat);
    const longitudes = markers.map((marker) => marker.lng);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    const latRange = Math.max(maxLat - minLat, 0.1);
    const lngRange = Math.max(maxLng - minLng, 0.1);

    return markers.map((marker) => {
      const left = 20 + ((marker.lng - minLng) / lngRange) * 56;
      const top = 18 + ((maxLat - marker.lat) / latRange) * 58;

      return {
        ...marker,
        left,
        top,
      };
    });
  }, [markers]);

  const routePath = useMemo(() => {
    if (positionedMarkers.length < 2) {
      return "";
    }

    return positionedMarkers
      .map((marker) => `${marker.left},${marker.top}`)
      .join(" ");
  }, [positionedMarkers]);

  return (
    <div className="pe-card project-map-card">
      <div className="project-map-shell">
        <div className="project-map-grid blueprint-grid" />
        <svg
          className="project-map-overlay"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {routePath ? (
            <polyline
              points={routePath}
              fill="none"
              stroke="rgba(13, 167, 231, 0.35)"
              strokeWidth="0.7"
              strokeDasharray="2.5 2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>

        <div className="project-map-region-label region-north">North Bay</div>
        <div className="project-map-region-label region-core">San Francisco</div>
        <div className="project-map-region-label region-south">Peninsula</div>

        {positionedMarkers.map((marker) => {
          const toneClass =
            marker.tone === "completed"
              ? "completed"
              : marker.tone === "ongoing"
                ? "ongoing"
                : "current";

          return (
            <button
              key={marker.id}
              type="button"
              aria-label={marker.label}
              aria-pressed={activeMarkerId === marker.id}
              onClick={() => onActivate(marker.id)}
              onMouseEnter={() => onActivate(marker.id)}
              onFocus={() => onActivate(marker.id)}
              className={`project-map-marker ${toneClass} ${
                activeMarkerId === marker.id ? "active" : ""
              }`}
              style={{ left: `${marker.left}%`, top: `${marker.top}%` }}
            />
          );
        })}

        <div className="project-map-legend">
          <div className="project-map-legend-items">
            <span className="project-map-legend-item status-active">Featured</span>
            <span className="project-map-legend-item status-completed">Completed</span>
            <span className="project-map-legend-item status-ongoing">Ongoing</span>
          </div>
          <div className="project-map-caption">
            Selected work across Northern California
          </div>
        </div>
      </div>
    </div>
  );
}
