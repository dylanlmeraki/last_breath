import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientRFIs() {
  const [search, setSearch] = useState("");
  const { data: rfis, isLoading } = useQuery<any[]>({ queryKey: ["/api/rfis"] });

  const filtered = (rfis || []).filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.subject?.toLowerCase().includes(q) || r.rfi_number?.toLowerCase().includes(q) || r.asked_by_name?.toLowerCase().includes(q);
  });

  return (
    <div>
      <PageHeader title="Client RFIs" subtitle="View and respond to client requests for information" />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search client RFIs..." />
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No client RFIs" description="Client requests for information will appear here" />
      ) : (
        <div className="space-y-3">
          {filtered.map((r: any) => (
            <Card key={r.id} className="hover-elevate" data-testid={`client-rfi-card-${r.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium text-muted-foreground">{r.rfi_number}</span>
                      {r.priority && <Badge variant="secondary" className="text-xs">{r.priority}</Badge>}
                    </div>
                    <p className="font-medium">{r.subject}</p>
                    {r.question && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.question}</p>}
                    <div className="flex gap-3 text-xs text-muted-foreground mt-2 flex-wrap">
                      {r.asked_by_name && <span>Asked by: {r.asked_by_name}</span>}
                      <span>Due: {formatDate(r.due_date, "short")}</span>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.answer && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Response:</p>
                    <p className="text-sm">{r.answer}</p>
                    {r.answered_by_name && <p className="text-xs text-muted-foreground mt-1">By: {r.answered_by_name}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
