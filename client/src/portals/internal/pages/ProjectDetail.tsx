import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Users, FileText,
  MessageSquare, AlertTriangle, ClipboardList, Milestone
} from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";

  const { data: project, isLoading } = useQuery<any>({
    queryKey: ["/api/projects/" + id],
    enabled: !!id,
  });

  const { data: milestones } = useQuery<any[]>({
    queryKey: ["/api/project-milestones"],
    select: (data) => data?.filter((m: any) => m.project_id === id),
  });

  const { data: documents } = useQuery<any[]>({
    queryKey: ["/api/project-documents"],
    select: (data) => data?.filter((d: any) => d.project_id === id),
  });

  const { data: messages } = useQuery<any[]>({
    queryKey: ["/api/project-messages"],
    select: (data) => data?.filter((m: any) => m.project_id === id),
  });

  const { data: changeOrders } = useQuery<any[]>({
    queryKey: ["/api/change-orders"],
    select: (data) => data?.filter((c: any) => c.project_id === id),
  });

  const { data: rfis } = useQuery<any[]>({
    queryKey: ["/api/rfis"],
    select: (data) => data?.filter((r: any) => r.project_id === id),
  });

  if (isLoading) return <DetailSkeleton />;
  if (!project) return <EmptyState icon={AlertTriangle} title="Project not found" description="This project may have been deleted" />;

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
          <Button variant="outline" onClick={() => navigate(basePath + "/projects")} data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><StatusBadge status={project.status} size="md" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-medium">{project.status}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><Calendar className="h-5 w-5 text-blue-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="font-medium">{formatDate(project.start_date, "short")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="font-medium">{formatCurrency(project.budget)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Progress</p>
            <div className="flex items-center gap-2">
              <Progress value={project.progress_percentage || 0} className="flex-1" />
              <span className="text-sm font-medium">{project.progress_percentage || 0}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones" data-testid="tab-milestones">Milestones ({milestones?.length || 0})</TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">Documents ({documents?.length || 0})</TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-messages">Messages ({messages?.length || 0})</TabsTrigger>
          <TabsTrigger value="change-orders" data-testid="tab-change-orders">Change Orders ({changeOrders?.length || 0})</TabsTrigger>
          <TabsTrigger value="rfis" data-testid="tab-rfis">RFIs ({rfis?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{project.project_type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><StatusBadge status={project.priority} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span>{project.client_name || project.client_email}</span></div>
                {project.location && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Est. Completion</span><span>{formatDate(project.estimated_completion, "short")}</span></div>
              </CardContent>
            </Card>
            {project.description && (
              <Card>
                <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.description}</p></CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          {(!milestones || milestones.length === 0) ? (
            <EmptyState icon={Milestone} title="No milestones" description="Add milestones to track project progress" />
          ) : (
            <div className="space-y-3">
              {milestones.map((m: any) => (
                <Card key={m.id} data-testid={`milestone-${m.id}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{m.milestone_name}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(m.due_date, "short")} {m.amount ? `• ${formatCurrency(m.amount)}` : ""}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          {(!documents || documents.length === 0) ? (
            <EmptyState icon={FileText} title="No documents" description="Upload project documents to share with the team" />
          ) : (
            <div className="space-y-3">
              {documents.map((d: any) => (
                <Card key={d.id} data-testid={`document-${d.id}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{d.document_name}</p>
                        <p className="text-xs text-muted-foreground">{d.document_type} • {formatDate(d.created_date, "short")}</p>
                      </div>
                    </div>
                    <StatusBadge status={d.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages">
          {(!messages || messages.length === 0) ? (
            <EmptyState icon={MessageSquare} title="No messages" description="Start a conversation about this project" />
          ) : (
            <div className="space-y-3">
              {messages.map((m: any) => (
                <Card key={m.id} data-testid={`message-${m.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{m.sender_name || m.sender_email}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(m.created_date, "short")}</span>
                      {m.is_internal && <StatusBadge status="Internal" size="sm" />}
                    </div>
                    <p className="text-sm">{m.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="change-orders">
          {(!changeOrders || changeOrders.length === 0) ? (
            <EmptyState icon={ClipboardList} title="No change orders" description="Change orders will appear here when created" />
          ) : (
            <div className="space-y-3">
              {changeOrders.map((c: any) => (
                <Card key={c.id} data-testid={`change-order-${c.id}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Cost: {formatCurrency(c.cost_impact)} • Schedule: {c.schedule_impact_days || 0} days
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rfis">
          {(!rfis || rfis.length === 0) ? (
            <EmptyState icon={AlertTriangle} title="No RFIs" description="Requests for information will appear here" />
          ) : (
            <div className="space-y-3">
              {rfis.map((r: any) => (
                <Card key={r.id} data-testid={`rfi-${r.id}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{r.subject}</p>
                      <p className="text-sm text-muted-foreground">{r.rfi_number} • Due: {formatDate(r.due_date, "short")}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={r.priority} size="sm" />
                      <StatusBadge status={r.status} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
