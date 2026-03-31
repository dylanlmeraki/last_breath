type Marker = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  tone: "current" | "completed" | "ongoing";
};

type Props = {
  markers: readonly Marker[];
  activeMarkerId: string;
  onActivate: (id: string) => void;
};

const positionMap: Record<string, { left: string; top: string }> = {
  "port-sf": { left: "31%", top: "48%" },
  "caltrans-american-canyon": { left: "34%", top: "30%" },
  sfusd: { left: "32%", top: "54%" },
  sfpuc: { left: "40%", top: "69%" },
  sfo: { left: "31%", top: "59%" },
  "medical-examiner": { left: "33%", top: "52%" },
};

export default function ProjectMiniMap({
  markers,
  activeMarkerId,
  onActivate,
}: Props) {
  return (
    <div className="pe-card project-map-card">
      <div className="project-map-shell">
        <div className="project-map-grid blueprint-grid" />

        {markers.map((marker) => {
          const pos = positionMap[marker.id] ?? { left: "50%", top: "50%" };
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
              onMouseEnter={() => onActivate(marker.id)}
              onFocus={() => onActivate(marker.id)}
              className={`project-map-marker ${toneClass} ${
                activeMarkerId === marker.id ? "active animate-pulse-cyan" : ""
              }`}
              style={{ left: pos.left, top: pos.top }}
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
