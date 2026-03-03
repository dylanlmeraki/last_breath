import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  FileSignature,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Send,
  Clock,
  DollarSign,
  Calendar,
  AlertTriangle,
  Search,
  FileText,
  MessageSquare,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import {
  useClientProjects,
  useClientProposals,
  useClientProposalMessages,
  useSendProposalMessage,
  useUpdateEntity,
  useClientMilestones,
  useClientChangeOrders,
} from "../lib/useClientData";

type ViewMode = "list" | "detail";
type StatusFilter = "all" | "pending" | "accepted" | "rejected" | "expired";

export default function ClientProposals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailTab, setDetailTab] = useState("overview");
  const [messageText, setMessageText] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [revisionNote, setRevisionNote] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useClientProjects();
  const projectIds = useMemo(() => (projects || []).map((p: any) => p.id), [projects]);
  const { data: proposals, isLoading: proposalsLoading } = useClientProposals(projectIds);
  const { data: discussionMessages } = useClientProposalMessages(selectedProposal?.id || null);
  const { data: milestones } = useClientMilestones(projectIds);
  const { data: changeOrders } = useClientChangeOrders(projectIds);

  const sendMessageMutation = useSendProposalMessage();
  const updateProposalMutation = useUpdateEntity("proposals");
  const updateMilestoneMutation = useUpdateEntity("project-milestones");
  const updateChangeOrderMutation = useUpdateEntity("change-orders");

  const isLoading = projectsLoading || proposalsLoading;

  const statusMap: Record<string, StatusFilter> = {
    sent: "pending",
    viewed: "pending",
    draft: "pending",
    signed: "accepted",
    accepted: "accepted",
    declined: "rejected",
    rejected: "rejected",
    expired: "expired",
  };

  const filteredProposals = useMemo(() => {
    let list = proposals || [];
    if (statusFilter !== "all") {
      list = list.filter((p: any) => statusMap[p.status?.toLowerCase()] === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p: any) =>
          p.title?.toLowerCase().includes(q) ||
          p.proposal_number?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [proposals, statusFilter, searchQuery]);

  const pendingProposals = useMemo(
    () => (proposals || []).filter((p: any) => ["sent", "viewed"].includes(p.status?.toLowerCase())),
    [proposals]
  );

  const pendingMilestones = useMemo(
    () =>
      (milestones || []).filter(
        (m: any) => m.status?.toLowerCase().replace(/\s+/g, "") === "pendingclientapproval"
      ),
    [milestones]
  );

  const pendingChangeOrders = useMemo(
    () =>
      (changeOrders || []).filter(
        (co: any) => co.status?.toLowerCase().replace(/\s+/g, "") === "pendingclientapproval"
      ),
    [changeOrders]
  );

  const statusCounts = useMemo(() => {
    const all = proposals || [];
    return {
      all: all.length,
      pending: all.filter((p: any) => ["sent", "viewed", "draft"].includes(p.status?.toLowerCase())).length,
      accepted: all.filter((p: any) => ["signed", "accepted"].includes(p.status?.toLowerCase())).length,
      rejected: all.filter((p: any) => ["declined", "rejected"].includes(p.status?.toLowerCase())).length,
      expired: all.filter((p: any) => p.status?.toLowerCase() === "expired").length,
    };
  }, [proposals]);

  const getProjectName = (projectId: string) => {
    const proj = (projects || []).find((p: any) => p.id === projectId);
    return proj?.project_name || "Unknown Project";
  };

  const openDetail = (proposal: any) => {
    setSelectedProposal(proposal);
    setViewMode("detail");
    setDetailTab("overview");
    setShowDeclineForm(false);
    setShowRevisionForm(false);
    setDeclineReason("");
    setRevisionNote("");
  };

  const backToList = () => {
    setViewMode("list");
    setSelectedProposal(null);
  };

  const handleAccept = () => {
    updateProposalMutation.mutate(
      { id: selectedProposal.id, data: { status: "signed", signed_date: new Date().toISOString() } },
      {
        onSuccess: () => {
          toast({ title: "Proposal Accepted", description: "You have accepted this proposal." });
          queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
          setSelectedProposal((prev: any) => ({ ...prev, status: "signed" }));
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const handleDecline = () => {
    updateProposalMutation.mutate(
      {
        id: selectedProposal.id,
        data: {
          status: "declined",
          declined_date: new Date().toISOString(),
          declined_reason: declineReason || undefined,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Proposal Declined", description: "You have declined this proposal." });
          queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
          setSelectedProposal((prev: any) => ({ ...prev, status: "declined" }));
          setShowDeclineForm(false);
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const handleRequestRevision = () => {
    sendMessageMutation.mutate(
      {
        proposal_id: selectedProposal.id,
        sender_email: user?.email || "",
        sender_name: user?.full_name || user?.email || "",
        message: `Revision Requested: ${revisionNote}`,
      },
      {
        onSuccess: () => {
          toast({ title: "Revision Requested", description: "Your revision request has been sent." });
          setShowRevisionForm(false);
          setRevisionNote("");
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedProposal) return;
    sendMessageMutation.mutate(
      {
        proposal_id: selectedProposal.id,
        sender_email: user?.email || "",
        sender_name: user?.full_name || user?.email || "",
        message: messageText.trim(),
      },
      {
        onSuccess: () => {
          setMessageText("");
          toast({ title: "Message Sent" });
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const handleApproveMilestone = (milestone: any) => {
    updateMilestoneMutation.mutate(
      {
        id: milestone.id,
        data: { status: "Approved", client_approval_date: new Date().toISOString() },
      },
      {
        onSuccess: () => {
          toast({ title: "Milestone Approved" });
          queryClient.invalidateQueries({ queryKey: ["/api/project-milestones"] });
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const handleApproveChangeOrder = (co: any) => {
    updateChangeOrderMutation.mutate(
      {
        id: co.id,
        data: { status: "Approved", client_approval_date: new Date().toISOString() },
      },
      {
        onSuccess: () => {
          toast({ title: "Change Order Approved" });
          queryClient.invalidateQueries({ queryKey: ["/api/change-orders"] });
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const handleRejectChangeOrder = (co: any) => {
    updateChangeOrderMutation.mutate(
      {
        id: co.id,
        data: { status: "Rejected", client_approval_date: new Date().toISOString() },
      },
      {
        onSuccess: () => {
          toast({ title: "Change Order Rejected" });
          queryClient.invalidateQueries({ queryKey: ["/api/change-orders"] });
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const isActionable = (status: string) =>
    ["sent", "viewed"].includes(status?.toLowerCase());

  if (viewMode === "detail" && selectedProposal) {
    return (
      <div data-testid="proposal-detail-view">
        <div className="mb-4">
          <Button variant="ghost" onClick={backToList} data-testid="button-back-to-proposals">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Proposals
          </Button>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight" data-testid="text-proposal-title">
                {selectedProposal.title}
              </h1>
              <StatusBadge status={selectedProposal.status} size="md" />
            </div>
            {selectedProposal.proposal_number && (
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-proposal-number">
                {selectedProposal.proposal_number}
              </p>
            )}
            {selectedProposal.project_id && (
              <p className="text-sm text-muted-foreground" data-testid="text-proposal-project">
                {getProjectName(selectedProposal.project_id)}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold" data-testid="text-proposal-amount">
              {formatCurrency(selectedProposal.amount)}
            </p>
          </div>
        </div>

        {isActionable(selectedProposal.status) && (
          <Card className="mb-6 border-yellow-200 dark:border-yellow-800" data-testid="banner-action-required">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Action Required</p>
                  <p className="text-sm text-muted-foreground">
                    This proposal is awaiting your response. Please review and accept, decline, or request a revision.
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <Button
                    onClick={handleAccept}
                    disabled={updateProposalMutation.isPending}
                    data-testid="button-accept-proposal"
                  >
                    {updateProposalMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setShowDeclineForm(true); setShowRevisionForm(false); }}
                    disabled={updateProposalMutation.isPending}
                    data-testid="button-decline-proposal"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setShowRevisionForm(true); setShowDeclineForm(false); }}
                    disabled={sendMessageMutation.isPending}
                    data-testid="button-request-revision"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Request Revision
                  </Button>
                </div>
              </div>

              {showDeclineForm && (
                <div className="mt-4 space-y-3">
                  <Separator />
                  <p className="text-sm font-medium">Reason for declining (optional):</p>
                  <Textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Please share your reason..."
                    data-testid="input-decline-reason"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleDecline}
                      disabled={updateProposalMutation.isPending}
                      data-testid="button-confirm-decline"
                    >
                      {updateProposalMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                      Confirm Decline
                    </Button>
                    <Button variant="ghost" onClick={() => setShowDeclineForm(false)} data-testid="button-cancel-decline">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {showRevisionForm && (
                <div className="mt-4 space-y-3">
                  <Separator />
                  <p className="text-sm font-medium">What changes would you like?</p>
                  <Textarea
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="Describe the changes you'd like..."
                    data-testid="input-revision-note"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRequestRevision}
                      disabled={sendMessageMutation.isPending || !revisionNote.trim()}
                      data-testid="button-confirm-revision"
                    >
                      {sendMessageMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                      Send Revision Request
                    </Button>
                    <Button variant="ghost" onClick={() => setShowRevisionForm(false)} data-testid="button-cancel-revision">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs value={detailTab} onValueChange={setDetailTab}>
          <TabsList data-testid="tabs-proposal-detail">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <FileText className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="discussion" data-testid="tab-discussion">
              <MessageSquare className="h-4 w-4 mr-1" />
              Discussion
              {(discussionMessages || []).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {(discussionMessages || []).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contracts" data-testid="tab-contracts">
              <FileSignature className="h-4 w-4 mr-1" />
              Contracts & Approvals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <DollarSign className="h-4 w-4" />
                    Amount
                  </div>
                  <p className="text-xl font-bold" data-testid="text-detail-amount">
                    {formatCurrency(selectedProposal.amount)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Calendar className="h-4 w-4" />
                    Sent Date
                  </div>
                  <p className="text-xl font-bold" data-testid="text-detail-sent-date">
                    {formatDate(selectedProposal.sent_date)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Clock className="h-4 w-4" />
                    Expires
                  </div>
                  <p className="text-xl font-bold" data-testid="text-detail-expiry">
                    {selectedProposal.expiration_date
                      ? formatDate(selectedProposal.expiration_date)
                      : "No expiry"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {selectedProposal.description && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-base">Scope & Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap" data-testid="text-proposal-description">
                    {selectedProposal.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {selectedProposal.content_html && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-base">Proposal Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    data-testid="content-proposal-html"
                    dangerouslySetInnerHTML={{ __html: selectedProposal.content_html }}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base">Timeline Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedProposal.sent_date && (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Sent:</span>{" "}
                        {formatDate(selectedProposal.sent_date, "long")}
                      </span>
                    </div>
                  )}
                  {selectedProposal.viewed_date && (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Viewed:</span>{" "}
                        {formatDate(selectedProposal.viewed_date, "long")}
                      </span>
                    </div>
                  )}
                  {selectedProposal.signed_date && (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Accepted:</span>{" "}
                        {formatDate(selectedProposal.signed_date, "long")}
                      </span>
                    </div>
                  )}
                  {selectedProposal.declined_date && (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Declined:</span>{" "}
                        {formatDate(selectedProposal.declined_date, "long")}
                      </span>
                    </div>
                  )}
                  {selectedProposal.expiration_date && (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Expires:</span>{" "}
                        {formatDate(selectedProposal.expiration_date, "long")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussion" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base">Discussion Thread</CardTitle>
              </CardHeader>
              <CardContent>
                {(discussionMessages || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-messages">
                    No messages yet. Start the conversation below.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                    {(discussionMessages || [])
                      .sort(
                        (a: any, b: any) =>
                          new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
                      )
                      .map((msg: any) => {
                        const isMe = msg.sender_email === user?.email;
                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                            data-testid={`message-${msg.id}`}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {getInitials(msg.sender_name || msg.sender_email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-medium" data-testid="text-message-sender">
                                  {msg.sender_name || msg.sender_email}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(msg.created_date)}
                                </span>
                              </div>
                              <Card>
                                <CardContent className="p-3">
                                  <p className="text-sm whitespace-pre-wrap" data-testid="text-message-content">
                                    {msg.message}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="resize-none flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    data-testid="input-discussion-message"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !messageText.trim()}
                    data-testid="button-send-message"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="mt-4 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base">Milestone Approvals</CardTitle>
                {pendingMilestones.length > 0 && (
                  <Badge variant="secondary">{pendingMilestones.length} pending</Badge>
                )}
              </CardHeader>
              <CardContent>
                {pendingMilestones.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-milestones">
                    No milestones pending approval.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingMilestones.map((m: any) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-3 p-3 border rounded-md flex-wrap"
                        data-testid={`milestone-approval-${m.id}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">{m.milestone_name}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                            <span>{getProjectName(m.project_id)}</span>
                            {m.due_date && <span>Due {formatDate(m.due_date, "short")}</span>}
                            {m.amount != null && <span>{formatCurrency(m.amount)}</span>}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleApproveMilestone(m)}
                          disabled={updateMilestoneMutation.isPending}
                          data-testid={`button-approve-milestone-${m.id}`}
                        >
                          {updateMilestoneMutation.isPending ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          Approve
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base">Change Order Approvals</CardTitle>
                {pendingChangeOrders.length > 0 && (
                  <Badge variant="secondary">{pendingChangeOrders.length} pending</Badge>
                )}
              </CardHeader>
              <CardContent>
                {pendingChangeOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-change-orders">
                    No change orders pending approval.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingChangeOrders.map((co: any) => (
                      <div
                        key={co.id}
                        className="p-3 border rounded-md"
                        data-testid={`change-order-approval-${co.id}`}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm">{co.title}</p>
                            {co.change_order_number && (
                              <p className="text-xs text-muted-foreground">{co.change_order_number}</p>
                            )}
                            <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                              <span>{getProjectName(co.project_id)}</span>
                              {co.cost_impact != null && (
                                <span className={co.cost_impact > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                                  {co.cost_impact > 0 ? "+" : ""}{formatCurrency(co.cost_impact)}
                                </span>
                              )}
                              {co.schedule_impact_days != null && co.schedule_impact_days !== 0 && (
                                <span>
                                  {co.schedule_impact_days > 0 ? "+" : ""}{co.schedule_impact_days} days
                                </span>
                              )}
                            </div>
                            {co.description && (
                              <p className="text-sm text-muted-foreground mt-2">{co.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleApproveChangeOrder(co)}
                              disabled={updateChangeOrderMutation.isPending}
                              data-testid={`button-approve-co-${co.id}`}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectChangeOrder(co)}
                              disabled={updateChangeOrderMutation.isPending}
                              data-testid={`button-reject-co-${co.id}`}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div data-testid="proposals-list-view">
      <PageHeader
        title="Proposals & Contracts"
        subtitle="Review proposals, accept or decline, and manage contracts"
      />

      {pendingProposals.length > 0 && (
        <Card className="mb-6 border-yellow-200 dark:border-yellow-800" data-testid="banner-pending-proposals">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {pendingProposals.length} Proposal{pendingProposals.length > 1 ? "s" : ""} Awaiting Your Response
                </p>
                <p className="text-sm text-muted-foreground">
                  Review and respond to pending proposals to keep your projects moving.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setStatusFilter("pending")}
                data-testid="button-view-pending"
              >
                View Pending
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proposals..."
            className="pl-9"
            data-testid="input-search-proposals"
          />
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)} className="mb-4">
        <TabsList data-testid="tabs-status-filter">
          <TabsTrigger value="all" data-testid="tab-filter-all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-filter-pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="accepted" data-testid="tab-filter-accepted">
            Accepted ({statusCounts.accepted})
          </TabsTrigger>
          <TabsTrigger value="rejected" data-testid="tab-filter-rejected">
            Declined ({statusCounts.rejected})
          </TabsTrigger>
          <TabsTrigger value="expired" data-testid="tab-filter-expired">
            Expired ({statusCounts.expired})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProposals.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title={statusFilter === "all" ? "No proposals" : `No ${statusFilter} proposals`}
          description={
            statusFilter === "all"
              ? "Proposals sent to you will appear here"
              : `You have no ${statusFilter} proposals at this time`
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredProposals.map((p: any) => {
            const actionable = isActionable(p.status);
            return (
              <Card
                key={p.id}
                className="cursor-pointer hover-elevate"
                onClick={() => openDetail(p)}
                data-testid={`proposal-card-${p.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium" data-testid={`text-proposal-title-${p.id}`}>
                          {p.title}
                        </p>
                        {actionable && (
                          <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        {p.proposal_number && <span>{p.proposal_number}</span>}
                        {p.project_id && (
                          <span>{getProjectName(p.project_id)}</span>
                        )}
                        <span>{formatCurrency(p.amount)}</span>
                        {p.sent_date && <span>Sent {formatDate(p.sent_date, "short")}</span>}
                        {p.expiration_date && (
                          <span>Expires {formatDate(p.expiration_date, "short")}</span>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {p.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={p.status} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
