import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2, Copy, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientInvites() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const { data: invites, isLoading } = useQuery<any[]>({ queryKey: ["/api/client-invites"] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/invites/client", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client-invites"] });
      setEmail("");
      setName("");
      setCompany("");
      toast({ title: "Invite sent" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/portal-register?token=${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard" });
  };

  const getStatusIcon = (invite: any) => {
    if (invite.used) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusLabel = (invite: any) => {
    if (invite.used) return "Used";
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) return "Expired";
    return "Pending";
  };

  return (
    <div>
      <PageHeader title="Client Invitations" subtitle="Send portal access invitations to clients" />

      <Card className="mb-6">
        <CardHeader><CardTitle>Send New Invitation</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Client Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" data-testid="input-invite-email" />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" data-testid="input-invite-name" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" data-testid="input-invite-company" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => createMutation.mutate({ email, name, company })}
              disabled={createMutation.isPending || !email}
              data-testid="button-send-invite"
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send Invitation
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? <TableSkeleton /> : (!invites || invites.length === 0) ? (
        <EmptyState icon={Mail} title="No invitations" description="Send your first client invitation above" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b">
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Company</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">Sent</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {invites.map((inv: any) => (
                <tr key={inv.id} className="border-b" data-testid={`invite-row-${inv.id}`}>
                  <td className="p-3 font-medium">{inv.email}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{inv.company_name || "—"}</td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground">{formatDate(inv.created_date, "short")}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(inv)}
                      <span className="text-sm">{getStatusLabel(inv)}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {!inv.used && inv.invite_token && (
                      <Button variant="ghost" size="sm" onClick={() => copyLink(inv.invite_token)} data-testid={`button-copy-link-${inv.id}`}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
