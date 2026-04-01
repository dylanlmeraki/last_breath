import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useClientProjects, useClientRfis } from "../lib/useClientData";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchInput } from "@/components/shared/SearchInput";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  HelpCircle, Plus, Loader2, Search, ChevronLeft,
  Paperclip, Calendar, AlertCircle, CheckCircle2, Clock, MessageSquare
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default function ClientRFIs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRfi, setSelectedRfi] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [priority, setPriority] = useState("medium");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const { data: projects, isLoading: projectsLoading } = useClientProjects();
  const projectIds = useMemo(() => (projects || []).map((p: any) => p.id), [projects]);
  const { data: rfis, isLoading: rfisLoading } = useClientRfis(projectIds);

  const isLoading = projectsLoading || rfisLoading;

  const filteredRfis = useMemo(() => {
    let result = rfis || [];
    if (statusFilter !== "all") {
      result = result.filter((r: any) => r.status === statusFilter);
    }
    if (projectFilter !== "all") {
      result = result.filter((r: any) => r.project_id === projectFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r: any) =>
        r.subject?.toLowerCase().includes(q) ||
        r.question?.toLowerCase().includes(q) ||
        r.rfi_number?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rfis, statusFilter, projectFilter, search]);

  const statusCounts = useMemo(() => {
    const all = rfis || [];
    return {
      total: all.length,
      open: all.filter((r: any) => r.status === "open").length,
      answered: all.filter((r: any) => r.status === "answered").length,
      closed: all.filter((r: any) => r.status === "closed").length,
    };
  }, [rfis]);

  const getProjectName = (projectId: string) => {
    const project = (projects || []).find((p: any) => p.id === projectId);
    return project?.project_name || "Unknown Project";
  };

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await apiRequest("POST", "/api/rfis", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rfis"] });
      setCreateOpen(false);
      setSubject("");
      setQuestion("");
      setPriority("medium");
      setSelectedProjectId("");
      toast({ title: "RFI submitted", description: "Your RFI has been submitted successfully." });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const handleSubmit = () => {
    if (!subject.trim() || !question.trim() || !selectedProjectId) return;
    createMutation.mutate({
      subject,
      question,
      priority,
      project_id: selectedProjectId,
      asked_by: user?.email,
      asked_by_name: user?.full_name || user?.email,
      status: "open",
      created_by: user?.email,
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertCircle className="h-3.5 w-3.5 text-red-500" />;
      case "high": return <AlertCircle className="h-3.5 w-3.5 text-orange-500" />;
      default: return null;
    }
  };

  if (selectedRfi) {
    return (
      <RFIDetail
        rfi={selectedRfi}
        projectName={getProjectName(selectedRfi.project_id)}
        onBack={() => setSelectedRfi(null)}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="RFIs"
        subtitle="Request for Information — ask questions and get answers from the engineering team"
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-rfi">
                <Plus className="h-4 w-4 mr-1" /> New RFI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit New RFI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="rfi-project">Project</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger data-testid="select-rfi-project">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {(projects || []).map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rfi-subject">Subject</Label>
                  <Input
                    id="rfi-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief subject line"
                    data-testid="input-rfi-subject"
                  />
                </div>
                <div>
                  <Label htmlFor="rfi-question">Question</Label>
                  <Textarea
                    id="rfi-question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Describe your question in detail"
                    rows={4}
                    data-testid="input-rfi-question"
                  />
                </div>
                <div>
                  <Label htmlFor="rfi-priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger data-testid="select-rfi-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || !subject.trim() || !question.trim() || !selectedProjectId}
                  className="w-full"
                  data-testid="button-submit-rfi"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Submit RFI
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card data-testid="stat-total-rfis">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-total-rfis">{statusCounts.total}</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-open-rfis">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Open</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-open-rfis">{statusCounts.open}</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-answered-rfis">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Answered</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-answered-rfis">{statusCounts.answered}</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-closed-rfis">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Closed</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-closed-rfis">{statusCounts.closed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search RFIs by subject, question, or number..."
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-44" data-testid="select-project-filter">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {(projects || []).map((p: any) => (
                <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : filteredRfis.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No RFIs Found"
          description={search || statusFilter !== "all" || projectFilter !== "all"
            ? "No RFIs match your current filters. Try adjusting your search criteria."
            : "Submit a Request for Information to get answers from the engineering team."
          }
          action={!search && statusFilter === "all" && projectFilter === "all" ? { label: "New RFI", onClick: () => setCreateOpen(true) } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredRfis.map((rfi: any) => (
            <Card
              key={rfi.id}
              className="hover-elevate cursor-pointer"
              onClick={() => setSelectedRfi(rfi)}
              data-testid={`card-rfi-${rfi.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {rfi.rfi_number && (
                        <span className="text-xs text-muted-foreground font-mono" data-testid={`text-rfi-number-${rfi.id}`}>
                          {rfi.rfi_number}
                        </span>
                      )}
                      <p className="font-medium" data-testid={`text-rfi-subject-${rfi.id}`}>{rfi.subject}</p>
                      {getPriorityIcon(rfi.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2" data-testid={`text-rfi-question-${rfi.id}`}>
                      {rfi.question}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span data-testid={`text-rfi-project-${rfi.id}`}>{getProjectName(rfi.project_id)}</span>
                      <span>Priority: {rfi.priority || "medium"}</span>
                      {rfi.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {formatDate(rfi.due_date, "short")}
                        </span>
                      )}
                      <span>{formatDate(rfi.created_date, "short")}</span>
                      {rfi.attachments && Array.isArray(rfi.attachments) && rfi.attachments.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {rfi.attachments.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={rfi.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RFIDetail({ rfi, projectName, onBack }: { rfi: any; projectName: string; onBack: () => void }) {
  const hasAttachments = rfi.attachments && Array.isArray(rfi.attachments) && rfi.attachments.length > 0;

  return (
    <div>
      <PageHeader
        title={rfi.subject}
        subtitle={rfi.rfi_number ? `RFI ${rfi.rfi_number}` : "Request for Information"}
        breadcrumbs={[
          { label: "RFIs", href: "#" },
          { label: rfi.subject },
        ]}
        actions={
          <Button variant="outline" onClick={onBack} data-testid="button-back-to-rfis">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to RFIs
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-rfi-question-detail">
            <CardHeader>
              <CardTitle className="text-base">Question</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap" data-testid="text-rfi-question-detail">{rfi.question}</p>
              {hasAttachments && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Attachments</p>
                  <div className="flex flex-col gap-2">
                    {rfi.attachments.map((att: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Paperclip className="h-3.5 w-3.5" />
                        <span data-testid={`text-rfi-attachment-${i}`}>{typeof att === "string" ? att : att.name || `Attachment ${i + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {rfi.answer && (
            <Card data-testid="card-rfi-response">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap" data-testid="text-rfi-answer">{rfi.answer}</p>
                {rfi.answered_date && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Answered {formatRelativeTime(rfi.answered_date)}
                    {rfi.assigned_to && ` by ${rfi.assigned_to}`}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {!rfi.answer && rfi.status === "open" && (
            <Card data-testid="card-rfi-pending">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">Awaiting Response</p>
                    <p className="text-sm">The engineering team will respond to your question soon.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card data-testid="card-rfi-details">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge status={rfi.status} />
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Project</p>
                <p className="text-sm font-medium" data-testid="text-rfi-detail-project">{projectName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Priority</p>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="capitalize" data-testid="text-rfi-detail-priority">
                    {rfi.priority || "medium"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Submitted By</p>
                <p className="text-sm" data-testid="text-rfi-detail-submitter">{rfi.asked_by_name || rfi.asked_by || "—"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm" data-testid="text-rfi-detail-date">{formatDate(rfi.created_date)}</p>
              </div>
              {rfi.due_date && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm" data-testid="text-rfi-detail-due">{formatDate(rfi.due_date)}</p>
                  </div>
                </>
              )}
              {rfi.assigned_to && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <p className="text-sm" data-testid="text-rfi-detail-assignee">{rfi.assigned_to}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
