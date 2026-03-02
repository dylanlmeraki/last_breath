import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Mail, Users, Zap, Target } from "lucide-react";

export default function SalesBotControl() {
  const { data: sequences, isLoading: ls } = useQuery<any[]>({ queryKey: ["/api/email-sequences"] });
  const { data: outreach, isLoading: lo } = useQuery<any[]>({ queryKey: ["/api/sales-outreach"] });

  const isLoading = ls || lo;
  const activeSequences = (sequences || []).filter((s) => s.active).length;
  const pendingOutreach = (outreach || []).filter((o) => o.status === "pending" || o.status === "queued").length;
  const completedOutreach = (outreach || []).filter((o) => o.status === "completed" || o.status === "sent").length;

  return (
    <div>
      <PageHeader title="Sales Bot Control" subtitle="Manage automated sales outreach and sequences" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={Zap} label="Active Sequences" value={activeSequences} />
            <StatCard icon={Mail} label="Total Sequences" value={(sequences || []).length} />
            <StatCard icon={Target} label="Pending Outreach" value={pendingOutreach} />
            <StatCard icon={Users} label="Completed" value={completedOutreach} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Email Sequences</CardTitle></CardHeader>
          <CardContent>
            {ls ? <TableSkeleton rows={3} /> : (!sequences || sequences.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No sequences configured</p>
            ) : (
              <div className="space-y-3">
                {sequences.map((seq: any) => (
                  <div key={seq.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`bot-sequence-${seq.id}`}>
                    <div>
                      <p className="font-medium text-sm">{seq.name}</p>
                      <p className="text-xs text-muted-foreground">{(seq.steps as any[])?.length || 0} steps</p>
                    </div>
                    <Badge variant={seq.active ? "default" : "secondary"}>{seq.active ? "Active" : "Paused"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Outreach</CardTitle></CardHeader>
          <CardContent>
            {lo ? <TableSkeleton rows={3} /> : (!outreach || outreach.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No outreach activity</p>
            ) : (
              <div className="space-y-3">
                {outreach.slice(0, 10).map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`bot-outreach-${o.id}`}>
                    <div>
                      <p className="font-medium text-sm">{o.prospect_name || o.prospect_email || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{o.sequence_name || "Direct"}</p>
                    </div>
                    <Badge variant="secondary">{o.status}</Badge>
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
