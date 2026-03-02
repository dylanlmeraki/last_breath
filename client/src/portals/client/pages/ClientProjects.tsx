import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FolderKanban, ArrowLeft, FileText, MessageSquare } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientProjects() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const { data: projects, isLoading } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const { data: milestones } = useQuery<any[]>({ queryKey: ["/api/project-milestones"] });
  const { data: documents } = useQuery<any[]>({ queryKey: ["/api/project-documents"] });
  const { data: messages } = useQuery<any[]>({ queryKey: ["/api/project-messages"] });

  const myProjects = (projects || []).filter((p) => p.client_email === user?.email);

  if (id) {
    const project = myProjects.find((p) => p.id === id);
    const projMilestones = (milestones || []).filter((m) => m.project_id === id);
    const projDocs = (documents || []).filter((d) => d.project_id === id);
    const projMessages = (messages || []).filter((m) => m.project_id === id && !m.is_internal);

    if (isLoading) return <DetailSkeleton />;
    if (!project) return <EmptyState icon={FolderKanban} title="Project not found" description="This project may not be available" />;

    return (
      <div>
        <PageHeader
          title={project.project_name}
          subtitle={project.project_number}
          actions={<Button variant="outline" onClick={() => navigate(basePath + "/projects")}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>}
        />

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <StatusBadge status={project.status} size="md" />
              <span className="text-sm font-medium">{project.progress_percentage || 0}% complete</span>
            </div>
            <Progress value={project.progress_percentage || 0} className="h-2" />
          </CardContent>
        </Card>

        <Tabs defaultValue="milestones">
          <TabsList>
            <TabsTrigger value="milestones">Milestones ({projMilestones.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({projDocs.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({projMessages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-3">
            {projMilestones.length === 0 ? <EmptyState icon={FolderKanban} title="No milestones" description="Milestones will appear as they are set" /> : (
              projMilestones.map((m: any) => (
                <Card key={m.id} data-testid={`milestone-${m.id}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{m.milestone_name}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(m.due_date, "short")} {m.amount ? `• ${formatCurrency(m.amount)}` : ""}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-3">
            {projDocs.length === 0 ? <EmptyState icon={FileText} title="No documents" description="Documents will appear when shared" /> : (
              projDocs.map((d: any) => (
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
              ))
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-3">
            {projMessages.length === 0 ? <EmptyState icon={MessageSquare} title="No messages" description="Messages with the PE team will appear here" /> : (
              projMessages.map((m: any) => (
                <Card key={m.id} data-testid={`message-${m.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{m.sender_name || m.sender_email}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(m.created_date, "short")}</span>
                    </div>
                    <p className="text-sm">{m.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Projects" subtitle={`${myProjects.length} project${myProjects.length !== 1 ? "s" : ""}`} />

      {isLoading ? <TableSkeleton /> : myProjects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects" description="Your projects will appear here once they are set up" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProjects.map((p: any) => (
            <Card
              key={p.id}
              className="cursor-pointer hover-elevate"
              onClick={() => navigate(basePath + "/projects/" + p.id)}
              data-testid={`project-card-${p.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{p.project_name}</p>
                    <p className="text-xs text-muted-foreground">{p.project_number}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <Progress value={p.progress_percentage || 0} className="h-1.5 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{p.progress_percentage || 0}%</span>
                  <span>{p.project_type}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
