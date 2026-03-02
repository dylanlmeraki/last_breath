import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ProjectDashboard() {
  const { data: projects, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const { data: milestones, isLoading: lm } = useQuery<any[]>({ queryKey: ["/api/project-milestones"] });

  const isLoading = lp || lm;
  const activeProjects = (projects || []).filter((p) => p.status === "In Progress" || p.status === "Active");
  const totalBudget = (projects || []).reduce((s, p) => s + (p.budget || 0), 0);
  const upcomingMilestones = (milestones || []).filter((m) => m.status !== "completed" && m.due_date).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).slice(0, 5);

  return (
    <div>
      <PageHeader title="Project Dashboard" subtitle="Overview of all active projects and milestones" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={FolderKanban} label="Total Projects" value={(projects || []).length} />
            <StatCard icon={Clock} label="Active" value={activeProjects.length} />
            <StatCard icon={CheckCircle} label="Completed" value={(projects || []).filter((p) => p.status === "Completed").length} />
            <StatCard icon={DollarSign} label="Total Budget" value={formatCurrency(totalBudget)} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Active Projects</CardTitle></CardHeader>
          <CardContent>
            {lp ? <TableSkeleton rows={3} /> : activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No active projects</p>
            ) : (
              <div className="space-y-3">
                {activeProjects.slice(0, 8).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`dashboard-project-${p.id}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.project_name || p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.client_name || "No client"}</p>
                    </div>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Upcoming Milestones</CardTitle></CardHeader>
          <CardContent>
            {lm ? <TableSkeleton rows={3} /> : upcomingMilestones.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming milestones</p>
            ) : (
              <div className="space-y-3">
                {upcomingMilestones.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`dashboard-milestone-${m.id}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{m.name || m.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {formatDate(m.due_date, "short")}</p>
                    </div>
                    <StatusBadge status={m.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
