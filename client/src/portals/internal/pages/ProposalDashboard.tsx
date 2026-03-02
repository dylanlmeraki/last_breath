import { useState } from "react";
import { listEntities, updateEntity, filterEntities } from "@/lib/apiClient";
import { callFunction } from "@/lib/functionsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Copy
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatCurrency } from "@/lib/utils";

function ProposalViewModal({ proposal, onClose, onUpdate }: { proposal: any; onClose: () => void; onUpdate: (updates: any) => void }) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{proposal.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge>{proposal.status}</Badge>
            {proposal.proposal_number && <span className="text-sm text-muted-foreground">{proposal.proposal_number}</span>}
            {proposal.amount && <span className="font-semibold">{formatCurrency(proposal.amount)}</span>}
          </div>
          {proposal.sent_date && (
            <p className="text-sm text-muted-foreground">Sent {formatDate(proposal.sent_date)}</p>
          )}
          {proposal.recipient_emails?.length > 0 && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{proposal.recipient_emails.join(', ')}</span>
            </div>
          )}
          {proposal.content_html && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div dangerouslySetInnerHTML={{ __html: proposal.content_html }} className="prose prose-sm max-w-none" />
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

export default function ProposalDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [editingProposal, setEditingProposal] = useState<any>(null);
  const [proposalProjectFilter, setProposalProjectFilter] = useState("all");
  const [shareEmail, setShareEmail] = useState("");
  const [sharingProposalId, setSharingProposalId] = useState<string | null>(null);
  const queryClient = useQueryClient();

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

  const sendProposalMutation = useMutation({
    mutationFn: async ({ id, data, proposal }: { id: string; data: any; proposal: any }) => {
      const updatedProposal = await updateEntity('Proposal', id, { 
        ...data, 
        status: 'sent',
        sent_date: new Date().toISOString()
      });

      if (data.recipient_emails?.length > 0) {
        for (const email of data.recipient_emails) {
          try {
            const prospects = await filterEntities('Prospect', { contact_email: email });
            if (prospects?.length > 0) {
              await updateEntity('Prospect', prospects[0].id, {
                status: "Proposal Sent",
                deal_stage: "Proposal"
              });
            }
          } catch (error) {
            console.error("Error updating prospect status:", error);
          }
        }
      }

      return updatedProposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      setEditingProposal(null);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-proposals-title">Proposals</h1>
          <p className="text-lg text-muted-foreground">Manage, track, and send all client proposals</p>
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
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your filters"
                    : "Start by creating a proposal template"}
                </p>
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
                                {proposal.project_id ? getProjectName(proposal.project_id) : ''} {proposal.proposal_number ? `\u2022 ${proposal.proposal_number}` : ''}
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
                        <div className="flex-1 cursor-pointer" onClick={() => setEditingProposal(proposal)}>
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
                              setSharingProposalId(proposal.id);
                            }}
                            data-testid={`button-share-${proposal.id}`}
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                      {sharingProposalId === proposal.id && (
                        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border" onClick={(e) => e.stopPropagation()}>
                          <p className="text-sm font-medium mb-3">Share Proposal</p>
                          <div className="flex gap-2 mb-2 flex-wrap">
                            <Input
                              type="email"
                              placeholder="recipient@email.com"
                              value={shareEmail}
                              onChange={(e) => setShareEmail(e.target.value)}
                              className="flex-1"
                              data-testid="input-share-email"
                            />
                            <Button
                              size="sm"
                              onClick={async () => {
                                if (!shareEmail) return;
                                try {
                                  await callFunction('shareProposal', { proposalId: proposal.id, recipientEmail: shareEmail });
                                  alert(`Proposal shared with ${shareEmail}`);
                                  setShareEmail("");
                                  setSharingProposalId(null);
                                } catch (error: any) {
                                  alert('Failed to share proposal: ' + error.message);
                                }
                              }}
                              data-testid="button-send-share"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Send
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `${window.location.origin}/internal/proposals?id=${proposal.id}`;
                              navigator.clipboard.writeText(url);
                              alert('Proposal link copied to clipboard!');
                            }}
                            className="w-full"
                            data-testid="button-copy-link"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy Link
                          </Button>
                        </div>
                      )}
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
    </div>
  );
}