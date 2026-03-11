import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "../components/AnimatedSection";
import ReactMarkdown from "react-markdown";

interface BlogPostData {
  id: string;
  title: string;
  seo_optimized_title?: string;
  slug: string;
  excerpt?: string;
  meta_description?: string;
  content: string;
  category: string;
  tags?: string[];
  keywords?: string[];
  author?: string;
  featured_image?: string;
  read_time?: string;
  published_date?: string;
  updated_date?: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<BlogPostData>({
    queryKey: ["/api/blog-posts/slug", slug],
    queryFn: () => fetch("/api/blog-posts/slug/" + slug).then(r => r.json()),
    enabled: !!slug,
  });

  if (!slug) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4" data-testid="text-post-not-found">Post not found</h1>
          <Link to={createPageUrl("Blog")}>
            <Button data-testid="button-back-to-blog">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" data-testid="blog-post-loading">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4" data-testid="text-post-not-found">Post not found</h1>
          <Link to={createPageUrl("Blog")}>
            <Button data-testid="button-back-to-blog">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = post.published_date ? new Date(post.published_date).toISOString() : new Date().toISOString();
  const currentUrl = window.location.href;
  const siteUrl = window.location.origin;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.seo_optimized_title || post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.featured_image || `${siteUrl}/Logo.jpeg`,
    "author": {
      "@type": "Organization",
      "name": post.author || "Pacific Engineering Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pacific Engineering & Construction Inc.",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/Logo.jpeg`
      }
    },
    "datePublished": publishedDate,
    "dateModified": post.updated_date || publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "keywords": post.keywords?.join(", ") || post.tags?.join(", ") || ""
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="blog-post-page">
      <Helmet>
        <title>{post.seo_optimized_title || post.title} | Pacific Engineering Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <meta name="keywords" content={post.keywords?.join(", ") || post.tags?.join(", ") || ""} />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={post.seo_optimized_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:image" content={post.featured_image || `${siteUrl}/Logo.jpeg`} />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={post.seo_optimized_title || post.title} />
        <meta property="twitter:description" content={post.meta_description || post.excerpt} />
        <meta property="twitter:image" content={post.featured_image || `${siteUrl}/Logo.jpeg`} />
        
        <link rel="canonical" href={currentUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <section className="py-6 px-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl("Blog")} data-testid="link-back-to-blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </section>

      {post.featured_image && (
        <section className="relative h-96 bg-slate-900">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
            data-testid="img-blog-post-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </section>
      )}

      <article className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="up">
            <Badge className="mb-6 bg-blue-600 text-white text-sm" data-testid="badge-category">
              {post.category}
            </Badge>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight" data-testid="text-blog-post-title">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium" data-testid="text-author">{post.author || "Pacific Engineering Team"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm" data-testid="text-published-date">
                  {post.published_date ? new Date(post.published_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Recently'}
                </span>
              </div>
              {post.read_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{post.read_time}</span>
                </div>
              )}
            </div>

            {post.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-12 rounded-r-md">
                <p className="text-lg text-slate-700 leading-relaxed italic">
                  {post.excerpt}
                </p>
              </div>
            )}

            <div className="prose prose-lg prose-slate max-w-none mb-12" data-testid="blog-post-content">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-5" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4" {...props} />,
                  p: ({ ...props }) => <p className="text-lg text-slate-700 leading-relaxed mb-6" {...props} />,
                  ul: ({ ...props }) => <ul className="space-y-3 mb-6 ml-6" {...props} />,
                  ol: ({ ...props }) => <ol className="space-y-3 mb-6 ml-6" {...props} />,
                  li: ({ ...props }) => <li className="text-lg text-slate-700 leading-relaxed" {...props} />,
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-blue-600 bg-slate-50 pl-6 py-4 my-8 italic text-slate-700" {...props} />
                  ),
                  a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-800 underline font-medium" {...props} />,
                  img: ({ ...props }) => (
                    <img className="rounded-md shadow-lg my-8 w-full" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-slate-200">
                <Tag className="w-4 h-4 text-slate-600" />
                {post.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-slate-600 border-slate-300" data-testid={`badge-tag-${idx}`}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </article>

      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Expert Guidance?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how we can help with your project
            </p>
            <Link to={createPageUrl("Contact")} data-testid="link-contact-cta">
              <Button size="lg" className="bg-white text-blue-600">
                Get in Touch
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
