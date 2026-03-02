import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { updateEntity } from "@/lib/apiClient";
import { queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileSignature, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientProposals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<any>(null);
  const { data: proposals, isLoading } = useQuery<any[]>({ queryKey: ["/api/proposals"] });

  const myProposals = (proposals || []).filter(
    (p) => p.client_email === user?.email || p.contact_email === user?.email
  );

  const respondMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateEntity("Proposal", id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      setSelected(null);
      toast({ title: "Response recorded", description: "Thank you for your response." });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  return (
    <div>
      <PageHeader title="Proposals" subtitle="View and respond to project proposals" />

      {isLoading ? <TableSkeleton /> : myProposals.length === 0 ? (
        <EmptyState icon={FileSignature} title="No proposals" description="Proposals sent to you will appear here" />
      ) : (
        <div className="space-y-3">
          {myProposals.map((p: any) => (
            <Card
              key={p.id}
              className="cursor-pointer hover-elevate"
              onClick={() => setSelected(p)}
              data-testid={`proposal-${p.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.title}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                      <span>{formatCurrency(p.amount)}</span>
                      {p.sent_date && <span>Sent {formatDate(p.sent_date, "short")}</span>}
                      {p.expiration_date && <span>Expires {formatDate(p.expiration_date, "short")}</span>}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={selected.status} size="md" />
                <span className="text-lg font-bold">{formatCurrency(selected.amount)}</span>
              </div>
              {selected.description && (
                <p className="text-sm text-muted-foreground">{selected.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.sent_date && (
                  <div>
                    <p className="text-muted-foreground">Sent</p>
                    <p className="font-medium">{formatDate(selected.sent_date)}</p>
                  </div>
                )}
                {selected.expiration_date && (
                  <div>
                    <p className="text-muted-foreground">Expires</p>
                    <p className="font-medium">{formatDate(selected.expiration_date)}</p>
                  </div>
                )}
                {selected.project_name && (
                  <div>
                    <p className="text-muted-foreground">Project</p>
                    <p className="font-medium">{selected.project_name}</p>
                  </div>
                )}
              </div>
              {(selected.status === "sent" || selected.status === "viewed") && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => respondMutation.mutate({ id: selected.id, status: "signed" })}
                    disabled={respondMutation.isPending}
                    data-testid="button-accept-proposal"
                  >
                    {respondMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => respondMutation.mutate({ id: selected.id, status: "declined" })}
                    disabled={respondMutation.isPending}
                    data-testid="button-decline-proposal"
                  >
                    {respondMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                    Decline
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
