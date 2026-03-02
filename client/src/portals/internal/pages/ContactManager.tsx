import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
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
import { Plus, Users, Loader2, Building, Mail, Phone, TrendingUp } from "lucide-react";
import { formatCurrency, formatRelativeTime, getInitials } from "@/lib/utils";

const prospectSchema = z.object({
  company_name: z.string().min(1, "Company name required"),
  contact_name: z.string().min(1, "Contact name required"),
  contact_email: z.string().email("Valid email required").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  contact_title: z.string().optional(),
  company_type: z.string().optional(),
  status: z.string().default("New"),
  lead_source: z.string().default("Manual"),
  notes: z.string().optional(),
  deal_value: z.coerce.number().optional(),
});

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export default function ContactManager() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: prospects, isLoading } = useQuery<any[]>({ queryKey: ["/api/prospects"] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/prospects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospects"] });
      setDialogOpen(false);
      toast({ title: "Prospect created" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const form = useForm({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      company_name: "", contact_name: "", contact_email: "", contact_phone: "",
      contact_title: "", company_type: "", status: "New", lead_source: "Manual",
      notes: "", deal_value: undefined,
    },
  });

  const filtered = (prospects || []).filter((p) => {
    if (search) {
      const s = search.toLowerCase();
      if (!p.company_name?.toLowerCase().includes(s) && !p.contact_name?.toLowerCase().includes(s) && !p.contact_email?.toLowerCase().includes(s)) return false;
    }
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Contact Manager"
        subtitle={`${filtered.length} prospect${filtered.length !== 1 ? "s" : ""}`}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-prospect"><Plus className="h-4 w-4 mr-1" /> Add Prospect</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add Prospect</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                  <FormField control={form.control} name="company_name" render={({ field }) => (
                    <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} data-testid="input-company" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="contact_name" render={({ field }) => (
                      <FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input {...field} data-testid="input-contact-name" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="contact_title" render={({ field }) => (
                      <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} data-testid="input-contact-title" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="contact_email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} data-testid="input-contact-email" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="contact_phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} data-testid="input-contact-phone" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deal_value" render={({ field }) => (
                    <FormItem><FormLabel>Deal Value ($)</FormLabel><FormControl><Input type="number" {...field} data-testid="input-deal-value" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} data-testid="input-notes" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-prospect">
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Add Prospect
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search contacts..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]" data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton rows={5} /> : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No prospects" description="Add your first prospect to start building your pipeline" action={{ label: "Add Prospect", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p: any) => (
            <Card key={p.id} className="hover-elevate" data-testid={`prospect-card-${p.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">{getInitials(p.contact_name)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{p.contact_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{p.contact_title}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-3.5 w-3.5" /><span className="truncate">{p.company_name}</span>
                  </div>
                  {p.contact_email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /><span className="truncate">{p.contact_email}</span>
                    </div>
                  )}
                  {p.deal_value && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" /><span className="font-medium">{formatCurrency(p.deal_value)}</span>
                    </div>
                  )}
                </div>
                {(p.engagement_score != null || p.fit_score != null) && (
                  <div className="flex gap-3 mt-3 pt-3 border-t">
                    {p.engagement_score != null && (
                      <div className="text-xs"><span className="text-muted-foreground">Engagement:</span> <span className="font-medium">{Math.round(p.engagement_score)}</span></div>
                    )}
                    {p.fit_score != null && (
                      <div className="text-xs"><span className="text-muted-foreground">Fit:</span> <span className="font-medium">{Math.round(p.fit_score)}</span></div>
                    )}
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
