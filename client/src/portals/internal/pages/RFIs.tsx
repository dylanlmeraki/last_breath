import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS = ["open", "answered", "closed"];

export default function RFIs() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: rfis, isLoading } = useQuery<any[]>({ queryKey: ["/api/rfis"] });

  const filtered = (rfis || []).filter((r) => {
    if (search && !r.subject?.toLowerCase().includes(search.toLowerCase()) && !r.rfi_number?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="RFIs" subtitle={`${filtered.length} request${filtered.length !== 1 ? "s" : ""} for information`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search RFIs..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No RFIs" description="Requests for information will appear here" />
      ) : (
        <div className="space-y-3">
          {filtered.map((r: any) => (
            <Card key={r.id} className="hover-elevate" data-testid={`rfi-card-${r.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">{r.rfi_number}</span>
                      <StatusBadge status={r.priority} size="sm" />
                    </div>
                    <p className="font-medium">{r.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.question}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                      {r.asked_by_name && <span>By: {r.asked_by_name}</span>}
                      <span>Due: {formatDate(r.due_date, "short")}</span>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.answer && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Answer:</p>
                    <p className="text-sm">{r.answer}</p>
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
