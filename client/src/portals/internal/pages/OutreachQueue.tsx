import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, Mail } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

const STATUS_OPTIONS = ["pending", "queued", "sent", "completed", "failed"];

export default function OutreachQueue() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data: outreach, isLoading } = useQuery<any[]>({ queryKey: ["/api/sales-outreach"] });

  const filtered = (outreach || []).filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Outreach Queue" subtitle={`${filtered.length} outreach item${filtered.length !== 1 ? "s" : ""}`} />

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={Send} title="No outreach items" description={statusFilter !== "all" ? `No ${statusFilter} outreach items` : "Outreach queue is empty"} />
      ) : (
        <div className="space-y-3">
          {filtered.map((o: any) => (
            <Card key={o.id} className="hover-elevate" data-testid={`outreach-card-${o.id}`}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10"><Mail className="h-4 w-4 text-primary" /></div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{o.prospect_name || o.prospect_email || "Unknown prospect"}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      {o.sequence_name && <span>{o.sequence_name}</span>}
                      {o.step_number && <span>Step {o.step_number}</span>}
                      {o.scheduled_date && <span><Clock className="h-3 w-3 inline mr-0.5" />{formatDate(o.scheduled_date, "short")}</span>}
                    </div>
                  </div>
                </div>
                <StatusBadge status={o.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
