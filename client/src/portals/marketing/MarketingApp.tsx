import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { HelmetProvider } from "react-helmet-async";
import MarketingLayout from "./layout/MarketingLayout";
import "./marketing.css";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const ServicesOverview = lazy(() => import("./pages/ServicesOverview"));
const InspectionsTesting = lazy(() => import("./pages/InspectionsTesting"));
const SpecialInspections = lazy(() => import("./pages/SpecialInspections"));
const StructuralEngineering = lazy(() => import("./pages/StructuralEngineering"));
const Construction = lazy(() => import("./pages/Construction"));
const ProjectGallery = lazy(() => import("./pages/ProjectGallery"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const PreviousWork = lazy(() => import("./pages/PreviousWork"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const SWPPPChecker = lazy(() => import("./pages/SWPPPChecker"));

function MarketingLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function MarketingApp() {
  return (
    <HelmetProvider>
    <MarketingLayout>
      <Suspense fallback={<MarketingLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services-overview" element={<ServicesOverview />} />
          <Route path="/inspections-testing" element={<InspectionsTesting />} />
          <Route path="/special-inspections" element={<SpecialInspections />} />
          <Route path="/structural-engineering" element={<StructuralEngineering />} />
          <Route path="/construction" element={<Construction />} />
          <Route path="/project-gallery" element={<ProjectGallery />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/previous-work" element={<PreviousWork />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/swppp-checker" element={<SWPPPChecker />} />
          <Route path="/consultation" element={<SWPPPChecker />} />
        </Routes>
      </Suspense>
    </MarketingLayout>
    </HelmetProvider>
  );
}
