import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useClientInvoices, useClientProjects } from "../lib/useClientData";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  CheckCircle,
  CreditCard,
  AlertTriangle,
  Clock,
  ArrowLeft,
  FileText,
  Calendar,
  Building2,
  Receipt,
  CircleDot,
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { SearchInput } from "@/components/shared/SearchInput";

type FilterStatus = "all" | "pending" | "paid" | "overdue" | "draft";

export default function ClientInvoices() {
  const { user } = useAuth();
  const { data: invoices, isLoading } = useClientInvoices();
  const { data: projects } = useClientProjects();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const myInvoices = invoices || [];

  const projectMap = useMemo(() => {
    const map: Record<string, any> = {};
    (projects || []).forEach((p: any) => {
      map[p.id] = p;
    });
    return map;
  }, [projects]);

  const filteredInvoices = useMemo(() => {
    let filtered = myInvoices;

    if (filterStatus !== "all") {
      if (filterStatus === "pending") {
        filtered = filtered.filter((i: any) => i.status === "sent" || i.status === "pending");
      } else {
        filtered = filtered.filter((i: any) => i.status === filterStatus);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i: any) =>
          (i.invoice_number || "").toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q) ||
          (projectMap[i.project_id]?.project_name || "").toLowerCase().includes(q)
      );
    }

    return filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.issue_date || a.created_date).getTime();
      const dateB = new Date(b.issue_date || b.created_date).getTime();
      return dateB - dateA;
    });
  }, [myInvoices, filterStatus, searchQuery, projectMap]);

  const totalInvoiced = myInvoices.reduce((s: number, i: any) => s + (i.total_amount || 0), 0);
  const totalPaid = myInvoices
    .filter((i: any) => i.status === "paid")
    .reduce((s: number, i: any) => s + (i.total_amount || 0), 0);
  const totalOutstanding = myInvoices
    .filter((i: any) => i.status === "sent" || i.status === "pending")
    .reduce((s: number, i: any) => s + (i.total_amount || 0), 0);
  const totalOverdue = myInvoices
    .filter((i: any) => i.status === "overdue")
    .reduce((s: number, i: any) => s + (i.total_amount || 0), 0);
  const overdueCount = myInvoices.filter((i: any) => i.status === "overdue").length;

  const selectedInvoice = selectedInvoiceId
    ? myInvoices.find((i: any) => i.id === selectedInvoiceId)
    : null;

  const paidInvoices = myInvoices
    .filter((i: any) => i.status === "paid" && i.paid_date)
    .sort((a: any, b: any) => new Date(b.paid_date).getTime() - new Date(a.paid_date).getTime());

  const statusFilters: { label: string; value: FilterStatus; count: number }[] = [
    { label: "All", value: "all", count: myInvoices.length },
    {
      label: "Pending",
      value: "pending",
      count: myInvoices.filter((i: any) => i.status === "sent" || i.status === "pending").length,
    },
    { label: "Paid", value: "paid", count: myInvoices.filter((i: any) => i.status === "paid").length },
    { label: "Overdue", value: "overdue", count: myInvoices.filter((i: any) => i.status === "overdue").length },
  ];

  if (selectedInvoice) {
    return <InvoiceDetail invoice={selectedInvoice} project={projectMap[selectedInvoice.project_id]} onBack={() => setSelectedInvoiceId(null)} />;
  }

  return (
    <div>
      <PageHeader title="Invoices" subtitle="View and manage your invoices and payments" />

      {overdueCount > 0 && !isLoading && (
        <Card className="mb-6 border-red-200 dark:border-red-900/50" data-testid="alert-overdue-invoices">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-400">
                  {overdueCount} overdue invoice{overdueCount !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total overdue amount: {formatCurrency(totalOverdue)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus("overdue")}
                data-testid="button-view-overdue"
              >
                View Overdue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={Receipt} label="Total Invoiced" value={formatCurrency(totalInvoiced)} />
            <StatCard icon={CheckCircle} label="Paid" value={formatCurrency(totalPaid)} />
            <StatCard icon={CreditCard} label="Outstanding" value={formatCurrency(totalOutstanding)} />
            <StatCard icon={AlertTriangle} label="Overdue" value={formatCurrency(totalOverdue)} />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              variant={filterStatus === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(f.value)}
              data-testid={`button-filter-${f.value}`}
            >
              {f.label}
              {f.count > 0 && (
                <Badge variant="secondary" className="ml-1.5 no-default-hover-elevate no-default-active-elevate">
                  {f.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search invoices..."
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : filteredInvoices.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title={filterStatus !== "all" ? "No matching invoices" : "No invoices"}
          description={
            filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Invoices will appear here when generated"
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-invoices">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium">Invoice #</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Project</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Description</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Issue Date</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Due Date</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv: any) => {
                  const project = projectMap[inv.project_id];
                  const isOverdue =
                    inv.status !== "paid" &&
                    inv.due_date &&
                    new Date(inv.due_date) < new Date();
                  return (
                    <tr
                      key={inv.id}
                      className="border-b hover-elevate cursor-pointer"
                      onClick={() => setSelectedInvoiceId(inv.id)}
                      data-testid={`invoice-row-${inv.id}`}
                    >
                      <td className="p-3 font-medium">{inv.invoice_number || "\u2014"}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">
                        {project?.project_name || "\u2014"}
                      </td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground truncate max-w-[200px]">
                        {inv.description || "\u2014"}
                      </td>
                      <td className="p-3 text-right font-medium">{formatCurrency(inv.total_amount)}</td>
                      <td className="p-3 hidden sm:table-cell text-muted-foreground">
                        {formatDate(inv.issue_date, "short")}
                      </td>
                      <td className="p-3 hidden sm:table-cell text-muted-foreground">
                        <span className={cn(isOverdue && "text-red-600 dark:text-red-400 font-medium")}>
                          {formatDate(inv.due_date, "short")}
                        </span>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={inv.status === "sent" ? "pending" : inv.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {paidInvoices.length > 0 && !isLoading && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4" data-testid="text-payment-history">Payment History</h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {paidInvoices.slice(0, 10).map((inv: any, idx: number) => {
                  const project = projectMap[inv.project_id];
                  return (
                    <div key={inv.id}>
                      {idx > 0 && <Separator className="mb-4" />}
                      <div
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => setSelectedInvoiceId(inv.id)}
                        data-testid={`payment-history-${inv.id}`}
                      >
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="font-medium">{inv.invoice_number || "Invoice"}</p>
                            <p className="font-semibold text-green-700 dark:text-green-400">
                              {formatCurrency(inv.total_amount)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <span>Paid {formatDate(inv.paid_date, "long")}</span>
                            {project && (
                              <>
                                <CircleDot className="h-2 w-2" />
                                <span>{project.project_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function InvoiceDetail({
  invoice,
  project,
  onBack,
}: {
  invoice: any;
  project: any;
  onBack: () => void;
}) {
  const lineItems = Array.isArray(invoice.line_items) ? invoice.line_items : [];
  const isOverdue =
    invoice.status !== "paid" &&
    invoice.due_date &&
    new Date(invoice.due_date) < new Date();

  const daysUntilDue = invoice.due_date
    ? Math.ceil((new Date(invoice.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back-invoices">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Invoices
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold" data-testid="text-invoice-number">
              {invoice.invoice_number || "Invoice"}
            </h1>
            <StatusBadge
              status={invoice.status === "sent" ? "pending" : invoice.status}
              size="md"
            />
            {isOverdue && (
              <Badge variant="destructive" className="no-default-hover-elevate no-default-active-elevate">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          {invoice.description && (
            <p className="text-muted-foreground mt-1" data-testid="text-invoice-description">
              {invoice.description}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold" data-testid="text-invoice-amount">
            {formatCurrency(invoice.total_amount)}
          </p>
          {daysUntilDue !== null && invoice.status !== "paid" && (
            <p
              className={cn(
                "text-sm mt-1",
                daysUntilDue < 0
                  ? "text-red-600 dark:text-red-400"
                  : daysUntilDue <= 7
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
              )}
            >
              {daysUntilDue < 0
                ? `${Math.abs(daysUntilDue)} days overdue`
                : daysUntilDue === 0
                  ? "Due today"
                  : `Due in ${daysUntilDue} days`}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {lineItems.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base">Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm" data-testid="table-line-items">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Description</th>
                      <th className="text-right py-2 font-medium">Qty</th>
                      <th className="text-right py-2 font-medium">Rate</th>
                      <th className="text-right py-2 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b last:border-0" data-testid={`line-item-${idx}`}>
                        <td className="py-2">{item.description || item.name || "\u2014"}</td>
                        <td className="py-2 text-right text-muted-foreground">
                          {item.quantity ?? 1}
                        </td>
                        <td className="py-2 text-right text-muted-foreground">
                          {formatCurrency(item.rate || item.unit_price)}
                        </td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(item.amount || (item.quantity || 1) * (item.rate || item.unit_price || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {invoice.subtotal != null && (
                      <tr className="border-t">
                        <td colSpan={3} className="py-2 text-right text-muted-foreground">
                          Subtotal
                        </td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(invoice.subtotal)}
                        </td>
                      </tr>
                    )}
                    {invoice.tax != null && invoice.tax > 0 && (
                      <tr>
                        <td colSpan={3} className="py-2 text-right text-muted-foreground">
                          Tax
                        </td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(invoice.tax)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t">
                      <td colSpan={3} className="py-2 text-right font-semibold">
                        Total
                      </td>
                      <td className="py-2 text-right font-bold text-base">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          )}

          {lineItems.length === 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base">Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold text-lg">{formatCurrency(invoice.total_amount)}</span>
                </div>
                {invoice.subtotal != null && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                )}
                {invoice.tax != null && invoice.tax > 0 && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatCurrency(invoice.tax)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PaymentStep
                  label="Invoice Created"
                  date={invoice.issue_date || invoice.created_date}
                  completed
                />
                <PaymentStep
                  label="Invoice Sent"
                  date={invoice.issue_date}
                  completed={invoice.status !== "draft"}
                />
                <PaymentStep
                  label="Payment Due"
                  date={invoice.due_date}
                  completed={invoice.status === "paid"}
                  warning={isOverdue}
                />
                <PaymentStep
                  label="Payment Received"
                  date={invoice.paid_date}
                  completed={invoice.status === "paid"}
                  isLast
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Invoice Number</p>
                  <p className="font-medium" data-testid="text-detail-invoice-number">
                    {invoice.invoice_number || "\u2014"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-medium" data-testid="text-detail-issue-date">
                    {formatDate(invoice.issue_date, "long")}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p
                    className={cn(
                      "font-medium",
                      isOverdue && "text-red-600 dark:text-red-400"
                    )}
                    data-testid="text-detail-due-date"
                  >
                    {formatDate(invoice.due_date, "long")}
                  </p>
                </div>
              </div>
              {invoice.paid_date && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Paid Date</p>
                      <p className="font-medium text-green-700 dark:text-green-400" data-testid="text-detail-paid-date">
                        {formatDate(invoice.paid_date, "long")}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {project && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Project</p>
                      <p className="font-medium" data-testid="text-detail-project">
                        {project.project_name}
                      </p>
                      {project.project_number && (
                        <p className="text-xs text-muted-foreground">
                          {project.project_number}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-1">
                  {invoice.status === "paid" ? "Amount Paid" : "Amount Due"}
                </p>
                <p
                  className={cn(
                    "text-3xl font-bold",
                    invoice.status === "paid"
                      ? "text-green-700 dark:text-green-400"
                      : isOverdue
                        ? "text-red-600 dark:text-red-400"
                        : ""
                  )}
                  data-testid="text-balance-amount"
                >
                  {formatCurrency(invoice.total_amount)}
                </p>
                {invoice.status === "paid" && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Fully paid
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({
  label,
  date,
  completed,
  warning,
  isLast,
}: {
  label: string;
  date?: string | null;
  completed?: boolean;
  warning?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-3 w-3 rounded-full border-2",
            completed
              ? "bg-green-500 border-green-500"
              : warning
                ? "bg-red-500 border-red-500"
                : "bg-transparent border-muted-foreground/40"
          )}
        />
        {!isLast && (
          <div
            className={cn(
              "w-0.5 h-8",
              completed ? "bg-green-300 dark:bg-green-700" : "bg-muted"
            )}
          />
        )}
      </div>
      <div className="-mt-0.5">
        <p className={cn("text-sm font-medium", !completed && !warning && "text-muted-foreground")}>
          {label}
        </p>
        {date && (
          <p className="text-xs text-muted-foreground">{formatDate(date, "long")}</p>
        )}
      </div>
    </div>
  );
}
