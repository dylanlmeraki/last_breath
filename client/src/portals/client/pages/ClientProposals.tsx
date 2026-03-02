import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FileSignature } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientProposals() {
  const { data: proposals, isLoading } = useQuery<any[]>({ queryKey: ["/api/proposals"] });

  return (
    <div>
      <PageHeader title="Proposals" subtitle="View and respond to project proposals" />

      {isLoading ? <TableSkeleton /> : (!proposals || proposals.length === 0) ? (
        <EmptyState icon={FileSignature} title="No proposals" description="Proposals sent to you will appear here" />
      ) : (
        <div className="space-y-3">
          {proposals.map((p: any) => (
            <Card key={p.id} className="hover-elevate" data-testid={`proposal-${p.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.title}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(p.amount)}</span>
                      {p.sent_date && <span>Sent {formatDate(p.sent_date, "short")}</span>}
                      {p.expiration_date && <span>Expires {formatDate(p.expiration_date, "short")}</span>}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
