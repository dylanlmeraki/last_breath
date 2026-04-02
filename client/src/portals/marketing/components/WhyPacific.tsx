import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Engineering informed by field reality",
  "Bay Area jurisdictional familiarity",
  "Compliance-minded documentation",
  "Integrated engineering + construction perspective",
];

export default function WhyPacific() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Why Pacific</h3>
      <p className="mt-2 text-sm text-slate-600">
        A practical engineering partner focused on permit-ready, field-ready delivery.
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
