import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Mail, Zap, BarChart3 } from "lucide-react";

export default function SequenceOptimization() {
  const { data: sequences, isLoading } = useQuery<any[]>({ queryKey: ["/api/email-sequences"] });

  return (
    <div>
      <PageHeader title="Sequence Optimization" subtitle="Analyze and optimize email sequence performance" />

      {isLoading ? <TableSkeleton /> : (!sequences || sequences.length === 0) ? (
        <EmptyState icon={TrendingUp} title="No sequences to optimize" description="Create email sequences first to view optimization insights" />
      ) : (
        <div className="space-y-4">
          {sequences.map((seq: any) => {
            const steps = (seq.steps as any[]) || [];
            return (
              <Card key={seq.id} className="hover-elevate" data-testid={`optimization-card-${seq.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-base">{seq.name}</CardTitle>
                    <Badge variant={seq.active ? "default" : "secondary"}>{seq.active ? "Active" : "Inactive"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold">{steps.length}</p>
                      <p className="text-xs text-muted-foreground">Steps</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold">{seq.prospect_count || 0}</p>
                      <p className="text-xs text-muted-foreground">Prospects</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold">{seq.open_rate ? `${seq.open_rate}%` : "—"}</p>
                      <p className="text-xs text-muted-foreground">Open Rate</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold">{seq.reply_rate ? `${seq.reply_rate}%` : "—"}</p>
                      <p className="text-xs text-muted-foreground">Reply Rate</p>
                    </div>
                  </div>
                  {steps.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Steps</p>
                      {steps.map((step: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-sm p-2 rounded bg-muted/20">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{i + 1}</div>
                          <span className="flex-1">{step.subject || step.name || `Step ${i + 1}`}</span>
                          {step.delay_days && <span className="text-xs text-muted-foreground">+{step.delay_days}d</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
