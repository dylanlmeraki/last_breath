import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderKanban, DollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = ["Planning", "In Progress", "Active", "Completed", "On Hold", "Cancelled"];

export default function ProjectsManager() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: projects, isLoading } = useQuery<any[]>({ queryKey: ["/api/projects"] });

  const filtered = (projects || []).filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.project_name?.toLowerCase().includes(q) && !p.name?.toLowerCase().includes(q) && !p.client_name?.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Projects Manager" subtitle={`${filtered.length} project${filtered.length !== 1 ? "s" : ""}`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-project-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects" description="Projects will appear here when created" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b">
              <th className="text-left p-3 font-medium">Project</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Client</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">Budget</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">Start Date</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-b hover:bg-accent/50" data-testid={`pm-project-row-${p.id}`}>
                  <td className="p-3">
                    <p className="font-medium">{p.project_name || p.name}</p>
                    {p.project_number && <p className="text-xs text-muted-foreground">{p.project_number}</p>}
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{p.client_name || "—"}</td>
                  <td className="p-3 hidden lg:table-cell font-medium">{formatCurrency(p.budget)}</td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground">{formatDate(p.start_date, "short")}</td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
