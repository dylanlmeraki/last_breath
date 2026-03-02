import { useState } from "react";
import { listEntities, createEntity, filterEntities } from "@/lib/apiClient";
import { callFunction } from "@/lib/functionsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Search, 
  Phone,
  Mail,
  Building2,
  TrendingUp,
  Loader2,
  Calendar,
  Tag,
  FileText,
  Sparkles,
  Clock,
  Target,
  Copy,
  Send
 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

function ContactDetailModal({ contact, onClose }: { contact: any; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contact?.contact_name || "Contact Details"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {contact?.company_name && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>{contact.company_name}</span>
            </div>
          )}
          {contact?.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{contact.email}</span>
            </div>
          )}
          {contact?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact?.status && (
            <div>
              <Badge>{contact.status}</Badge>
            </div>
          )}
          {contact?.notes && (
            <div>
              <p className="text-sm font-medium mb-1">Notes:</p>
              <p className="text-sm text-muted-foreground">{contact.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClientSegmentation({ contacts, onSegmentSelect }: { contacts: any[]; onSegmentSelect: (contacts: any[] | null) => void }) {
  const segments = [
    { label: "All", filter: null },
    { label: "Leads", filter: "Lead" },
    { label: "Prospects", filter: "Prospect" },
    { label: "Clients", filter: "Client" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {segments.map((seg) => (
        <Button
          key={seg.label}
          variant="outline"
          size="sm"
          onClick={() => {
            if (seg.filter === null) {
              onSegmentSelect(null);
            } else {
              onSegmentSelect(contacts.filter((c: any) => c.contact_type === seg.filter));
            }
          }}
          data-testid={`segment-${seg.label.toLowerCase()}`}
        >
          {seg.label} ({seg.filter === null ? contacts.length : contacts.filter((c: any) => c.contact_type === seg.filter).length})
        </Button>
      ))}
    </div>
  );
}

export default function ContactManager() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [segmentedContacts, setSegmentedContacts] = useState<any[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => listEntities('Prospect', '-updated_date', 500),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => listEntities('Interaction', '-created_date', 100),
  });

  const formSubmissions = contacts.filter((c: any) => 
    c.lead_source === 'Website Form' || 
    c.lead_source === 'Consultation Request'
  );

  const consultationRequests = formSubmissions.filter((c: any) => c.lead_source === 'Consultation Request');
  const contactFormSubmissions = formSubmissions.filter((c: any) => c.lead_source === 'Website Form');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-for-contacts-opps'],
    queryFn: () => listEntities('Project', '-created_date', 100),
  });

  const handleSegmentSelect = (contacts: any[] | null) => {
    setSegmentedContacts(contacts);
  };

  const baseContacts = segmentedContacts || contacts;

  const analyzeSubmission = async (submission: any) => {
    setAnalyzing(submission.id);
    try {
      const res = await callFunction('analyzeContactInquiry', { contact_id: submission.id });
      setAnalysis((prev: any) => ({ ...prev, [submission.id]: res?.analysis || res?.fallback || "Analysis complete" }));
    } catch {
      setAnalysis((prev: any) => ({ ...prev, [submission.id]: { error: "Analysis unavailable" } }));
    } finally {
      setAnalyzing(null);
    }
  };

  const findOpportunities = async (clientEmail: string) => {
    setAnalyzing(clientEmail);
    try {
      const res = await callFunction('identifySalesOpportunities', { client_email: clientEmail });
      setAnalysis((prev: any) => ({ ...prev, [clientEmail]: res?.analysis || res?.fallback || "Analysis complete" }));
    } catch {
      setAnalysis((prev: any) => ({ ...prev, [clientEmail]: { error: "Analysis unavailable" } }));
    } finally {
      setAnalyzing(null);
    }
  };

  const filteredContacts = baseContacts.filter((contact: any) => {
    const matchesSearch = 
      contact.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || contact.contact_type === typeFilter;
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: contacts.length,
    leads: contacts.filter((c: any) => c.contact_type === "Lead").length,
    prospects: contacts.filter((c: any) => c.contact_type === "Prospect").length,
    clients: contacts.filter((c: any) => c.contact_type === "Client").length
  };

  const statusColors: Record<string, string> = {
    "New": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Contacted": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Qualified": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Proposal Sent": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Active Client": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Inactive": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "Lost": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const typeColors: Record<string, string> = {
    "Lead": "bg-blue-500",
    "Prospect": "bg-cyan-500",
    "Client": "bg-green-500",
    "Partner": "bg-purple-500",
    "Vendor": "bg-orange-500"
  };

  const leadSourceIcons: Record<string, any> = {
    "Website Form": Mail,
    "Consultation Request": Calendar,
    "Referral": Users,
    "Phone Call": Phone
  };

  const handleNewContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const handleEditContact = (contact: any) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const generateProposalMutation = useMutation({
    mutationFn: async (submission: any) => {
      const data = await callFunction('generateProposal', {
        formData: submission,
        formType: submission.lead_source
      });
      return data;
    },
    onSuccess: async (data: any, submission: any) => {
      if (data?.proposal) {
        await createEntity('Proposal', {
          title: data.proposal.title,
          content_html: data.proposal.content_html,
          proposal_number: data.proposal.proposal_number,
          status: 'draft',
          recipient_emails: [submission.email || submission.contact_email],
          fields_data: {
            service_interest: data.proposal.service_interest,
            project_type: data.proposal.project_type,
            client_name: data.proposal.client_name,
            client_company: data.proposal.client_company,
          }
        });
      }
      const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";
      navigate(basePath + createPageUrl("ProposalDashboard"));
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    }
  });

  const handleGenerateProposal = async (submission: any) => {
    setSelectedSubmission(submission);
    setIsGenerating(true);
    try {
      await generateProposalMutation.mutateAsync(submission);
    } catch (error) {
      console.error('Error generating proposal:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";

  return (
    <div className="py-6 max-w-7xl mx-auto">
      <ClientSegmentation 
        contacts={contacts} 
        onSegmentSelect={handleSegmentSelect}
      />

      <div className="mb-8 mt-8">
        <div className="flex items-center justify-between gap-1 mb-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-contact-manager-title">Contact Manager</h1>
            <p className="text-muted-foreground">
              {segmentedContacts ? `Viewing ${filteredContacts.length} segmented contacts` : `Manage ${contacts.length} leads, prospects, and clients`}
            </p>
          </div>
          <Button onClick={handleNewContact} data-testid="button-new-contact">
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Button>
        </div>

        {formSubmissions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-1">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Form Submissions</p>
                  <p className="text-2xl font-bold">{formSubmissions.length}</p>
                </div>
                <FileText className="w-8 h-8 text-cyan-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between gap-1">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Consultation Requests</p>
                  <p className="text-2xl font-bold">{consultationRequests.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between gap-1">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contact Forms</p>
                  <p className="text-2xl font-bold">{contactFormSubmissions.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4" data-testid="stat-total-contacts">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Contacts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Leads</p>
                <p className="text-2xl font-bold">{stats.leads}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prospects</p>
                <p className="text-2xl font-bold">{stats.prospects}</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Clients</p>
                <p className="text-2xl font-bold">{stats.clients}</p>
              </div>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts in this tab..."
                className="pl-10"
                data-testid="input-search-contacts"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40" data-testid="filter-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Lead">Leads</SelectItem>
                <SelectItem value="Prospect">Prospects</SelectItem>
                <SelectItem value="Client">Clients</SelectItem>
                <SelectItem value="Partner">Partners</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40" data-testid="filter-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Active Client">Active Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="contacts" data-testid="tab-contacts">
            <Users className="w-4 h-4 mr-2" />
            All Contacts ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="submissions" data-testid="tab-submissions">
            <FileText className="w-4 h-4 mr-2" />
            Form Submissions ({formSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="opportunities" data-testid="tab-opportunities">
            <TrendingUp className="w-4 h-4 mr-2" />
            Opportunities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Contacts Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding your first contact"}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredContacts.map((contact: any) => {
                const contactActivities = activities.filter((a: any) => a.contact_id === contact.id || a.prospect_id === contact.id);
                const LeadIcon = leadSourceIcons[contact.lead_source] || Tag;
                
                return (
                  <Card
                    key={contact.id}
                    className="p-6 hover-elevate transition-all cursor-pointer"
                    onClick={() => handleEditContact(contact)}
                    data-testid={`contact-card-${contact.id}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-4 flex-wrap">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full ${typeColors[contact.contact_type] || 'bg-gray-500'} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                          {contact.contact_name?.[0] || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-bold truncate">
                              {contact.contact_name}
                            </h3>
                            <Badge className={statusColors[contact.status] || "bg-gray-100 text-gray-700"}>
                              {contact.status}
                            </Badge>
                          </div>
                          {contact.company_name && (
                            <p className="text-muted-foreground mb-2 flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {contact.company_name}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {(contact.email || contact.contact_email) && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {contact.email || contact.contact_email}
                              </div>
                            )}
                            {(contact.phone || contact.contact_phone) && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {contact.phone || contact.contact_phone}
                              </div>
                            )}
                            {contact.lead_source && (
                              <div className="flex items-center gap-1">
                                <LeadIcon className="w-4 h-4" />
                                {contact.lead_source}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="font-semibold">
                          {contact.contact_type}
                        </Badge>
                        {contactActivities.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {contactActivities.length} {contactActivities.length === 1 ? 'activity' : 'activities'}
                          </span>
                        )}
                      </div>
                    </div>
                    {contact.services_interested?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {contact.services_interested.slice(0, 3).map((service: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {contact.services_interested.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{contact.services_interested.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions">
          <Tabs defaultValue="consultation" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="consultation">
                <FileText className="w-4 h-4 mr-2" />
                Consultation Requests ({consultationRequests.length})
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Forms ({contactFormSubmissions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consultation">
              {consultationRequests.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Consultation Requests</h3>
                  <p className="text-muted-foreground">Submissions will appear here</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {consultationRequests.map((submission: any) => (
                    <Card key={submission.id} className="p-6 hover-elevate transition-all" data-testid={`consultation-${submission.id}`}>
                      <div className="flex justify-between items-start gap-6 flex-wrap">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between gap-1 flex-wrap">
                            <div>
                              <h3 className="text-xl font-bold">{submission.contact_name}</h3>
                              {submission.company_name && (
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                  <Building2 className="w-4 h-4" />
                                  {submission.company_name}
                                </p>
                              )}
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {submission.status || 'New'}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4 text-blue-600" />
                              {submission.email || submission.contact_email}
                            </div>
                            {(submission.phone || submission.contact_phone) && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4 text-blue-600" />
                                {submission.phone || submission.contact_phone}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4 text-blue-600" />
                              {formatDate(submission.created_date, "long")}
                            </div>
                          </div>

                          {submission.services_interested?.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Services Interested:</p>
                              <div className="flex flex-wrap gap-2">
                                {submission.services_interested.map((service: string, idx: number) => (
                                  <Badge key={idx} variant="outline">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {submission.notes && (
                            <div>
                              <p className="text-sm font-medium mb-1">Project Details:</p>
                              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                {submission.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              onClick={(e) => { e.stopPropagation(); handleGenerateProposal(submission); }}
                              disabled={isGenerating && selectedSubmission?.id === submission.id}
                              data-testid={`button-generate-proposal-${submission.id}`}
                            >
                              {isGenerating && selectedSubmission?.id === submission.id ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                              ) : (
                                <><Sparkles className="w-4 h-4 mr-2" />Generate Proposal</>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); analyzeSubmission(submission); }}
                              disabled={analyzing === submission.id}
                              data-testid={`button-analyze-${submission.id}`}
                            >
                              {analyzing === submission.id ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
                              ) : (
                                <><Sparkles className="w-4 h-4 mr-2" />Analyze</>
                              )}
                            </Button>
                          </div>

                          {analysis[submission.id] && typeof analysis[submission.id] === 'object' && (
                            <div className="space-y-3 border-t pt-3">
                              <div className="grid md:grid-cols-3 gap-3">
                                <Card className="p-3 bg-green-50 dark:bg-green-900/20">
                                  <div className="text-xs text-muted-foreground">Sentiment</div>
                                  <div className="font-semibold">{analysis[submission.id].sentiment?.type || 'N/A'}</div>
                                </Card>
                                <Card className="p-3 bg-red-50 dark:bg-red-900/20">
                                  <div className="text-xs text-muted-foreground">Urgency</div>
                                  <div className="font-semibold">{analysis[submission.id].urgency || 'N/A'}</div>
                                </Card>
                                <Card className="p-3 bg-blue-50 dark:bg-blue-900/20">
                                  <div className="text-xs text-muted-foreground">Services</div>
                                  <div className="text-sm">{analysis[submission.id].recommended_services?.length || 0} recommended</div>
                                </Card>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="contact">
              {contactFormSubmissions.length === 0 ? (
                <Card className="p-12 text-center">
                  <Mail className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Contact Forms</h3>
                  <p className="text-muted-foreground">Submissions will appear here</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {contactFormSubmissions.map((submission: any) => (
                    <Card key={submission.id} className="p-6 hover-elevate transition-all" data-testid={`contact-form-${submission.id}`}>
                      <div className="flex justify-between items-start gap-6 flex-wrap">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between gap-1 flex-wrap">
                            <div>
                              <h3 className="text-xl font-bold">{submission.contact_name}</h3>
                              {submission.company_name && (
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                  <Building2 className="w-4 h-4" />
                                  {submission.company_name}
                                </p>
                              )}
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {submission.status || 'New'}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4 text-blue-600" />
                              {submission.email || submission.contact_email}
                            </div>
                            {(submission.phone || submission.contact_phone) && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4 text-blue-600" />
                                {submission.phone || submission.contact_phone}
                              </div>
                            )}
                          </div>
                          {submission.notes && (
                            <div>
                              <p className="text-sm font-medium mb-1">Details:</p>
                              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{submission.notes}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={(e) => { e.stopPropagation(); handleGenerateProposal(submission); }}
                            disabled={isGenerating && selectedSubmission?.id === submission.id}
                            data-testid={`button-generate-proposal-contact-${submission.id}`}
                          >
                            {isGenerating && selectedSubmission?.id === submission.id ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                            ) : (
                              <><Sparkles className="w-4 h-4 mr-2" />Generate Proposal</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="opportunities">
          <div className="space-y-4">
            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Projects</h3>
                <p className="text-muted-foreground">Projects will appear here for opportunity analysis</p>
              </Card>
            ) : (
              Object.entries(
                projects.reduce((acc: any, proj: any) => {
                  if (!acc[proj.client_email]) {
                    acc[proj.client_email] = { email: proj.client_email, name: proj.client_name, projects: [] };
                  }
                  acc[proj.client_email].projects.push(proj);
                  return acc;
                }, {} as Record<string, any>)
              ).map(([email, client]: [string, any]) => (
                <Card key={email} className="p-6" data-testid={`opportunity-${email}`}>
                  <div className="flex items-start justify-between gap-1 mb-3 flex-wrap">
                    <div>
                      <h3 className="text-lg font-bold">{client.name}</h3>
                      <p className="text-muted-foreground">{email}</p>
                    </div>
                    <Button onClick={() => findOpportunities(email)} disabled={analyzing === email} data-testid={`button-find-opportunities-${email}`}>
                      {analyzing === email ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Analyzing...</>) : (<><Target className="w-4 h-4 mr-2"/>Find Opportunities</>)}
                    </Button>
                  </div>

                  {analysis[email] && typeof analysis[email] === 'object' && (
                    <div className="space-y-3 border-t pt-3">
                      {analysis[email].opportunities?.length > 0 && (
                        <div className="space-y-2">
                          <div className="font-semibold">Identified Opportunities ({analysis[email].opportunities.length})</div>
                          {analysis[email].opportunities.map((opp: any, idx: number) => (
                            <Card key={idx} className="p-3">
                              <div className="flex items-start justify-between gap-1 mb-1 flex-wrap">
                                <div className="font-semibold">{opp.service}</div>
                                <Badge>{opp.priority} priority</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mb-1">{opp.reasoning}</div>
                              {opp.suggested_action && <div className="text-sm font-semibold">Action: {opp.suggested_action}</div>}
                              {opp.estimated_value && <div className="text-sm text-muted-foreground">Est. Value: {opp.estimated_value}</div>}
                            </Card>
                          ))}
                        </div>
                      )}
                      {analysis[email].engagement_strategy && (
                        <Card className="p-3 bg-blue-50 dark:bg-blue-900/20">
                          <div className="font-semibold mb-1">Engagement Strategy</div>
                          <div className="text-sm">{analysis[email].engagement_strategy}</div>
                        </Card>
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {showModal && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => {
            setShowModal(false);
            setSelectedContact(null);
          }}
        />
      )}
    </div>
  );
}