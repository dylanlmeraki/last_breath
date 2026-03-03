import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, PenSquare, Globe, Image, Plus, Pencil, Trash2, Star, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GalleryProject } from "@shared/schema";

const GALLERY_CATEGORIES = [
  "Commercial", "Residential", "Infrastructure", "Industrial",
  "Municipal", "Environmental", "Mixed-Use", "Renovation",
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function GalleryEditor({ project, onClose }: { project: GalleryProject | null; onClose: () => void }) {
  const { toast } = useToast();
  const isEdit = !!project;

  const [form, setForm] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    location: project?.location || "",
    county: project?.county || "",
    category: project?.category || "Commercial",
    date: project?.date || "",
    budget: project?.budget || "",
    client_name: project?.client_name || "",
    contact_name: project?.contact_name || "",
    description: project?.description || "",
    scope: project?.scope || "",
    services: (project?.services || []) as string[],
    agencies: (project?.agencies || []) as string[],
    image: project?.image || "",
    images: (project?.images || []) as string[],
    featured: project?.featured || false,
    published: project?.published || false,
    sort_order: project?.sort_order || 0,
  });

  const [serviceInput, setServiceInput] = useState("");
  const [agencyInput, setAgencyInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (isEdit) {
        return apiRequest("PATCH", `/api/entities/gallery-projects/${project.id}`, data);
      } else {
        return apiRequest("POST", "/api/entities/gallery-projects", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-projects"] });
      toast({ title: isEdit ? "Project updated" : "Project created" });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Error saving project", description: err.message, variant: "destructive" });
    },
  });

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: isEdit ? f.slug : slugify(title),
    }));
  };

  const addTag = (field: "services" | "agencies", value: string) => {
    if (!value.trim()) return;
    setForm((f) => ({
      ...f,
      [field]: [...(f[field] as string[]), value.trim()],
    }));
  };

  const removeTag = (field: "services" | "agencies", index: number) => {
    setForm((f) => ({
      ...f,
      [field]: (f[field] as string[]).filter((_: string, i: number) => i !== index),
    }));
  };

  const addImage = (url: string) => {
    if (!url.trim()) return;
    setForm((f) => ({ ...f, images: [...f.images, url.trim()] }));
    setImageInput("");
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_: string, i: number) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    saveMutation.mutate(form);
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle data-testid="text-gallery-editor-title">{isEdit ? "Edit Gallery Project" : "New Gallery Project"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Project title" data-testid="input-gallery-title" />
          </div>
          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="project-slug" data-testid="input-gallery-slug" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger data-testid="select-gallery-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GALLERY_CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="San Francisco, CA" data-testid="input-gallery-location" />
          </div>
          <div className="space-y-2">
            <Label>County</Label>
            <Input value={form.county} onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))} placeholder="San Francisco" data-testid="input-gallery-county" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} placeholder="2024" data-testid="input-gallery-date" />
          </div>
          <div className="space-y-2">
            <Label>Budget</Label>
            <Input value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} placeholder="$500K - $1M" data-testid="input-gallery-budget" />
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} data-testid="input-gallery-sort" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} placeholder="Client company" data-testid="input-gallery-client" />
          </div>
          <div className="space-y-2">
            <Label>Contact Name</Label>
            <Input value={form.contact_name} onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))} placeholder="Contact person" data-testid="input-gallery-contact" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Project description..." rows={3} data-testid="input-gallery-description" />
        </div>

        <div className="space-y-2">
          <Label>Scope</Label>
          <Textarea value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))} placeholder="Project scope..." rows={2} data-testid="input-gallery-scope" />
        </div>

        <div className="space-y-2">
          <Label>Main Image URL</Label>
          <Input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." data-testid="input-gallery-image" />
          {form.image && <img src={form.image} alt="Preview" className="h-20 rounded object-cover" />}
        </div>

        <div className="space-y-2">
          <Label>Gallery Images</Label>
          <div className="flex gap-2">
            <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Image URL" data-testid="input-gallery-add-image" />
            <Button type="button" variant="outline" size="sm" onClick={() => addImage(imageInput)} data-testid="button-gallery-add-image">Add</Button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((url: string, i: number) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Gallery ${i + 1}`} className="h-16 w-16 rounded object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Services</Label>
          <div className="flex gap-2">
            <Input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)} placeholder="Add a service" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("services", serviceInput); setServiceInput(""); } }} data-testid="input-gallery-add-service" />
            <Button type="button" variant="outline" size="sm" onClick={() => { addTag("services", serviceInput); setServiceInput(""); }} data-testid="button-gallery-add-service">Add</Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {form.services.map((s: string, i: number) => (
              <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeTag("services", i)}>{s} <X className="h-3 w-3 ml-1" /></Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Agencies</Label>
          <div className="flex gap-2">
            <Input value={agencyInput} onChange={(e) => setAgencyInput(e.target.value)} placeholder="Add an agency" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("agencies", agencyInput); setAgencyInput(""); } }} data-testid="input-gallery-add-agency" />
            <Button type="button" variant="outline" size="sm" onClick={() => { addTag("agencies", agencyInput); setAgencyInput(""); }} data-testid="button-gallery-add-agency">Add</Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {form.agencies.map((a: string, i: number) => (
              <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeTag("agencies", i)}>{a} <X className="h-3 w-3 ml-1" /></Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <Switch checked={form.published} onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))} data-testid="switch-gallery-published" />
            <Label>Published</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} data-testid="switch-gallery-featured" />
            <Label>Featured</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} data-testid="button-gallery-cancel">Cancel</Button>
          <Button type="submit" disabled={saveMutation.isPending} data-testid="button-gallery-save">
            {saveMutation.isPending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default function ContentManager() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [editorProject, setEditorProject] = useState<GalleryProject | null | "new">(null);
  const { toast } = useToast();

  const { data: posts, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/blog-posts"] });
  const { data: pages, isLoading: lpg } = useQuery<any[]>({ queryKey: ["/api/custom-pages"] });
  const { data: galleryProjects, isLoading: lg } = useQuery<GalleryProject[]>({ queryKey: ["/api/gallery-projects"] });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/entities/gallery-projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-projects"] });
      toast({ title: "Project deleted" });
    },
  });

  const filteredPosts = (posts || []).filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));
  const filteredPages = (pages || []).filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));
  const filteredGallery = (galleryProjects || []).filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Content Manager" subtitle="Manage blog posts, custom pages, and project gallery" />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search content..." />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="posts" data-testid="tab-posts"><PenSquare className="h-4 w-4 mr-2" />Blog Posts ({filteredPosts.length})</TabsTrigger>
          <TabsTrigger value="pages" data-testid="tab-pages"><Globe className="h-4 w-4 mr-2" />Custom Pages ({filteredPages.length})</TabsTrigger>
          <TabsTrigger value="gallery" data-testid="tab-gallery"><Image className="h-4 w-4 mr-2" />Gallery ({filteredGallery.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {lp ? <TableSkeleton /> : filteredPosts.length === 0 ? (
            <EmptyState icon={PenSquare} title="No blog posts" description="Create blog posts from the Blog Editor" />
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post: any) => (
                <Card key={post.id} className="hover-elevate" data-testid={`content-post-${post.id}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{post.title}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        {post.category && <span>{post.category}</span>}
                        <span>{formatDate(post.published_date || post.created_date, "short")}</span>
                      </div>
                    </div>
                    <StatusBadge status={post.published ? "Published" : "Draft"} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pages">
          {lpg ? <TableSkeleton /> : filteredPages.length === 0 ? (
            <EmptyState icon={Globe} title="No custom pages" description="Create pages from the Page Builder" />
          ) : (
            <div className="space-y-3">
              {filteredPages.map((page: any) => (
                <Card key={page.id} className="hover-elevate" data-testid={`content-page-${page.id}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">/{page.slug}</p>
                    </div>
                    <StatusBadge status={page.published ? "Published" : "Draft"} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gallery">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setEditorProject("new")} data-testid="button-new-gallery-project">
              <Plus className="h-4 w-4 mr-2" /> New Gallery Project
            </Button>
          </div>
          {lg ? <TableSkeleton /> : filteredGallery.length === 0 ? (
            <EmptyState icon={Image} title="No gallery projects" description="Add projects to showcase in the marketing site gallery" />
          ) : (
            <div className="space-y-3">
              {filteredGallery.map((project) => (
                <Card key={project.id} className="hover-elevate" data-testid={`content-gallery-${project.id}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {project.image && (
                        <img src={project.image} alt={project.title} className="h-12 w-12 rounded object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{project.title}</p>
                          {project.featured && <Star className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                        </div>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                          <span>{project.category}</span>
                          {project.location && <span>{project.location}</span>}
                          {project.date && <span>{project.date}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={project.published ? "Published" : "Draft"} />
                      <Button variant="ghost" size="icon" onClick={() => setEditorProject(project)} data-testid={`button-edit-gallery-${project.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this project?")) deleteMutation.mutate(project.id); }} data-testid={`button-delete-gallery-${project.id}`}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={editorProject !== null} onOpenChange={(open) => { if (!open) setEditorProject(null); }}>
        {editorProject !== null && (
          <GalleryEditor
            project={editorProject === "new" ? null : editorProject}
            onClose={() => setEditorProject(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
