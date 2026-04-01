import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Loader2, Monitor, Tablet, Smartphone, Eye, Code, Variable } from "lucide-react";

const CATEGORIES = [
  { value: "proposal", label: "Proposal" },
  { value: "report", label: "Report" },
  { value: "contract", label: "Contract" },
  { value: "invoice", label: "Invoice" },
];

const TEMPLATE_VARIABLES = [
  { name: "client_name", label: "Client Name" },
  { name: "project_name", label: "Project Name" },
  { name: "date", label: "Date" },
  { name: "amount", label: "Amount" },
  { name: "company_name", label: "Company Name" },
  { name: "project_number", label: "Project Number" },
  { name: "scope_of_work", label: "Scope of Work" },
  { name: "start_date", label: "Start Date" },
  { name: "end_date", label: "End Date" },
  { name: "contact_email", label: "Contact Email" },
  { name: "contact_phone", label: "Contact Phone" },
  { name: "address", label: "Address" },
];

const SAMPLE_DATA: Record<string, string> = {
  client_name: "Acme Corporation",
  project_name: "Office Renovation Phase 2",
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  amount: "$125,000",
  company_name: "Pacific Engineering & Construction",
  project_number: "PE-2025-1234",
  scope_of_work: "Complete interior renovation including structural modifications, MEP upgrades, and finish work.",
  start_date: "March 1, 2025",
  end_date: "June 30, 2025",
  contact_email: "info@pacificengineeringsf.com",
  contact_phone: "(415) 555-0100",
  address: "123 Main Street, San Francisco, CA 94105",
};

type ViewportSize = "desktop" | "tablet" | "mobile";

function interpolatePreview(content: string): string {
  let result = content;
  for (const [key, value] of Object.entries(SAMPLE_DATA)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

function TemplateEditor({
  template,
  onClose,
}: {
  template?: any;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(template?.name || "");
  const [category, setCategory] = useState(template?.category || "proposal");
  const [description, setDescription] = useState(template?.description || "");
  const [content, setContent] = useState(template?.content || "");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/proposal-templates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-templates"] });
      onClose();
      toast({ title: "Template saved" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const insertVariable = (varName: string) => {
    const tag = `{{${varName}}}`;
    setContent((prev: string) => prev + tag);
  };

  const viewportWidth = viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "375px";

  const renderedContent = useMemo(() => interpolatePreview(content), [content]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 border-b">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template name"
            className="max-w-xs"
            data-testid="input-template-editor-name"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36" data-testid="select-template-editor-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="max-w-xs"
            data-testid="input-template-editor-description"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-template-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate({ name, category, description, content })}
            disabled={createMutation.isPending || !name}
            data-testid="button-template-save"
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Template
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
        <Variable className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground mr-1">Insert:</span>
        <div className="flex items-center gap-1 flex-wrap">
          {TEMPLATE_VARIABLES.map((v) => (
            <Button
              key={v.name}
              variant="outline"
              size="sm"
              onClick={() => insertVariable(v.name)}
              data-testid={`button-insert-var-${v.name}`}
            >
              {v.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col border-r min-w-0">
          <div className="px-4 py-2 border-b flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Editor</span>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none rounded-none border-0 focus-visible:ring-0 font-mono text-sm"
            placeholder={"<h1>{{project_name}}</h1>\n<p>Dear {{client_name}},</p>\n<p>We are pleased to submit this {{category}} for your review...</p>"}
            data-testid="textarea-template-content"
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 border-b flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`toggle-elevate ${previewMode === "preview" ? "toggle-elevated" : ""}`}
                onClick={() => setPreviewMode("preview")}
                data-testid="button-preview-rendered"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`toggle-elevate ${previewMode === "code" ? "toggle-elevated" : ""}`}
                onClick={() => setPreviewMode("code")}
                data-testid="button-preview-source"
              >
                <Code className="h-4 w-4" />
              </Button>
              <div className="w-px h-5 bg-border mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className={`toggle-elevate ${viewport === "desktop" ? "toggle-elevated" : ""}`}
                onClick={() => setViewport("desktop")}
                data-testid="button-viewport-desktop"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`toggle-elevate ${viewport === "tablet" ? "toggle-elevated" : ""}`}
                onClick={() => setViewport("tablet")}
                data-testid="button-viewport-tablet"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`toggle-elevate ${viewport === "mobile" ? "toggle-elevated" : ""}`}
                onClick={() => setViewport("mobile")}
                data-testid="button-viewport-mobile"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 bg-muted/20 flex justify-center">
            <div
              style={{ width: viewportWidth, maxWidth: "100%" }}
              className="bg-background border rounded-md"
            >
              {previewMode === "preview" ? (
                <div
                  className="p-6 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                  data-testid="div-template-preview"
                />
              ) : (
                <pre className="p-4 text-xs font-mono whitespace-pre-wrap break-all" data-testid="pre-template-source">
                  {renderedContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateBuilder() {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: templates, isLoading } = useQuery<any[]>({ queryKey: ["/api/proposal-templates"] });

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (activeCategory === "all") return templates;
    return templates.filter((t: any) => t.category === activeCategory);
  }, [templates, activeCategory]);

  if (editorOpen) {
    return (
      <div className="h-full flex flex-col">
        <TemplateEditor
          template={selectedTemplate}
          onClose={() => {
            setEditorOpen(false);
            setSelectedTemplate(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Template Builder"
        subtitle="Create and manage document templates with live preview"
        actions={
          <Button
            onClick={() => { setSelectedTemplate(null); setEditorOpen(true); }}
            data-testid="button-new-doc-template"
          >
            <Plus className="h-4 w-4 mr-1" /> New Template
          </Button>
        }
      />

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList data-testid="tabs-template-categories">
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c.value} value={c.value} data-testid={`tab-${c.value}`}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          {isLoading ? <TableSkeleton /> : filteredTemplates.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No templates found"
              description={activeCategory === "all" ? "Create templates for proposals, reports, and contracts" : `No ${activeCategory} templates yet`}
              action={{ label: "New Template", onClick: () => { setSelectedTemplate(null); setEditorOpen(true); } }}
            />
          ) : (
            <div className="space-y-3 mt-4">
              {filteredTemplates.map((t: any) => (
                <Card
                  key={t.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => { setSelectedTemplate(t); setEditorOpen(true); }}
                  data-testid={`doc-template-card-${t.id}`}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{t.name}</p>
                        {t.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {t.category && <Badge variant="secondary">{t.category}</Badge>}
                      <Button variant="ghost" size="sm" data-testid={`button-edit-template-${t.id}`}>
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
