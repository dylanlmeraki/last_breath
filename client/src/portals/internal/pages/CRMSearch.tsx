import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Building2, Mail, Phone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CRMSearch() {
  const [search, setSearch] = useState("");
  const { data: prospects, isLoading } = useQuery<any[]>({ queryKey: ["/api/prospects"] });

  const filtered = (prospects || []).filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.company?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <PageHeader title="CRM Search" subtitle="Search prospects by name, company, or email" />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, company, email, or phone..." />
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={search ? Search : Users} title={search ? "No results found" : "Search prospects"} description={search ? "Try a different search term" : "Enter a name, company, or email to search"} />
      ) : (
        <div className="space-y-3">
          {filtered.map((p: any) => (
            <Card key={p.id} className="hover-elevate" data-testid={`prospect-card-${p.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.name || "Unknown"}</p>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
                      {p.company && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{p.company}</span>}
                      {p.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{p.email}</span>}
                      {p.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{p.phone}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p.deal_value > 0 && <span className="text-sm font-medium">{formatCurrency(p.deal_value)}</span>}
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
