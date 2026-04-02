export type ProjectVisualVariant = "poster" | "blueprint" | "spotlight";

export type ProjectVisualSeed = {
  title: string;
  slug: string;
  category: string;
  location: string;
  county: string;
  date: string;
  services: string[];
  popupSummary: string;
  status: "current" | "ongoing" | "completed";
  visualPrompt: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type Theme = {
  ink: string;
  panel: string;
  grid: string;
  accent: string;
  accentSoft: string;
  accentWarm: string;
  glow: string;
};

const DEFAULT_THEME: Theme = {
  ink: "#101729",
  panel: "#17213a",
  grid: "#1f3556",
  accent: "#2253da",
  accentSoft: "#0da7e7",
  accentWarm: "#f5751f",
  glow: "rgba(13,167,231,0.24)",
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(value: string, maxChars: number, maxLines: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }
    current = word;

    if (lines.length === maxLines) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    const last = lines[maxLines - 1] ?? "";
    lines[maxLines - 1] = `${last.replace(/[. ]+$/, "")}...`;
  }

  return lines;
}

function themeForCategory(category: string): Theme {
  const normalized = category.toLowerCase();

  if (normalized.includes("stormwater") || normalized.includes("civil")) {
    return {
      ...DEFAULT_THEME,
      accent: "#0da7e7",
      accentSoft: "#13c5a5",
      accentWarm: "#ffd08a",
      glow: "rgba(19,197,165,0.22)",
    };
  }

  if (normalized.includes("aviation") || normalized.includes("infrastructure")) {
    return {
      ...DEFAULT_THEME,
      accent: "#2f8bff",
      accentSoft: "#0da7e7",
      accentWarm: "#f5751f",
      glow: "rgba(47,139,255,0.22)",
    };
  }

  if (normalized.includes("utilities")) {
    return {
      ...DEFAULT_THEME,
      accent: "#13c5a5",
      accentSoft: "#0da7e7",
      accentWarm: "#f5751f",
      glow: "rgba(19,197,165,0.22)",
    };
  }

  if (normalized.includes("institutional") || normalized.includes("civic")) {
    return {
      ...DEFAULT_THEME,
      accent: "#2253da",
      accentSoft: "#387cf3",
      accentWarm: "#ff9a3d",
      glow: "rgba(34,83,218,0.2)",
    };
  }

  return DEFAULT_THEME;
}

function statusLabel(status: ProjectVisualSeed["status"]): string {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "completed":
      return "Completed";
    default:
      return "Featured";
  }
}

function buildSvg(seed: ProjectVisualSeed, variant: ProjectVisualVariant): string {
  const theme = themeForCategory(seed.category);
  const titleLines = wrapText(seed.title, variant === "spotlight" ? 26 : 30, 3);
  const summaryLines = wrapText(
    seed.popupSummary,
    variant === "blueprint" ? 46 : 54,
    variant === "poster" ? 3 : 4,
  );
  const serviceLine = escapeXml(seed.services.slice(0, 3).join(" / "));
  const promptLine = escapeXml(seed.visualPrompt);
  const coordLine = `${seed.coordinates.lat.toFixed(3)} / ${seed.coordinates.lng.toFixed(3)}`;
  const dateLine = escapeXml(`${seed.location} | ${seed.date}`);
  const categoryLine = escapeXml(seed.category);
  const slugLine = escapeXml(seed.slug.replace(/-/g, " "));
  const status = escapeXml(statusLabel(seed.status));
  const upperLocation = escapeXml(seed.county.toUpperCase());
  const layoutShift = variant === "poster" ? 0 : variant === "blueprint" ? 30 : -20;
  const detailPanelY = variant === "spotlight" ? 590 : 618;

  const titleText = titleLines
    .map(
      (line, index) =>
        `<tspan x="116" dy="${index === 0 ? 0 : 74}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const summaryText = summaryLines
    .map(
      (line, index) =>
        `<tspan x="116" dy="${index === 0 ? 0 : 30}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const blueprintDetail =
    variant === "blueprint"
      ? `<path d="M1055 214 L1412 214 L1412 585 L1128 585 L1128 690 L1500 690" fill="none" stroke="${theme.accentSoft}" stroke-width="2" stroke-dasharray="12 12" opacity="0.55"/>
         <circle cx="1190" cy="302" r="78" fill="none" stroke="${theme.accentSoft}" stroke-width="2" opacity="0.55"/>
         <circle cx="1190" cy="302" r="18" fill="${theme.accentWarm}" opacity="0.9"/>
         <rect x="1260" y="298" width="132" height="10" rx="5" fill="${theme.accentSoft}" opacity="0.65"/>
         <rect x="1260" y="324" width="96" height="10" rx="5" fill="${theme.accentSoft}" opacity="0.35"/>`
      : `<path d="M1030 ${246 + layoutShift} C1170 176, 1310 176, 1470 260" fill="none" stroke="${theme.accentSoft}" stroke-width="3" stroke-dasharray="14 12" opacity="0.45"/>
         <path d="M1030 ${452 + layoutShift} C1170 522, 1324 540, 1490 470" fill="none" stroke="${theme.accent}" stroke-width="3" stroke-dasharray="14 12" opacity="0.4"/>
         <circle cx="1236" cy="${352 + layoutShift}" r="108" fill="none" stroke="${theme.accentSoft}" stroke-width="2" opacity="0.32"/>
         <circle cx="1236" cy="${352 + layoutShift}" r="44" fill="none" stroke="${theme.accentWarm}" stroke-width="3" opacity="0.5"/>
         <circle cx="1236" cy="${352 + layoutShift}" r="12" fill="${theme.accentWarm}"/>`;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-label="${escapeXml(seed.title)} generated project visual">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.ink}"/>
        <stop offset="55%" stop-color="${theme.panel}"/>
        <stop offset="100%" stop-color="#243252"/>
      </linearGradient>
      <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${theme.accent}"/>
        <stop offset="55%" stop-color="${theme.accentSoft}"/>
        <stop offset="100%" stop-color="${theme.accentWarm}"/>
      </linearGradient>
      <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
        <path d="M 52 0 L 0 0 0 52" fill="none" stroke="${theme.grid}" stroke-width="1"/>
      </pattern>
      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="36" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="1600" height="1000" fill="url(#bg)"/>
    <rect width="1600" height="1000" fill="url(#grid)" opacity="0.28"/>
    <circle cx="1360" cy="150" r="220" fill="${theme.glow}" filter="url(#glow)"/>
    <circle cx="132" cy="898" r="180" fill="rgba(245,117,31,0.08)" filter="url(#glow)"/>
    <rect x="76" y="76" width="1448" height="848" rx="30" fill="none" stroke="rgba(255,255,255,0.12)"/>
    <rect x="94" y="94" width="1412" height="812" rx="24" fill="none" stroke="rgba(255,255,255,0.06)"/>
    <rect x="116" y="116" width="176" height="42" rx="21" fill="rgba(255,255,255,0.08)"/>
    <text x="146" y="144" fill="#f8fafc" font-family="IBM Plex Sans, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2">${categoryLine}</text>
    <rect x="314" y="116" width="134" height="42" rx="21" fill="rgba(13,167,231,0.16)"/>
    <text x="342" y="144" fill="#c7f5ff" font-family="IBM Plex Sans, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2">${status}</text>
    <text x="116" y="214" fill="#f8fafc" font-family="IBM Plex Sans, Arial, sans-serif" font-size="62" font-weight="800" letter-spacing="-1.8">${titleText}</text>
    <text x="116" y="436" fill="#d6e3f3" font-family="IBM Plex Sans, Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="1.4">${dateLine}</text>
    <text x="116" y="494" fill="#cbd5e1" font-family="IBM Plex Sans, Arial, sans-serif" font-size="22" font-weight="400">${summaryText}</text>
    <rect x="116" y="${detailPanelY}" width="610" height="176" rx="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>
    <text x="150" y="${detailPanelY + 44}" fill="${theme.accentSoft}" font-family="IBM Plex Mono, monospace" font-size="16" font-weight="700" letter-spacing="2">PROJECT LENS</text>
    <text x="150" y="${detailPanelY + 84}" fill="#f8fafc" font-family="IBM Plex Sans, Arial, sans-serif" font-size="28" font-weight="700">${serviceLine}</text>
    <text x="150" y="${detailPanelY + 122}" fill="#cbd5e1" font-family="IBM Plex Sans, Arial, sans-serif" font-size="19">${escapeXml(
      promptLine,
    )}</text>
    <text x="150" y="${detailPanelY + 154}" fill="#94a3b8" font-family="IBM Plex Mono, monospace" font-size="15" letter-spacing="1.4">${upperLocation} | ${coordLine}</text>
    <g>
      <rect x="990" y="118" width="426" height="782" rx="34" fill="rgba(10,15,27,0.32)" stroke="rgba(255,255,255,0.12)"/>
      <rect x="1020" y="150" width="366" height="10" rx="5" fill="url(#accentLine)" opacity="0.92"/>
      <text x="1024" y="196" fill="#94a3b8" font-family="IBM Plex Mono, monospace" font-size="15" font-weight="700" letter-spacing="2">PACIFIC PROJECT VISUAL</text>
      <text x="1024" y="236" fill="#f8fafc" font-family="IBM Plex Sans, Arial, sans-serif" font-size="32" font-weight="700">${escapeXml(
        seed.location,
      )}</text>
      ${blueprintDetail}
      <text x="1024" y="676" fill="${theme.accentWarm}" font-family="IBM Plex Mono, monospace" font-size="14" font-weight="700" letter-spacing="2">COUNTY / REGION</text>
      <text x="1024" y="712" fill="#f8fafc" font-family="IBM Plex Sans, Arial, sans-serif" font-size="22" font-weight="700">${upperLocation}</text>
      <text x="1024" y="772" fill="${theme.accentWarm}" font-family="IBM Plex Mono, monospace" font-size="14" font-weight="700" letter-spacing="2">REFERENCE TAG</text>
      <text x="1024" y="808" fill="#f8fafc" font-family="IBM Plex Sans, Arial, sans-serif" font-size="20" font-weight="600">${slugLine}</text>
    </g>
    <rect x="116" y="886" width="1368" height="8" rx="4" fill="url(#accentLine)" opacity="0.88"/>
  </svg>`;
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createGeneratedProjectVisuals(seed: ProjectVisualSeed): {
  image: string;
  images: string[];
} {
  const poster = svgToDataUri(buildSvg(seed, "poster"));
  const blueprint = svgToDataUri(buildSvg(seed, "blueprint"));
  const spotlight = svgToDataUri(buildSvg(seed, "spotlight"));

  return {
    image: poster,
    images: [poster, blueprint, spotlight],
  };
}
