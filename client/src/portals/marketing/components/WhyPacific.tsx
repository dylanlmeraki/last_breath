import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Bay Area agency, permit, and jurisdiction familiarity",
  "Engineering, compliance, and contractor perspective in one team",
  "Inspection, documentation, and closeout discipline",
  "Project communication built for owners, architects, and field teams",
];

export default function WhyPacific() {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Why Pacific Engineering</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        A practical partner for scopes that need engineering judgment,
        permitting fluency, and field-ready coordination.
      </p>
      <ul className="mt-4 space-y-3">
        {reasons.map((reason) => (
          <li key={reason} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-600" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
