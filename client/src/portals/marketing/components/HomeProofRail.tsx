import {
  Award,
  Building2,
  FileCheck,
  History,
  Shield,
  Wrench,
} from "lucide-react";
import { proofRailItems } from "../data/proofRailItems";

const iconMap = {
  History,
  Shield,
  Award,
  Building2,
  FileCheck,
  Wrench,
} as const;

export default function HomeProofRail() {
  return (
    <section className="proof-rail pe-container-wide" aria-label="Pacific Engineering proof points">
      <div className="proof-rail-inner">
        {proofRailItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <article key={item.id} className="proof-item">
              <div className="proof-item-icon">
                <Icon size={18} strokeWidth={2.1} />
              </div>
              <h3 className="proof-item-value">{item.value}</h3>
              <p className="proof-item-label">{item.support}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
