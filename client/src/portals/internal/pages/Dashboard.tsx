import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban, Users, FileSignature, DollarSign,
  Plus, ArrowRight, Clock
} from "lucide-react";
import { formatCurrency, formatRelativeTime, formatDate } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: projects, isLoading: loadingProjects } = useQuery<any[]>({
    queryKey: ["/api/projects"],
  });

  const { data: prospects, isLoading: loadingProspects } = useQuery<any[]>({
    queryKey: ["/api/prospects"],
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery<any[]>({
    queryKey: ["/api/proposals"],
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery<any[]>({
    queryKey: ["/api/invoices"],
  });

  const { data: tasks } = useQuery<any[]>({
    queryKey: ["/api/tasks"],
  });

  const isLoading = loadingProjects || loadingProspects || loadingProposals || loadingInvoices;

  const activeProjects = projects?.filter((p) => p.status === "In Progress" || p.status === "Active") || [];
  const pipelineValue = prospects?.reduce((sum, p) => sum + (p.deal_value || 0), 0) || 0;
  const pendingProposals = proposals?.filter((p) => p.status === "sent" || p.status === "viewed") || [];
  const outstandingInvoices = invoices?.filter((i) => i.status === "sent" || i.status === "overdue") || [];
  const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + (i.total_amount || 0), 0);

  const upcomingTasks = (tasks || [])
    .filter((t) => t.status !== "Completed" && t.due_date)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back to Pacific Engineering"
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate(basePath + "/projects")} data-testid="button-new-project">
              <Plus className="h-4 w-4 mr-1" /> New Project
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={FolderKanban} label="Active Projects" value={activeProjects.length} />
            <StatCard icon={Users} label="Pipeline Value" value={formatCurrency(pipelineValue)} />
            <StatCard icon={FileSignature} label="Pending Proposals" value={pendingProposals.length} />
            <StatCard icon={DollarSign} label="Outstanding" value={formatCurrency(outstandingAmount)} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate(basePath + "/projects")} data-testid="link-view-all-projects">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(projects || []).slice(0, 5).map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer hover:bg-accent/50 rounded px-2 -mx-2 transition-colors"
                  onClick={() => navigate(basePath + "/projects/" + project.id)}
                  data-testid={`project-row-${project.id}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{project.project_name}</p>
                    <p className="text-xs text-muted-foreground">{project.client_name || project.client_email}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))}
              {(!projects || projects.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`task-row-${task.id}`}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDate(task.due_date, "short")}</span>
                    </div>
                  </div>
                  <StatusBadge status={task.priority} size="sm" />
                </div>
              ))}
              {upcomingTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
