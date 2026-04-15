import { BriefcaseBusiness, CheckCircle2, Clock3, ShieldCheck, UserCircle2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { aboutTeamProfiles } from "../data/aboutTeamProfiles";

export default function AboutTeamGrid() {
  const featuredProfile =
    aboutTeamProfiles.find((profile) => profile.id === "mark-waldman") ?? aboutTeamProfiles[0];
  const capabilityProfiles = aboutTeamProfiles.filter(
    (profile) => profile.id !== featuredProfile?.id,
  );
  const canRenderFeaturedPortrait = featuredProfile?.status === "approved";

  return (
    <div className="about-team-stack">
      {featuredProfile && (
        <AnimatedSection direction="up" delay={0.02}>
          <article className="about-team-featured pe-card" data-testid="card-featured-principal">
            <div className="about-team-featured-media">
              {canRenderFeaturedPortrait ? (
                <img
                  src={featuredProfile.image}
                  alt={featuredProfile.name}
                  className="about-team-featured-image"
                  loading="lazy"
                />
              ) : (
                <div className="about-team-featured-placeholder" aria-hidden="true">
                  <UserCircle2 className="h-10 w-10" />
                  <span>Leadership Portrait Pending</span>
                </div>
              )}
            </div>

            <div className="about-team-featured-body">
              <span className="about-team-featured-eyebrow">Principal Leadership</span>
              <div className="about-team-header">
                <h3 className="about-team-name">{featuredProfile.name}</h3>
                <p className="about-team-role">{featuredProfile.role}</p>
              </div>

              <div className="about-team-featured-meta">
                <span className="about-team-meta-item">
                  <Clock3 className="h-3.5 w-3.5" />
                  {featuredProfile.years}
                </span>
                <span className="about-team-meta-item">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  {featuredProfile.focus}
                </span>
                <span className="about-team-meta-item">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Credential-led delivery support
                </span>
              </div>

              <p className="about-team-summary">{featuredProfile.summary}</p>

              <div className="about-team-tags">
                {featuredProfile.credentials.map((credential) => (
                  <span key={credential} className="pe-pill">
                    <CheckCircle2 className="h-3 w-3" />
                    {credential}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </AnimatedSection>
      )}

      <div className="about-team-grid about-team-grid-supporting">
        {capabilityProfiles.map((profile, index) => (
          <AnimatedSection key={profile.id} direction="up" delay={0.08 + index * 0.04}>
            <article className="about-team-capability pe-card">
              <div className="about-team-capability-head">
                <span className="about-team-capability-icon" aria-hidden="true">
                  <UserCircle2 className="h-4 w-4" />
                </span>
                <div className="about-team-header">
                  <h3 className="about-team-name">{profile.name}</h3>
                  <p className="about-team-role">{profile.role}</p>
                </div>
              </div>

              <div className="about-team-meta">
                <span className="about-team-meta-item">
                  <Clock3 className="h-3.5 w-3.5" />
                  {profile.years}
                </span>
                <span className="about-team-meta-item">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  {profile.focus}
                </span>
              </div>

              <p className="about-team-summary">{profile.summary}</p>

              <div className="about-team-tags">
                {profile.credentials.map((credential) => (
                  <span key={credential} className="pe-pill">
                    <CheckCircle2 className="h-3 w-3" />
                    {credential}
                  </span>
                ))}
              </div>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
