import { useEffect, useRef, useState, ReactNode, Children, isValidElement } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  parallax?: boolean;
  stagger?: number;
  blur?: boolean;
  ease?: "spring" | "tween";
}

function ParallaxWrapper({ children, className, variants, isInView, parallaxRef }: {
  children: ReactNode; className: string; variants: Variants; isInView: boolean; parallaxRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.85]);

  return (
    <motion.div
      ref={parallaxRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      style={{ y, opacity: scrollOpacity }}
      className="text-center sm:mb-14 lg:mb-20 mb-[60px]"
    >
      {children}
    </motion.div>
  );
}

export default function AnimatedSection({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.6,
  threshold = 0.2,
  parallax = false,
  stagger = 0,
  blur = false,
  ease = "spring",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const prefersReducedMotion = useReducedMotion();
  const [isSmallViewport, setIsSmallViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewportMode = () => setIsSmallViewport(mediaQuery.matches);

    updateViewportMode();
    mediaQuery.addEventListener("change", updateViewportMode);

    return () => {
      mediaQuery.removeEventListener("change", updateViewportMode);
    };
  }, []);

  const safeBlur = blur && !prefersReducedMotion;
  const yDist = prefersReducedMotion ? 0 : 1;
  const xDist = prefersReducedMotion || isSmallViewport ? 0 : 1;

  const baseTransition = ease === "spring"
    ? { type: "spring" as const, stiffness: 100, damping: 20, mass: 1, delay, duration }
    : { type: "tween" as const, duration, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (stagger > 0) {
    const childArray = Children.toArray(children).filter(isValidElement);
    return (
      <div ref={ref} className={className}>
        {childArray.map((child, i) => {
          const itemDelay = delay + i * stagger;
          const itemTransition = ease === "spring"
            ? { type: "spring" as const, stiffness: 100, damping: 20, mass: 1, delay: itemDelay, duration }
            : { type: "tween" as const, duration, delay: itemDelay, ease: [0.22, 1, 0.36, 1] as const };

          return (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                y: (direction === "up" ? 18 : direction === "down" ? -18 : 0) * yDist,
                x: (direction === "left" ? 18 : direction === "right" ? -18 : 0) * xDist,
                scale: prefersReducedMotion ? 1 : 0.995,
                filter: safeBlur ? "blur(2px)" : "blur(0px)",
              }}
              animate={isInView ? {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: itemTransition,
              } : undefined}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    );
  }

  const variants = {
    hidden: {
      opacity: 1,
      y: (direction === "up" ? 22 : direction === "down" ? -22 : 0) * yDist,
      x: (direction === "left" ? 22 : direction === "right" ? -22 : 0) * xDist,
      scale: prefersReducedMotion ? 1 : 0.995,
      filter: safeBlur ? "blur(2px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: baseTransition,
    },
  };

  if (parallax && !prefersReducedMotion) {
    return (
      <ParallaxWrapper parallaxRef={ref} className={className} variants={variants} isInView={isInView}>
        {children}
      </ParallaxWrapper>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
