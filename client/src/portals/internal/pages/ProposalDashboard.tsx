import { useState, useRef } from "react";
import { listEntities, updateEntity, filterEntities, createEntity } from "@/lib/apiClient";
import { callFunction } from "@/lib/functionsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Search,
  Eye,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  Mail,
  Loader2,
  Sparkles,
  Share2,
  Copy,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  LayoutTemplate
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatCurrency } from "@/lib/utils";

function ProposalViewModal({ proposal, onClose, onUpdate }: { proposal: any; onClose: () => void; onUpdate: (updates: any) => void }) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <DialogTitle data-testid="text-proposal-view-title">{proposal.title}</DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant={previewMode === "desktop" ? "default" : "ghost"}
                onClick={() => setPreviewMode("desktop")}
                data-testid="button-preview-desktop"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant={previewMode === "tablet" ? "default" : "ghost"}
                onClick={() => setPreviewMode("tablet")}
                data-testid="button-preview-tablet"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant={previewMode === "mobile" ? "default" : "ghost"}
                onClick={() => setPreviewMode("mobile")}
                data-testid="button-preview-mobile"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge>{proposal.status}</Badge>
            {proposal.proposal_number && <span className="text-sm text-muted-foreground" data-testid="text-proposal-number">{proposal.proposal_number}</span>}
            {proposal.amount && <span className="font-semibold" data-testid="text-proposal-amount">{formatCurrency(proposal.amount)}</span>}
          </div>
          {proposal.sent_date && (
            <p className="text-sm text-muted-foreground">Sent {formatDate(proposal.sent_date)}</p>
          )}
          {proposal.recipient_emails?.length > 0 && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm" data-testid="text-proposal-recipients">{proposal.recipient_emails.join(', ')}</span>
            </div>
          )}
          {proposal.content_html ? (
            <div className="border rounded-lg bg-white dark:bg-gray-950 flex justify-center p-4">
              <iframe
                ref={iframeRef}
                srcDoc={proposal.content_html}
                className="border-0 rounded-md transition-all duration-300"
                style={{
                  width: previewWidths[previewMode],
                  maxWidth: "100%",
                  minHeight: "400px",
                  height: "60vh"
                }}
                title="Proposal Preview"
                sandbox="allow-same-origin"
                data-testid="iframe-proposal-preview"
              />
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/30">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No content to preview</p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {proposal.status === 'draft' && (
              <Button onClick={() => onUpdate({ status: 'sent', sent_date: new Date().toISOString() })} data-testid="button-mark-sent">
                <Send className="w-4 h-4 mr-2" />Mark as Sent
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareProposalModal({ proposal, onClose }: { proposal: any; onClose: () => void }) {
  const [shareEmail, setShareEmail] = useState("");
  const [shareMessage, setShareMessage] = useState(`Hi,\n\nPlease find attached our proposal: "${proposal.title}".\n\nWe look forward to your review.\n\nBest regards`);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!shareEmail) return;
    setSending(true);
    try {
      await callFunction('shareProposal', { proposalId: proposal.id, recipientEmail: shareEmail, message: shareMessage });
      toast({ title: "Proposal shared", description: `Sent to ${shareEmail}` });
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed to share", description: error.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Proposal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Proposal</Label>
            <div className="p-3 rounded-md bg-muted/50 text-sm">
              <p className="font-medium">{proposal.title}</p>
              {proposal.amount && <p className="text-muted-foreground">{formatCurrency(proposal.amount)}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Recipient Email</Label>
            <Input
              type="email"
              placeholder="client@company.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              data-testid="input-share-recipient"
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              rows={5}
              data-testid="input-share-message"
            />
          </div>
          <div className="border rounded-md p-4 bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">Email Preview</p>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">To:</span> {shareEmail || "—"}</p>
              <p><span className="text-muted-foreground">Subject:</span> Proposal: {proposal.title}</p>
              <div className="border-t mt-2 pt-2 whitespace-pre-wrap text-muted-foreground">{shareMessage}</div>
            </div>
          </div>
          <div className="flex gap-2 justify-end flex-wrap">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel-share">Cancel</Button>
            <Button
              onClick={() => {
                const url = `${window.location.origin}/internal/proposals?id=${proposal.id}`;
                navigator.clipboard.writeText(url);
                toast({ title: "Link copied" });
              }}
              variant="outline"
              data-testid="button-copy-link"
            >
              <Copy className="w-4 h-4 mr-2" />Copy Link
            </Button>
            <Button onClick={handleSend} disabled={sending || !shareEmail} data-testid="button-send-share">
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateFromTemplateModal({ onClose, projects, onCreated }: { onClose: () => void; projects: any[]; onCreated: () => void }) {
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['proposal-templates'],
    queryFn: () => listEntities('EmailTemplate', '-created_date', 100),
  });

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setTitle(template.name || "");
  };

  const handleCreate = async () => {
    if (!title) return;
    setCreating(true);
    try {
      const contentHtml = selectedTemplate?.html_body || selectedTemplate?.body || "";
      await createEntity('Proposal', {
        title,
        project_id: projectId || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        recipient_emails: recipientEmail ? [recipientEmail] : [],
        content_html: contentHtml,
        status: 'draft',
        created_date: new Date().toISOString(),
      });
      toast({ title: "Proposal created from template" });
      onCreated();
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Proposal from Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!selectedTemplate ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">Select a template to start</p>
              {templatesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <LayoutTemplate className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No templates available</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-[50vh] overflow-y-auto">
                  {templates.map((t: any) => (
                    <Card
                      key={t.id}
                      className="p-4 cursor-pointer hover-elevate"
                      onClick={() => handleSelectTemplate(t)}
                      data-testid={`template-option-${t.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <LayoutTemplate className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{t.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{t.subject || t.category || "General"}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Template: <strong>{selectedTemplate.name}</strong></span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)} className="ml-auto" data-testid="button-change-template">Change</Button>
              </div>
              <div className="space-y-2">
                <Label>Proposal Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter proposal title" data-testid="input-proposal-title" />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger data-testid="select-proposal-project">
                    <SelectValue placeholder="Select project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" data-testid="input-proposal-amount" />
                </div>
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="client@email.com" data-testid="input-proposal-recipient" />
                </div>
              </div>
              <div className="flex gap-2 justify-end flex-wrap">
                <Button variant="outline" onClick={onClose} data-testid="button-cancel-create">Cancel</Button>
                <Button onClick={handleCreate} disabled={creating || !title} data-testid="button-create-proposal">
                  {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Proposal
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProposalDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [sharingProposal, setSharingProposal] = useState<any>(null);
  const [showCreateFromTemplate, setShowCreateFromTemplate] = useState(false);
  const [proposalProjectFilter, setProposalProjectFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => listEntities('Proposal', '-created_date', 100),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listEntities('Project', '-created_date', 100),
  });

  const updateProposalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateEntity('Proposal', id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    }
  });

  const filteredProposals = proposals.filter((p: any) => {
    const matchesSearch = !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.proposal_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: proposals.length,
    draft: proposals.filter((p: any) => p.status === "draft").length,
    sent: proposals.filter((p: any) => p.status === "sent" || p.status === "viewed").length,
    signed: proposals.filter((p: any) => p.status === "signed").length,
    totalValue: proposals.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    viewed: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    signed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    declined: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    expired: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
  };

  const statusIcons: Record<string, any> = {
    draft: Clock,
    sent: Send,
    viewed: Eye,
    signed: CheckCircle,
    declined: XCircle,
    expired: Clock
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p: any) => p.id === projectId);
    return project?.project_name || "Unknown Project";
  };

  return (
    <div className="py-6 lg:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-proposals-title">Proposals</h1>
            <p className="text-lg text-muted-foreground">Manage, track, and send all client proposals</p>
          </div>
          <Button onClick={() => setShowCreateFromTemplate(true)} data-testid="button-create-from-template">
            <LayoutTemplate className="w-4 h-4 mr-2" />
            Create from Template
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white" data-testid="stat-total-proposals">
            <div className="flex items-center justify-between gap-1 mb-3">
              <FileText className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.total}</span>
            </div>
            <p className="text-sm opacity-90">Total Proposals</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
            <div className="flex items-center justify-between gap-1 mb-3">
              <Send className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.sent}</span>
            </div>
            <p className="text-sm opacity-90">Sent & Active</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <div className="flex items-center justify-between gap-1 mb-3">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.signed}</span>
            </div>
            <p className="text-sm opacity-90">Signed</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <div className="flex items-center justify-between gap-1 mb-3">
              <DollarSign className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">${(stats.totalValue / 1000).toFixed(0)}K</span>
            </div>
            <p className="text-sm opacity-90">Total Value</p>
          </Card>
        </div>

        <Tabs defaultValue="proposals" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="proposals" data-testid="tab-all-proposals">All Proposals</TabsTrigger>
            <TabsTrigger value="ai-generated" data-testid="tab-ai-generated">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals">
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search proposals..."
                    className="pl-10"
                    data-testid="input-search-proposals"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["all", "sent", "viewed", "signed", "draft"].map((s) => (
                    <Button
                      key={s}
                      variant={statusFilter === s ? "default" : "outline"}
                      onClick={() => setStatusFilter(s)}
                      data-testid={`filter-${s}`}
                    >
                      {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                      {s === "draft" ? "s" : ""}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              </div>
            ) : filteredProposals.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Proposals Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start by creating a proposal from a template"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button onClick={() => setShowCreateFromTemplate(true)} data-testid="button-empty-create">
                    <LayoutTemplate className="w-4 h-4 mr-2" />
                    Create from Template
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProposals.map((proposal: any) => {
                  const StatusIcon = statusIcons[proposal.status] || FileText;
                  return (
                    <Card key={proposal.id} className="p-6 hover-elevate transition-all" data-testid={`proposal-card-${proposal.id}`}>
                      <div className="flex items-start justify-between gap-1 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{proposal.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {proposal.project_id ? getProjectName(proposal.project_id) : ''} {proposal.proposal_number ? `• ${proposal.proposal_number}` : ''}
                              </p>
                            </div>
                            <Badge className={statusColors[proposal.status] || statusColors.draft}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {proposal.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            {proposal.amount && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">
                                  ${proposal.amount.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {proposal.sent_date && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Sent {formatDate(proposal.sent_date, "short")}</span>
                              </div>
                            )}
                            {proposal.signed_date && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Signed {formatDate(proposal.signed_date, "short")}</span>
                              </div>
                            )}
                            {proposal.recipient_emails?.length > 0 && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{proposal.recipient_emails[0]}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSharingProposal(proposal)}
                            data-testid={`button-share-proposal-${proposal.id}`}
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProposal(proposal)}
                            data-testid={`button-view-proposal-${proposal.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-generated">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-1 mb-6 flex-wrap">
                <h3 className="text-2xl font-bold">AI-Generated Proposals</h3>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">Filter by Project</Label>
                <Select value={proposalProjectFilter} onValueChange={setProposalProjectFilter}>
                  <SelectTrigger data-testid="select-project-filter">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project: any) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.project_name} - {project.client_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {proposals.filter((p: any) => proposalProjectFilter === "all" || p.project_id === proposalProjectFilter).length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No proposals generated yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Visit Contacts to generate AI proposals from form submissions</p>
                  </div>
                ) : (
                  proposals.filter((p: any) => proposalProjectFilter === "all" || p.project_id === proposalProjectFilter).map((proposal: any) => (
                    <div
                      key={proposal.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      data-testid={`ai-proposal-${proposal.id}`}
                    >
                      <div className="flex items-start justify-between gap-1 flex-wrap">
                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedProposal(proposal)}>
                          <h4 className="font-semibold mb-1">{proposal.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {proposal.recipient_emails?.join(', ') || 'No recipients'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <span>{formatDate(proposal.created_date)}</span>
                            {proposal.sent_date && (
                              <span>Sent {formatDate(proposal.sent_date, "short")}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={statusColors[proposal.status] || statusColors.draft}>
                            {proposal.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSharingProposal(proposal);
                            }}
                            data-testid={`button-share-${proposal.id}`}
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedProposal && (
        <ProposalViewModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onUpdate={(updates) => {
            updateProposalMutation.mutate({ id: selectedProposal.id, updates });
            setSelectedProposal(null);
          }}
        />
      )}

      {sharingProposal && (
        <ShareProposalModal
          proposal={sharingProposal}
          onClose={() => setSharingProposal(null)}
        />
      )}

      {showCreateFromTemplate && (
        <CreateFromTemplateModal
          onClose={() => setShowCreateFromTemplate(false)}
          projects={projects}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ['proposals'] })}
        />
      )}
    </div>
  );
}