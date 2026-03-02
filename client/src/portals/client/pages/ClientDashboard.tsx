import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FolderKanban, FileSignature, DollarSign, MessageSquare, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const { data: projects, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const { data: proposals } = useQuery<any[]>({ queryKey: ["/api/proposals"] });
  const { data: invoices, isLoading: li } = useQuery<any[]>({ queryKey: ["/api/invoices"] });

  const myProjects = (projects || []).filter((p) => p.client_email === user?.email);
  const activeProjects = myProjects.filter((p) => p.status !== "Completed" && p.status !== "Cancelled");
  const myProposals = (proposals || []).filter((p) => p.client_email === user?.email || p.contact_email === user?.email);
  const pendingProposals = myProposals.filter((p) => p.status === "sent" || p.status === "viewed");
  const myInvoices = (invoices || []).filter((i) => i.client_email === user?.email);
  const outstanding = myInvoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + (i.total_amount || 0), 0);

  return (
    <div>
      <PageHeader title="Welcome back" subtitle={user?.full_name || ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {lp ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={FolderKanban} label="Active Projects" value={activeProjects.length} />
            <StatCard icon={FileSignature} label="Pending Proposals" value={pendingProposals.length} />
            <StatCard icon={DollarSign} label="Outstanding" value={formatCurrency(outstanding)} />
            <StatCard icon={MessageSquare} label="Total Projects" value={myProjects.length} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Your Projects</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate(basePath + "/projects")} data-testid="link-view-projects">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
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
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-medium text-sm truncate">{p.project_name}</p>
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
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Pending Proposals</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate(basePath + "/proposals")} data-testid="link-view-proposals">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {pendingProposals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No pending proposals</p>
            ) : (
              <div className="space-y-3">
                {pendingProposals.slice(0, 5).map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer hover:bg-accent/50 rounded-lg px-2 -mx-2 transition-colors"
                    onClick={() => navigate(basePath + "/proposals")}
                    data-testid={`proposal-quick-${p.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(p.amount)}</p>
                    </div>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate(basePath + "/invoices")} data-testid="link-view-invoices">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {myInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {myInvoices.slice(0, 5).map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`invoice-quick-${inv.id}`}>
                    <div>
                      <p className="text-sm font-medium">{inv.invoice_number || "Invoice"}</p>
                      <p className="text-xs text-muted-foreground">Due {formatDate(inv.due_date, "short")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatCurrency(inv.total_amount)}</span>
                      <StatusBadge status={inv.status} size="sm" />
                    </div>
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
