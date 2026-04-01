import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, PenSquare, Eye, Loader2, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content required"),
  category: z.string().min(1, "Category required"),
  meta_description: z.string().optional(),
  featured_image: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

const CATEGORIES = ["Engineering", "Construction", "Sustainability", "Safety", "Innovation", "Company News"];

export default function BlogEditor() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery<any[]>({ queryKey: ["/api/blog-posts"] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => { const res = await apiRequest("POST", "/api/blog-posts", data); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] }); setDialogOpen(false); toast({ title: "Post created" }); form.reset(); },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", slug: "", excerpt: "", content: "", category: "", meta_description: "", featured_image: "", published: false, featured: false },
  });

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const filtered = (posts || []).filter((p) => {
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Blog Editor" subtitle={`${filtered.length} post${filtered.length !== 1 ? "s" : ""}`}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button data-testid="button-new-post"><Plus className="h-4 w-4 mr-1" /> New Post</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Create Blog Post</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl>
                      <Input {...field} onChange={(e) => { field.onChange(e); form.setValue("slug", autoSlug(e.target.value)); }} data-testid="input-title" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} data-testid="input-slug" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                        <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="excerpt" render={({ field }) => (
                    <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea rows={2} {...field} data-testid="input-excerpt" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={10} {...field} data-testid="input-content" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="meta_description" render={({ field }) => (
                    <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Input {...field} data-testid="input-meta" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="featured_image" render={({ field }) => (
                    <FormItem><FormLabel>Featured Image URL</FormLabel><FormControl><Input {...field} data-testid="input-image" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex gap-6">
                    <FormField control={form.control} name="published" render={({ field }) => (
                      <FormItem className="flex items-center gap-2"><FormLabel>Published</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="featured" render={({ field }) => (
                      <FormItem className="flex items-center gap-2"><FormLabel>Featured</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-post">
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create Post
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search posts..." /></div>

      {isLoading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState icon={PenSquare} title="No blog posts" description="Create your first blog post" action={{ label: "New Post", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {filtered.map((post: any) => (
            <Card key={post.id} className="hover-elevate" data-testid={`post-card-${post.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{post.title}</p>
                    {post.featured && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span>{post.category}</span>
                    <span>{formatDate(post.published_date || post.created_date, "short")}</span>
                    {post.read_time && <span>{post.read_time}</span>}
                  </div>
                </div>
                <StatusBadge status={post.published ? "Published" : "Draft"} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
