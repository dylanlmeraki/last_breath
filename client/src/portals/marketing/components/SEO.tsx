import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}: SEOProps) {
  const siteName = "Pacific Engineering & Construction Inc.";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = url ? `${baseUrl}${url}` : typeof window !== "undefined" ? window.location.href : "";
  const ogImage = image || "/images/pe-logo.png";

  const seoTitle = title || "Pacific Engineering & Construction Inc.";
  const seoDescription = description || "Professional civil engineering, construction management, and SWPPP services in the San Francisco Bay Area.";
  const seoKeywords = keywords || "civil engineering, construction, SWPPP, Bay Area";

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Pacific Engineering & Construction Inc." />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
