import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Loader2, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PageBuilder() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const { data: pages, isLoading } = useQuery<any[]>({ queryKey: ["/api/custom-pages"] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/custom-pages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/custom-pages"] });
      setDialogOpen(false);
      setTitle("");
      setSlug("");
      setContent("");
      setPublished(false);
      toast({ title: "Page created" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div>
      <PageHeader
        title="Page Builder"
        subtitle="Manage custom website pages"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-page"><Plus className="h-4 w-4 mr-1" /> New Page</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create Page</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }} placeholder="Page title" data-testid="input-page-title" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="page-slug" data-testid="input-page-slug" />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} placeholder="Page content..." data-testid="input-page-content" />
                </div>
                <div className="flex items-center gap-2">
                  <Label>Published</Label>
                  <Switch checked={published} onCheckedChange={setPublished} data-testid="switch-published" />
                </div>
                <Button
                  className="w-full"
                  onClick={() => createMutation.mutate({ title, slug, content, published })}
                  disabled={createMutation.isPending || !title}
                  data-testid="button-create-page"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Page
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? <TableSkeleton /> : (!pages || pages.length === 0) ? (
        <EmptyState icon={FileText} title="No custom pages" description="Create custom pages for your website" action={{ label: "New Page", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {pages.map((page: any) => (
            <Card key={page.id} className="hover-elevate" data-testid={`page-card-${page.id}`}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{page.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">/{page.slug} - {formatDate(page.created_date, "short")}</p>
                </div>
                <StatusBadge status={page.published ? "Published" : "Draft"} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
