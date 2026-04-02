import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, MapPin, Building2, Award, CheckCircle, Mail, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import useEmblaCarousel from 'embla-carousel-react';
import { fetchMarketingJson, submitMarketingIntake } from "../lib/stubApi";

interface GalleryProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  county: string;
  location: string;
  date: string;
  image: string;
  images: string[];
  services: string[];
  agencies?: string[];
  scope?: string;
  client_name?: string;
  contact_name?: string;
  budget?: string;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: project, isLoading } = useQuery<GalleryProject | undefined>({
    queryKey: ["/api/gallery-projects/slug", slug],
    queryFn: () => fetchMarketingJson<GalleryProject>("/api/gallery-projects/slug/" + slug),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" data-testid="project-detail-loading">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4" data-testid="text-project-not-found">Project Not Found</h1>
          <Link to={createPageUrl("ProjectGallery")}>
            <Button data-testid="button-back-to-gallery">Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitMarketingIntake({
        submissionType: "projectInquiry",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        projectType: project.slug,
        serviceInterest: project.services?.[0],
        message: `Project Inquiry: ${project.title}\n\n${formData.message}`,
        context: {
          projectSlug: project.slug,
          projectTitle: project.title,
          location: project.location,
        },
      });

      setSubmissionMessage(response.nextStepMessage);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      console.error("Error sending inquiry:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="project-detail-page">
      <SEO 
        title={`${project.title} - Project Portfolio | Pacific Engineering`}
        description={project.description?.substring(0, 160)}
        keywords={`${project.category}, ${project.services?.join(', ')}, ${project.location}, engineering project`}
        image={project.images?.[0]}
        type="article"
        url={`/project/${project.slug}`}
      />
      
      <section className="py-6 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl("ProjectGallery")} data-testid="link-back-to-gallery">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-slate-900 relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {project.images?.map((img: string, idx: number) => (
              <div key={idx} className="flex-[0_0_100%] min-w-0">
                <div className="relative h-96 md:h-[600px]">
                  <img
                    src={img}
                    alt={`${project.title} - Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    data-testid={`img-carousel-${idx}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {project.images && project.images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              data-testid="button-carousel-prev"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>
            <button
              onClick={scrollNext}
              data-testid="button-carousel-next"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all z-10"
            >
              <ChevronRight className="w-6 h-6 text-slate-900" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {project.images.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                  data-testid={`button-carousel-dot-${idx}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === selectedIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection direction="up">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="bg-slate-900 text-white px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">
                    {project.date}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight" data-testid="text-project-title">
                  {project.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-slate-500 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-medium" data-testid="text-project-location">{project.location}</span>
                  </div>
                  {project.budget && (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-medium">Budget: {project.budget}</span>
                    </div>
                  )}
                </div>
                
                <div id="overview" className="mb-10 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Project Overview</h2>
                  <p className="text-slate-600 text-lg leading-relaxed" data-testid="text-project-description">
                    {project.description}
                  </p>
                </div>
                
                {project.scope && (
                  <div id="scope" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Scope of Work</h2>
                    <div className="bg-slate-50 border-l-4 border-blue-600 p-6 rounded-r-md">
                      <p className="text-slate-700 leading-relaxed">
                        {project.scope}
                      </p>
                    </div>
                  </div>
                )}

                {project.client_name && (
                  <div id="client" className="mb-10 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Client Information</h2>
                    <Card className="p-6 border border-slate-200 bg-white rounded-md shadow-sm">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client</div>
                            <div className="text-slate-900 font-medium" data-testid="text-project-client">{project.client_name}</div>
                          </div>
                        </div>
                        {project.contact_name && (
                          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <div>
                              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</div>
                              <div className="text-slate-900 font-medium">{project.contact_name}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              </AnimatedSection>
            </div>
            
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <AnimatedSection direction="right" delay={0.2}>
                <Card className="p-6 border border-slate-200 bg-slate-50 rounded-md shadow-md">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Quick Navigation</h3>
                  <div className="space-y-2">
                    <a href="#overview" className="block px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium text-slate-700">
                      Project Overview
                    </a>
                    <a href="#scope" className="block px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium text-slate-700">
                      Scope of Work
                    </a>
                    <a href="#services" className="block px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium text-slate-700">
                      Services Provided
                    </a>
                    <a href="#client" className="block px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium text-slate-700">
                      Client Info
                    </a>
                  </div>
                </Card>
                
                <Card id="services" className="p-6 border border-slate-200 bg-white rounded-md shadow-md scroll-mt-24">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Services Provided</h3>
                  <div className="space-y-2">
                    {project.services?.map((service: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-md border-l-2 border-blue-600"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {project.agencies && project.agencies.length > 0 && (
                  <Card className="p-6 border border-slate-200 bg-white rounded-md shadow-md">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Agency Participation</h3>
                    <div className="space-y-3">
                      {project.agencies.map((agency: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="font-medium">{agency}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                
                <Card className="p-6 border-2 border-blue-600 bg-blue-50 rounded-md shadow-lg">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">Interested in a Similar Project?</h3>
                  
                  {submitted ? (
                    <div className="text-center py-6" data-testid="inquiry-success">
                      <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-slate-700 font-medium mb-2">Thank you for your inquiry.</p>
                      <p className="text-sm text-slate-600">{submissionMessage}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSubmitted(false);
                          setSubmissionMessage("");
                        }}
                        className="mt-4"
                        data-testid="button-send-another"
                      >
                        Send Another Inquiry
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-project-inquiry">
                      <div>
                        <Label htmlFor="name" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 border-slate-300 bg-white"
                          data-testid="input-inquiry-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1 border-slate-300 bg-white"
                          data-testid="input-inquiry-email"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-1 border-slate-300 bg-white"
                          data-testid="input-inquiry-phone"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="company" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="mt-1 border-slate-300 bg-white"
                          data-testid="input-inquiry-company"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Message *</Label>
                        <Textarea
                          id="message"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="mt-1 border-slate-300 bg-white min-h-[120px]"
                          placeholder="Tell us about your project..."
                          data-testid="input-inquiry-message"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        data-testid="button-submit-inquiry"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold tracking-tight rounded-md h-12"
                      >
                        {isSubmitting ? "Sending..." : "Send Inquiry"}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </form>
                  )}
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection direction="up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed font-light">
              Let's discuss how we can bring the same level of excellence to your construction project.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Contact")} data-testid="link-contact-cta">
                <Button size="lg" className="bg-white text-blue-600 px-10 py-7 text-lg font-bold tracking-tight rounded-md">
                  Get in Touch
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("ProjectGallery")} data-testid="link-more-projects">
                <Button size="lg" variant="outline" className="border-white text-white px-10 py-7 text-lg font-bold tracking-tight rounded-md">
                  View More Projects
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
