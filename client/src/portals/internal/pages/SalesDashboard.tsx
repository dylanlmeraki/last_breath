import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Target, ArrowRight } from "lucide-react";
import { formatCurrency, getInitials } from "@/lib/utils";

const STAGES = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export default function SalesDashboard() {
  const { data: prospects, isLoading } = useQuery<any[]>({ queryKey: ["/api/prospects"] });

  const totalPipeline = (prospects || []).filter((p) => !["Won", "Lost"].includes(p.status)).reduce((s, p) => s + (p.deal_value || 0), 0);
  const wonDeals = (prospects || []).filter((p) => p.status === "Won");
  const wonValue = wonDeals.reduce((s, p) => s + (p.deal_value || 0), 0);
  const weightedPipeline = (prospects || []).filter((p) => !["Won", "Lost"].includes(p.status)).reduce((s, p) => s + (p.deal_value || 0) * ((p.probability || 50) / 100), 0);

  const byStage = STAGES.map((stage) => ({
    stage,
    prospects: (prospects || []).filter((p) => p.status === stage),
    count: (prospects || []).filter((p) => p.status === stage).length,
  }));

  return (
    <div>
      <PageHeader title="Sales Dashboard" subtitle="Pipeline overview and performance metrics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={DollarSign} label="Pipeline Value" value={formatCurrency(totalPipeline)} />
            <StatCard icon={Target} label="Weighted Pipeline" value={formatCurrency(weightedPipeline)} />
            <StatCard icon={TrendingUp} label="Won Deals" value={formatCurrency(wonValue)} />
            <StatCard icon={Users} label="Total Prospects" value={prospects?.length || 0} />
          </>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Pipeline</CardTitle></CardHeader>
        <CardContent>
          {(prospects || []).length === 0 ? (
            <EmptyState icon={TrendingUp} title="No prospects" description="Add prospects to see your pipeline" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {byStage.map(({ stage, prospects: stageProspects, count }) => (
                <div key={stage} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">{stage}</span>
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{count}</span>
                  </div>
                  <div className="space-y-2">
                    {stageProspects.slice(0, 3).map((p: any) => (
                      <div key={p.id} className="text-xs p-2 bg-muted/50 rounded" data-testid={`pipeline-card-${p.id}`}>
                        <p className="font-medium truncate">{p.company_name}</p>
                        {p.deal_value && <p className="text-muted-foreground">{formatCurrency(p.deal_value)}</p>}
                      </div>
                    ))}
                    {stageProspects.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">+{stageProspects.length - 3} more</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Top Prospects</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(prospects || [])
              .filter((p) => p.deal_value && !["Won", "Lost"].includes(p.status))
              .sort((a, b) => (b.deal_value || 0) * (b.probability || 50) - (a.deal_value || 0) * (a.probability || 50))
              .slice(0, 5)
              .map((p: any) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`top-prospect-${p.id}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{getInitials(p.contact_name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.company_name}</p>
                      <p className="text-xs text-muted-foreground">{p.contact_name}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium">{formatCurrency(p.deal_value)}</p>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
