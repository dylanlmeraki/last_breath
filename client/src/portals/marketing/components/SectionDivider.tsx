import { useEffect, useRef, useState } from "react";

type DividerVariant = "gradient" | "wave" | "blueprint" | "angled";

interface SectionDividerProps {
  variant?: DividerVariant;
  from?: "light" | "dark";
  to?: "light" | "dark";
  className?: string;
  flip?: boolean;
}

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function SectionDivider({
  variant = "gradient",
  from = "light",
  to = "light",
  className = "",
  flip = false,
}: SectionDividerProps) {
  const { ref, inView } = useInView(0.1);

  if (variant === "wave") {
    const topColor = from === "dark" ? "#0f172a" : "#ffffff";
    const bottomColor = to === "dark" ? "#0f172a" : "#f8fafc";
    return (
      <div
        ref={ref}
        className={`relative w-full overflow-hidden ${className}`}
        style={{ height: "clamp(40px, 5vw, 80px)", marginTop: "-1px", marginBottom: "-1px" }}
        data-testid="section-divider-wave"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={`absolute inset-0 w-full h-full ${flip ? "rotate-180" : ""}`}
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        >
          <rect width="1440" height="120" fill={topColor} />
          <path
            d="M0 60C240 20 480 100 720 60C960 20 1200 100 1440 60V120H0V60Z"
            fill={bottomColor}
          />
          <path
            d="M0 60C240 20 480 100 720 60C960 20 1200 100 1440 60"
            stroke="url(#divider-gradient)"
            strokeWidth="2"
            strokeOpacity="0.6"
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: inView ? 0 : 2000,
              transition: "stroke-dashoffset 2s ease-out 0.3s",
            }}
          />
          <defs>
            <linearGradient id="divider-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="0.2" stopColor="#06b6d4" />
              <stop offset="0.5" stopColor="#3b82f6" />
              <stop offset="0.8" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="1" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === "angled") {
    const topColor = from === "dark" ? "#0f172a" : "#ffffff";
    const bottomColor = to === "dark" ? "#0f172a" : "#f8fafc";
    return (
      <div
        ref={ref}
        className={`relative w-full overflow-hidden ${className}`}
        style={{ height: "clamp(30px, 4vw, 60px)", marginTop: "-1px", marginBottom: "-1px" }}
        data-testid="section-divider-angled"
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={`absolute inset-0 w-full h-full ${flip ? "rotate-180" : ""}`}
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease-out",
          }}
        >
          <rect width="1440" height="60" fill={topColor} />
          <polygon points="0,30 1440,0 1440,60 0,60" fill={bottomColor} />
          <line
            x1="0" y1="30" x2="1440" y2="0"
            stroke="url(#angled-gradient)"
            strokeWidth="2"
            strokeOpacity="0.5"
            style={{
              strokeDasharray: 1500,
              strokeDashoffset: inView ? 0 : 1500,
              transition: "stroke-dashoffset 1.5s ease-out 0.2s",
            }}
          />
          <defs>
            <linearGradient id="angled-gradient" x1="0" y1="30" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="0.3" stopColor="#06b6d4" />
              <stop offset="0.7" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#f97316" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === "blueprint") {
    return (
      <div
        ref={ref}
        className={`relative w-full overflow-hidden ${className}`}
        style={{ height: "clamp(16px, 2vw, 32px)" }}
        data-testid="section-divider-blueprint"
      >
        <div className="absolute inset-0 flex items-center">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.4) 20%, rgba(59,130,246,0.5) 50%, rgba(249,115,22,0.3) 80%, transparent)",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s",
              transformOrigin: "left center",
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i === 1 ? "#f97316" : "#06b6d4",
                opacity: inView ? 1 : 0,
                transform: inView ? "scale(1) rotate(45deg)" : "scale(0) rotate(0deg)",
                transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.6 + i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: "clamp(3px, 0.4vw, 6px)" }}
      data-testid="section-divider-gradient"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #06b6d4, #3b82f6, #f97316)",
          transform: inView ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
          transformOrigin: "left center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: inView ? "pe-divider-shimmer 3s ease-in-out infinite" : "none",
        }}
      />
      <style>{`@keyframes pe-divider-shimmer { 0%, 100% { background-position: -200% 0; } 50% { background-position: 200% 0; } }`}</style>
    </div>
  );
}
