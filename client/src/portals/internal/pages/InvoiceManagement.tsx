import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = ["draft", "sent", "paid", "overdue", "cancelled"];

export default function InvoiceManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: invoices, isLoading } = useQuery<any[]>({ queryKey: ["/api/invoices"] });

  const filtered = (invoices || []).filter((inv) => {
    if (search && !inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) && !inv.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    return true;
  });

  const totalInvoiced = (invoices || []).reduce((s, i) => s + (i.total_amount || 0), 0);
  const totalPaid = (invoices || []).filter((i) => i.status === "paid").reduce((s, i) => s + (i.total_amount || 0), 0);
  const totalOutstanding = (invoices || []).filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + (i.total_amount || 0), 0);
  const overdueAmount = (invoices || []).filter((i) => i.status === "overdue").reduce((s, i) => s + (i.total_amount || 0), 0);

  return (
    <div>
      <PageHeader title="Invoices" subtitle={`${filtered.length} invoice${filtered.length !== 1 ? "s" : ""}`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={DollarSign} label="Total Invoiced" value={formatCurrency(totalInvoiced)} />
            <StatCard icon={CheckCircle} label="Total Paid" value={formatCurrency(totalPaid)} />
            <StatCard icon={CreditCard} label="Outstanding" value={formatCurrency(totalOutstanding)} />
            <StatCard icon={AlertTriangle} label="Overdue" value={formatCurrency(overdueAmount)} />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search invoices..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={DollarSign} title="No invoices" description="Invoices will appear here when created" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b">
              <th className="text-left p-3 font-medium">Invoice #</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Description</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">Due Date</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((inv: any) => (
                <tr key={inv.id} className="border-b hover:bg-accent/50" data-testid={`invoice-row-${inv.id}`}>
                  <td className="p-3 font-medium">{inv.invoice_number || "—"}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground truncate max-w-[200px]">{inv.description || "—"}</td>
                  <td className="p-3 font-medium">{formatCurrency(inv.total_amount)}</td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground">{formatDate(inv.due_date, "short")}</td>
                  <td className="p-3"><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
