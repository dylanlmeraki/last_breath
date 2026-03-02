import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileSignature, Eye, Send, CheckCircle, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const proposalSchema = z.object({
  title: z.string().min(1, "Title required"),
  amount: z.coerce.number().min(0).optional(),
  status: z.string().default("draft"),
  content_html: z.string().optional(),
});

const STATUS_OPTIONS = ["draft", "sent", "viewed", "signed", "declined", "expired"];

export default function ProposalDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: proposals, isLoading } = useQuery<any[]>({ queryKey: ["/api/proposals"] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => { const res = await apiRequest("POST", "/api/proposals", data); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/proposals"] }); setDialogOpen(false); toast({ title: "Proposal created" }); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const form = useForm({ resolver: zodResolver(proposalSchema), defaultValues: { title: "", amount: undefined, status: "draft", content_html: "" } });

  const filtered = (proposals || []).filter((p) => {
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const sent = (proposals || []).filter((p) => p.status === "sent").length;
  const signed = (proposals || []).filter((p) => p.status === "signed").length;
  const totalValue = (proposals || []).reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div>
      <PageHeader title="Proposals" subtitle={`${filtered.length} proposal${filtered.length !== 1 ? "s" : ""}`}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button data-testid="button-new-proposal"><Plus className="h-4 w-4 mr-1" /> New Proposal</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Proposal</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} data-testid="input-proposal-title" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem><FormLabel>Amount ($)</FormLabel><FormControl><Input type="number" {...field} data-testid="input-amount" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="content_html" render={({ field }) => (
                    <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={6} {...field} data-testid="input-content" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-proposal">
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create Proposal
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={FileSignature} label="Total Value" value={formatCurrency(totalValue)} />
            <StatCard icon={Send} label="Sent" value={sent} />
            <StatCard icon={CheckCircle} label="Signed" value={signed} />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search proposals..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={FileSignature} title="No proposals" description="Create your first proposal" action={{ label: "New Proposal", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {filtered.map((p: any) => (
            <Card key={p.id} className="hover-elevate" data-testid={`proposal-card-${p.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.title}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    {p.proposal_number && <span>{p.proposal_number}</span>}
                    <span>{formatCurrency(p.amount)}</span>
                    {p.sent_date && <span>Sent {formatDate(p.sent_date, "short")}</span>}
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
