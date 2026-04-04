import AnimatedSection from "./AnimatedSection";

interface MarketingPageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  eyebrow?: string;
  sectionTestId?: string;
  titleTestId?: string;
}

export default function MarketingPageHero({
  title,
  description,
  backgroundImage,
  eyebrow = "Pacific Engineering",
  sectionTestId,
  titleTestId,
}: MarketingPageHeroProps) {
  return (
    <section
      className="pe-secondary-hero"
      data-testid={sectionTestId}
    >
      {backgroundImage ? (
        <div
          className="pe-secondary-hero-media"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="pe-secondary-hero-overlay" aria-hidden="true" />
      <div className="pe-secondary-hero-grid blueprint-grid" aria-hidden="true" />

      <div className="pe-container-wide pe-secondary-hero-shell">
        <AnimatedSection direction="up">
          <div className="pe-secondary-hero-panel">
            <span className="eyebrow cool pe-secondary-hero-eyebrow">{eyebrow}</span>
            <h1 className="pe-secondary-hero-title" data-testid={titleTestId}>
              {title}
            </h1>
            <p className="pe-secondary-hero-copy">{description}</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
