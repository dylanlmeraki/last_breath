import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/SearchInput";
import { Search, FileText, CheckCircle, AlertTriangle, Globe } from "lucide-react";

export default function SEOAssistant() {
  const [search, setSearch] = useState("");
  const { data: posts, isLoading } = useQuery<any[]>({ queryKey: ["/api/blog-posts"] });

  const filtered = (posts || []).filter((p) => {
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getSeoScore = (post: any) => {
    let score = 0;
    if (post.title && post.title.length > 10) score += 25;
    if (post.meta_description && post.meta_description.length > 50) score += 25;
    if (post.excerpt && post.excerpt.length > 20) score += 25;
    if (post.content && post.content.length > 300) score += 25;
    return score;
  };

  return (
    <div>
      <PageHeader title="SEO Assistant" subtitle="Analyze and optimize your content for search engines" />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search blog posts..." />
      </div>

      {isLoading ? <TableSkeleton /> : (!filtered || filtered.length === 0) ? (
        <EmptyState icon={Globe} title="No content to analyze" description="Create blog posts to analyze their SEO performance" />
      ) : (
        <div className="space-y-3">
          {filtered.map((post: any) => {
            const score = getSeoScore(post);
            return (
              <Card key={post.id} className="hover-elevate" data-testid={`seo-card-${post.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{post.title}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        <span>/{post.slug}</span>
                        {post.category && <Badge variant="secondary" className="text-xs">{post.category}</Badge>}
                      </div>
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          {post.meta_description ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />}
                          <span className="text-muted-foreground">Meta description {post.meta_description ? `(${post.meta_description.length} chars)` : "missing"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {post.excerpt ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />}
                          <span className="text-muted-foreground">Excerpt {post.excerpt ? "present" : "missing"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {post.featured_image ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />}
                          <span className="text-muted-foreground">Featured image {post.featured_image ? "set" : "missing"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className={`text-2xl font-bold ${score >= 75 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"}`}>{score}</div>
                      <p className="text-xs text-muted-foreground">SEO Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
