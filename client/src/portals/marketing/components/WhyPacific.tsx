import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Bay Area permit, agency, and jurisdiction fluency without handoff lag",
  "Engineering, compliance, and contractor awareness managed in one workflow",
  "Inspection, documentation, and closeout discipline that holds up in review",
  "Direct communication with owners, architects, agencies, and field crews",
];

export default function WhyPacific() {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Why Pacific Engineering</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Practical support for teams that need clear technical judgment, permit-ready documentation,
        and decisions that stay usable once work is active.
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
