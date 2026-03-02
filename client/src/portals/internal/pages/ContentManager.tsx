import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, PenSquare, Globe } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ContentManager() {
  const [search, setSearch] = useState("");
  const { data: posts, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/blog-posts"] });
  const { data: pages, isLoading: lpg } = useQuery<any[]>({ queryKey: ["/api/custom-pages"] });

  const filteredPosts = (posts || []).filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));
  const filteredPages = (pages || []).filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Content Manager" subtitle="Manage all blog posts and custom pages" />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search content..." />
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="mb-4">
          <TabsTrigger value="posts" data-testid="tab-posts"><PenSquare className="h-4 w-4 mr-2" />Blog Posts ({filteredPosts.length})</TabsTrigger>
          <TabsTrigger value="pages" data-testid="tab-pages"><Globe className="h-4 w-4 mr-2" />Custom Pages ({filteredPages.length})</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
