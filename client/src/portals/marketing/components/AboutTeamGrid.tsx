import { BriefcaseBusiness, CheckCircle2, Clock3 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { aboutTeamProfiles } from "../data/aboutTeamProfiles";

export default function AboutTeamGrid() {
  return (
    <div className="about-team-grid">
      {aboutTeamProfiles.map((profile, index) => (
        <AnimatedSection key={profile.id} direction="up" delay={index * 0.04}>
          <article className="about-team-card pe-card">
            <div className="about-team-media">
              <img
                src={profile.image}
                alt={profile.name}
                className="about-team-image"
                loading="lazy"
              />
              <div className="about-team-media-overlay" aria-hidden="true" />
              <div className="about-team-media-copy">
                <h3 className="about-team-name">{profile.name}</h3>
                <p className="about-team-role">{profile.role}</p>
              </div>
            </div>

            <div className="about-team-body">
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
            </div>
          </article>
        </AnimatedSection>
      ))}
    </div>
  );
}
