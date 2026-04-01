import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Users, Shield, Activity, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminConsole() {
  const { toast } = useToast();
  const { data: users, isLoading: loadingUsers } = useQuery<any[]>({ queryKey: ["/api/users"] });
  const { data: auditLogs, isLoading: loadingLogs } = useQuery<any[]>({ queryKey: ["/api/audit-logs"] });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/functions/createSandboxData", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({ title: "Seed data created" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  return (
    <div>
      <PageHeader title="Admin Console" subtitle="System configuration, user management, and audit logs" />

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users" data-testid="tab-users"><Users className="h-4 w-4 mr-2" />Users</TabsTrigger>
          <TabsTrigger value="audit" data-testid="tab-audit"><Activity className="h-4 w-4 mr-2" />Audit Logs</TabsTrigger>
          <TabsTrigger value="system" data-testid="tab-system"><Settings className="h-4 w-4 mr-2" />System</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {loadingUsers ? <TableSkeleton /> : (!users || users.length === 0) ? (
            <EmptyState icon={Users} title="No users" description="No users found in the system" />
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50 border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Status</th>
                </tr></thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b" data-testid={`user-row-${u.id}`}>
                      <td className="p-3 font-medium">{u.full_name || "—"}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{u.email}</td>
                      <td className="p-3"><Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge></td>
                      <td className="p-3 hidden lg:table-cell"><Badge variant={u.status === "active" ? "default" : "secondary"}>{u.status || "active"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="audit">
          {loadingLogs ? <TableSkeleton /> : (!auditLogs || auditLogs.length === 0) ? (
            <EmptyState icon={Shield} title="No audit logs" description="Activity will be logged here" />
          ) : (
            <div className="space-y-2">
              {auditLogs.slice(0, 50).map((log: any) => (
                <Card key={log.id} data-testid={`audit-log-${log.id}`}>
                  <CardContent className="p-3 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user_email} - {log.entity_type} {log.entity_id}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatRelativeTime(log.created_date)}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader><CardTitle>System Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Seed Data</h3>
                <p className="text-sm text-muted-foreground mb-3">Generate sample data for testing and development.</p>
                <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} data-testid="button-seed-data">
                  {seedMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Generate Seed Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
