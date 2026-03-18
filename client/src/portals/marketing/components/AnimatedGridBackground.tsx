import { useEffect, useRef, useState } from "react";

interface AnimatedGridBackgroundProps {
  gridSize?: number;
  animationDuration?: number;
  triggerInterval?: number;
  offsetX?: number;
  offsetY?: number;
  baseOpacity?: number;
  zIndex?: number;
  movingOffset?: boolean;
  className?: string;
}

interface CellState {
  x: number;
  y: number;
  isAnimating: boolean;
  scale: number;
  opacity: number;
  animationStart: number;
  hue: number;
}

const AnimatedGridBackground = ({
  gridSize = 40,
  animationDuration = 2000,
  triggerInterval = 400,
  offsetX = 0,
  offsetY = 0,
  baseOpacity = 1,
  zIndex = 0,
  movingOffset = false,
  className = "",
}: AnimatedGridBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const cellsRef = useRef<CellState[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTriggerRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  const CELL_PADDING = 2;

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      isVisibleRef.current = false;
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const cols = Math.ceil(dimensions.width / gridSize);
    const rows = Math.ceil(dimensions.height / gridSize);
    cellsRef.current = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        cellsRef.current.push({
          x, y, isAnimating: false, scale: 0, opacity: 0, animationStart: 0,
          hue: 190 + Math.random() * 30,
        });
      }
    }
  }, [dimensions.width, dimensions.height, gridSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = (timestamp: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      if (baseOpacity === 1) {
        ctx.fillStyle = "hsl(220, 13%, 9%)";
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      }

      let curOffX = offsetX;
      let curOffY = offsetY;
      if (movingOffset) {
        const elapsed = (timestamp - startTimeRef.current) / 1000;
        curOffX = offsetX + Math.sin(elapsed * 0.1) * 20;
        curOffY = offsetY + Math.cos(elapsed * 0.1) * 20;
      }

      const cols = Math.ceil(dimensions.width / gridSize);
      const rows = Math.ceil(dimensions.height / gridSize);

      ctx.strokeStyle = `rgba(100, 150, 200, ${0.08 * baseOpacity})`;
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * gridSize + curOffX, 0);
        ctx.lineTo(x * gridSize + curOffX, dimensions.height);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * gridSize + curOffY);
        ctx.lineTo(dimensions.width, y * gridSize + curOffY);
        ctx.stroke();
      }

      if (timestamp - lastTriggerRef.current > triggerInterval) {
        const randomIndex = Math.floor(Math.random() * cellsRef.current.length);
        const cell = cellsRef.current[randomIndex];
        if (cell && !cell.isAnimating) {
          cell.isAnimating = true;
          cell.animationStart = timestamp;
          cell.hue = 190 + Math.random() * 30;
        }
        lastTriggerRef.current = timestamp;
      }

      cellsRef.current.forEach((cell) => {
        if (cell.isAnimating) {
          const elapsed = timestamp - cell.animationStart;
          const progress = Math.min(elapsed / animationDuration, 1);
          if (progress < 0.5) {
            cell.scale = progress * 2;
            cell.opacity = progress * 2;
          } else {
            cell.scale = 1;
            cell.opacity = 2 - progress * 2;
          }
          if (progress >= 1) {
            cell.isAnimating = false;
            cell.scale = 0;
            cell.opacity = 0;
          }

          if (cell.opacity > 0) {
            const cellSize = gridSize - CELL_PADDING * 2;
            const scaledSize = cellSize * cell.scale;
            const offset = (cellSize - scaledSize) / 2;
            const x = cell.x * gridSize + CELL_PADDING + curOffX;
            const y = cell.y * gridSize + CELL_PADDING + curOffY;
            ctx.fillStyle = `hsla(${cell.hue}, 70%, 50%, ${cell.opacity * 0.3 * baseOpacity})`;
            ctx.shadowColor = `hsla(${cell.hue}, 70%, 50%, ${cell.opacity * baseOpacity})`;
            ctx.shadowBlur = 15 * cell.opacity * baseOpacity;
            ctx.fillRect(x + offset, y + offset, scaledSize, scaledSize);
            ctx.shadowBlur = 0;
          }
        }
      });
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [animationDuration, gridSize, triggerInterval, baseOpacity, dimensions.height, dimensions.width, movingOffset, offsetX, offsetY]);

  return (
    <div ref={wrapperRef} className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: baseOpacity === 1 ? "hsl(220, 13%, 9%)" : "transparent" }}
      />
    </div>
  );
};

export default AnimatedGridBackground;
