import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Plus, Loader2, Send, Eye, LayoutTemplate } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function ClientCommunications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [composeStep, setComposeStep] = useState<"compose" | "preview">("compose");

  const { data: messages, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-messages"] });
  const { data: templates = [] } = useQuery<any[]>({ queryKey: ["/api/email-templates"] });

  const sendMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/project-messages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-messages"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Message sent" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setRecipientEmail("");
    setSelectedTemplateId("");
    setComposeStep("compose");
  };

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

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForm();
  };

  return (
    <div>
      <PageHeader
        title="Client Communications"
        subtitle="Manage project messages and client conversations"
        actions={
          <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-message"><Plus className="h-4 w-4 mr-1" /> New Message</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Compose Message</DialogTitle></DialogHeader>

              <Tabs value={composeStep} onValueChange={(v) => setComposeStep(v as "compose" | "preview")}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="compose" className="flex-1" data-testid="tab-compose">Compose</TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1" data-testid="tab-preview" disabled={!message}>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="compose">
                  <div className="space-y-4">
                    {templates.length > 0 && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <LayoutTemplate className="w-3 h-3" />
                          Use Template
                        </Label>
                        <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                          <SelectTrigger data-testid="select-message-template">
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
                      <Input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="client@company.com" data-testid="input-recipient" />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Message subject" data-testid="input-subject" />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={5} data-testid="input-message-body" />
                    </div>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <Button
                        variant="outline"
                        onClick={() => setComposeStep("preview")}
                        disabled={!message}
                        data-testid="button-preview-message"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        onClick={() => sendMutation.mutate({ subject, message, sender_email: user?.email, recipient_email: recipientEmail, direction: "outbound" })}
                        disabled={sendMutation.isPending || !message || !recipientEmail}
                        data-testid="button-send-message"
                      >
                        {sendMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                        Send
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground font-medium">From:</span> {user?.email || "—"}</p>
                        <p><span className="text-muted-foreground font-medium">To:</span> {recipientEmail || "—"}</p>
                        <p><span className="text-muted-foreground font-medium">Subject:</span> {subject || "(No subject)"}</p>
                      </div>
                      <div className="border-t pt-3">
                        <div className="whitespace-pre-wrap text-sm" data-testid="text-message-preview">{message}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <Button variant="outline" onClick={() => setComposeStep("compose")} data-testid="button-back-to-compose">
                        Edit
                      </Button>
                      <Button
                        onClick={() => sendMutation.mutate({ subject, message, sender_email: user?.email, recipient_email: recipientEmail, direction: "outbound" })}
                        disabled={sendMutation.isPending || !message || !recipientEmail}
                        data-testid="button-send-from-preview"
                      >
                        {sendMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                        Send Message
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? <TableSkeleton /> : (!messages || messages.length === 0) ? (
        <EmptyState icon={MessageSquare} title="No messages" description="Client messages will appear here" action={{ label: "Compose", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <Card key={msg.id} className="hover-elevate" data-testid={`message-card-${msg.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{msg.subject || "No subject"}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                      <span>{msg.sender_email || msg.sender_name}</span>
                      <span>{formatRelativeTime(msg.created_date)}</span>
                    </div>
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