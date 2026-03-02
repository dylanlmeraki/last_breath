import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, Save } from "lucide-react";

export default function AdminEmailSettings() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<any[]>({ queryKey: ["/api/email-settings"] });

  const currentSettings = settings?.[0] || {};
  const [fromName, setFromName] = useState(currentSettings.from_name || "Pacific Engineering");
  const [fromEmail, setFromEmail] = useState(currentSettings.from_email || "");
  const [replyTo, setReplyTo] = useState(currentSettings.reply_to || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(currentSettings.notifications_enabled ?? true);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (currentSettings.id) {
        const res = await apiRequest("PUT", `/api/email-settings/${currentSettings.id}`, data);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/email-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-settings"] });
      toast({ title: "Email settings saved" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  return (
    <div>
      <PageHeader title="Email Settings" subtitle="Configure email notification preferences and sender details" />

      {isLoading ? <TableSkeleton rows={4} /> : (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader><CardTitle>Sender Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>From Name</Label>
                <Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Pacific Engineering" data-testid="input-from-name" />
              </div>
              <div className="space-y-2">
                <Label>From Email</Label>
                <Input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="noreply@pacificengineering.com" data-testid="input-from-email" />
              </div>
              <div className="space-y-2">
                <Label>Reply-To Email</Label>
                <Input value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="info@pacificengineering.com" data-testid="input-reply-to" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Send email notifications for system events</p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} data-testid="switch-notifications" />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => saveMutation.mutate({ from_name: fromName, from_email: fromEmail, reply_to: replyTo, notifications_enabled: notificationsEnabled })}
            disabled={saveMutation.isPending}
            data-testid="button-save-email-settings"
          >
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
        </div>
      )}
    </div>
  );
}
