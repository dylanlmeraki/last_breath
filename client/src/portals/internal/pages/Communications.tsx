import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Mail, FileText, Send, Plus, Loader2, Eye, LayoutTemplate } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

function TemplatePreviewCard({ template }: { template: any }) {
  const [showPreview, setShowPreview] = useState(false);
  const htmlContent = template.html_body || template.body || "";

  return (
    <>
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`comm-template-${template.id}`}>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{template.name}</p>
          <p className="text-xs text-muted-foreground truncate">{template.subject || "No subject"}</p>
          {template.category && (
            <Badge variant="outline" className="text-xs mt-1">{template.category}</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPreview(true)}
          data-testid={`button-preview-template-${template.id}`}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {showPreview && (
        <Dialog open={true} onOpenChange={() => setShowPreview(false)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{template.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {template.subject && (
                <p className="text-sm"><span className="text-muted-foreground">Subject:</span> {template.subject}</p>
              )}
              {htmlContent ? (
                <div className="border rounded-lg bg-white dark:bg-gray-950 p-1">
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full border-0 rounded-md"
                    style={{ minHeight: "300px" }}
                    title="Template Preview"
                    sandbox="allow-same-origin"
                    data-testid="iframe-template-preview"
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/30">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No HTML content</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function QuickComposeDialog({ templates, onClose }: { templates: any[]; onClose: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const sendMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/project-messages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-messages"] });
      toast({ title: "Message sent" });
      onClose();
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId && templateId !== "none") {
      const template = templates.find((t: any) => t.id === templateId);
      if (template) {
        setSubject(template.subject || "");
        setMessage(template.body || template.html_body || "");
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick Compose</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {templates.length > 0 && (
            <div className="space-y-2">
              <Label>Use Template</Label>
              <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                <SelectTrigger data-testid="select-compose-template">
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No template</SelectItem>
                  {templates.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Recipient Email</Label>
            <Input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="client@company.com"
              data-testid="input-compose-recipient"
            />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
              data-testid="input-compose-subject"
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={5}
              data-testid="input-compose-message"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => sendMutation.mutate({
              subject,
              message,
              sender_email: user?.email,
              recipient_email: recipientEmail,
              direction: "outbound"
            })}
            disabled={sendMutation.isPending || !message || !recipientEmail}
            data-testid="button-compose-send"
          >
            {sendMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Communications() {
  const { data: messages, isLoading: lm } = useQuery<any[]>({ queryKey: ["/api/project-messages"] });
  const { data: templates, isLoading: lt } = useQuery<any[]>({ queryKey: ["/api/email-templates"] });
  const [showCompose, setShowCompose] = useState(false);

  const isLoading = lm || lt;

  return (
    <div>
      <PageHeader
        title="Communications"
        subtitle="Overview of messages and email templates"
        actions={
          <Button onClick={() => setShowCompose(true)} data-testid="button-quick-compose">
            <Plus className="h-4 w-4 mr-1" />
            Quick Compose
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={MessageSquare} label="Total Messages" value={(messages || []).length} />
            <StatCard icon={Mail} label="Email Templates" value={(templates || []).length} />
            <StatCard icon={Send} label="Recent (7d)" value={(messages || []).filter((m) => { const d = new Date(m.created_date); return (Date.now() - d.getTime()) < 7 * 86400000; }).length} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Messages</CardTitle></CardHeader>
          <CardContent>
            {lm ? <TableSkeleton rows={3} /> : (!messages || messages.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 8).map((msg: any) => (
                  <div key={msg.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`comm-message-${msg.id}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{msg.subject || "No subject"}</p>
                      <p className="text-xs text-muted-foreground">{msg.sender_email || msg.sender_name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{formatRelativeTime(msg.created_date)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <CardTitle className="text-base">Email Templates</CardTitle>
              <Badge variant="outline" className="text-xs">
                <LayoutTemplate className="w-3 h-3 mr-1" />
                {(templates || []).length} templates
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {lt ? <TableSkeleton rows={3} /> : (!templates || templates.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No templates created</p>
            ) : (
              <div className="space-y-3">
                {templates.slice(0, 8).map((t: any) => (
                  <TemplatePreviewCard key={t.id} template={t} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showCompose && (
        <QuickComposeDialog
          templates={templates || []}
          onClose={() => setShowCompose(false)}
        />
      )}
    </div>
  );
}