import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Mail, Loader2, Save, Send, CheckCircle2, XCircle, Shield,
  MousePointerClick, Eye, Globe, Server,
} from "lucide-react";

export default function AdminEmailSettings() {
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState("");
  const { data: settings, isLoading } = useQuery<any[]>({ queryKey: ["/api/email-settings"] });
  const { data: emailStatus } = useQuery<any>({ queryKey: ["/api/admin/email-status"] });

  const currentSettings = settings?.[0] || {};
  const [fromName, setFromName] = useState("Pacific Engineering");
  const [fromEmail, setFromEmail] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (settings?.[0]) {
      const s = settings[0];
      if (s.from_name) setFromName(s.from_name);
      if (s.from_email) setFromEmail(s.from_email);
      if (s.reply_to) setReplyTo(s.reply_to);
      if (s.notifications_enabled !== undefined) setNotificationsEnabled(s.notifications_enabled);
    }
  }, [settings]);

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

  const testMutation = useMutation({
    mutationFn: async (to: string) => {
      const res = await apiRequest("POST", "/api/admin/test-email", { to });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Test email sent!", description: `Check ${testEmail} for the test message.` });
      } else {
        toast({ variant: "destructive", title: "Email failed", description: data.error || "Unknown error" });
      }
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed to send", description: e.message }),
  });

  const handleTestEmail = () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast({ variant: "destructive", title: "Enter a valid email address" });
      return;
    }
    testMutation.mutate(testEmail);
  };

  return (
    <div>
      <PageHeader title="Email Settings" subtitle="Configure email provider, sender details, and test your setup" />

      {isLoading ? <TableSkeleton rows={4} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Sender Configuration
                </CardTitle>
                <CardDescription>
                  Configure how outgoing emails appear to recipients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Pacific Engineering" data-testid="input-from-name" />
                </div>
                <div className="space-y-2">
                  <Label>From Email</Label>
                  <Input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="notifications@pacificengineeringsf.com" data-testid="input-from-email" />
                </div>
                <div className="space-y-2">
                  <Label>Reply-To Email</Label>
                  <Input value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="info@pacificengineeringsf.com" data-testid="input-reply-to" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Test Email
                </CardTitle>
                <CardDescription>
                  Verify your email configuration is working correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    type="email"
                    data-testid="input-test-email"
                  />
                </div>
                <Button
                  onClick={handleTestEmail}
                  disabled={testMutation.isPending}
                  variant="outline"
                  data-testid="button-send-test-email"
                >
                  {testMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Test Email
                </Button>
                {testMutation.isSuccess && testMutation.data?.success && (
                  <p className="text-sm text-green-600 flex items-center gap-1" data-testid="text-test-success">
                    <CheckCircle2 className="h-4 w-4" /> Test email sent successfully
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Provider Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <Badge variant="secondary" data-testid="badge-provider">{emailStatus?.provider || "Resend"}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Key</span>
                  {emailStatus?.configured ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" data-testid="badge-api-configured">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive" data-testid="badge-api-missing">
                      <XCircle className="h-3 w-3 mr-1" /> Not Set
                    </Badge>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Domain</span>
                  <span className="text-sm font-mono" data-testid="text-domain">{emailStatus?.domain || "—"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> TLS
                  </span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" data-testid="badge-tls">
                    Enforced
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MousePointerClick className="h-3.5 w-3.5" /> Click Tracking
                  </span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" data-testid="badge-click-tracking">
                    Enabled
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> Open Tracking
                  </span>
                  <Badge variant="outline" data-testid="badge-open-tracking">
                    Available
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Portal URLs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Internal Portal</p>
                  <p className="text-sm font-mono truncate" data-testid="text-internal-url">{emailStatus?.internal_url || "—"}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Client Portal</p>
                  <p className="text-sm font-mono truncate" data-testid="text-portal-url">{emailStatus?.portal_url || "—"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">DNS Configuration</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  SPF, DKIM, and DMARC records are managed through the Resend dashboard and your domain registrar (Namecheap). No SMTP configuration is needed in this app — Resend handles email delivery via API.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
