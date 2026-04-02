import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, Info, Plus, X, ArrowRight, Loader2, Upload, FileText, Calendar as CalendarIcon } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import SEO from "../components/SEO";
import AnimatedGridBackground from "../components/AnimatedGridBackground";
import BlueprintBackground from "../components/BlueprintBackground";
import { submitMarketingIntake } from "../lib/stubApi";

interface AddressEntry {
  addressLine: string;
  zipCode: string;
  state: string;
  county: string;
  approximateSize: string;
}

interface SubmittedData {
  locations: AddressEntry[];
  service: string | undefined;
  contactDate: Date | null;
  filesCount: number;
}

export default function Consultation() {
  const [addresses, setAddresses] = useState<AddressEntry[]>([
    { addressLine: "", zipCode: "", state: "CA", county: "", approximateSize: "" }
  ]);
  const [moreThanFive, setMoreThanFive] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [formData, setFormData] = useState({ 
    serviceInterest: "",
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [preferredContactDate, setPreferredContactDate] = useState<Date | undefined>(undefined);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const serviceOptions = [
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

  const californiaCounties = [
    "Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa",
    "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo",
    "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa",
    "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange",
    "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino",
    "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo",
    "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou",
    "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare",
    "Tuolumne", "Ventura", "Yolo", "Yuba"
  ];

  const addAddress = () => {
    if (addresses.length < 5) {
      setAddresses([...addresses, { addressLine: "", zipCode: "", state: "CA", county: "", approximateSize: "" }]);
    }
  };

  const removeAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const updateAddress = (index: number, field: keyof AddressEntry, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const wordCount = additionalDetails.trim().split(/\s+/).filter((word) => word.length > 0).length;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name || !formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email || !formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    const hasValidAddress = addresses.some(addr => addr.addressLine && addr.county);
    if (!hasValidAddress) {
      errors.addresses = "Please provide at least one location with address and county";
    }
    
    if (!formData.serviceInterest) {
      errors.serviceInterest = "Please select a service interest";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      setUploadedFiles(prev => [...prev, { name: file.name, url: URL.createObjectURL(file) }]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const locationsText = addresses.map((addr, i) => {
        return `Project Location ${i + 1}: Address: ${addr.addressLine || 'Not provided'}, Zip: ${addr.zipCode || 'Not provided'}, State: ${addr.state || 'CA'}, County: ${addr.county || 'Not provided'}, Size: ${addr.approximateSize || 'Not provided'}`;
      }).join('; ');

      const serviceLabel = serviceOptions.find(opt => opt.value === formData.serviceInterest)?.label || formData.serviceInterest;

      const message = `Service Interest: ${serviceLabel}
Preferred Contact Date: ${preferredContactDate ? format(preferredContactDate, 'PPP') : 'Not specified'}
Project Locations: ${locationsText}
More than 5 locations: ${moreThanFive || 'N/A'}
Additional Details: ${additionalDetails || 'None'}
Files Attached: ${uploadedFiles.length}`;

      const response = await submitMarketingIntake({
        submissionType: "consultation",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceInterest: formData.serviceInterest,
        projectType: "consultation",
        message,
        attachments: uploadedFiles.map((file) => file.name),
        context: {
          locations: addresses,
          moreThanFive,
          preferredContactDate: preferredContactDate?.toISOString(),
          additionalDetails,
          page: "consultation",
        },
      });

      setSubmissionMessage(response.nextStepMessage);
      setSubmittedData({
        locations: addresses.filter(a => a.addressLine || a.county),
        service: serviceLabel,
        contactDate: preferredContactDate || null,
        filesCount: uploadedFiles.length,
      });

      setSubmitted(true);
      setAddresses([{ addressLine: "", zipCode: "", state: "CA", county: "", approximateSize: "" }]);
      setMoreThanFive("");
      setFormData({ 
        serviceInterest: "",
        name: "",
        email: "",
        phone: "",
        company: ""
      });
      setPreferredContactDate(undefined);
      setUploadedFiles([]);
      setAdditionalDetails("");
      setValidationErrors({});
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to submit form. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="consultation-page">
      <SEO 
        title="Free Project Consultation - SWPPP & Engineering Services | PECI"
        description="Request a free consultation for your construction, SWPPP, engineering, or inspection project. Expert analysis and tailored solutions from our PE-certified team."
        keywords="free consultation, SWPPP consultation, engineering consultation, project quote, construction consultation, project analysis"
        url="/consultation"
      />
      
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.6]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600')" }}
          />
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
                <h1 className="text-white mb-6 text-3xl font-bold sm:text-5xl md:text-6xl tracking-tight" data-testid="text-consultation-title">
                  Free Project Consultation
                </h1>
                <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-200 via-blue-500 to-cyan-200 mx-auto mb-8 rounded-full"></div>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
                  Tell us about your project and our team of Professional Engineers and construction experts will reach out to discuss your needs and provide tailored solutions.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/80 via-cyan-500/80 to-blue-500/80" />
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="up" delay={0.1}>
            <Card className="p-8 border border-slate-200 shadow-xl mb-8 bg-white rounded-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500 -mx-8 -mt-8 mb-8" />
              <h2 className="text-slate-900 mb-8 text-3xl font-bold text-center tracking-tight">Project Details</h2>
              
              <div className="space-y-6">
                <Card className="p-6 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Your Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setValidationErrors(prev => ({ ...prev, name: undefined }));
                        }}
                        placeholder="John Doe"
                        className={`h-12 rounded-md ${validationErrors.name ? 'border-red-500' : ''}`}
                        required
                        data-testid="input-name"
                      />
                      {validationErrors.name && (
                        <p className="text-red-600 text-xs mt-1 font-medium" data-testid="error-name">{validationErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setValidationErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        placeholder="john@example.com"
                        className={`h-12 rounded-md ${validationErrors.email ? 'border-red-500' : ''}`}
                        required
                        data-testid="input-email"
                      />
                      {validationErrors.email && (
                        <p className="text-red-600 text-xs mt-1 font-medium" data-testid="error-email">{validationErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(415) 123-4567"
                        className="h-12 rounded-md"
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="ABC Construction"
                        className="h-12 rounded-md"
                        data-testid="input-company"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-cyan-50 border border-cyan-200 rounded-md">
                  <Label htmlFor="service-interest" className="text-slate-700 font-bold mb-3 block uppercase text-xs tracking-wider">
                    Service Interest *
                  </Label>
                  <Select
                    value={formData.serviceInterest}
                    onValueChange={(value) => {
                      setFormData({ ...formData, serviceInterest: value });
                      setValidationErrors(prev => ({ ...prev, serviceInterest: undefined }));
                    }}
                  >
                    <SelectTrigger id="service-interest" className={`h-12 bg-white rounded-md ${validationErrors.serviceInterest ? 'border-red-500' : ''}`} data-testid="select-service-interest">
                      <SelectValue placeholder="Select service you're interested in" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.serviceInterest && (
                    <p className="text-red-600 text-xs mt-2 font-medium" data-testid="error-service">{validationErrors.serviceInterest}</p>
                  )}
                </Card>

                {addresses.map((address, index) => (
                  <Card key={index} className="p-6 bg-white border border-slate-200 rounded-md shadow-lg">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                        Project Location {index + 1}
                      </h3>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAddress(index)}
                          className="text-red-600 rounded-md"
                          data-testid={`button-remove-location-${index}`}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor={`address-${index}`} className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                          Address Line
                        </Label>
                        <Input
                          id={`address-${index}`}
                          value={address.addressLine}
                          onChange={(e) => updateAddress(index, 'addressLine', e.target.value)}
                          placeholder="123 Main Street"
                          className="h-12 rounded-md"
                          data-testid={`input-address-${index}`}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`zipcode-${index}`} className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                            Zip Code
                          </Label>
                          <Input
                            id={`zipcode-${index}`}
                            value={address.zipCode}
                            onChange={(e) => updateAddress(index, 'zipCode', e.target.value)}
                            placeholder="94107"
                            maxLength={5}
                            className="h-12 rounded-md"
                            data-testid={`input-zipcode-${index}`}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`state-${index}`} className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                            State
                          </Label>
                          <Input
                            id={`state-${index}`}
                            value={address.state}
                            onChange={(e) => updateAddress(index, 'state', e.target.value)}
                            placeholder="CA"
                            className="h-12 rounded-md"
                            data-testid={`input-state-${index}`}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`county-${index}`} className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                          County
                        </Label>
                        <Select
                          value={address.county}
                          onValueChange={(value) => updateAddress(index, 'county', value)}
                        >
                          <SelectTrigger id={`county-${index}`} className="h-12 bg-white rounded-md" data-testid={`select-county-${index}`}>
                            <SelectValue placeholder="Select a county..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] rounded-md">
                            {californiaCounties.map((county) => (
                              <SelectItem key={county} value={county}>
                                {county}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`size-${index}`} className="text-slate-700 font-bold mb-2 block uppercase text-xs tracking-wider">
                          Approximate Size
                        </Label>
                        <Select
                          value={address.approximateSize}
                          onValueChange={(value) => updateAddress(index, 'approximateSize', value)}
                        >
                          <SelectTrigger id={`size-${index}`} className="h-12 bg-white rounded-md" data-testid={`select-size-${index}`}>
                            <SelectValue placeholder="Select size..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-md">
                            <SelectItem value="1 acre or less">1 acre or less</SelectItem>
                            <SelectItem value="1-5 acres">1-5 acres</SelectItem>
                            <SelectItem value="5+ acres">5+ acres</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="flex justify-center">
                  <Button
                    onClick={addAddress}
                    disabled={addresses.length >= 5}
                    data-testid="button-add-location"
                    className={`rounded-md font-bold tracking-tight shadow-lg ${
                      addresses.length >= 5
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                    }`}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Another Location
                  </Button>
                </div>

                {addresses.length === 5 && (
                  <Card className="p-6 bg-amber-50 border border-amber-200 rounded-md shadow-lg">
                    <Label htmlFor="more-than-five" className="font-bold text-slate-900 mb-3 block text-lg uppercase tracking-wide">
                      More than 5 locations?
                    </Label>
                    <Select value={moreThanFive} onValueChange={setMoreThanFive}>
                      <SelectTrigger id="more-than-five" className="h-12 bg-white rounded-md" data-testid="select-more-than-five">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>

                    {moreThanFive === "yes" && (
                      <div className="mt-4 p-4 bg-white rounded-md border-2 border-amber-300">
                        <p className="text-slate-700 leading-relaxed">
                          We're delighted to help with any size project. Please provide details in the <strong>"Additional Details"</strong> field below.
                        </p>
                      </div>
                    )}
                  </Card>
                )}

                {validationErrors.addresses && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md" data-testid="error-addresses">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 text-sm font-medium">{validationErrors.addresses}</p>
                  </div>
                )}

                <Card className={`p-6 transition-all duration-300 rounded-md shadow-lg ${
                  moreThanFive === "yes"
                    ? 'bg-amber-50 border-amber-300 border-2'
                    : 'bg-white border-slate-200'
                }`}>
                  <Label htmlFor="additional-details" className="font-bold text-slate-900 mb-3 block text-lg uppercase tracking-wide">
                    Additional Project Details
                  </Label>
                  <Textarea
                    id="additional-details"
                    value={additionalDetails}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/).filter((word) => word.length > 0);
                      if (words.length <= 500) {
                        setAdditionalDetails(e.target.value);
                      }
                    }}
                    placeholder="Tell us about your project timeline, special requirements, specific challenges, or any questions you have..."
                    className="min-h-[200px] resize-none rounded-md"
                    data-testid="input-additional-details"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-slate-500 font-medium" data-testid="text-word-count">
                      {wordCount} / 500 words
                    </p>
                    {wordCount >= 500 && (
                      <p className="text-sm text-amber-600 font-medium">
                        Word limit reached
                      </p>
                    )}
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-slate-200 rounded-md shadow-lg">
                  <Label className="text-slate-700 font-bold mb-3 block uppercase text-xs tracking-wider">
                    Attach Project Documents (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center bg-slate-50">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                      data-testid="input-file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center shadow-sm">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="text-blue-600 font-bold uppercase tracking-wide text-xs">Click to upload</span> or drag and drop
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        PDF, DOC, JPG, PNG, DWG up to 10MB each
                      </p>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 bg-blue-50 p-3 rounded-md border border-blue-100"
                          data-testid={`file-item-${index}`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-slate-700 font-medium truncate max-w-[200px]">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            data-testid={`button-remove-file-${index}`}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-6 bg-white border border-slate-200 rounded-md shadow-lg">
                  <Label className="text-slate-700 font-bold mb-3 block uppercase text-xs tracking-wider">
                    Preferred Contact Date (Optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 justify-start text-left font-normal rounded-md border-slate-300"
                        data-testid="button-select-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {preferredContactDate ? format(preferredContactDate, 'PPP') : 'Select a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-md">
                      <Calendar
                        mode="single"
                        selected={preferredContactDate}
                        onSelect={(value) =>
                          setPreferredContactDate(value as Date | undefined)
                        }
                        disabled={(date: Date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-slate-500 mt-2 font-medium">
                    Let us know when you'd like to be contacted
                  </p>
                </Card>

                {submitted ? (
                  <Card className="p-8 bg-green-50 border border-green-200 rounded-md shadow-xl" data-testid="submission-success">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-md flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
                        Submission Received!
                      </h3>
                      
                      <div className="bg-white rounded-md p-6 mb-6 text-left border border-green-200">
                        <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wide">Your Submission Summary:</h4>
                        <div className="space-y-2 text-sm text-slate-700">
                          {submittedData?.locations && submittedData.locations.length > 0 && (
                            <p><strong>Locations:</strong> {submittedData.locations.length} project location(s)</p>
                          )}
                          {submittedData?.service && (
                            <p><strong>Service:</strong> {submittedData.service}</p>
                          )}
                          {submittedData?.contactDate && (
                            <p><strong>Preferred Contact:</strong> {format(submittedData.contactDate, 'PPP')}</p>
                          )}
                          {submittedData?.filesCount && submittedData.filesCount > 0 && (
                            <p><strong>Documents Attached:</strong> {submittedData.filesCount} file(s)</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                        <p className="text-blue-900 font-bold mb-1">Next Step</p>
                        <p className="text-blue-700 text-sm">
                          {submissionMessage}
                        </p>
                      </div>

                      <p className="text-slate-600 mb-6">
                        Thank you for your inquiry. A member of our team will review your submission and reach out to discuss your project needs.
                      </p>
                      <Button 
                        onClick={() => { setSubmitted(false); setSubmittedData(null); setSubmissionMessage(""); }} 
                        variant="outline"
                        className="border-slate-300 text-slate-700 rounded-md uppercase tracking-wide font-bold"
                        data-testid="button-submit-another"
                      >
                        Submit Another Inquiry
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="flex justify-center pt-6">
                    <Button 
                      size="lg" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      data-testid="button-submit-consultation"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-7 text-lg font-bold tracking-tight rounded-md shadow-xl transition-all duration-300 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit Consultation Request
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.2}>
            <Card className="p-8 mb-8 bg-blue-50 border border-blue-200 rounded-md shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center shadow-md">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-wide">About Service Requirements</h3>
                    {isInfoExpanded && (
                      <p className="text-slate-700 leading-relaxed mt-4">
                        Different services have different requirements. Our team will assess your specific project needs and recommend the appropriate engineering and construction services. Fill out the form as completely as possible so our licensed professionals can best assist you.
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white transition-colors"
                  data-testid="button-toggle-info"
                >
                  {isInfoExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.3}>
            <Card className="p-8 bg-white border border-slate-200 rounded-md shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center uppercase tracking-wide">Regulatory Requirements</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  <strong className="text-slate-900">Federal Requirements:</strong> Under the Clean Water Act's National Pollutant Discharge Elimination System (NPDES) program, a SWPPP is required for construction activities that disturb one acre or more of land surface, or are part of a larger common plan of development.
                </p>
                <p>
                  <strong className="text-slate-900">California Requirements:</strong> The California State Water Resources Control Board requires coverage under the Construction General Permit for qualifying projects throughout the state, including the San Francisco Bay Area.
                </p>
                <p>
                  <strong className="text-slate-900">Local Requirements:</strong> Many California municipalities have additional local requirements that may apply to smaller projects or have specific provisions. Our locally trained professionals will guide you through all applicable regulations.
                </p>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <Card className="p-8 bg-slate-900 border-0 text-white rounded-md mt-8 shadow-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-wide">We've Got You Covered</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Our dedicated teams with decades of combined expertise in environmental and structural engineering will help you navigate compliance efficiently.
                </p>
                <a href="tel:+14156894428">
                  <Button size="lg" data-testid="button-call-now" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md font-bold tracking-tight h-14 px-10 shadow-lg transition-all duration-300 group">
                    Call for Immediate Assistance: (415)-689-4428
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </a>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
