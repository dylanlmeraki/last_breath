import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Plus, Loader2, PenSquare, Eye, Send, X } from "lucide-react";

function PreviewFrame({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Email Preview"
      className="w-full h-full border-0 rounded-md bg-white"
      sandbox="allow-same-origin"
      data-testid="iframe-email-preview"
    />
  );
}

export default function EmailTemplates() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [templateType, setTemplateType] = useState("general");
  const [previewHtml, setPreviewHtml] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [sendTestDialogOpen, setSendTestDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendTestTemplateId, setSendTestTemplateId] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery<any[]>({ queryKey: ["/api/email-templates"] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/email-templates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-templates"] });
      setDialogOpen(false);
      setName("");
      setSubject("");
      setBody("");
      setCategory("");
      setTemplateType("general");
      toast({ title: "Template created" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const previewMutation = useMutation({
    mutationFn: async (data: { subject_template: string; body_template: string }) => {
      const res = await apiRequest("POST", "/api/email-templates/preview", data);
      return res.json();
    },
    onSuccess: (data: any) => {
      setPreviewHtml(data.html || "");
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Preview failed", description: e.message }),
  });

  const sendTestMutation = useMutation({
    mutationFn: async ({ id, to }: { id: string; to: string }) => {
      const res = await apiRequest("POST", `/api/email-templates/${id}/send-test`, { to });
      return res.json();
    },
    onSuccess: (data: any) => {
      setSendTestDialogOpen(false);
      setTestEmail("");
      setSendTestTemplateId(null);
      if (data.success) {
        toast({ title: "Test email sent", description: "Check your inbox" });
      } else {
        toast({ variant: "destructive", title: "Send failed", description: data.error || "Unknown error" });
      }
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Send failed", description: e.message }),
  });

  function handlePreview(t: any) {
    setSelectedTemplate(t);
    previewMutation.mutate({
      subject_template: t.subject_template || t.subject || "",
      body_template: t.body_template || t.body || "",
    });
  }

  function handleSendTest(templateId: string) {
    setSendTestTemplateId(templateId);
    setSendTestDialogOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Email Templates"
        subtitle="Manage reusable email templates"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-template"><Plus className="h-4 w-4 mr-1" /> New Template</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create Email Template</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome Email" data-testid="input-template-name" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input value={templateType} onChange={(e) => setTemplateType(e.target.value)} placeholder="general, onboarding, notification" data-testid="input-template-type" />
                </div>
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject with {{variables}}" data-testid="input-template-subject" />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Email body content with {{client_name}}, {{project_name}}..." data-testid="input-template-body" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Variables:</span>
                  {["client_name", "project_name", "company_name", "date", "amount", "name", "link"].map((v) => (
                    <Badge
                      key={v}
                      variant="outline"
                      className="cursor-pointer text-xs"
                      onClick={() => setBody((b) => b + `{{${v}}}`)}
                      data-testid={`badge-var-${v}`}
                    >
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={() =>
                    createMutation.mutate({
                      template_name: name,
                      template_type: templateType,
                      subject_template: subject,
                      body_template: body,
                      active: true,
                      created_by: "admin",
                    })
                  }
                  disabled={createMutation.isPending || !name}
                  data-testid="button-save-template"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Dialog open={sendTestDialogOpen} onOpenChange={setSendTestDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Send Test Email</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient Email</Label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                data-testid="input-test-email"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (sendTestTemplateId && testEmail) {
                  sendTestMutation.mutate({ id: sendTestTemplateId, to: testEmail });
                }
              }}
              disabled={sendTestMutation.isPending || !testEmail}
              data-testid="button-confirm-send-test"
            >
              {sendTestMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send Test
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 min-h-0">
        <Tabs defaultValue="list" className="h-full flex flex-col">
          <TabsList className="mx-4 mb-2 w-fit">
            <TabsTrigger value="list" data-testid="tab-list">Templates</TabsTrigger>
            <TabsTrigger value="preview" data-testid="tab-preview" disabled={!selectedTemplate}>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="flex-1 overflow-auto px-4 pb-4 mt-0">
            {isLoading ? <TableSkeleton /> : (!templates || templates.length === 0) ? (
              <EmptyState icon={Mail} title="No templates" description="Create email templates for consistent communication" action={{ label: "New Template", onClick: () => setDialogOpen(true) }} />
            ) : (
              <div className="space-y-3">
                {templates.map((t: any) => (
                  <Card key={t.id} className="hover-elevate" data-testid={`template-card-${t.id}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <PenSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <p className="font-medium truncate" data-testid={`text-template-name-${t.id}`}>
                            {t.template_name || t.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate" data-testid={`text-template-subject-${t.id}`}>
                          {t.subject_template || t.subject || "No subject"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {t.template_type && <Badge variant="secondary">{t.template_type}</Badge>}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handlePreview(t)}
                          data-testid={`button-preview-${t.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSendTest(t.id)}
                          data-testid={`button-send-test-${t.id}`}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden px-4 pb-4 mt-0">
            {selectedTemplate ? (
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-medium" data-testid="text-preview-template-name">
                      {selectedTemplate.template_name || selectedTemplate.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.subject_template || selectedTemplate.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePreview(selectedTemplate)}
                      disabled={previewMutation.isPending}
                      data-testid="button-refresh-preview"
                    >
                      {previewMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Refresh Preview
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSendTest(selectedTemplate.id)}
                      data-testid="button-send-test-preview"
                    >
                      <Send className="h-4 w-4 mr-1" /> Send Test
                    </Button>
                  </div>
                </div>
                <Card className="flex-1 min-h-0 overflow-hidden">
                  <CardContent className="p-0 h-full">
                    {previewMutation.isPending ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : previewHtml ? (
                      <PreviewFrame html={previewHtml} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Click "Refresh Preview" to render this template
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a template to preview
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
