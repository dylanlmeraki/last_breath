import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, FolderKanban, FileSignature, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsDashboard() {
  const { data: projects, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const { data: prospects, isLoading: lpr } = useQuery<any[]>({ queryKey: ["/api/prospects"] });
  const { data: proposals, isLoading: lprop } = useQuery<any[]>({ queryKey: ["/api/proposals"] });
  const { data: invoices, isLoading: li } = useQuery<any[]>({ queryKey: ["/api/invoices"] });

  const isLoading = lp || lpr || lprop || li;

  const totalRevenue = (invoices || []).filter((i) => i.status === "paid").reduce((s, i) => s + (i.total_amount || 0), 0);
  const activeProjects = (projects || []).filter((p) => p.status === "In Progress" || p.status === "Active").length;
  const conversionRate = prospects?.length ? Math.round(((prospects.filter((p) => p.status === "Won").length) / prospects.length) * 100) : 0;

  const statusCounts: Record<string, number> = {};
  (projects || []).forEach((p) => { statusCounts[p.status] = (statusCounts[p.status] || 0) + 1; });

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Business performance overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(totalRevenue)} />
            <StatCard icon={FolderKanban} label="Active Projects" value={activeProjects} />
            <StatCard icon={FileSignature} label="Proposals Sent" value={(proposals || []).filter((p) => p.status !== "draft").length} />
            <StatCard icon={Users} label="Conversion Rate" value={`${conversionRate}%`} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Project Status Distribution</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(statusCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No project data available</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(statusCounts).sort(([, a], [, b]) => b - a).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(count / (projects?.length || 1)) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pipeline Summary</CardTitle></CardHeader>
          <CardContent>
            {(!prospects || prospects.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pipeline data available</p>
            ) : (
              <div className="space-y-3">
                {["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].map((stage) => {
                  const count = (prospects || []).filter((p) => p.status === stage).length;
                  const value = (prospects || []).filter((p) => p.status === stage).reduce((s, p) => s + (p.deal_value || 0), 0);
                  if (count === 0) return null;
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <span className="text-sm">{stage}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-muted-foreground ml-2">{formatCurrency(value)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
