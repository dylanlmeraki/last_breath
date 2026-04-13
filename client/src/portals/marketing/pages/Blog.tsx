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
import CTASection from "../components/CTASection";
import MarketingPageHero from "../components/MarketingPageHero";
import { marketingRouteImages } from "@shared/marketing-asset-manifest";

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
    <div className="min-h-screen bg-slate-50 blog-page-surface" data-testid="blog-page">
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

      <MarketingPageHero
        title="Pacific Engineering Insights"
        description="Practical guidance on compliance, engineering coordination, inspections, and Bay Area project delivery from Pacific Engineering’s field-informed perspective."
        backgroundImage={marketingRouteImages.blogHero}
        sectionTestId="section-blog-hero"
        titleTestId="text-blog-title"
      />

      <section className="pe-section pe-section-tight section-surface-solid blog-filter-section">
        <AnimatedSection direction="up" delay={0.1}>
          <div className="pe-container-wide">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  data-testid={`button-filter-${cat.value}`}
                  className={`blog-filter-chip ${
                    selectedCategory === cat.value
                      ? "is-active bg-blue-700 text-white"
                      : "bg-white text-gray-700"
                  }`}
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
            <section className="pe-section section-surface-soft blog-featured-section">
              <AnimatedSection direction="up" delay={0.2}>
                <div className="pe-container-wide">
                  <div className="mb-8">
                    <span className="blog-featured-badge">
                      Featured Article
                    </span>
                  </div>
                  
                  <Link to={`/blog/${featuredPost.slug}`} data-testid={`link-featured-post-${featuredPost.slug}`}>
                    <Card className="blog-featured-card overflow-hidden border border-slate-200 transition-all duration-300 cursor-pointer group rounded-md bg-white">
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
                    <div className="blog-featured-panel p-8 lg:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-4 mb-4">
                            <Badge className="bg-blue-50 text-blue-700 capitalize">
                              {featuredPost.category.replace('-', ' ')}
                            </Badge>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(featuredPost.published_date)}</span>
                            </div>
                          </div>
                          
                          <h2 className="pe-heading-2 text-slate-900 mb-4 group-hover:text-blue-700 transition-colors" data-testid="text-featured-title">
                            {featuredPost.seo_optimized_title || featuredPost.title}
                          </h2>
                          
                          <p className="pe-copy text-base mb-6">
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
                          
                          <Button size="lg" className="pe-button w-full lg:w-auto transition-all duration-300 group">
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
            <section className="pe-section section-surface-solid blog-list-section">
                <div className="pe-container-wide">
                  <AnimatedSection direction="up" className="text-center mb-16">
                    <h2 className="pe-heading-2 text-slate-900 mb-6">
                      Latest Articles
                    </h2>
                    <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto rounded-full"></div>
                  </AnimatedSection>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post: BlogPostData) => (
                      <Link to={`/blog/${post.slug}`} key={post.id} data-testid={`link-blog-post-${post.slug}`}>
                        <Card className="group blog-post-card overflow-hidden border border-slate-200 transition-all duration-300 cursor-pointer h-full flex flex-col rounded-md">
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
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2" data-testid={`text-post-title-${post.id}`}>
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

      <section className="pe-section section-surface-soft blog-consult-band">
        <AnimatedSection direction="up">
          <div className="pe-container text-center">
            <h2 className="pe-heading-2 text-slate-900 mb-6">
              Need a Practical Read on Project Requirements?
            </h2>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
            <p className="pe-lead mx-auto mb-8">
              Talk to Pacific Engineering if you need project-specific guidance on compliance, permitting, or field coordination rather than general updates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
              <Link
                to={createPageUrl("Contact")}
                data-testid="button-contact-blog"
                className="pe-button"
              >
                Contact Pacific Engineering
              </Link>
              <Button size="lg" asChild variant="outline" className="whitespace-nowrap rounded-md">
                <Link to={createPageUrl("Consultation")}>
                  Request Consultation
                </Link>
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
