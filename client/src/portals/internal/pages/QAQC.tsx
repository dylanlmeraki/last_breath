import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck, FileText, AlertTriangle, CheckCircle } from "lucide-react";

const CHECKLIST_ITEMS = [
  { id: "docs", label: "All project documents uploaded", category: "Documentation" },
  { id: "review", label: "Technical review completed", category: "Review" },
  { id: "specs", label: "Specifications verified", category: "Documentation" },
  { id: "safety", label: "Safety compliance checked", category: "Compliance" },
  { id: "permits", label: "Permits obtained", category: "Compliance" },
  { id: "budget", label: "Budget reconciled", category: "Financial" },
  { id: "milestones", label: "Milestones on schedule", category: "Timeline" },
  { id: "client", label: "Client sign-off obtained", category: "Approval" },
];

export default function QAQC() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const { data: projects, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const { data: documents, isLoading: ld } = useQuery<any[]>({ queryKey: ["/api/project-documents"] });

  const isLoading = lp || ld;
  const pendingDocs = (documents || []).filter((d) => d.status === "Review" || d.status === "Draft").length;
  const completedChecks = checked.size;

  const toggleCheck = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  return (
    <div>
      <PageHeader title="QA/QC Dashboard" subtitle="Quality assurance and quality control checklists" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={ClipboardCheck} label="Checklist Progress" value={`${completedChecks}/${CHECKLIST_ITEMS.length}`} />
            <StatCard icon={FileText} label="Pending Reviews" value={pendingDocs} />
            <StatCard icon={CheckCircle} label="Active Projects" value={(projects || []).filter((p) => p.status === "In Progress" || p.status === "Active").length} />
            <StatCard icon={AlertTriangle} label="Issues" value={0} />
          </>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Project Quality Checklist</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30" data-testid={`checklist-item-${item.id}`}>
                <Checkbox
                  checked={checked.has(item.id)}
                  onCheckedChange={() => toggleCheck(item.id)}
                  data-testid={`checkbox-${item.id}`}
                />
                <div className="flex-1">
                  <p className={`text-sm ${checked.has(item.id) ? "line-through text-muted-foreground" : "font-medium"}`}>{item.label}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
