import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CheckCircle, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientInvoices() {
  const { data: invoices, isLoading } = useQuery<any[]>({ queryKey: ["/api/invoices"] });

  const totalPaid = (invoices || []).filter((i) => i.status === "paid").reduce((s, i) => s + (i.total_amount || 0), 0);
  const totalOutstanding = (invoices || []).filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + (i.total_amount || 0), 0);

  return (
    <div>
      <PageHeader title="Invoices" subtitle="View and manage your invoices" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={DollarSign} label="Total Invoiced" value={formatCurrency(totalPaid + totalOutstanding)} />
            <StatCard icon={CheckCircle} label="Paid" value={formatCurrency(totalPaid)} />
            <StatCard icon={CreditCard} label="Outstanding" value={formatCurrency(totalOutstanding)} />
          </>
        )}
      </div>

      {isLoading ? <TableSkeleton /> : (!invoices || invoices.length === 0) ? (
        <EmptyState icon={DollarSign} title="No invoices" description="Invoices will appear here when generated" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b">
              <th className="text-left p-3 font-medium">Invoice #</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Description</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Due Date</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="border-b" data-testid={`invoice-row-${inv.id}`}>
                  <td className="p-3 font-medium">{inv.invoice_number || "—"}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground truncate max-w-[200px]">{inv.description || "—"}</td>
                  <td className="p-3 font-medium">{formatCurrency(inv.total_amount)}</td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">{formatDate(inv.due_date, "short")}</td>
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
