import type { CSSProperties, ReactNode } from "react";
import AnimatedSection from "./AnimatedSection";

/**
 * Hero types for the P6-001 hero-system reset.
 *
 * text-first - dark technical surface, blueprint grid, no background image.
 * split      - two-column layout: copy left, contained image panel right.
 * proof      - full-bleed treatment (backgroundImage required).
 * default    - legacy behavior, identical to proof.
 */
export type HeroType = "default" | "text-first" | "split" | "proof";

interface MarketingPageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  eyebrow?: string;
  sectionTestId?: string;
  titleTestId?: string;
  className?: string;
  overlayVariant?: "default" | "field" | "technical" | "calm";
  mediaPosition?: string;
  mediaPositionMobile?: string;
  mediaFilter?: string;
  mediaOpacity?: number;
  heroType?: HeroType;
  splitImage?: string;
  splitImageAlt?: string;
  ctaSlot?: ReactNode;
}

export default function MarketingPageHero({
  title,
  description,
  backgroundImage,
  eyebrow = "Pacific Engineering",
  sectionTestId,
  titleTestId,
  className,
  overlayVariant = "default",
  mediaPosition = "center",
  mediaPositionMobile,
  mediaFilter = "grayscale(0.35) saturate(0.62) contrast(1.08) brightness(0.72)",
  mediaOpacity = 0.44,
  heroType = "default",
  splitImage,
  splitImageAlt = "",
  ctaSlot,
}: MarketingPageHeroProps) {
  const heroStyle = {
    "--pe-hero-media-position": mediaPosition,
    "--pe-hero-media-position-mobile": mediaPositionMobile ?? mediaPosition,
    "--pe-hero-media-filter": mediaFilter,
    "--pe-hero-media-opacity": String(mediaOpacity),
  } as CSSProperties & Record<string, string>;

  const heroClassName = [
    "pe-secondary-hero",
    `pe-secondary-hero--${overlayVariant}`,
    heroType !== "default" ? `pe-secondary-hero--${heroType}` : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const showMedia = heroType === "default" || heroType === "proof";

  if (heroType === "split") {
    return (
      <section
        className={heroClassName}
        style={heroStyle}
        data-testid={sectionTestId}
      >
        <div
          className="pe-secondary-hero-grid blueprint-grid"
          aria-hidden="true"
        />
        <div className="pe-container-wide pe-secondary-hero-shell pe-secondary-hero-shell--split">
          <AnimatedSection direction="up">
            <div className="pe-secondary-hero-panel">
              <span className="eyebrow cool pe-secondary-hero-eyebrow">
                {eyebrow}
              </span>
              <h1
                className="pe-secondary-hero-title"
                data-testid={titleTestId}
              >
                {title}
              </h1>
              <p className="pe-secondary-hero-copy">{description}</p>
              {ctaSlot != null && (
                <div className="pe-secondary-hero-cta-slot">{ctaSlot}</div>
              )}
            </div>
          </AnimatedSection>
          {splitImage != null && (
            <AnimatedSection direction="right" delay={0.12}>
              <div className="pe-secondary-hero-split-media">
                <img
                  src={splitImage}
                  alt={splitImageAlt}
                  className="pe-secondary-hero-split-image"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={heroClassName}
      style={heroStyle}
      data-testid={sectionTestId}
    >
      {showMedia && backgroundImage != null ? (
        <div
          className="pe-secondary-hero-media"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      {showMedia ? (
        <div className="pe-secondary-hero-overlay" aria-hidden="true" />
      ) : null}
      <div
        className="pe-secondary-hero-grid blueprint-grid"
        aria-hidden="true"
      />
      <div className="pe-container-wide pe-secondary-hero-shell">
        <AnimatedSection direction="up">
          <div className="pe-secondary-hero-panel">
            <span className="eyebrow cool pe-secondary-hero-eyebrow">
              {eyebrow}
            </span>
            <h1
              className="pe-secondary-hero-title"
              data-testid={titleTestId}
            >
              {title}
            </h1>
            <p className="pe-secondary-hero-copy">{description}</p>
            {ctaSlot != null && (
              <div className="pe-secondary-hero-cta-slot">{ctaSlot}</div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}