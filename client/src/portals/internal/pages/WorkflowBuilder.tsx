import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Workflow, Zap, Clock } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default function WorkflowBuilder() {
  const { toast } = useToast();
  const { data: workflows, isLoading } = useQuery<any[]>({ queryKey: ["/api/workflows"] });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await apiRequest("PUT", `/api/workflows/${id}`, { active });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/workflows"] }),
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  return (
    <div>
      <PageHeader title="Workflow Builder" subtitle="Automate your business processes" />

      {isLoading ? <TableSkeleton /> : (!workflows || workflows.length === 0) ? (
        <EmptyState icon={Workflow} title="No workflows" description="Create automated workflows to streamline operations" />
      ) : (
        <div className="space-y-3">
          {workflows.map((wf: any) => (
            <Card key={wf.id} className="hover-elevate" data-testid={`workflow-card-${wf.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10"><Zap className="h-5 w-5 text-primary" /></div>
                  <div className="min-w-0">
                    <p className="font-medium">{wf.name}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>Trigger: {wf.trigger_type}</span>
                      <span>Runs: {wf.execution_count || 0}</span>
                      {wf.last_executed && <span>Last: {formatRelativeTime(wf.last_executed)}</span>}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={wf.active}
                  onCheckedChange={(active) => toggleMutation.mutate({ id: wf.id, active })}
                  data-testid={`toggle-workflow-${wf.id}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
