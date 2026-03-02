import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FolderKanban, ClipboardList, DollarSign, MessageSquare } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const { data: projects, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const { data: invoices, isLoading: li } = useQuery<any[]>({ queryKey: ["/api/invoices"] });
  const { data: milestones } = useQuery<any[]>({ queryKey: ["/api/project-milestones"] });

  const myProjects = (projects || []).filter((p) => p.client_email === user?.email);
  const activeProjects = myProjects.filter((p) => p.status !== "Completed" && p.status !== "Cancelled");
  const pendingApprovals = (milestones || []).filter((m) => m.status === "Pending Client Approval");
  const outstanding = (invoices || []).filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + (i.total_amount || 0), 0);

  return (
    <div>
      <PageHeader title="Welcome back" subtitle={user?.full_name || ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {lp ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={FolderKanban} label="Active Projects" value={activeProjects.length} />
            <StatCard icon={ClipboardList} label="Pending Approvals" value={pendingApprovals.length} />
            <StatCard icon={DollarSign} label="Outstanding" value={formatCurrency(outstanding)} />
            <StatCard icon={MessageSquare} label="Total Projects" value={myProjects.length} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Your Projects</CardTitle></CardHeader>
          <CardContent>
            {activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No active projects</p>
            ) : (
              <div className="space-y-4">
                {activeProjects.slice(0, 5).map((p: any) => (
                  <div
                    key={p.id}
                    className="cursor-pointer hover:bg-accent/50 rounded-lg p-3 -mx-3 transition-colors"
                    onClick={() => navigate(basePath + "/projects/" + p.id)}
                    data-testid={`project-card-${p.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{p.project_name}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    <Progress value={p.progress_percentage || 0} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">{p.progress_percentage || 0}% complete</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pending Approvals</CardTitle></CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No items waiting for approval</p>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`approval-${m.id}`}>
                    <div>
                      <p className="text-sm font-medium">{m.milestone_name}</p>
                      <p className="text-xs text-muted-foreground">Due: {formatDate(m.due_date, "short")}</p>
                    </div>
                    <StatusBadge status="Pending" size="sm" />
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
