import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowRight, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "../components/AnimatedSection";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import BlueprintBackground from "../components/BlueprintBackground";
import CTASection from "../components/CTASection";

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
  author?: string;
  featured_image?: string;
  read_time?: string;
  published?: boolean;
  published_date?: string;
  featured?: boolean;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: blogPosts = [], isLoading } = useQuery<BlogPostData[]>({
    queryKey: ["/api/blog-posts"],
  });

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "compliance", label: "Compliance" },
    { value: "best-practices", label: "Best Practices" },
    { value: "regulations", label: "Regulations" },
    { value: "inspections", label: "Inspections" },
    { value: "engineering", label: "Engineering" },
    { value: "case-studies", label: "Case Studies" }
  ];

  const filteredPosts = selectedCategory === "all"
    ? blogPosts
    : blogPosts.filter((post: BlogPostData) => post.category === selectedCategory);

  const featuredPost = blogPosts.find((post: BlogPostData) => post.featured);
  const regularPosts = filteredPosts.filter((post: BlogPostData) => !post.featured);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Pacific Engineering & Construction Blog",
    "description": "Expert insights on stormwater management, construction compliance, and engineering best practices",
    "url": window.location.origin + createPageUrl("Blog"),
    "publisher": {
      "@type": "Organization",
      "name": "Pacific Engineering & Construction Inc.",
      "logo": {
        "@type": "ImageObject",
        "url": window.location.origin + "/Logo.jpeg"
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="blog-page">
      <Helmet>
        <title>Blog | Pacific Engineering & Construction</title>
        <meta name="description" content="Expert insights on stormwater management, construction compliance, engineering best practices, and environmental regulations from Pacific Engineering's team of licensed professionals." />
        <meta name="keywords" content="construction blog, engineering insights, SWPPP guidance, stormwater compliance, construction best practices, civil engineering" />
        <link rel="canonical" href={window.location.origin + createPageUrl("Blog")} />
        
        <meta property="og:title" content="Blog | Pacific Engineering & Construction" />
        <meta property="og:description" content="Expert insights on stormwater management, construction compliance, and engineering best practices" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin + createPageUrl("Blog")} />
        
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>

      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.6]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-transparent to-blue-950/15 opacity-50" />
        <AnimatedGridBackground baseOpacity={0.5} gridSize={40} triggerInterval={500} animationDuration={2500} className="hidden sm:block z-[1] opacity-30" />
        <BlueprintBackground className="z-[2] opacity-50" />
        <div className="absolute top-1/3 left-1/5 w-48 md:w-72 h-48 md:h-72 bg-cyan-500/8 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-[1]" />
        <div className="absolute bottom-1/4 right-1/5 w-40 md:w-64 h-40 md:h-64 bg-blue-500/6 rounded-full blur-[60px] md:blur-[100px] pointer-events-none z-[1]" />

        <div className="relative z-[5] max-w-5xl mx-auto text-center">
          <AnimatedSection direction="up" blur>
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-cyan-500/5 rounded-2xl blur-sm hidden sm:block" />
              <div className="relative bg-slate-950/30 sm:bg-slate-950/40 backdrop-blur-[6px] rounded-lg sm:rounded-xl border border-white/[0.06] shadow-2xl overflow-hidden px-5 py-8 sm:p-10 md:p-12">
                <div className="h-0.5 sm:h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80 absolute top-0 left-0 right-0" />
                <h1 className="text-white mb-6 text-3xl font-bold sm:text-5xl md:text-6xl tracking-tight" data-testid="text-blog-title">
                  Insights & Updates
                </h1>
                <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
                  Expert guidance, industry insights, and the latest updates in stormwater compliance, structural engineering, and construction best practices.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80" />
      </section>

      <section className="py-12 px-6 bg-white border-b border-slate-200">
        <AnimatedSection direction="up" delay={0.1}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  data-testid={`button-filter-${cat.value}`}
                  className={`${
                    selectedCategory === cat.value
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  } px-6`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center py-20" data-testid="blog-loading">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="py-20 px-6 text-center" data-testid="blog-empty">
          <p className="text-xl text-gray-600">No blog posts published yet. Check back soon!</p>
        </div>
      ) : (
        <>
          {selectedCategory === "all" && featuredPost && (
            <section className="py-20 px-6 bg-slate-50">
              <AnimatedSection direction="up" delay={0.2}>
                <div className="max-w-7xl mx-auto">
                  <div className="mb-8">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Featured Article
                    </span>
                  </div>
                  
                  <Link to={`/blog/${featuredPost.slug}`} data-testid={`link-featured-post-${featuredPost.slug}`}>
                    <Card className="overflow-hidden border border-slate-200 shadow-xl transition-all duration-300 cursor-pointer group rounded-md bg-white">
                    <div className="grid lg:grid-cols-2 gap-0">
                    {featuredPost.featured_image && (
                      <div className="relative h-96 lg:h-auto overflow-hidden">
                        <img
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          data-testid="img-featured-post"
                        />
                      </div>
                    )}
                    <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
                          <div className="flex items-center gap-4 mb-4">
                            <Badge className="bg-blue-100 text-blue-700 capitalize">
                              {featuredPost.category.replace('-', ' ')}
                            </Badge>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(featuredPost.published_date)}</span>
                            </div>
                          </div>
                          
                          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors" data-testid="text-featured-title">
                            {featuredPost.seo_optimized_title || featuredPost.title}
                          </h2>
                          
                          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                            {featuredPost.meta_description || featuredPost.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between gap-2 mb-6">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span className="text-sm">{featuredPost.author}</span>
                            </div>
                            {featuredPost.read_time && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{featuredPost.read_time}</span>
                              </div>
                            )}
                          </div>
                          
                          {featuredPost.tags && featuredPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {featuredPost.tags.slice(0, 4).map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white w-full lg:w-auto rounded-md shadow-lg transition-all duration-300 group">
                            Read Full Article
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              </AnimatedSection>
            </section>
          )}

          {regularPosts.length > 0 && (
            <section className="py-20 px-6 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                  <AnimatedSection direction="up" className="text-center mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                      Latest Articles
                    </h2>
                    <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto rounded-full"></div>
                  </AnimatedSection>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post: BlogPostData) => (
                      <Link to={`/blog/${post.slug}`} key={post.id} data-testid={`link-blog-post-${post.slug}`}>
                        <Card className="group overflow-hidden border border-slate-200 shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col rounded-md">
                          {post.featured_image && (
                            <div className="relative h-56 overflow-hidden">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 backdrop-blur-sm capitalize">
                                  {post.category.replace('-', ' ')}
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 text-gray-600 text-sm mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.published_date)}</span>
                              </div>
                              {post.read_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{post.read_time}</span>
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2" data-testid={`text-post-title-${post.id}`}>
                              {post.seo_optimized_title || post.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                              {post.meta_description || post.excerpt}
                            </p>
                            
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 3).map((tag: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between gap-2 mt-auto">
                              <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <User className="w-4 h-4" />
                                <span>{post.author}</span>
                              </div>
                              
                              <Button variant="ghost" size="sm" className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                Read More
                                <ArrowRight className="ml-1 w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
            </section>
          )}
        </>
      )}

      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <AnimatedSection direction="up">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Stay Informed
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-light">
              Subscribe to receive the latest updates on compliance regulations, best practices, and industry insights delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                data-testid="input-newsletter-email"
                className="flex h-12 w-full rounded-md border border-input bg-white px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button size="lg" data-testid="button-subscribe" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white whitespace-nowrap rounded-md shadow-lg transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <CTASection
        headline="Have Questions?"
        body="Our team is here to help you navigate compliance requirements and find the right solutions for your project."
        primaryButtonText="Talk to Our Team"
        primaryButtonLink={createPageUrl("Contact")}
        testIdPrefix="blog-cta"
      />
    </div>
  );
}
