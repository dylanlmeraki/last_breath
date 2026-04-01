import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS = ["pending", "approved", "rejected", "in_review"];

export default function ProjectRequests() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: requests, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-requests"] });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PUT", `/api/project-requests/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-requests"] });
      toast({ title: "Request updated" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const filtered = (requests || []).filter((r) => statusFilter === "all" || r.status === statusFilter);

  return (
    <div>
      <PageHeader title="Project Requests" subtitle={`${filtered.length} request${filtered.length !== 1 ? "s" : ""}`} />

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-request-status">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No project requests" description="Client project requests will appear here" />
      ) : (
        <div className="space-y-3">
          {filtered.map((req: any) => (
            <Card key={req.id} className="hover-elevate" data-testid={`request-card-${req.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{req.title || req.project_type || "Project Request"}</p>
                    {req.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{req.description}</p>}
                    <div className="flex gap-3 text-xs text-muted-foreground mt-2 flex-wrap">
                      {req.client_name && <span>Client: {req.client_name}</span>}
                      {req.client_email && <span>{req.client_email}</span>}
                      <span>{formatDate(req.created_date, "short")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={req.status || "pending"} />
                    {(req.status === "pending" || req.status === "in_review") && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => updateMutation.mutate({ id: req.id, status: "approved" })} data-testid={`button-approve-${req.id}`}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => updateMutation.mutate({ id: req.id, status: "rejected" })} data-testid={`button-reject-${req.id}`}>
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
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
