import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatCard } from "@/components/shared/StatCard";
import { TableSkeleton, DetailSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  FolderKanban, ArrowLeft, FileText, MessageSquare, Plus,
  Calendar, DollarSign, MapPin, Users, Clock, CheckCircle2,
  XCircle, AlertCircle, Send, ChevronRight, ArrowUpDown,
  Milestone, GitPullRequestArrow, CircleDot, Target
} from "lucide-react";
import { formatCurrency, formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import {
  useClientProjects,
  useClientMilestones,
  useClientChangeOrders,
  useClientDocuments,
  useClientMessages,
  useUpdateEntity,
  useCreateEntity,
  useSendMessage,
} from "../lib/useClientData";

type SortOption = "name" | "status" | "progress" | "recent";

export default function ClientProjects() {
  const { id } = useParams();

  if (id) {
    return <ProjectDetail projectId={id} />;
  }
  return <ProjectList />;
}

function ProjectList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const { data: projects, isLoading } = useClientProjects();
  const projectIds = useMemo(() => (projects || []).map((p: any) => p.id), [projects]);
  const { data: milestones } = useClientMilestones(projectIds);

  const filteredProjects = useMemo(() => {
    let result = projects || [];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p: any) =>
        p.project_name?.toLowerCase().includes(q) ||
        p.project_number?.toLowerCase().includes(q) ||
        p.project_type?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p: any) => p.status?.toLowerCase().replace(/\s+/g, "") === statusFilter);
    }

    result = [...result].sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return (a.project_name || "").localeCompare(b.project_name || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "progress":
          return (b.progress_percentage || 0) - (a.progress_percentage || 0);
        case "recent":
        default:
          return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
      }
    });

    return result;
  }, [projects, search, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const all = projects || [];
    const active = all.filter((p: any) => ["in progress", "inprogress", "active"].includes(p.status?.toLowerCase().replace(/\s+/g, "") || ""));
    const completed = all.filter((p: any) => p.status?.toLowerCase() === "completed");
    const totalBudget = all.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
    const avgProgress = all.length > 0 ? Math.round(all.reduce((sum: number, p: any) => sum + (p.progress_percentage || 0), 0) / all.length) : 0;
    return { total: all.length, active: active.length, completed: completed.length, totalBudget, avgProgress };
  }, [projects]);

  const getNextMilestone = (projectId: string) => {
    const projMilestones = (milestones || [])
      .filter((m: any) => m.project_id === projectId && m.status !== "Completed" && m.status !== "completed")
      .sort((a: any, b: any) => new Date(a.due_date || 0).getTime() - new Date(b.due_date || 0).getTime());
    return projMilestones[0];
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "planning", label: "Planning" },
    { value: "inprogress", label: "In Progress" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "onhold", label: "On Hold" },
  ];

  if (isLoading) {
    return (
      <div>
        <PageHeader title="My Projects" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Projects"
        subtitle={`${stats.total} project${stats.total !== 1 ? "s" : ""}`}
        actions={
          <Button onClick={() => setShowRequestDialog(true)} data-testid="button-new-project-request">
            <Plus className="h-4 w-4 mr-1" /> New Project Request
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FolderKanban} label="Total Projects" value={stats.total} />
        <StatCard icon={Target} label="Active" value={stats.active} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} />
        <StatCard icon={DollarSign} label="Total Budget" value={formatCurrency(stats.totalBudget)} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
          className="w-full sm:w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-44" data-testid="select-sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={search || statusFilter !== "all" ? "Try adjusting your filters" : "Your projects will appear here once they are set up"}
          action={search || statusFilter !== "all" ? { label: "Clear Filters", onClick: () => { setSearch(""); setStatusFilter("all"); } } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p: any) => {
            const nextMs = getNextMilestone(p.id);
            return (
              <Card
                key={p.id}
                className="cursor-pointer hover-elevate"
                onClick={() => navigate(basePath + "/projects/" + p.id)}
                data-testid={`project-card-${p.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" data-testid={`text-project-name-${p.id}`}>{p.project_name}</p>
                      <p className="text-xs text-muted-foreground">{p.project_number}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>

                  <Progress value={p.progress_percentage || 0} className="h-1.5 mb-3" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{p.progress_percentage || 0}% complete</span>
                    <span>{p.project_type}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {p.budget && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(p.budget)}
                      </span>
                    )}
                    {p.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {p.location}
                      </span>
                    )}
                    {p.estimated_completion && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(p.estimated_completion, "short")}
                      </span>
                    )}
                  </div>

                  {nextMs && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Milestone className="h-3 w-3" />
                        Next: <span className="font-medium text-foreground">{nextMs.milestone_name}</span>
                        {nextMs.due_date && <span>({formatDate(nextMs.due_date, "short")})</span>}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectRequestDialog
        open={showRequestDialog}
        onClose={() => setShowRequestDialog(false)}
      />
    </div>
  );
}

function ProjectDetail({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const { data: projects, isLoading: loadingProjects } = useClientProjects();
  const { data: milestones, isLoading: loadingMilestones } = useClientMilestones([projectId]);
  const { data: changeOrders, isLoading: loadingCOs } = useClientChangeOrders([projectId]);
  const { data: documents, isLoading: loadingDocs } = useClientDocuments([projectId]);
  const { data: messages, isLoading: loadingMsgs } = useClientMessages([projectId]);

  const updateMilestone = useUpdateEntity("project-milestones");
  const updateChangeOrder = useUpdateEntity("change-orders");
  const sendMessage = useSendMessage();

  const [activeTab, setActiveTab] = useState("overview");
  const [milestoneComment, setMilestoneComment] = useState("");
  const [coComment, setCOComment] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [actionMilestoneId, setActionMilestoneId] = useState<string | null>(null);
  const [actionCOId, setActionCOId] = useState<string | null>(null);

  const project = (projects || []).find((p: any) => p.id === projectId);
  const projMilestones = useMemo(() =>
    (milestones || []).sort((a: any, b: any) => new Date(a.due_date || 0).getTime() - new Date(b.due_date || 0).getTime()),
    [milestones]
  );
  const projChangeOrders = changeOrders || [];
  const projDocs = documents || [];
  const projMessages = useMemo(() =>
    (messages || []).filter((m: any) => !m.is_internal).sort((a: any, b: any) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime()),
    [messages]
  );

  const handleMilestoneAction = (milestoneId: string, status: string) => {
    updateMilestone.mutate(
      { id: milestoneId, data: { status, client_comments: milestoneComment, client_approval_date: new Date().toISOString() } },
      {
        onSuccess: () => {
          toast({ title: `Milestone ${status.toLowerCase()}` });
          setMilestoneComment("");
          setActionMilestoneId(null);
        },
        onError: () => toast({ title: "Failed to update milestone", variant: "destructive" }),
      }
    );
  };

  const handleCOAction = (coId: string, status: string) => {
    updateChangeOrder.mutate(
      { id: coId, data: { status, client_comments: coComment, client_approval_date: new Date().toISOString() } },
      {
        onSuccess: () => {
          toast({ title: `Change order ${status.toLowerCase()}` });
          setCOComment("");
          setActionCOId(null);
        },
        onError: () => toast({ title: "Failed to update change order", variant: "destructive" }),
      }
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;
    sendMessage.mutate(
      {
        project_id: projectId,
        sender_email: user.email,
        sender_name: user.full_name || user.email,
        message: newMessage.trim(),
        message_type: "client",
      },
      {
        onSuccess: () => {
          setNewMessage("");
          toast({ title: "Message sent" });
        },
        onError: () => toast({ title: "Failed to send message", variant: "destructive" }),
      }
    );
  };

  if (loadingProjects) return <DetailSkeleton />;

  if (!project) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Project not found"
        description="This project may not be available or has been removed"
        action={{ label: "Back to Projects", onClick: () => navigate(basePath + "/projects") }}
      />
    );
  }

  const teamMembers = Array.isArray(project.assigned_team_members) ? project.assigned_team_members : [];
  const completedMilestones = projMilestones.filter((m: any) => m.status?.toLowerCase() === "completed").length;
  const pendingApprovals = projMilestones.filter((m: any) =>
    m.status?.toLowerCase().replace(/\s+/g, "") === "pendingclientapproval"
  ).length;
  const pendingCOs = projChangeOrders.filter((co: any) =>
    co.status?.toLowerCase().replace(/\s+/g, "") === "pendingclientapproval"
  ).length;

  return (
    <div>
      <PageHeader
        title={project.project_name}
        subtitle={project.project_number}
        breadcrumbs={[
          { label: "Projects", href: basePath + "/projects" },
          { label: project.project_name },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate(basePath + "/projects")} data-testid="button-back-to-projects">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        }
      />

      <Card className="mb-6" data-testid="project-progress-card">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={project.status} size="md" />
              {project.priority && <Badge variant="outline">{project.priority}</Badge>}
              {project.project_type && <Badge variant="secondary">{project.project_type}</Badge>}
            </div>
            <span className="text-sm font-medium">{project.progress_percentage || 0}% complete</span>
          </div>
          <Progress value={project.progress_percentage || 0} className="h-2 mb-4" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {project.start_date && (
              <div>
                <p className="text-muted-foreground text-xs">Start Date</p>
                <p className="font-medium">{formatDate(project.start_date)}</p>
              </div>
            )}
            {project.estimated_completion && (
              <div>
                <p className="text-muted-foreground text-xs">Est. Completion</p>
                <p className="font-medium">{formatDate(project.estimated_completion)}</p>
              </div>
            )}
            {project.budget != null && (
              <div>
                <p className="text-muted-foreground text-xs">Budget</p>
                <p className="font-medium">{formatCurrency(project.budget)}</p>
              </div>
            )}
            {project.location && (
              <div>
                <p className="text-muted-foreground text-xs">Location</p>
                <p className="font-medium">{project.location}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {(pendingApprovals > 0 || pendingCOs > 0) && (
        <Card className="mb-6 border-yellow-300 dark:border-yellow-700" data-testid="pending-actions-banner">
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1 text-sm">
              <span className="font-medium">Action Required: </span>
              {pendingApprovals > 0 && <span>{pendingApprovals} milestone{pendingApprovals > 1 ? "s" : ""} awaiting approval. </span>}
              {pendingCOs > 0 && <span>{pendingCOs} change order{pendingCOs > 1 ? "s" : ""} awaiting approval.</span>}
            </div>
            <div className="flex gap-2">
              {pendingApprovals > 0 && (
                <Button variant="outline" size="sm" onClick={() => setActiveTab("milestones")} data-testid="button-go-milestones">
                  Review Milestones
                </Button>
              )}
              {pendingCOs > 0 && (
                <Button variant="outline" size="sm" onClick={() => setActiveTab("changes")} data-testid="button-go-changes">
                  Review Changes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones" data-testid="tab-milestones">
            Milestones ({projMilestones.length})
          </TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">
            Documents ({projDocs.length})
          </TabsTrigger>
          <TabsTrigger value="changes" data-testid="tab-changes">
            Change Orders ({projChangeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-messages">
            Messages ({projMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          {project.description && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap" data-testid="text-project-description">{project.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Milestone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Milestones</p>
                  <p className="text-lg font-semibold" data-testid="text-milestones-progress">{completedMilestones}/{projMilestones.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Documents</p>
                  <p className="text-lg font-semibold" data-testid="text-documents-count">{projDocs.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Messages</p>
                  <p className="text-lg font-semibold" data-testid="text-messages-count">{projMessages.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {teamMembers.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" /> Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {teamMembers.map((member: any, i: number) => {
                    const name = typeof member === "string" ? member : member.name || member.email || "Team Member";
                    return (
                      <div key={i} className="flex items-center gap-2" data-testid={`team-member-${i}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {projMilestones.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-base">Milestone Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projMilestones.slice(0, 5).map((m: any, idx: number) => {
                    const isCompleted = m.status?.toLowerCase() === "completed";
                    return (
                      <div key={m.id} className="flex items-start gap-3" data-testid={`timeline-milestone-${m.id}`}>
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full flex-shrink-0 mt-1 ${isCompleted ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                          {idx < Math.min(projMilestones.length - 1, 4) && <div className="w-px h-8 bg-muted-foreground/20" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{m.milestone_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(m.due_date, "short")}
                            {m.amount ? ` · ${formatCurrency(m.amount)}` : ""}
                          </p>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-3 mt-4">
          {loadingMilestones ? <TableSkeleton rows={3} /> : projMilestones.length === 0 ? (
            <EmptyState icon={Milestone} title="No milestones" description="Milestones will appear as they are set by the project team" />
          ) : (
            projMilestones.map((m: any) => {
              const isPendingApproval = m.status?.toLowerCase().replace(/\s+/g, "") === "pendingclientapproval";
              const isActionOpen = actionMilestoneId === m.id;
              return (
                <Card key={m.id} data-testid={`milestone-${m.id}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium" data-testid={`text-milestone-name-${m.id}`}>{m.milestone_name}</p>
                        {m.description && <p className="text-sm text-muted-foreground mt-1">{m.description}</p>}
                      </div>
                      <StatusBadge status={m.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      {m.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {formatDate(m.due_date)}
                        </span>
                      )}
                      {m.amount != null && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" /> {formatCurrency(m.amount)}
                        </span>
                      )}
                      {m.completion_percentage != null && (
                        <span>{m.completion_percentage}% complete</span>
                      )}
                    </div>

                    {m.completion_percentage != null && (
                      <Progress value={m.completion_percentage || 0} className="h-1.5 mb-3" />
                    )}

                    {isPendingApproval && (
                      <div className="mt-3 pt-3 border-t">
                        {!isActionOpen ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setActionMilestoneId(m.id)} data-testid={`button-review-milestone-${m.id}`}>
                              Review
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Label>Comments (optional)</Label>
                            <Textarea
                              value={milestoneComment}
                              onChange={(e) => setMilestoneComment(e.target.value)}
                              placeholder="Add any comments..."
                              className="resize-none"
                              data-testid={`input-milestone-comment-${m.id}`}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleMilestoneAction(m.id, "Approved")}
                                disabled={updateMilestone.isPending}
                                data-testid={`button-approve-milestone-${m.id}`}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMilestoneAction(m.id, "Rejected")}
                                disabled={updateMilestone.isPending}
                                data-testid={`button-reject-milestone-${m.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => { setActionMilestoneId(null); setMilestoneComment(""); }}
                                data-testid={`button-cancel-milestone-${m.id}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {m.client_comments && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground">Your comments:</p>
                        <p className="text-sm mt-1">{m.client_comments}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-3 mt-4">
          {loadingDocs ? <TableSkeleton rows={3} /> : projDocs.length === 0 ? (
            <EmptyState icon={FileText} title="No documents" description="Documents will appear when shared by the project team" />
          ) : (
            projDocs.map((d: any) => (
              <Card key={d.id} data-testid={`document-${d.id}`}>
                <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate" data-testid={`text-document-name-${d.id}`}>{d.document_name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {d.document_type && <span>{d.document_type}</span>}
                        <span>{formatDate(d.created_date, "short")}</span>
                        {d.uploaded_by_name && <span>by {d.uploaded_by_name}</span>}
                        {d.version && <span>v{d.version}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={d.status} />
                    {d.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); window.open(d.file_url, "_blank"); }}
                        data-testid={`button-download-doc-${d.id}`}
                      >
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="changes" className="space-y-3 mt-4">
          {loadingCOs ? <TableSkeleton rows={3} /> : projChangeOrders.length === 0 ? (
            <EmptyState icon={GitPullRequestArrow} title="No change orders" description="Change orders will appear here when proposed" />
          ) : (
            projChangeOrders.map((co: any) => {
              const isPendingApproval = co.status?.toLowerCase().replace(/\s+/g, "") === "pendingclientapproval";
              const isActionOpen = actionCOId === co.id;
              return (
                <Card key={co.id} data-testid={`change-order-${co.id}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium" data-testid={`text-co-title-${co.id}`}>{co.title}</p>
                          {co.change_order_number && (
                            <Badge variant="outline">{co.change_order_number}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{co.description}</p>
                      </div>
                      <StatusBadge status={co.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      {co.cost_impact != null && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          Cost Impact: <span className={co.cost_impact > 0 ? "text-red-600 dark:text-red-400 font-medium" : "text-green-600 dark:text-green-400 font-medium"}>
                            {co.cost_impact > 0 ? "+" : ""}{formatCurrency(co.cost_impact)}
                          </span>
                        </span>
                      )}
                      {co.schedule_impact_days != null && co.schedule_impact_days !== 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Schedule: {co.schedule_impact_days > 0 ? "+" : ""}{co.schedule_impact_days} days
                        </span>
                      )}
                      {co.priority && <Badge variant="secondary">{co.priority}</Badge>}
                    </div>

                    {co.reason && (
                      <div className="text-sm bg-muted/50 rounded-md p-3 mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Reason</p>
                        <p>{co.reason}</p>
                      </div>
                    )}

                    {isPendingApproval && (
                      <div className="mt-3 pt-3 border-t">
                        {!isActionOpen ? (
                          <Button size="sm" onClick={() => setActionCOId(co.id)} data-testid={`button-review-co-${co.id}`}>
                            Review
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <Label>Comments (optional)</Label>
                            <Textarea
                              value={coComment}
                              onChange={(e) => setCOComment(e.target.value)}
                              placeholder="Add any comments..."
                              className="resize-none"
                              data-testid={`input-co-comment-${co.id}`}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleCOAction(co.id, "Approved")}
                                disabled={updateChangeOrder.isPending}
                                data-testid={`button-approve-co-${co.id}`}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCOAction(co.id, "Rejected")}
                                disabled={updateChangeOrder.isPending}
                                data-testid={`button-reject-co-${co.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => { setActionCOId(null); setCOComment(""); }}
                                data-testid={`button-cancel-co-${co.id}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {co.client_comments && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground">Your comments:</p>
                        <p className="text-sm mt-1">{co.client_comments}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                {loadingMsgs ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-muted rounded w-1/4" />
                          <div className="h-4 bg-muted rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : projMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No messages yet. Start the conversation below.</p>
                  </div>
                ) : (
                  projMessages.map((m: any) => {
                    const isMe = m.sender_email === user?.email;
                    return (
                      <div key={m.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`} data-testid={`message-${m.id}`}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">{getInitials(m.sender_name || m.sender_email)}</AvatarFallback>
                        </Avatar>
                        <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-medium">{m.sender_name || m.sender_email}</span>
                            <span className="text-xs text-muted-foreground">{formatRelativeTime(m.created_date)}</span>
                          </div>
                          <div className={`rounded-lg p-3 text-sm ${isMe ? "bg-primary/10" : "bg-muted"}`}>
                            {m.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <Separator />

              <div className="p-4 flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="resize-none flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  data-testid="input-new-message"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessage.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectRequestDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const createRequest = useCreateEntity("project-requests");

  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");

  const resetForm = () => {
    setTitle("");
    setProjectType("");
    setDescription("");
    setLocation("");
    setBudgetRange("");
    setTimeline("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !projectType) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    createRequest.mutate(
      {
        client_email: user?.email,
        client_name: user?.full_name || user?.email,
        project_type: projectType,
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        budget_range: budgetRange || undefined,
        timeline: timeline || undefined,
        status: "pending",
      },
      {
        onSuccess: () => {
          toast({ title: "Project request submitted" });
          resetForm();
          onClose();
        },
        onError: () => toast({ title: "Failed to submit request", variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Project Request</DialogTitle>
          <DialogDescription>Submit a request for a new project. Our team will review and follow up.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Project Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Office Renovation Phase 2"
              data-testid="input-request-title"
            />
          </div>

          <div>
            <Label>Project Type *</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger data-testid="select-request-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Renovation">Renovation</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project scope and requirements..."
              className="resize-none"
              data-testid="input-request-description"
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Project location"
              data-testid="input-request-location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Budget Range</Label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger data-testid="select-request-budget">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under $50K">Under $50K</SelectItem>
                  <SelectItem value="$50K - $100K">$50K - $100K</SelectItem>
                  <SelectItem value="$100K - $250K">$100K - $250K</SelectItem>
                  <SelectItem value="$250K - $500K">$250K - $500K</SelectItem>
                  <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                  <SelectItem value="Over $1M">Over $1M</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger data-testid="select-request-timeline">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3 months">1-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                  <SelectItem value="12+ months">12+ months</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-request">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createRequest.isPending} data-testid="button-submit-request">
            {createRequest.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
