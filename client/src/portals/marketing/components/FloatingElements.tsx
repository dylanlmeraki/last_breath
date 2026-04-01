import { motion, useReducedMotion } from "framer-motion";

interface FloatingElementsProps {
  className?: string;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ className = "" }) => {
  const prefersReducedMotion = useReducedMotion();

  const floatAnim = (vals: Record<string, number[]>, dur: number, del = 0) =>
    prefersReducedMotion
      ? { animate: {}, transition: {} }
      : { animate: vals, transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay: del } };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute top-[8%] left-[4%] w-40 h-48"
        {...floatAnim({ y: [0, -12, 0], opacity: [0.6, 0.9, 0.6] }, 10)}
      >
        <svg viewBox="0 0 160 200" className="w-full h-full" fill="none">
          <rect x="10" y="40" width="100" height="120" stroke="rgba(6,182,212,0.12)" strokeWidth="0.8" />
          <rect x="20" y="50" width="35" height="25" stroke="rgba(6,182,212,0.18)" strokeWidth="0.5" strokeDasharray="3 2" />
          <rect x="65" y="50" width="35" height="25" stroke="rgba(6,182,212,0.18)" strokeWidth="0.5" strokeDasharray="3 2" />
          <rect x="20" y="85" width="80" height="30" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <line x1="60" y1="85" x2="60" y2="115" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" />
          <rect x="30" y="125" width="20" height="35" stroke="rgba(6,182,212,0.2)" strokeWidth="0.6" />
          <line x1="10" y1="40" x2="60" y2="10" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" />
          <line x1="110" y1="40" x2="60" y2="10" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" />
          <line x1="5" y1="40" x2="0" y2="40" stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
          <line x1="5" y1="160" x2="0" y2="160" stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="0" y2="160" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <text x="2" y="104" fontSize="4" fill="rgba(6,182,212,0.25)" transform="rotate(-90,2,104)">120'-0"</text>
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[12%] right-[6%] w-36 h-36"
        {...floatAnim({ y: [0, 10, 0], rotate: [0, -2, 0] }, 12, 1)}
      >
        <svg viewBox="0 0 140 140" className="w-full h-full" fill="none">
          <rect x="20" y="20" width="100" height="100" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" />
          <line x1="20" y1="20" x2="120" y2="120" stroke="rgba(6,182,212,0.06)" strokeWidth="0.4" strokeDasharray="4 4" />
          <line x1="120" y1="20" x2="20" y2="120" stroke="rgba(6,182,212,0.06)" strokeWidth="0.4" strokeDasharray="4 4" />
          <circle cx="70" cy="70" r="30" stroke="rgba(6,182,212,0.12)" strokeWidth="0.5" strokeDasharray="2 3" />
          <rect x="40" y="35" width="60" height="70" stroke="rgba(6,182,212,0.15)" strokeWidth="0.6" />
          <rect x="45" y="40" width="20" height="15" stroke="rgba(6,182,212,0.1)" strokeWidth="0.4" />
          <rect x="75" y="40" width="20" height="15" stroke="rgba(6,182,212,0.1)" strokeWidth="0.4" />
          <line x1="70" y1="35" x2="70" y2="105" stroke="rgba(6,182,212,0.08)" strokeWidth="0.4" strokeDasharray="2 2" />
          <circle cx="45" cy="90" r="2" fill="rgba(249,115,22,0.2)" />
          <circle cx="95" cy="90" r="2" fill="rgba(249,115,22,0.2)" />
          <text x="125" y="72" fontSize="4" fill="rgba(6,182,212,0.2)">A1</text>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[22%] left-[6%] w-32 h-32"
        {...floatAnim({ y: [0, -8, 0], x: [0, 4, 0] }, 9, 2)}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
          <rect x="10" y="10" width="100" height="100" stroke="rgba(6,182,212,0.08)" strokeWidth="0.4" />
          {[30, 50, 70, 90].map((x) => (
            <line key={`v${x}`} x1={x} y1="10" x2={x} y2="110" stroke="rgba(6,182,212,0.06)" strokeWidth="0.3" strokeDasharray="2 4" />
          ))}
          {[30, 50, 70, 90].map((y) => (
            <line key={`h${y}`} x1="10" y1={y} x2="110" y2={y} stroke="rgba(6,182,212,0.06)" strokeWidth="0.3" strokeDasharray="2 4" />
          ))}
          <rect x="30" y="30" width="40" height="40" stroke="rgba(249,115,22,0.15)" strokeWidth="0.6" />
          <line x1="30" y1="50" x2="70" y2="50" stroke="rgba(249,115,22,0.1)" strokeWidth="0.4" />
          <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(249,115,22,0.1)" strokeWidth="0.4" />
          <circle cx="30" cy="30" r="1.5" fill="rgba(249,115,22,0.25)" />
          <circle cx="70" cy="30" r="1.5" fill="rgba(249,115,22,0.25)" />
          <circle cx="30" cy="70" r="1.5" fill="rgba(249,115,22,0.25)" />
          <circle cx="70" cy="70" r="1.5" fill="rgba(249,115,22,0.25)" />
          <text x="32" y="28" fontSize="3.5" fill="rgba(6,182,212,0.2)">C1</text>
          <text x="72" y="28" fontSize="3.5" fill="rgba(6,182,212,0.2)">C2</text>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[28%] right-[4%] w-36 h-44"
        {...floatAnim({ y: [0, 14, 0], opacity: [0.5, 0.8, 0.5] }, 11, 0.5)}
      >
        <svg viewBox="0 0 140 180" className="w-full h-full" fill="none">
          <rect x="20" y="10" width="100" height="160" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" />
          <line x1="20" y1="50" x2="120" y2="50" stroke="rgba(6,182,212,0.12)" strokeWidth="0.4" />
          <line x1="20" y1="90" x2="120" y2="90" stroke="rgba(6,182,212,0.12)" strokeWidth="0.4" />
          <line x1="20" y1="130" x2="120" y2="130" stroke="rgba(6,182,212,0.12)" strokeWidth="0.4" />
          <rect x="30" y="15" width="25" height="30" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <rect x="85" y="15" width="25" height="30" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <rect x="30" y="55" width="25" height="30" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <rect x="85" y="55" width="25" height="30" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <rect x="55" y="135" width="30" height="35" stroke="rgba(249,115,22,0.18)" strokeWidth="0.6" />
          <line x1="15" y1="50" x2="10" y2="50" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <line x1="15" y1="90" x2="10" y2="90" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <line x1="15" y1="130" x2="10" y2="130" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
          <line x1="10" y1="50" x2="10" y2="90" stroke="rgba(6,182,212,0.1)" strokeWidth="0.4" />
          <text x="5" y="73" fontSize="3.5" fill="rgba(6,182,212,0.2)" transform="rotate(-90,5,73)">FLOOR 2</text>
          <line x1="10" y1="90" x2="10" y2="130" stroke="rgba(6,182,212,0.1)" strokeWidth="0.4" />
          <text x="5" y="113" fontSize="3.5" fill="rgba(6,182,212,0.2)" transform="rotate(-90,5,113)">FLOOR 1</text>
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[42%] left-[2%] w-14 h-52"
        {...floatAnim({ opacity: [0.4, 0.7, 0.4] }, 5)}
      >
        <svg viewBox="0 0 40 200" className="w-full h-full" fill="none">
          <line x1="20" y1="5" x2="20" y2="195" stroke="rgba(6,182,212,0.12)" strokeWidth="0.6" />
          {[5, 45, 85, 125, 165].map((y, i) => (
            <g key={i}>
              <line x1="20" y1={y} x2="12" y2={y} stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
              <text x="8" y={y + 1.5} fontSize="3" fill="rgba(6,182,212,0.2)" textAnchor="end">{(5 - i) * 4}'</text>
            </g>
          ))}
          <line x1="20" y1="45" x2="35" y2="45" stroke="rgba(249,115,22,0.2)" strokeWidth="0.5" />
          <polygon points="34,43 38,45 34,47" fill="rgba(249,115,22,0.25)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[38%] right-[2%] w-14 h-52"
        {...floatAnim({ opacity: [0.3, 0.65, 0.3] }, 6, 1.5)}
      >
        <svg viewBox="0 0 40 200" className="w-full h-full" fill="none">
          <line x1="20" y1="5" x2="20" y2="195" stroke="rgba(249,115,22,0.1)" strokeWidth="0.5" />
          {[25, 65, 105, 145, 185].map((y, i) => (
            <g key={i}>
              <line x1="20" y1={y} x2="28" y2={y} stroke="rgba(249,115,22,0.15)" strokeWidth="0.5" />
            </g>
          ))}
          <circle cx="20" cy="25" r="3" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" fill="none" />
          <circle cx="20" cy="105" r="3" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" fill="none" />
          <line x1="5" y1="65" x2="20" y2="65" stroke="rgba(6,182,212,0.12)" strokeWidth="0.4" />
          <polygon points="6,63 2,65 6,67" fill="rgba(6,182,212,0.15)" />
        </svg>
      </motion.div>
    </div>
  );
};

export default FloatingElements;
