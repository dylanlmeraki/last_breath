import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import ClientOnboarding from "../components/ClientOnboarding";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderKanban,
  FileSignature,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  TrendingUp,
  Activity,
  Lightbulb,
  CircleDot,
  Bell,
  Receipt,
} from "lucide-react";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useClientProjects,
  useClientMilestones,
  useClientInvoices,
  useClientDocuments,
  useClientProposals,
  useClientMessages,
  useClientNotifications,
} from "../lib/useClientData";

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";
  const [showOnboarding, setShowOnboarding] = useState(!user?.onboarding_complete && user?.role === "client");

  const { data: projects, isLoading: loadingProjects } = useClientProjects();
  const { data: invoices, isLoading: loadingInvoices } = useClientInvoices();

  const projectIds = useMemo(
    () => (projects || []).map((p: any) => p.id),
    [projects]
  );

  const { data: milestones, isLoading: loadingMilestones } = useClientMilestones(projectIds);
  const { data: proposals, isLoading: loadingProposals } = useClientProposals(projectIds);
  const { data: documents } = useClientDocuments(projectIds);
  const { data: messages } = useClientMessages(projectIds);
  const { data: notifications } = useClientNotifications();

  const activeProjects = useMemo(
    () => (projects || []).filter((p: any) => p.status !== "Completed" && p.status !== "Cancelled"),
    [projects]
  );

  const totalProjectValue = useMemo(
    () => (projects || []).reduce((s: number, p: any) => s + (p.budget || 0), 0),
    [projects]
  );

  const outstandingAmount = useMemo(
    () =>
      (invoices || [])
        .filter((i: any) => i.status === "sent" || i.status === "overdue")
        .reduce((s: number, i: any) => s + (i.total_amount || 0), 0),
    [invoices]
  );

  const paidAmount = useMemo(
    () =>
      (invoices || [])
        .filter((i: any) => i.status === "paid")
        .reduce((s: number, i: any) => s + (i.total_amount || 0), 0),
    [invoices]
  );

  const pendingProposals = useMemo(
    () => (proposals || []).filter((p: any) => p.status === "sent" || p.status === "viewed"),
    [proposals]
  );

  const pendingProposalValue = useMemo(
    () => pendingProposals.reduce((s: number, p: any) => s + (p.amount || 0), 0),
    [pendingProposals]
  );

  const upcomingMilestones = useMemo(() => {
    const now = new Date();
    return (milestones || [])
      .filter(
        (m: any) =>
          m.due_date &&
          new Date(m.due_date) >= now &&
          m.status !== "Completed" &&
          m.status !== "Approved"
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      )
      .slice(0, 5);
  }, [milestones]);

  const pendingDocuments = useMemo(
    () =>
      (documents || []).filter(
        (d: any) =>
          d.status === "Pending Client Approval" || d.status === "pending"
      ),
    [documents]
  );

  const overdueInvoices = useMemo(
    () => (invoices || []).filter((i: any) => i.status === "overdue"),
    [invoices]
  );

  const recentActivity = useMemo(() => {
    const items: { id: string; type: string; title: string; date: string; icon: string }[] = [];

    (messages || []).slice(0, 5).forEach((m: any) => {
      items.push({
        id: `msg-${m.id}`,
        type: "message",
        title: `${m.sender_name || "Someone"} sent a message`,
        date: m.created_date,
        icon: "message",
      });
    });

    (documents || []).slice(0, 5).forEach((d: any) => {
      items.push({
        id: `doc-${d.id}`,
        type: "document",
        title: `Document uploaded: ${d.document_name}`,
        date: d.created_date,
        icon: "document",
      });
    });

    (projects || [])
      .filter((p: any) => p.updated_date !== p.created_date)
      .slice(0, 3)
      .forEach((p: any) => {
        items.push({
          id: `proj-${p.id}`,
          type: "project",
          title: `${p.project_name} status: ${p.status}`,
          date: p.updated_date,
          icon: "project",
        });
      });

    return items
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 8);
  }, [messages, documents, projects]);

  const projectHealth = useMemo(() => {
    if (!activeProjects.length) return 0;
    const onTrack = activeProjects.filter(
      (p: any) =>
        p.status === "In Progress" || p.status === "Planning" || p.status === "Active"
    ).length;
    return Math.round((onTrack / activeProjects.length) * 100);
  }, [activeProjects]);

  const unreadNotifications = (notifications || []).length;

  const isLoading = loadingProjects || loadingInvoices;

  const activityIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "document":
        return <FileText className="h-4 w-4 text-amber-500" />;
      case "project":
        return <FolderKanban className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const serviceRecommendations = useMemo(() => {
    const recs: { title: string; description: string }[] = [];
    if (activeProjects.length > 0 && !pendingDocuments.length) {
      recs.push({
        title: "All documents up to date",
        description: "Your project documentation is current. Keep reviewing new uploads promptly.",
      });
    }
    if (overdueInvoices.length > 0) {
      recs.push({
        title: "Outstanding payments",
        description: `You have ${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? "s" : ""}. Settling them helps keep your projects on track.`,
      });
    }
    if (pendingProposals.length > 0) {
      recs.push({
        title: "Review pending proposals",
        description: `${pendingProposals.length} proposal${pendingProposals.length > 1 ? "s" : ""} awaiting your review. Timely responses help us start sooner.`,
      });
    }
    if (recs.length === 0) {
      recs.push({
        title: "You're all caught up",
        description: "No pending actions at this time. Check back later for updates on your projects.",
      });
    }
    return recs;
  }, [activeProjects, pendingDocuments, overdueInvoices, pendingProposals]);

  return (
    <div>
      <ClientOnboarding open={showOnboarding} onComplete={() => setShowOnboarding(false)} />
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(" ")[0] || ""}`}
        subtitle="Here's an overview of your projects and account"
        actions={
          unreadNotifications > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(basePath + "/messages")}
              data-testid="button-view-notifications"
            >
              <Bell className="h-4 w-4 mr-1" />
              {unreadNotifications} new
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={TrendingUp}
              label="Total Project Value"
              value={formatCurrency(totalProjectValue)}
              data-testid="stat-total-value"
            />
            <StatCard
              icon={DollarSign}
              label="Outstanding Invoices"
              value={formatCurrency(outstandingAmount)}
              data-testid="stat-outstanding"
            />
            <StatCard
              icon={CheckCircle2}
              label="Paid Amount"
              value={formatCurrency(paidAmount)}
              data-testid="stat-paid"
            />
            <StatCard
              icon={FileSignature}
              label="Pending Proposals"
              value={pendingProposals.length}
              data-testid="stat-pending-proposals"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card data-testid="stat-active-projects">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Projects</p>
              <p className="text-lg font-bold" data-testid="text-active-count">
                {loadingProjects ? "..." : activeProjects.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-project-health">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Project Health</p>
              <p className="text-lg font-bold" data-testid="text-health-score">
                {loadingProjects ? "..." : `${projectHealth}%`}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-pending-actions">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Actions</p>
              <p className="text-lg font-bold" data-testid="text-pending-count">
                {pendingProposals.length + pendingDocuments.length + overdueInvoices.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-proposal-value">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Receipt className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Proposal Value</p>
              <p className="text-lg font-bold" data-testid="text-proposal-value">
                {loadingProposals ? "..." : formatCurrency(pendingProposalValue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Active Projects</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(basePath + "/projects")}
              data-testid="link-view-projects"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingProjects ? (
              <SectionSkeleton rows={4} />
            ) : activeProjects.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-6"
                data-testid="text-no-projects"
              >
                No active projects
              </p>
            ) : (
              <div className="space-y-4">
                {activeProjects.slice(0, 5).map((p: any) => {
                  const nextMilestone = (milestones || []).find(
                    (m: any) =>
                      m.project_id === p.id &&
                      m.status !== "Completed" &&
                      m.status !== "Approved"
                  );
                  return (
                    <div
                      key={p.id}
                      className="cursor-pointer hover-elevate rounded-lg p-3 -mx-3"
                      onClick={() => navigate(basePath + "/projects/" + p.id)}
                      data-testid={`project-card-${p.id}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="font-medium text-sm truncate">{p.project_name}</p>
                          {p.project_number && (
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {p.project_number}
                            </span>
                          )}
                        </div>
                        <StatusBadge status={p.status} />
                      </div>
                      <Progress value={p.progress_percentage || 0} className="h-1.5 mb-1" />
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          {p.progress_percentage || 0}% complete
                        </p>
                        {nextMilestone && (
                          <p className="text-xs text-muted-foreground truncate">
                            Next: {nextMilestone.milestone_name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMilestones ? (
              <SectionSkeleton rows={4} />
            ) : upcomingMilestones.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-6"
                data-testid="text-no-milestones"
              >
                No upcoming milestones
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingMilestones.map((m: any) => {
                  const proj = (projects || []).find((p: any) => p.id === m.project_id);
                  const daysUntil = Math.ceil(
                    (new Date(m.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={m.id}
                      className="flex items-start gap-3"
                      data-testid={`milestone-item-${m.id}`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-full bg-primary/10 flex-shrink-0">
                        <CircleDot className="h-3 w-3 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{m.milestone_name}</p>
                        {proj && (
                          <p className="text-xs text-muted-foreground truncate">
                            {proj.project_name}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(m.due_date, "short")}
                          </span>
                          {daysUntil <= 7 && (
                            <Badge variant="secondary" className="text-xs">
                              {daysUntil <= 0 ? "Due today" : `${daysUntil}d`}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(pendingProposals.length > 0 ||
        pendingDocuments.length > 0 ||
        overdueInvoices.length > 0) && (
        <Card className="mb-6 border-amber-200 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">Action Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingProposals.map((p: any) => (
                <div
                  key={`action-prop-${p.id}`}
                  className="flex items-center justify-between gap-2 cursor-pointer hover-elevate rounded-lg p-2 -mx-2"
                  onClick={() => navigate(basePath + "/proposals")}
                  data-testid={`action-proposal-${p.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileSignature className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        Review proposal: {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(p.amount)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}

              {pendingDocuments.map((d: any) => (
                <div
                  key={`action-doc-${d.id}`}
                  className="flex items-center justify-between gap-2 cursor-pointer hover-elevate rounded-lg p-2 -mx-2"
                  onClick={() => navigate(basePath + "/documents")}
                  data-testid={`action-document-${d.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        Approve document: {d.document_name}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}

              {overdueInvoices.map((inv: any) => (
                <div
                  key={`action-inv-${inv.id}`}
                  className="flex items-center justify-between gap-2 cursor-pointer hover-elevate rounded-lg p-2 -mx-2"
                  onClick={() => navigate(basePath + "/invoices")}
                  data-testid={`action-invoice-${inv.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <DollarSign className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        Overdue invoice: {inv.invoice_number || "Invoice"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(inv.total_amount)} &middot; Due{" "}
                        {formatDate(inv.due_date, "short")}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-6"
                data-testid="text-no-activity"
              >
                No recent activity
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3"
                    data-testid={`activity-item-${item.id}`}
                  >
                    <div className="mt-0.5 flex-shrink-0">{activityIcon(item.type)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatRelativeTime(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Pending Proposals</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(basePath + "/proposals")}
              data-testid="link-view-proposals"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingProposals ? (
              <SectionSkeleton rows={3} />
            ) : pendingProposals.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-6"
                data-testid="text-no-proposals"
              >
                No pending proposals
              </p>
            ) : (
              <div className="space-y-3">
                {pendingProposals.slice(0, 5).map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 cursor-pointer hover-elevate rounded-lg p-2 -mx-2"
                    onClick={() => navigate(basePath + "/proposals")}
                    data-testid={`proposal-quick-${p.id}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(p.amount)}
                      </p>
                    </div>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Recent Invoices</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(basePath + "/invoices")}
              data-testid="link-view-invoices"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingInvoices ? (
              <SectionSkeleton rows={4} />
            ) : (invoices || []).length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-6"
                data-testid="text-no-invoices"
              >
                No invoices yet
              </p>
            ) : (
              <div className="space-y-3">
                {(invoices || []).slice(0, 5).map((inv: any) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between gap-2 py-2 border-b last:border-0"
                    data-testid={`invoice-quick-${inv.id}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {inv.invoice_number || "Invoice"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(inv.due_date, "short")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-medium">
                        {formatCurrency(inv.total_amount)}
                      </span>
                      <StatusBadge status={inv.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-muted/50"
                  data-testid={`recommendation-${i}`}
                >
                  <p className="text-sm font-medium mb-0.5">{rec.title}</p>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
