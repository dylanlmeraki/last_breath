import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Inbox, FileText } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function FormSubmissions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: submissions, isLoading } = useQuery<any[]>({ queryKey: ["/api/form-submissions"] });

  const filtered = (submissions || []).filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.form_name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <PageHeader title="Form Submissions" subtitle={`${filtered.length} submission${filtered.length !== 1 ? "s" : ""}`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search submissions..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="No submissions" description="Form submissions will appear here when received" />
      ) : (
        <div className="space-y-3">
          {filtered.map((sub: any) => (
            <Card key={sub.id} className="hover-elevate" data-testid={`submission-card-${sub.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <p className="font-medium">{sub.form_name || "Contact Form"}</p>
                    </div>
                    <div className="flex gap-3 text-sm text-muted-foreground flex-wrap">
                      {sub.name && <span>{sub.name}</span>}
                      {sub.email && <span>{sub.email}</span>}
                      {sub.phone && <span>{sub.phone}</span>}
                    </div>
                    {sub.message && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{sub.message}</p>}
                    <span className="text-xs text-muted-foreground mt-1 block">{formatRelativeTime(sub.created_date)}</span>
                  </div>
                  <StatusBadge status={sub.status || "new"} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
