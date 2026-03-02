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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, Plus, Loader2, PenSquare } from "lucide-react";

export default function EmailTemplates() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");

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
      toast({ title: "Template created" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  return (
    <div>
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
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="onboarding, follow-up, etc." data-testid="input-template-category" />
                </div>
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" data-testid="input-template-subject" />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Email body content..." data-testid="input-template-body" />
                </div>
                <Button
                  className="w-full"
                  onClick={() => createMutation.mutate({ name, subject, body, category })}
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

      {isLoading ? <TableSkeleton /> : (!templates || templates.length === 0) ? (
        <EmptyState icon={Mail} title="No templates" description="Create email templates for consistent communication" action={{ label: "New Template", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {templates.map((t: any) => (
            <Card key={t.id} className="hover-elevate" data-testid={`template-card-${t.id}`}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <PenSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p className="font-medium truncate">{t.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{t.subject || "No subject"}</p>
                </div>
                {t.category && <Badge variant="secondary">{t.category}</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
