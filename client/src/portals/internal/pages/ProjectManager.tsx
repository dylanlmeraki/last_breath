import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, FolderKanban, LayoutGrid, List, Loader2 } from "lucide-react";
import { formatDate, generateProjectNumber, formatCurrency } from "@/lib/utils";

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  client_email: z.string().email("Valid email required"),
  client_name: z.string().optional(),
  project_type: z.string().min(1, "Project type is required"),
  status: z.string().default("Planning"),
  priority: z.string().default("Medium"),
  location: z.string().optional(),
  description: z.string().optional(),
  budget: z.coerce.number().optional(),
});

const STATUS_OPTIONS = ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"];
const TYPE_OPTIONS = ["Commercial", "Residential", "Industrial", "Infrastructure", "Renovation"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

export default function ProjectManager() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<any[]>({
    queryKey: ["/api/projects"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/projects", {
        ...data,
        project_number: generateProjectNumber(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setDialogOpen(false);
      toast({ title: "Project created successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to create project", description: error.message });
    },
  });

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: "", client_email: "", client_name: "", project_type: "",
      status: "Planning", priority: "Medium", location: "", description: "", budget: undefined,
    },
  });

  const filtered = (projects || []).filter((p) => {
    if (search) {
      const s = search.toLowerCase();
      if (
        !p.project_name?.toLowerCase().includes(s) &&
        !p.project_number?.toLowerCase().includes(s) &&
        !p.client_name?.toLowerCase().includes(s) &&
        !p.client_email?.toLowerCase().includes(s)
      ) return false;
    }
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (typeFilter !== "all" && p.project_type !== typeFilter) return false;
    return true;
  });

  const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";

  return (
    <div>
      <PageHeader
        title="Project Manager"
        subtitle={`${filtered.length} project${filtered.length !== 1 ? "s" : ""}`}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-project">
                <Plus className="h-4 w-4 mr-1" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                  <FormField control={form.control} name="project_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Office Renovation" {...field} data-testid="input-project-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="client_email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Email</FormLabel>
                        <FormControl><Input type="email" placeholder="client@company.com" {...field} data-testid="input-client-email" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="client_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl><Input placeholder="John Smith" {...field} data-testid="input-client-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="project_type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-project-type"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>{TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="priority" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-priority"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{PRIORITY_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input placeholder="San Francisco, CA" {...field} data-testid="input-location" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Project description..." {...field} data-testid="input-description" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="budget" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget ($)</FormLabel>
                      <FormControl><Input type="number" placeholder="50000" {...field} data-testid="input-budget" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-project">
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Project
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." className="flex-1" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]" data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]" data-testid="filter-type"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")} data-testid="button-view-list">
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")} data-testid="button-view-grid">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects found" description="Create your first project to get started" action={{ label: "New Project", onClick: () => setDialogOpen(true) }} />
      ) : viewMode === "list" ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-3 font-medium">Project</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Client</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Type</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Progress</th>
                  <th className="text-left p-3 font-medium hidden xl:table-cell">Budget</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => navigate(basePath + "/projects/" + p.id)}
                    data-testid={`project-row-${p.id}`}
                  >
                    <td className="p-3">
                      <p className="font-medium">{p.project_name}</p>
                      <p className="text-xs text-muted-foreground">{p.project_number}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{p.client_name || p.client_email}</td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground">{p.project_type}</td>
                    <td className="p-3"><StatusBadge status={p.status} /></td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={p.progress_percentage || 0} className="h-2 w-20" />
                        <span className="text-xs text-muted-foreground">{p.progress_percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="p-3 hidden xl:table-cell text-muted-foreground">{formatCurrency(p.budget)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p: any) => (
            <Card
              key={p.id}
              className="cursor-pointer hover-elevate transition-all"
              onClick={() => navigate(basePath + "/projects/" + p.id)}
              data-testid={`project-card-${p.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{p.project_name}</p>
                    <p className="text-xs text-muted-foreground">{p.project_number}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{p.client_name || p.client_email}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{p.project_type}</span>
                  <span className="text-sm font-medium">{formatCurrency(p.budget)}</span>
                </div>
                <div className="mt-3">
                  <Progress value={p.progress_percentage || 0} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
