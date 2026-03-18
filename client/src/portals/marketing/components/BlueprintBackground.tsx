
import { motion, useReducedMotion } from "framer-motion";

interface ArchitecturalLineProps {
  path: string;
  delay?: number;
  duration?: number;
  fromSide: "left" | "right" | "top" | "bottom";
  type?: "wall" | "dimension" | "section" | "detail" | "heavy";
  strokeWidth?: number;
  opacity?: number;
}

const ArchitecturalLine: React.FC<ArchitecturalLineProps> = ({
  path,
  delay = 0,
  duration = 4,
  fromSide,
  type = "wall",
  strokeWidth: customStrokeWidth,
  opacity = 0.5,
}) => {
  const strokeWidth = customStrokeWidth?.toString() || (
    type === "heavy" ? "1.5" :
    type === "wall" ? "1" : 
    type === "dimension" ? "0.5" : 
    type === "section" ? "0.8" : "0.6"
  );
  const isDashed = type === "dimension" || type === "section";

  const baseOpacity = opacity;
  const glowOpacity = Math.min(1, opacity * 1.4);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <motion.path
        d={path}
        stroke="rgba(100, 150, 180, 0.1)"
        strokeWidth={parseFloat(strokeWidth) * 1.3}
        strokeDasharray={isDashed ? "6 3" : "0"}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0, baseOpacity * 0.25, baseOpacity * 0.25, 0],
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
      
      <motion.path
        d={path}
        stroke={`url(#blueprint-gradient-${fromSide}-${delay})`}
        strokeWidth={strokeWidth}
        strokeDasharray={isDashed ? "6 3" : "0"}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0, glowOpacity, glowOpacity, 0],
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
      
      <defs>
        <linearGradient
          id={`blueprint-gradient-${fromSide}-${delay}`}
          gradientUnits="userSpaceOnUse"
          x1={fromSide === "left" ? "0%" : fromSide === "right" ? "100%" : "50%"}
          y1={fromSide === "top" ? "0%" : fromSide === "bottom" ? "100%" : "50%"}
          x2={fromSide === "left" ? "100%" : fromSide === "right" ? "0%" : "50%"}
          y2={fromSide === "top" ? "100%" : fromSide === "bottom" ? "0%" : "50%"}
        >
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
          <stop offset="15%" stopColor="rgba(6, 182, 212, 0.5)" />
          <stop offset="35%" stopColor="rgba(14, 165, 233, 0.7)" />
          <stop offset="50%" stopColor="rgba(249, 115, 22, 0.85)" />
          <stop offset="65%" stopColor="rgba(234, 88, 12, 0.7)" />
          <stop offset="85%" stopColor="rgba(251, 146, 60, 0.5)" />
          <stop offset="100%" stopColor="rgba(251, 146, 60, 0)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

interface ArchitecturalElementProps {
  type: "compass" | "dimension-mark" | "section-marker" | "detail-callout" | "room-label" | "grid-marker";
  position: { x: number; y: number };
  size?: number;
  delay?: number;
  duration?: number;
  fromSide: "left" | "right";
  opacity?: number;
}

const ArchitecturalElement: React.FC<ArchitecturalElementProps> = ({
  type,
  position,
  size = 40,
  delay = 0,
  duration = 6,
  fromSide,
  opacity = 0.5,
}) => {
  const xStart = fromSide === "left" ? -150 : 1250;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      initial={{ x: xStart, opacity: 0 }}
      animate={{
        x: [xStart, 0, 0, fromSide === "left" ? 1250 : -150],
        opacity: [0, opacity, opacity, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut",
      }}
    >
      {type === "compass" && (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" />
          <circle cx="25" cy="25" r="14" fill="none" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="0.5" />
          <circle cx="25" cy="25" r="2.5" fill="rgba(249, 115, 22, 0.5)" />
          <line x1="25" y1="8" x2="25" y2="16" stroke="rgba(249, 115, 22, 0.6)" strokeWidth="1" />
          <line x1="25" y1="34" x2="25" y2="42" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" />
          <line x1="8" y1="25" x2="16" y2="25" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" />
          <line x1="34" y1="25" x2="42" y2="25" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" />
          <polygon points="25,5 23,11 25,9 27,11" fill="rgba(249, 115, 22, 0.5)" />
          <text x="25" y="5" fontSize="5" fill="rgba(249, 115, 22, 0.6)" textAnchor="middle">N</text>
        </svg>
      )}
      {type === "dimension-mark" && (
        <svg width={size * 1.5} height={size * 0.5} viewBox="0 0 75 25">
          <line x1="5" y1="12" x2="70" y2="12" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" strokeDasharray="3 2" />
          <line x1="5" y1="7" x2="5" y2="17" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="0.8" />
          <line x1="70" y1="7" x2="70" y2="17" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="0.8" />
          <polygon points="10,12 15,10 15,14" fill="rgba(6, 182, 212, 0.4)" />
          <polygon points="65,12 60,10 60,14" fill="rgba(6, 182, 212, 0.4)" />
          <rect x="30" y="8" width="15" height="8" fill="rgba(15, 23, 42, 0.7)" />
          <text x="37" y="14" fontSize="5" fill="rgba(249, 115, 22, 0.7)" textAnchor="middle">24&apos;</text>
        </svg>
      )}
      {type === "section-marker" && (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="18" fill="none" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1" />
          <circle cx="25" cy="25" r="12" fill="rgba(15, 23, 42, 0.5)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
          <line x1="25" y1="7" x2="25" y2="13" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="1" />
          <line x1="25" y1="37" x2="25" y2="43" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
          <text x="25" y="28" fontSize="9" fill="rgba(249, 115, 22, 0.7)" textAnchor="middle" fontWeight="bold">A</text>
        </svg>
      )}
      {type === "detail-callout" && (
        <svg width={size} height={size * 1.2} viewBox="0 0 50 60">
          <circle cx="25" cy="15" r="11" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" />
          <circle cx="25" cy="15" r="7" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="0.5" />
          <line x1="25" y1="26" x2="25" y2="53" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="0.5" />
          <circle cx="25" cy="53" r="1.5" fill="rgba(249, 115, 22, 0.5)" />
          <text x="25" y="18" fontSize="7" fill="rgba(6, 182, 212, 0.7)" textAnchor="middle">1</text>
        </svg>
      )}
      {type === "room-label" && (
        <svg width={size * 2} height={size * 0.6} viewBox="0 0 100 30">
          <rect x="2" y="2" width="96" height="26" fill="rgba(15, 23, 42, 0.5)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
          <line x1="2" y1="10" x2="98" y2="10" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="0.3" />
          <text x="50" y="21" fontSize="7" fill="rgba(249, 115, 22, 0.6)" textAnchor="middle" letterSpacing="1">AREA 101</text>
          <text x="50" y="8" fontSize="4" fill="rgba(6, 182, 212, 0.5)" textAnchor="middle">1,250 SF</text>
        </svg>
      )}
      {type === "grid-marker" && (
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
          <circle cx="20" cy="20" r="10" fill="rgba(15, 23, 42, 0.6)" />
          <text x="20" y="24" fontSize="10" fill="rgba(249, 115, 22, 0.8)" textAnchor="middle" fontWeight="bold">B</text>
        </svg>
      )}
    </motion.div>
  );
};

interface BlueprintBackgroundProps {
  className?: string;
}

const BlueprintBackground: React.FC<BlueprintBackgroundProps> = ({ className = "" }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.02)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>
    );
  }

  const architecturalPaths = [
    { path: "M 0 150 L 180 150 L 180 250 L 280 250", fromSide: "left" as const, delay: 0, duration: 5, type: "heavy" as const, strokeWidth: 1.5, opacity: 0.55 },
    { path: "M 0 250 L 120 250 L 120 350 M 180 250 L 180 350 L 280 350", fromSide: "left" as const, delay: 0.5, duration: 4.5, type: "wall" as const, strokeWidth: 1, opacity: 0.45 },
    { path: "M 0 580 L 140 580 M 140 540 L 140 620 M 140 580 L 280 580", fromSide: "left" as const, delay: 1.5, duration: 6, type: "heavy" as const, strokeWidth: 1.8, opacity: 0.6 },
    { path: "M 0 720 L 160 720 L 200 680 L 200 760 L 160 720", fromSide: "left" as const, delay: 2, duration: 4, type: "wall" as const, strokeWidth: 0.8, opacity: 0.4 },
    { path: "M 0 820 L 220 820 L 220 850", fromSide: "left" as const, delay: 2.8, duration: 5.5, type: "heavy" as const, strokeWidth: 1.2, opacity: 0.5 },
    
    { path: "M 0 420 L 150 420 L 150 520 L 200 520 L 200 420 L 650 420 L 650 480 L 750 480", fromSide: "left" as const, delay: 1, duration: 7, type: "wall" as const, strokeWidth: 1, opacity: 0.45 },
    { path: "M 0 350 L 850 350 L 850 380 L 900 380", fromSide: "left" as const, delay: 2.2, duration: 8, type: "heavy" as const, strokeWidth: 1.5, opacity: 0.55 },
    
    { path: "M 0 100 L 80 100 L 80 60 L 160 60 L 160 100 L 240 100", fromSide: "left" as const, delay: 0.3, duration: 4, type: "detail" as const, strokeWidth: 0.6, opacity: 0.35 },
    { path: "M 0 450 L 60 450 L 60 400 L 120 400", fromSide: "left" as const, delay: 1.8, duration: 3.5, type: "detail" as const, strokeWidth: 0.5, opacity: 0.3 },
    
    { path: "M 0 200 L 150 200 M 145 195 L 150 200 L 145 205", fromSide: "left" as const, delay: 0.6, duration: 3.5, type: "dimension" as const, strokeWidth: 0.5, opacity: 0.3 },
    { path: "M 0 480 L 380 480 M 375 475 L 380 480 L 375 485", fromSide: "left" as const, delay: 1.2, duration: 5, type: "dimension" as const, strokeWidth: 0.6, opacity: 0.35 },
    { path: "M 0 650 L 120 650 M 115 645 L 120 650 L 115 655", fromSide: "left" as const, delay: 1.8, duration: 3, type: "dimension" as const, strokeWidth: 0.4, opacity: 0.25 },
    { path: "M 0 300 L 200 300 M 195 295 L 200 300 L 195 305", fromSide: "left" as const, delay: 3.2, duration: 4, type: "dimension" as const, strokeWidth: 0.5, opacity: 0.3 },
    
    { path: "M 1200 180 L 1020 180 L 1020 280 L 920 280", fromSide: "right" as const, delay: 0.3, duration: 5.5, type: "heavy" as const, strokeWidth: 1.5, opacity: 0.55 },
    { path: "M 1200 320 L 1080 320 L 1080 220 M 1020 280 L 1020 380 L 920 380", fromSide: "right" as const, delay: 0.8, duration: 4.5, type: "wall" as const, strokeWidth: 1, opacity: 0.45 },
    { path: "M 1200 620 L 1060 620 M 1060 580 L 1060 660 M 1060 620 L 920 620", fromSide: "right" as const, delay: 1.8, duration: 6.5, type: "heavy" as const, strokeWidth: 1.8, opacity: 0.6 },
    { path: "M 1200 750 L 1040 750 L 1000 710 L 1000 790 L 1040 750", fromSide: "right" as const, delay: 3, duration: 4, type: "wall" as const, strokeWidth: 0.8, opacity: 0.4 },
    { path: "M 1200 100 L 980 100 L 980 130", fromSide: "right" as const, delay: 3.5, duration: 5, type: "heavy" as const, strokeWidth: 1.2, opacity: 0.5 },
    
    { path: "M 1200 480 L 1050 480 L 1050 380 L 1000 380 L 1000 480 L 450 480 L 450 520 L 350 520", fromSide: "right" as const, delay: 1.3, duration: 7.5, type: "wall" as const, strokeWidth: 1, opacity: 0.45 },
    { path: "M 1200 550 L 300 550 L 300 580 L 250 580", fromSide: "right" as const, delay: 2.5, duration: 8.5, type: "heavy" as const, strokeWidth: 1.5, opacity: 0.55 },
    
    { path: "M 1200 130 L 1120 130 L 1120 80 L 1040 80 L 1040 130 L 960 130", fromSide: "right" as const, delay: 0.5, duration: 4.5, type: "detail" as const, strokeWidth: 0.6, opacity: 0.35 },
    { path: "M 1200 450 L 1140 450 L 1140 400 L 1080 400", fromSide: "right" as const, delay: 2.2, duration: 3.5, type: "detail" as const, strokeWidth: 0.5, opacity: 0.3 },
    
    { path: "M 1200 230 L 1050 230 M 1055 225 L 1050 230 L 1055 235", fromSide: "right" as const, delay: 0.9, duration: 3.5, type: "dimension" as const, strokeWidth: 0.5, opacity: 0.3 },
    { path: "M 1200 680 L 820 680 M 825 675 L 820 680 L 825 685", fromSide: "right" as const, delay: 1.6, duration: 5.5, type: "dimension" as const, strokeWidth: 0.6, opacity: 0.35 },
    { path: "M 1200 820 L 1080 820 M 1085 815 L 1080 820 L 1085 825", fromSide: "right" as const, delay: 2.4, duration: 3, type: "dimension" as const, strokeWidth: 0.4, opacity: 0.25 },
    { path: "M 1200 400 L 1000 400 M 1005 395 L 1000 400 L 1005 405", fromSide: "right" as const, delay: 3.8, duration: 4.5, type: "dimension" as const, strokeWidth: 0.5, opacity: 0.3 },
    
    { path: "M 300 0 L 300 900", fromSide: "top" as const, delay: 0.4, duration: 6, type: "section" as const, strokeWidth: 0.8, opacity: 0.4 },
    { path: "M 600 0 L 600 150 L 700 150 L 700 900", fromSide: "top" as const, delay: 1.1, duration: 7, type: "section" as const, strokeWidth: 1, opacity: 0.45 },
    { path: "M 900 0 L 900 900", fromSide: "top" as const, delay: 1.9, duration: 5.5, type: "section" as const, strokeWidth: 0.6, opacity: 0.35 },
    { path: "M 450 0 L 450 200 L 500 200 L 500 0", fromSide: "top" as const, delay: 2.8, duration: 5, type: "detail" as const, strokeWidth: 0.5, opacity: 0.3 },
    
    { path: "M 400 900 L 400 0", fromSide: "bottom" as const, delay: 0.7, duration: 5.5, type: "detail" as const, strokeWidth: 0.5, opacity: 0.3 },
    { path: "M 750 900 L 750 300 L 850 300 L 850 0", fromSide: "bottom" as const, delay: 1.5, duration: 7, type: "detail" as const, strokeWidth: 0.8, opacity: 0.4 },
    { path: "M 1050 900 L 1050 0", fromSide: "bottom" as const, delay: 2.6, duration: 6, type: "detail" as const, strokeWidth: 0.6, opacity: 0.35 },
    { path: "M 200 900 L 200 700 L 250 700 L 250 900", fromSide: "bottom" as const, delay: 3.4, duration: 5, type: "detail" as const, strokeWidth: 0.5, opacity: 0.3 },
    { path: "M 1100 900 L 1100 800 L 1150 800 L 1150 900", fromSide: "bottom" as const, delay: 4, duration: 4.5, type: "detail" as const, strokeWidth: 0.4, opacity: 0.25 },
  ];

  const architecturalElements = [
    { type: "compass" as const, position: { x: 6, y: 12 }, size: 38, delay: 1, duration: 7, fromSide: "left" as const, opacity: 0.55 },
    { type: "dimension-mark" as const, position: { x: 10, y: 32 }, size: 42, delay: 1.8, duration: 6, fromSide: "left" as const, opacity: 0.4 },
    { type: "section-marker" as const, position: { x: 8, y: 52 }, size: 35, delay: 2.5, duration: 5.5, fromSide: "left" as const, opacity: 0.45 },
    { type: "detail-callout" as const, position: { x: 12, y: 70 }, size: 36, delay: 3.2, duration: 6.5, fromSide: "left" as const, opacity: 0.4 },
    { type: "room-label" as const, position: { x: 6, y: 85 }, size: 32, delay: 4, duration: 7, fromSide: "left" as const, opacity: 0.4 },
    { type: "grid-marker" as const, position: { x: 14, y: 22 }, size: 30, delay: 4.5, duration: 6, fromSide: "left" as const, opacity: 0.35 },
    
    { type: "compass" as const, position: { x: 90, y: 15 }, size: 40, delay: 1.3, duration: 6.5, fromSide: "right" as const, opacity: 0.55 },
    { type: "grid-marker" as const, position: { x: 86, y: 35 }, size: 36, delay: 2, duration: 5.5, fromSide: "right" as const, opacity: 0.5 },
    { type: "section-marker" as const, position: { x: 88, y: 55 }, size: 34, delay: 2.8, duration: 6, fromSide: "right" as const, opacity: 0.45 },
    { type: "detail-callout" as const, position: { x: 84, y: 72 }, size: 38, delay: 3.5, duration: 7, fromSide: "right" as const, opacity: 0.4 },
    { type: "room-label" as const, position: { x: 87, y: 88 }, size: 32, delay: 4.2, duration: 6.5, fromSide: "right" as const, opacity: 0.4 },
    { type: "dimension-mark" as const, position: { x: 82, y: 45 }, size: 38, delay: 4.8, duration: 5.5, fromSide: "right" as const, opacity: 0.35 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.02)_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(6,182,212,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(249,115,22,0.04),transparent_50%)]" />

      {architecturalPaths.map((line, i) => (
        <ArchitecturalLine
          key={`arch-line-${i}`}
          path={line.path}
          delay={line.delay}
          duration={line.duration}
          fromSide={line.fromSide}
          type={line.type}
          strokeWidth={line.strokeWidth}
          opacity={line.opacity}
        />
      ))}

      {architecturalElements.map((element, i) => (
        <ArchitecturalElement
          key={`arch-element-${i}`}
          type={element.type}
          position={element.position}
          size={element.size}
          delay={element.delay}
          duration={element.duration}
          fromSide={element.fromSide}
          opacity={element.opacity}
        />
      ))}
    </div>
  );
};

export default BlueprintBackground;
