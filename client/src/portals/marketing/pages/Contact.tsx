import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Send, CheckCircle, Upload, FileText, X } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import SEO from "../components/SEO";
import AnimatedGridBackground from "../components/AnimatedGridBackground";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  projectType: string;
  message: string;
}

interface UploadedFile {
  name: string;
  url: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
  [key: string]: string | undefined;
}

interface TouchedFields {
  [key: string]: boolean;
}

interface ServiceOption {
  value: string;
  label: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "",
    projectType: "",
    message: ""
  });

  const serviceOptions: ServiceOption[] = [
    { value: "swppp-qsd", label: "SWPPP Development (QSD Services)" },
    { value: "swppp-qsp", label: "SWPPP Implementation (QSP Services)" },
    { value: "construction-class-a", label: "Construction - Class A (Infrastructure)" },
    { value: "construction-class-b", label: "Construction - Class B (Building)" },
    { value: "inspections-stormwater", label: "Stormwater Testing & Inspections" },
    { value: "inspections-materials", label: "Materials Testing & Sampling" },
    { value: "special-inspections", label: "Special Inspections (PE-Certified)" },
    { value: "structural-engineering", label: "Structural Engineering Consulting" },
    { value: "civil-engineering", label: "Civil Engineering Consulting" },
    { value: "multiple", label: "Multiple Services" },
    { value: "other", label: "Other / Not Sure" }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get("service");
    if (serviceParam) {
      const match = serviceOptions.find(opt => 
        opt.label.toLowerCase().includes(serviceParam.toLowerCase()) || 
        opt.value.toLowerCase() === serviceParam.toLowerCase()
      );
      
      if (match) {
        setFormData(prev => ({ ...prev, serviceInterest: match.value }));
      } else {
        setFormData(prev => ({ ...prev, serviceInterest: "other", message: `Inquired about: ${serviceParam}\n\n` + prev.message }));
      }
    }
  }, []);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      const url = URL.createObjectURL(file);
      setUploadedFiles(prev => [...prev, { name: file.name, url }]);
    }
  };

  const removeFile = (index: number): void => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateField = (name: string, value: string): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    switch(name) {
      case 'name':
        if (!value.trim()) errors.name = 'Name is required';
        else if (value.length < 2) errors.name = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = 'Invalid email format';
        break;
      case 'phone':
        if (value && !/^[\d\s\-\(\)]+$/.test(value)) errors.phone = 'Invalid phone number';
        break;
      case 'serviceInterest':
        if (!value) errors.serviceInterest = 'Please select a service';
        break;
      case 'message':
        if (!value.trim()) errors.message = 'Message is required';
        else if (value.length < 10) errors.message = 'Message must be at least 10 characters';
        break;
    }
    
    return errors;
  };

  const handleFieldChange = (field: keyof ContactFormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
    
    if (touchedFields[field]) {
      const fieldErrors = validateField(field, value);
      setValidationErrors(prev => ({ ...prev, ...fieldErrors, [field]: fieldErrors[field] }));
    }
  };

  const handleFieldBlur = (field: keyof ContactFormData): void => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const fieldErrors = validateField(field, formData[field]);
    setValidationErrors(prev => ({ ...prev, ...fieldErrors }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    (Object.keys(formData) as Array<keyof ContactFormData>).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldErrors);
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);

    try {
      await fetch("/api/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          serviceInterest: formData.serviceInterest,
          projectType: formData.projectType,
          message: formData.message,
          attachments: uploadedFiles.map(f => f.name),
        }),
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        serviceInterest: "",
        projectType: "",
        message: ""
      });
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-contact">
      <SEO 
        title="Contact Pacific Engineering - Get Your Free Consultation"
        description="Contact Pacific Engineering for civil engineering, SWPPP, construction, and inspection services. Located in San Francisco. Call (415)-689-4428 or request a free consultation today."
        keywords="contact pacific engineering, engineering consultation, SWPPP quote, construction services inquiry, San Francisco engineers, free consultation"
        image="/Logo.jpeg"
        url="/contact"
      />
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-900 border-b-4 border-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
        </div>

        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <AnimatedGridBackground />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <AnimatedSection direction="up">
            <h1 className="text-white mb-6 text-3xl font-bold sm:text-5xl md:text-6xl tracking-tight" data-testid="text-contact-title">Get in Touch</h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
              Ready to discuss your project needs? Our team of Professional Engineers and construction experts is here to help.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection direction="up" delay={0.1}>
              <Card className="p-8 border border-slate-200 shadow-xl bg-white rounded-md overflow-hidden" data-testid="card-contact-form">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500 -mx-8 -mt-8 mb-8" />
                <h2 className="text-slate-900 mb-8 text-3xl font-bold text-center tracking-tight">Send Us a Message</h2>
                
                {submitted ?
                <div className="text-center py-12" data-testid="text-submission-success">
                    <div className="w-20 h-20 bg-blue-100 rounded-md flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 uppercase tracking-wide">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-md uppercase tracking-wide font-bold" data-testid="button-send-another">
                      Send Another Message
                    </Button>
                  </div> :

                  <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                            Full Name *
                          </Label>
                          <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('name', e.target.value)}
                          onBlur={() => handleFieldBlur('name')}
                          placeholder="John Smith"
                          className={`h-12 rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${validationErrors.name && touchedFields.name ? 'border-red-500' : ''}`}
                          data-testid="input-name" />
                          {validationErrors.name && touchedFields.name && (
                            <p className="text-red-600 text-xs mt-1 font-medium" data-testid="text-error-name">{validationErrors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                            Email Address *
                          </Label>
                          <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('email', e.target.value)}
                          onBlur={() => handleFieldBlur('email')}
                          placeholder="john@company.com"
                          className={`h-12 rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${validationErrors.email && touchedFields.email ? 'border-red-500' : ''}`}
                          data-testid="input-email" />
                          {validationErrors.email && touchedFields.email && (
                            <p className="text-red-600 text-xs mt-1 font-medium" data-testid="text-error-email">{validationErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                            Phone Number
                          </Label>
                          <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('phone', e.target.value)}
                          onBlur={() => handleFieldBlur('phone')}
                          placeholder="(555) 123-4567"
                          className={`h-12 rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${validationErrors.phone && touchedFields.phone ? 'border-red-500' : ''}`}
                          data-testid="input-phone" />
                          {validationErrors.phone && touchedFields.phone && (
                            <p className="text-red-600 text-xs mt-1 font-medium" data-testid="text-error-phone">{validationErrors.phone}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="company" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                            Company Name
                          </Label>
                          <Input
                          id="company"
                          value={formData.company}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="ABC Construction"
                          className="h-12 rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          data-testid="input-company" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="serviceInterest" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                          Service Interest *
                        </Label>
                        <Select
                          value={formData.serviceInterest}
                          onValueChange={(value: string) => {
                            handleFieldChange('serviceInterest', value);
                            setTouchedFields(prev => ({ ...prev, serviceInterest: true }));
                          }}
                          required
                        >
                          <SelectTrigger className={`h-12 bg-white rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${validationErrors.serviceInterest && touchedFields.serviceInterest ? 'border-red-500' : ''}`} data-testid="select-service-interest">
                            <SelectValue placeholder="Select service you're interested in" />
                          </SelectTrigger>
                          <SelectContent className="rounded-md border-slate-200">
                            {serviceOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {validationErrors.serviceInterest && touchedFields.serviceInterest && (
                          <p className="text-red-600 text-xs mt-1 font-medium" data-testid="text-error-service">{validationErrors.serviceInterest}</p>
                        )}
                      </div>

                      {formData.serviceInterest && formData.serviceInterest !== 'other' && (
                        <div>
                          <Label htmlFor="projectType" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                            Project Type
                          </Label>
                          <Select
                            value={formData.projectType}
                            onValueChange={(value: string) => handleFieldChange('projectType', value)}
                          >
                            <SelectTrigger className="h-12 bg-white rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500" data-testid="select-project-type">
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-md border-slate-200">
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="residential">Residential</SelectItem>
                              <SelectItem value="infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="industrial">Industrial</SelectItem>
                              <SelectItem value="municipal">Municipal</SelectItem>
                              <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="message" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                          Message *
                        </Label>
                        <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('message', e.target.value)}
                        onBlur={() => handleFieldBlur('message')}
                        placeholder="Tell us about your project and how we can help..."
                        className={`min-h-[150px] rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${validationErrors.message && touchedFields.message ? 'border-red-500' : ''}`}
                        data-testid="input-message" />
                        {validationErrors.message && touchedFields.message && (
                          <p className="text-red-600 text-xs mt-1 font-medium" data-testid="text-error-message">{validationErrors.message}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                          Attachments (Optional)
                        </Label>
                        <div className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                            data-testid="input-file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-600 text-sm">Click to upload or drag and drop</p>
                            <p className="text-slate-400 text-xs mt-1">PDF, Word, Excel, or Images (max 10MB)</p>
                          </label>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between gap-2 bg-slate-50 p-3 rounded-md" data-testid={`text-uploaded-file-${index}`}>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-slate-700">{file.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-slate-400 hover:text-red-600 transition-colors"
                                  data-testid={`button-remove-file-${index}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-lg rounded-md shadow-lg transition-all duration-300"
                        data-testid="button-submit-contact"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">...</span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                }
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <div className="space-y-8">
                <Card className="p-8 border border-slate-200 shadow-xl bg-white rounded-md" data-testid="card-contact-info">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Phone</h4>
                        <a href="tel:+14156894428" className="text-blue-600 hover:text-blue-700 font-medium text-lg" data-testid="link-phone">
                          (415) 689-4428
                        </a>
                        <p className="text-slate-500 text-sm mt-1">Monday - Friday, 8am - 5pm PST</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Email</h4>
                        <a href="mailto:amwaldman@sbcglobal.net" className="text-blue-600 hover:text-blue-700 font-medium" data-testid="link-email">
                          amwaldman@sbcglobal.net
                        </a>
                        <p className="text-slate-500 text-sm mt-1">We respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Office</h4>
                        <p className="text-slate-700 font-medium">470 3rd St.</p>
                        <p className="text-slate-700">San Francisco, CA 94107</p>
                        <p className="text-slate-500 text-sm mt-1">Serving the entire Bay Area</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border border-slate-200 shadow-xl bg-gradient-to-br from-blue-600 to-cyan-500 rounded-md text-white" data-testid="card-service-help">
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">Need Help Choosing a Service?</h3>
                  <p className="text-blue-100 mb-6">
                    Not sure which service is right for your project? Our team can help you identify the best solution.
                  </p>
                  <div className="space-y-3">
                    <p className="text-blue-50 text-sm">
                      Call us at <a href="tel:+14156894428" className="font-bold underline" data-testid="link-help-phone">(415) 689-4428</a> for a free consultation, or describe your project in the form and we'll recommend the right services.
                    </p>
                  </div>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
