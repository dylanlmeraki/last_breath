import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Plus, Loader2, Monitor, Tablet, Smartphone, Eye,
  GripVertical, Trash2, ChevronUp, ChevronDown, Image, Type,
  MousePointerClick, HelpCircle, BarChart3, Quote, Layout,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type ViewportSize = "desktop" | "tablet" | "mobile";

interface PageSection {
  id: string;
  type: string;
  title: string;
  body: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  items: Array<{ question: string; answer: string }>;
  stats: Array<{ label: string; value: string }>;
}

const SECTION_TYPES = [
  { value: "hero", label: "Hero", icon: Layout },
  { value: "text", label: "Text Block", icon: Type },
  { value: "image_text", label: "Image + Text", icon: Image },
  { value: "cta", label: "Call to Action", icon: MousePointerClick },
  { value: "faq", label: "FAQ", icon: HelpCircle },
  { value: "stats", label: "Stats Grid", icon: BarChart3 },
  { value: "testimonials", label: "Testimonials", icon: Quote },
];

function createSection(type: string): PageSection {
  return {
    id: crypto.randomUUID(),
    type,
    title: "",
    body: "",
    imageUrl: "",
    ctaText: "",
    ctaLink: "",
    items: type === "faq" ? [{ question: "", answer: "" }] : [],
    stats: type === "stats" ? [{ label: "", value: "" }] : [],
  };
}

function renderSectionPreview(section: PageSection): string {
  switch (section.type) {
    case "hero":
      return `<div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;padding:48px 32px;text-align:center;border-radius:8px;margin-bottom:16px">
        <h1 style="font-size:2rem;font-weight:700;margin:0 0 12px">${section.title || "Hero Title"}</h1>
        <p style="font-size:1.1rem;opacity:.9;margin:0 0 20px">${section.body || "Hero subtitle text goes here"}</p>
        ${section.ctaText ? `<a href="${section.ctaLink || "#"}" style="display:inline-block;background:#fff;color:#1e3a5f;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600">${section.ctaText}</a>` : ""}
      </div>`;
    case "text":
      return `<div style="padding:24px 0;margin-bottom:16px">
        ${section.title ? `<h2 style="font-size:1.5rem;font-weight:600;margin:0 0 12px">${section.title}</h2>` : ""}
        <div style="line-height:1.7;color:#555">${section.body || "Text content goes here..."}</div>
      </div>`;
    case "image_text":
      return `<div style="display:flex;gap:24px;align-items:center;padding:24px 0;margin-bottom:16px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          ${section.imageUrl ? `<img src="${section.imageUrl}" style="width:100%;border-radius:8px" alt="" />` : `<div style="background:#e5e7eb;height:200px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#9ca3af">Image placeholder</div>`}
        </div>
        <div style="flex:1;min-width:200px">
          ${section.title ? `<h2 style="font-size:1.5rem;font-weight:600;margin:0 0 12px">${section.title}</h2>` : ""}
          <p style="line-height:1.7;color:#555">${section.body || "Description text..."}</p>
        </div>
      </div>`;
    case "cta":
      return `<div style="background:#f8fafc;padding:40px 32px;text-align:center;border-radius:8px;margin-bottom:16px;border:1px solid #e2e8f0">
        <h2 style="font-size:1.5rem;font-weight:600;margin:0 0 8px">${section.title || "Ready to get started?"}</h2>
        <p style="color:#64748b;margin:0 0 20px">${section.body || "Contact us today for a free consultation."}</p>
        ${section.ctaText ? `<a href="${section.ctaLink || "#"}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">${section.ctaText}</a>` : ""}
      </div>`;
    case "faq":
      return `<div style="padding:24px 0;margin-bottom:16px">
        <h2 style="font-size:1.5rem;font-weight:600;margin:0 0 16px">${section.title || "Frequently Asked Questions"}</h2>
        ${(section.items || []).map((item) => `
          <div style="border-bottom:1px solid #e2e8f0;padding:16px 0">
            <p style="font-weight:600;margin:0 0 4px">${item.question || "Question?"}</p>
            <p style="color:#64748b;margin:0">${item.answer || "Answer..."}</p>
          </div>
        `).join("")}
      </div>`;
    case "stats":
      return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;padding:24px 0;margin-bottom:16px">
        ${(section.stats || []).map((s) => `
          <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:8px">
            <p style="font-size:2rem;font-weight:700;margin:0;color:#2563eb">${s.value || "0"}</p>
            <p style="color:#64748b;margin:4px 0 0;font-size:.9rem">${s.label || "Metric"}</p>
          </div>
        `).join("")}
      </div>`;
    case "testimonials":
      return `<div style="padding:24px 0;margin-bottom:16px">
        <h2 style="font-size:1.5rem;font-weight:600;margin:0 0 16px;text-align:center">${section.title || "What Our Clients Say"}</h2>
        <div style="background:#f8fafc;padding:24px;border-radius:8px;border-left:4px solid #2563eb">
          <p style="font-style:italic;margin:0 0 8px;line-height:1.7">"${section.body || "Testimonial quote..."}"</p>
          <p style="font-weight:600;color:#64748b;margin:0">${section.ctaText || "- Client Name"}</p>
        </div>
      </div>`;
    default:
      return "";
  }
}

function SectionEditor({
  section,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  section: PageSection;
  index: number;
  total: number;
  onChange: (updated: PageSection) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const sectionType = SECTION_TYPES.find((s) => s.value === section.type);
  const Icon = sectionType?.icon || Type;

  return (
    <Card data-testid={`section-editor-${index}`}>
      <CardHeader className="p-3 flex flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{sectionType?.label || section.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={index === 0}
            onClick={() => onMove("up")}
            data-testid={`button-move-up-${index}`}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={index === total - 1}
            onClick={() => onMove("down")}
            data-testid={`button-move-down-${index}`}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            data-testid={`button-remove-section-${index}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        {section.type !== "stats" && (
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <Input
              value={section.title}
              onChange={(e) => onChange({ ...section, title: e.target.value })}
              placeholder="Section title"
              data-testid={`input-section-title-${index}`}
            />
          </div>
        )}

        {["hero", "text", "image_text", "cta", "testimonials"].includes(section.type) && (
          <div className="space-y-1">
            <Label className="text-xs">{section.type === "testimonials" ? "Quote" : "Body"}</Label>
            <Textarea
              value={section.body}
              onChange={(e) => onChange({ ...section, body: e.target.value })}
              rows={3}
              placeholder={section.type === "testimonials" ? "Testimonial quote..." : "Section content..."}
              data-testid={`textarea-section-body-${index}`}
            />
          </div>
        )}

        {section.type === "image_text" && (
          <div className="space-y-1">
            <Label className="text-xs">Image URL</Label>
            <Input
              value={section.imageUrl}
              onChange={(e) => onChange({ ...section, imageUrl: e.target.value })}
              placeholder="https://..."
              data-testid={`input-section-image-${index}`}
            />
          </div>
        )}

        {["hero", "cta"].includes(section.type) && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">CTA Text</Label>
              <Input
                value={section.ctaText}
                onChange={(e) => onChange({ ...section, ctaText: e.target.value })}
                placeholder="Get Started"
                data-testid={`input-section-cta-text-${index}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CTA Link</Label>
              <Input
                value={section.ctaLink}
                onChange={(e) => onChange({ ...section, ctaLink: e.target.value })}
                placeholder="/contact"
                data-testid={`input-section-cta-link-${index}`}
              />
            </div>
          </div>
        )}

        {section.type === "testimonials" && (
          <div className="space-y-1">
            <Label className="text-xs">Attribution</Label>
            <Input
              value={section.ctaText}
              onChange={(e) => onChange({ ...section, ctaText: e.target.value })}
              placeholder="- Client Name, Company"
              data-testid={`input-section-attribution-${index}`}
            />
          </div>
        )}

        {section.type === "faq" && (
          <div className="space-y-3">
            {(section.items || []).map((item, i) => (
              <div key={i} className="space-y-2 p-3 rounded-md bg-muted/30">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs">Q&A #{i + 1}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newItems = [...section.items];
                      newItems.splice(i, 1);
                      onChange({ ...section, items: newItems });
                    }}
                    data-testid={`button-remove-faq-${index}-${i}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  value={item.question}
                  onChange={(e) => {
                    const newItems = [...section.items];
                    newItems[i] = { ...newItems[i], question: e.target.value };
                    onChange({ ...section, items: newItems });
                  }}
                  placeholder="Question"
                  data-testid={`input-faq-question-${index}-${i}`}
                />
                <Textarea
                  value={item.answer}
                  onChange={(e) => {
                    const newItems = [...section.items];
                    newItems[i] = { ...newItems[i], answer: e.target.value };
                    onChange({ ...section, items: newItems });
                  }}
                  rows={2}
                  placeholder="Answer"
                  data-testid={`textarea-faq-answer-${index}-${i}`}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ ...section, items: [...(section.items || []), { question: "", answer: "" }] })}
              data-testid={`button-add-faq-${index}`}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Q&A
            </Button>
          </div>
        )}

        {section.type === "stats" && (
          <div className="space-y-3">
            {(section.stats || []).map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...section.stats];
                    newStats[i] = { ...newStats[i], value: e.target.value };
                    onChange({ ...section, stats: newStats });
                  }}
                  placeholder="Value"
                  className="w-24"
                  data-testid={`input-stat-value-${index}-${i}`}
                />
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...section.stats];
                    newStats[i] = { ...newStats[i], label: e.target.value };
                    onChange({ ...section, stats: newStats });
                  }}
                  placeholder="Label"
                  className="flex-1"
                  data-testid={`input-stat-label-${index}-${i}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newStats = [...section.stats];
                    newStats.splice(i, 1);
                    onChange({ ...section, stats: newStats });
                  }}
                  data-testid={`button-remove-stat-${index}-${i}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ ...section, stats: [...(section.stats || []), { label: "", value: "" }] })}
              data-testid={`button-add-stat-${index}`}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Stat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PageEditorView({
  page,
  onClose,
}: {
  page?: any;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [published, setPublished] = useState(page?.published || false);
  const [metaTitle, setMetaTitle] = useState(page?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(page?.meta_description || "");
  const [ogImage, setOgImage] = useState(page?.og_image || "");
  const [sections, setSections] = useState<PageSection[]>(() => {
    if (page?.sections) {
      try { return JSON.parse(page.sections); } catch { return []; }
    }
    return [];
  });
  const [viewport, setViewport] = useState<ViewportSize>("desktop");

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/custom-pages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/custom-pages"] });
      onClose();
      toast({ title: "Page saved" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const addSection = (type: string) => {
    setSections((prev) => [...prev, createSection(type)]);
  };

  const updateSection = useCallback((index: number, updated: PageSection) => {
    setSections((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  const removeSection = useCallback((index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveSection = useCallback((index: number, direction: "up" | "down") => {
    setSections((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const previewHtml = useMemo(() => {
    return sections.map(renderSectionPreview).join("");
  }, [sections]);

  const viewportWidth = viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "375px";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 border-b">
        <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
          <Input
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!page) setSlug(autoSlug(e.target.value)); }}
            placeholder="Page title"
            className="max-w-xs"
            data-testid="input-page-editor-title"
          />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>/</span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="page-slug"
              className="max-w-[160px]"
              data-testid="input-page-editor-slug"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Published</Label>
            <Switch checked={published} onCheckedChange={setPublished} data-testid="switch-page-published" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-page-cancel">
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate({
              title,
              slug,
              published,
              content: JSON.stringify(sections),
              meta_title: metaTitle,
              meta_description: metaDescription,
              og_image: ogImage,
            })}
            disabled={createMutation.isPending || !title}
            data-testid="button-page-save"
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Page
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-[420px] flex-shrink-0 border-r overflow-y-auto">
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader className="p-3 space-y-0">
                <CardTitle className="text-sm">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Meta Title</Label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Page title for search engines"
                    data-testid="input-meta-title"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Meta Description</Label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="Brief page description for search results"
                    data-testid="textarea-meta-description"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">OG Image URL</Label>
                  <Input
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://..."
                    data-testid="input-og-image"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Sections ({sections.length})</span>
              </div>

              {sections.map((section, i) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={i}
                  total={sections.length}
                  onChange={(updated) => updateSection(i, updated)}
                  onRemove={() => removeSection(i)}
                  onMove={(dir) => moveSection(i, dir)}
                />
              ))}

              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground mb-2">Add Section</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTION_TYPES.map((st) => {
                      const Icon = st.icon;
                      return (
                        <Button
                          key={st.value}
                          variant="outline"
                          size="sm"
                          onClick={() => addSection(st.value)}
                          className="justify-start"
                          data-testid={`button-add-section-${st.value}`}
                        >
                          <Icon className="h-3 w-3 mr-1.5" />
                          {st.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                className={`toggle-elevate ${viewport === "desktop" ? "toggle-elevated" : ""}`}
                onClick={() => setViewport("desktop")}
                data-testid="button-page-viewport-desktop"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`toggle-elevate ${viewport === "tablet" ? "toggle-elevated" : ""}`}
                onClick={() => setViewport("tablet")}
                data-testid="button-page-viewport-tablet"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`toggle-elevate ${viewport === "mobile" ? "toggle-elevated" : ""}`}
                onClick={() => setViewport("mobile")}
                data-testid="button-page-viewport-mobile"
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
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Layout className="h-10 w-10 mb-3 opacity-50" />
                  <p className="text-sm">Add sections to build your page</p>
                </div>
              ) : (
                <div
                  className="p-6"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                  data-testid="div-page-preview"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PageBuilder() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const { data: pages, isLoading } = useQuery<any[]>({ queryKey: ["/api/custom-pages"] });

  if (editorOpen) {
    return (
      <div className="h-full flex flex-col">
        <PageEditorView
          page={selectedPage}
          onClose={() => { setEditorOpen(false); setSelectedPage(null); }}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Page Builder"
        subtitle="Build custom website pages with sections and live preview"
        actions={
          <Button
            onClick={() => { setSelectedPage(null); setEditorOpen(true); }}
            data-testid="button-new-page"
          >
            <Plus className="h-4 w-4 mr-1" /> New Page
          </Button>
        }
      />

      {isLoading ? <TableSkeleton /> : (!pages || pages.length === 0) ? (
        <EmptyState
          icon={FileText}
          title="No custom pages"
          description="Create custom pages with a section-based builder"
          action={{ label: "New Page", onClick: () => { setSelectedPage(null); setEditorOpen(true); } }}
        />
      ) : (
        <div className="space-y-3">
          {pages.map((page: any) => (
            <Card
              key={page.id}
              className="hover-elevate cursor-pointer"
              onClick={() => { setSelectedPage(page); setEditorOpen(true); }}
              data-testid={`page-card-${page.id}`}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{page.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">/{page.slug} - {formatDate(page.created_date, "short")}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={page.published ? "Published" : "Draft"} />
                  <Button variant="ghost" size="sm" data-testid={`button-edit-page-${page.id}`}>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
