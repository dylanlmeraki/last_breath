import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useClientProjects,
  useClientMilestones,
  useClientDocuments,
  useClientMessages,
  useClientInvoices,
  useClientProposals,
} from "../lib/useClientData";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  FileText,
  MessageSquare,
  DollarSign,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  Target,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const DATE_RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "180", label: "Last 6 months" },
  { value: "365", label: "Last year" },
  { value: "all", label: "All time" },
];

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function filterByDateRange(items: any[], dateField: string, days: string) {
  if (days === "all") return items;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(days));
  return items.filter((item) => {
    const d = new Date(item[dateField]);
    return d >= cutoff;
  });
}

function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h];
        if (val == null) return "";
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str}"`
          : str;
      }).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ClientReports() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("90");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: projects = [], isLoading: loadingProjects } = useClientProjects();
  const projectIds = useMemo(() => projects.map((p: any) => p.id), [projects]);
  const { data: milestones = [], isLoading: loadingMilestones } = useClientMilestones(projectIds);
  const { data: documents = [], isLoading: loadingDocuments } = useClientDocuments(projectIds);
  const { data: messages = [], isLoading: loadingMessages } = useClientMessages(projectIds);
  const { data: invoices = [], isLoading: loadingInvoices } = useClientInvoices();
  const { data: proposals = [], isLoading: loadingProposals } = useClientProposals(projectIds);

  const isLoading = loadingProjects || loadingMilestones || loadingDocuments || loadingMessages || loadingInvoices || loadingProposals;

  const filteredProjects = useMemo(() => filterByDateRange(projects, "created_date", dateRange), [projects, dateRange]);
  const filteredDocuments = useMemo(() => filterByDateRange(documents, "created_date", dateRange), [documents, dateRange]);
  const filteredMessages = useMemo(() => filterByDateRange(messages, "created_date", dateRange), [messages, dateRange]);
  const filteredInvoices = useMemo(() => filterByDateRange(invoices, "created_date", dateRange), [invoices, dateRange]);
  const filteredMilestones = useMemo(() => filterByDateRange(milestones, "created_date", dateRange), [milestones, dateRange]);

  const projectAnalytics = useMemo(() => {
    const totalBudget = projects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
    const avgProgress = projects.length > 0
      ? projects.reduce((sum: number, p: any) => sum + (p.progress_percentage || 0), 0) / projects.length
      : 0;

    const onTime = projects.filter((p: any) => {
      if (!p.estimated_completion) return true;
      const est = new Date(p.estimated_completion);
      if (p.actual_completion) {
        return new Date(p.actual_completion) <= est;
      }
      return new Date() <= est;
    }).length;
    const timelineAdherence = projects.length > 0 ? Math.round((onTime / projects.length) * 100) : 100;

    const completedMilestones = milestones.filter((m: any) =>
      m.status?.toLowerCase() === "completed" || m.status?.toLowerCase() === "approved"
    ).length;
    const milestoneRate = milestones.length > 0
      ? Math.round((completedMilestones / milestones.length) * 100)
      : 0;

    const statusCounts: Record<string, number> = {};
    projects.forEach((p: any) => {
      const s = p.status || "Unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const progressData = projects.map((p: any) => ({
      name: p.project_name?.length > 20 ? p.project_name.slice(0, 20) + "..." : p.project_name,
      progress: Math.round(p.progress_percentage || 0),
      budget: p.budget || 0,
    }));

    return { totalBudget, avgProgress, timelineAdherence, milestoneRate, statusData, progressData, completedMilestones };
  }, [projects, milestones]);

  const documentAnalytics = useMemo(() => {
    const totalDocs = filteredDocuments.length;
    const approved = filteredDocuments.filter((d: any) => d.status?.toLowerCase() === "approved").length;
    const pending = filteredDocuments.filter((d: any) =>
      d.status?.toLowerCase() === "pending" || d.status?.toLowerCase() === "pending client approval"
    ).length;
    const draft = filteredDocuments.filter((d: any) => d.status?.toLowerCase() === "draft").length;

    const typeCounts: Record<string, number> = {};
    filteredDocuments.forEach((d: any) => {
      const t = d.document_type || "Other";
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

    const monthlyUploads: Record<string, number> = {};
    filteredDocuments.forEach((d: any) => {
      const date = new Date(d.created_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyUploads[key] = (monthlyUploads[key] || 0) + 1;
    });
    const uploadTrend = Object.entries(monthlyUploads)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    return { totalDocs, approved, pending, draft, typeData, uploadTrend };
  }, [filteredDocuments]);

  const commAnalytics = useMemo(() => {
    const totalMessages = filteredMessages.length;
    const sentByClient = filteredMessages.filter((m: any) => m.sender_email === user?.email).length;
    const received = totalMessages - sentByClient;

    const monthlyVolume: Record<string, { sent: number; received: number }> = {};
    filteredMessages.forEach((m: any) => {
      const date = new Date(m.created_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyVolume[key]) monthlyVolume[key] = { sent: 0, received: 0 };
      if (m.sender_email === user?.email) {
        monthlyVolume[key].sent += 1;
      } else {
        monthlyVolume[key].received += 1;
      }
    });
    const volumeTrend = Object.entries(monthlyVolume)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    const projectMessageCounts: Record<string, { name: string; count: number }> = {};
    filteredMessages.forEach((m: any) => {
      const proj = projects.find((p: any) => p.id === m.project_id);
      const name = proj?.project_name || "Unknown";
      if (!projectMessageCounts[m.project_id]) {
        projectMessageCounts[m.project_id] = { name, count: 0 };
      }
      projectMessageCounts[m.project_id].count += 1;
    });
    const messagesByProject = Object.values(projectMessageCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { totalMessages, sentByClient, received, volumeTrend, messagesByProject };
  }, [filteredMessages, user?.email, projects]);

  const financialAnalytics = useMemo(() => {
    const totalInvoiced = filteredInvoices.reduce((sum: number, i: any) => sum + (i.total_amount || 0), 0);
    const paidAmount = filteredInvoices
      .filter((i: any) => i.status?.toLowerCase() === "paid")
      .reduce((sum: number, i: any) => sum + (i.total_amount || 0), 0);
    const outstanding = filteredInvoices
      .filter((i: any) => i.status?.toLowerCase() !== "paid" && i.status?.toLowerCase() !== "draft")
      .reduce((sum: number, i: any) => sum + (i.total_amount || 0), 0);
    const overdue = filteredInvoices
      .filter((i: any) => i.status?.toLowerCase() === "overdue")
      .reduce((sum: number, i: any) => sum + (i.total_amount || 0), 0);

    const monthlyPayments: Record<string, { invoiced: number; paid: number }> = {};
    filteredInvoices.forEach((inv: any) => {
      const date = new Date(inv.created_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyPayments[key]) monthlyPayments[key] = { invoiced: 0, paid: 0 };
      monthlyPayments[key].invoiced += inv.total_amount || 0;
      if (inv.status?.toLowerCase() === "paid") {
        monthlyPayments[key].paid += inv.total_amount || 0;
      }
    });
    const paymentTrend = Object.entries(monthlyPayments)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    const proposalAccepted = proposals.filter((p: any) => p.status?.toLowerCase() === "signed" || p.status?.toLowerCase() === "accepted").length;
    const proposalTotal = proposals.length;
    const acceptanceRate = proposalTotal > 0 ? Math.round((proposalAccepted / proposalTotal) * 100) : 0;

    return { totalInvoiced, paidAmount, outstanding, overdue, paymentTrend, acceptanceRate, proposalAccepted, proposalTotal };
  }, [filteredInvoices, proposals]);

  const handleExport = () => {
    if (activeTab === "overview" || activeTab === "projects") {
      exportToCSV(
        projects.map((p: any) => ({
          Name: p.project_name,
          Number: p.project_number || "",
          Status: p.status,
          Progress: `${Math.round(p.progress_percentage || 0)}%`,
          Budget: p.budget || 0,
          Start: formatDate(p.start_date),
          "Est. Completion": formatDate(p.estimated_completion),
        })),
        "project-report"
      );
    } else if (activeTab === "documents") {
      exportToCSV(
        filteredDocuments.map((d: any) => ({
          Name: d.document_name,
          Type: d.document_type || "",
          Status: d.status,
          "Uploaded By": d.uploaded_by_name || d.uploaded_by || "",
          Date: formatDate(d.created_date),
        })),
        "document-report"
      );
    } else if (activeTab === "communications") {
      exportToCSV(
        filteredMessages.map((m: any) => ({
          Sender: m.sender_name || m.sender_email,
          Message: m.message?.slice(0, 200) || "",
          Date: formatDate(m.created_date),
          Project: projects.find((p: any) => p.id === m.project_id)?.project_name || "",
        })),
        "communications-report"
      );
    } else if (activeTab === "financial") {
      exportToCSV(
        filteredInvoices.map((i: any) => ({
          Number: i.invoice_number || "",
          Amount: i.total_amount || 0,
          Status: i.status,
          "Issue Date": formatDate(i.issue_date),
          "Due Date": formatDate(i.due_date),
          "Paid Date": formatDate(i.paid_date),
        })),
        "financial-report"
      );
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="p-6 space-y-6" data-testid="client-reports-page">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Track project performance, document activity, and financial metrics"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px]" data-testid="select-date-range">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value} data-testid={`date-range-${r.value}`}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport} data-testid="button-export-csv">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-reports">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <BarChart3 className="h-4 w-4 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" data-testid="tab-projects">
            <Target className="h-4 w-4 mr-1.5" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">
            <FileText className="h-4 w-4 mr-1.5" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="communications" data-testid="tab-communications">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Communications
          </TabsTrigger>
          <TabsTrigger value="financial" data-testid="tab-financial">
            <DollarSign className="h-4 w-4 mr-1.5" />
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Target}
              label="Active Projects"
              value={projects.filter((p: any) => p.status !== "Completed" && p.status !== "Cancelled").length}
            />
            <StatCard
              icon={TrendingUp}
              label="Timeline Adherence"
              value={`${projectAnalytics.timelineAdherence}%`}
            />
            <StatCard
              icon={CheckCircle2}
              label="Milestone Completion"
              value={`${projectAnalytics.milestoneRate}%`}
            />
            <StatCard
              icon={DollarSign}
              label="Total Budget"
              value={formatCurrency(projectAnalytics.totalBudget)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Project Status Distribution</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {projectAnalytics.statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={projectAnalytics.statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name} (${value})`}
                      >
                        {projectAnalytics.statusData.map((_: any, idx: number) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground" data-testid="text-no-project-data">
                    No project data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Project Progress</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {projectAnalytics.progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={projectAnalytics.progressData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [`${value}%`, "Progress"]} />
                      <Bar dataKey="progress" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground" data-testid="text-no-progress-data">
                    No project data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Documents" value={filteredDocuments.length} />
            <StatCard icon={MessageSquare} label="Messages" value={filteredMessages.length} />
            <StatCard icon={DollarSign} label="Paid" value={formatCurrency(financialAnalytics.paidAmount)} />
            <StatCard icon={Clock} label="Outstanding" value={formatCurrency(financialAnalytics.outstanding)} />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Target} label="Total Projects" value={projects.length} />
            <StatCard
              icon={TrendingUp}
              label="Avg. Progress"
              value={`${Math.round(projectAnalytics.avgProgress)}%`}
            />
            <StatCard
              icon={CheckCircle2}
              label="Milestones Completed"
              value={`${projectAnalytics.completedMilestones}/${milestones.length}`}
            />
            <StatCard
              icon={Activity}
              label="Timeline Adherence"
              value={`${projectAnalytics.timelineAdherence}%`}
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Budget by Project</CardTitle>
            </CardHeader>
            <CardContent>
              {projectAnalytics.progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectAnalytics.progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), "Budget"]} />
                    <Bar dataKey="budget" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No budget data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Milestone Status by Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="milestone-status-list">
                {projects.map((p: any) => {
                  const projMilestones = milestones.filter((m: any) => m.project_id === p.id);
                  const completed = projMilestones.filter((m: any) =>
                    m.status?.toLowerCase() === "completed" || m.status?.toLowerCase() === "approved"
                  ).length;
                  const total = projMilestones.length;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div key={p.id} className="flex items-center gap-4" data-testid={`milestone-row-${p.id}`}>
                      <span className="text-sm font-medium w-40 truncate">{p.project_name}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-visible">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-20 text-right">
                        {completed}/{total}
                      </span>
                      <Badge variant="secondary" className="text-xs">{pct}%</Badge>
                    </div>
                  );
                })}
                {projects.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">No projects to display</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Total Documents" value={documentAnalytics.totalDocs} />
            <StatCard icon={CheckCircle2} label="Approved" value={documentAnalytics.approved} />
            <StatCard icon={Clock} label="Pending" value={documentAnalytics.pending} />
            <StatCard icon={FileText} label="Draft" value={documentAnalytics.draft} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Documents by Type</CardTitle>
              </CardHeader>
              <CardContent>
                {documentAnalytics.typeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={documentAnalytics.typeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name} (${value})`}
                      >
                        {documentAnalytics.typeData.map((_: any, idx: number) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground">
                    No document data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Upload Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {documentAnalytics.uploadTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={documentAnalytics.uploadTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Uploads"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground">
                    No upload data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={MessageSquare} label="Total Messages" value={commAnalytics.totalMessages} />
            <StatCard icon={TrendingUp} label="Sent by You" value={commAnalytics.sentByClient} />
            <StatCard icon={Activity} label="Received" value={commAnalytics.received} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Message Volume Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {commAnalytics.volumeTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={commAnalytics.volumeTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sent" name="Sent" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="received" name="Received" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                    No message data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Messages by Project</CardTitle>
              </CardHeader>
              <CardContent>
                {commAnalytics.messagesByProject.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={commAnalytics.messagesByProject} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" name="Messages" fill={CHART_COLORS[3]} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                    No message data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Total Invoiced" value={formatCurrency(financialAnalytics.totalInvoiced)} />
            <StatCard icon={CheckCircle2} label="Paid" value={formatCurrency(financialAnalytics.paidAmount)} />
            <StatCard icon={Clock} label="Outstanding" value={formatCurrency(financialAnalytics.outstanding)} />
            <StatCard
              icon={TrendingUp}
              label="Proposal Acceptance"
              value={`${financialAnalytics.acceptanceRate}%`}
            />
          </div>

          {financialAnalytics.overdue > 0 && (
            <Card className="border-destructive/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Clock className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium" data-testid="text-overdue-alert">Overdue Balance: {formatCurrency(financialAnalytics.overdue)}</p>
                  <p className="text-sm text-muted-foreground">You have overdue invoices that require attention</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Invoiced vs Paid Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {financialAnalytics.paymentTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={financialAnalytics.paymentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value)]} />
                    <Legend />
                    <Bar dataKey="invoiced" name="Invoiced" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="paid" name="Paid" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No financial data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Proposal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-testid="proposal-summary">
                <div className="text-center p-4">
                  <p className="text-3xl font-bold" data-testid="text-total-proposals">{financialAnalytics.proposalTotal}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Proposals</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-3xl font-bold" data-testid="text-accepted-proposals">{financialAnalytics.proposalAccepted}</p>
                  <p className="text-sm text-muted-foreground mt-1">Accepted</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-3xl font-bold" data-testid="text-acceptance-rate">{financialAnalytics.acceptanceRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Acceptance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
