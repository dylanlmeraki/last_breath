import { useState } from "react";
import { filterEntities, listEntities } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  FileText,
  MessageSquare,
  Download,
  ArrowLeft,
  TrendingUp,
  Clock,
  AlertCircle,
  Loader2,
  Target,
  GitPullRequest,
  CheckCircle2,
  FileImage,
  FileSpreadsheet,
  FileCode,
  File,
  Eye,
  FileBarChart,
  ExternalLink
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatCurrency } from "@/lib/utils";

function getFileTypeIcon(docType: string | undefined, fileName?: string) {
  if (!docType && !fileName) return File;
  const t = (docType || "").toLowerCase();
  const name = (fileName || "").toLowerCase();

  if (t.includes("image") || t.includes("photo") || t.includes("drawing") || /\.(png|jpg|jpeg|gif|svg|webp)$/.test(name)) return FileImage;
  if (t.includes("spreadsheet") || t.includes("excel") || t.includes("csv") || /\.(xlsx|xls|csv)$/.test(name)) return FileSpreadsheet;
  if (t.includes("code") || /\.(js|ts|py|html|css|json)$/.test(name)) return FileCode;
  if (t.includes("report") || t.includes("pdf") || /\.pdf$/.test(name)) return FileBarChart;
  return FileText;
}

function getFileTypeColor(docType: string | undefined) {
  if (!docType) return "bg-gray-100 dark:bg-gray-800 text-gray-600";
  const t = docType.toLowerCase();
  if (t.includes("image") || t.includes("photo") || t.includes("drawing")) return "bg-purple-100 dark:bg-purple-900/30 text-purple-600";
  if (t.includes("spreadsheet") || t.includes("excel") || t.includes("csv")) return "bg-green-100 dark:bg-green-900/30 text-green-600";
  if (t.includes("report") || t.includes("pdf")) return "bg-red-100 dark:bg-red-900/30 text-red-600";
  if (t.includes("contract") || t.includes("legal")) return "bg-amber-100 dark:bg-amber-900/30 text-amber-600";
  return "bg-blue-100 dark:bg-blue-900/30 text-blue-600";
}

function DocumentPreviewModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const isImage = /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(doc.file_url || "");
  const isPdf = /\.pdf$/i.test(doc.file_url || "");

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{doc.document_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline">{doc.document_type}</Badge>
            {doc.version && <span className="text-sm text-muted-foreground">v{doc.version}</span>}
            <span className="text-sm text-muted-foreground">Uploaded {formatDate(doc.created_date)}</span>
            {doc.uploaded_by_name && <span className="text-sm text-muted-foreground">by {doc.uploaded_by_name}</span>}
          </div>

          {doc.file_url && (
            <div className="border rounded-lg overflow-hidden bg-muted/30">
              {isImage ? (
                <img src={doc.file_url} alt={doc.document_name} className="max-w-full max-h-[60vh] mx-auto object-contain" data-testid="img-document-preview" />
              ) : isPdf ? (
                <iframe src={doc.file_url} className="w-full" style={{ minHeight: "60vh" }} title="Document Preview" data-testid="iframe-document-preview" />
              ) : (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                  <Button variant="outline" asChild data-testid="button-open-in-new-tab">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 justify-end flex-wrap">
            {doc.file_url && (
              <Button variant="outline" asChild data-testid="button-download-preview">
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectDetail() {
  const { user } = useAuth();
  const { id: projectId } = useParams<{ id: string }>();
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await filterEntities('Project', { id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: () => filterEntities('ProjectDocument', { project_id: projectId }, '-created_date', 100),
    enabled: !!projectId
  });

  const { data: milestones = [], isLoading: milestonesLoading } = useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: () => filterEntities('ProjectMilestone', { project_id: projectId }, '-due_date', 100),
    enabled: !!projectId
  });

  const { data: changeOrders = [], isLoading: changeOrdersLoading } = useQuery({
    queryKey: ['project-change-orders', projectId],
    queryFn: () => filterEntities('ChangeOrder', { project_id: projectId }, '-created_date', 100),
    enabled: !!projectId
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['project-messages', projectId],
    queryFn: () => filterEntities('ProjectMessage', { project_id: projectId }, '-created_date', 100),
    enabled: !!projectId
  });

  const statusColors: Record<string, string> = {
    "Planning": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "On Hold": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Under Review": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Completed": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Closed": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  };

  if (projectLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Link to={basePath + "/projects"}>
            <Button data-testid="button-back-to-projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-800 text-white py-12 px-6 rounded-lg mb-8">
        <div className="max-w-7xl mx-auto">
          <Link to={basePath + "/projects"} className="inline-flex items-center text-cyan-200 hover:text-white mb-6 transition-colors" data-testid="link-back-to-projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" data-testid="text-project-name">{project.project_name}</h1>
              <p className="text-cyan-100 text-lg">Project #{project.project_number}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={`${statusColors[project.status] || statusColors["Planning"]} text-base px-4 py-2`}>
                {project.status}
              </Badge>
              <Link to={`${basePath}/pdf-generator?project=${projectId}`}>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white" data-testid="button-generate-report">
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Project Type</span>
                </div>
                <p className="text-lg font-semibold" data-testid="text-project-type">{project.project_type}</p>
              </div>

              {project.location && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <p className="text-lg font-semibold">{project.location}</p>
                </div>
              )}

              {project.start_date && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Start Date</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(project.start_date, "long")}</p>
                </div>
              )}

              {project.estimated_completion && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Est. Completion</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(project.estimated_completion, "long")}</p>
                </div>
              )}
            </div>

            {project.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Project Description</h3>
                <p className="leading-relaxed">{project.description}</p>
              </div>
            )}

            {project.budget && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Budget</h3>
                <p className="text-lg font-semibold">{formatCurrency(project.budget)}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-1 mb-3 flex-wrap">
                <span className="text-sm font-semibold">Overall Progress</span>
                <span className="text-2xl font-bold">{project.progress_percentage || 0}%</span>
              </div>
              <Progress value={project.progress_percentage || 0} className="h-3" />
            </div>
          </Card>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="documents" className="flex items-center gap-2" data-testid="tab-documents">
                <FileText className="w-4 h-4" />
                Documents ({documents.length})
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2" data-testid="tab-messages">
                <MessageSquare className="w-4 h-4" />
                Messages ({messages.length})
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex items-center gap-2" data-testid="tab-milestones">
                <Target className="w-4 h-4" />
                Milestones ({milestones.filter((m: any) => m.status === 'Pending Client Approval').length})
              </TabsTrigger>
              <TabsTrigger value="changeorders" className="flex items-center gap-2" data-testid="tab-change-orders">
                <GitPullRequest className="w-4 h-4" />
                Change Orders ({changeOrders.filter((co: any) => co.status === 'Pending Client Approval').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <h3 className="text-lg font-bold">Project Documents</h3>
                  <Link to={`${basePath}/pdf-generator?project=${projectId}`}>
                    <Button variant="outline" size="sm" data-testid="button-generate-report-tab">
                      <FileBarChart className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </Link>
                </div>

                {docsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No documents uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc: any) => {
                      const DocIcon = getFileTypeIcon(doc.document_type, doc.file_url);
                      const iconColor = getFileTypeColor(doc.document_type);
                      return (
                        <Card key={doc.id} className="p-4 border hover-elevate transition-colors" data-testid={`document-${doc.id}`}>
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center`}>
                                <DocIcon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{doc.document_name}</h4>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                                  <Badge variant="outline" className="text-xs">{doc.document_type}</Badge>
                                  {doc.version && <span>v{doc.version}</span>}
                                  <span>Uploaded {formatDate(doc.created_date)}</span>
                                  {doc.uploaded_by_name && <span>by {doc.uploaded_by_name}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewDoc(doc)}
                                data-testid={`button-preview-${doc.id}`}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                              {doc.file_url && (
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm" data-testid={`button-download-${doc.id}`}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card className="overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                  <h3 className="text-lg font-bold mb-1">Project Communication</h3>
                  <p className="text-sm text-muted-foreground">Messages about this project</p>
                </div>
                <div className="p-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No messages yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg: any) => (
                        <div key={msg.id} className="bg-muted/50 rounded-lg p-4" data-testid={`message-${msg.id}`}>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-medium text-sm">{msg.sender_name || msg.sender_email}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(msg.created_date)}</span>
                            {msg.is_internal && <Badge variant="outline" className="text-xs">Internal</Badge>}
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between gap-1 mb-6 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold">Project Milestones</h3>
                    <p className="text-sm text-muted-foreground mt-1">Review and approve project milestones</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    {milestones.filter((m: any) => m.status === 'Pending Client Approval').length} Pending
                  </Badge>
                </div>

                {milestonesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : milestones.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No milestones defined yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {milestones.map((milestone: any) => (
                      <Card key={milestone.id} className="p-4" data-testid={`milestone-${milestone.id}`}>
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <div>
                            <h4 className="font-semibold">{milestone.milestone_name}</h4>
                            <p className="text-sm text-muted-foreground">Due: {formatDate(milestone.due_date)}</p>
                            {milestone.amount && <p className="text-sm font-medium">{formatCurrency(milestone.amount)}</p>}
                          </div>
                          <Badge className={statusColors[milestone.status] || statusColors["Planning"]}>
                            {milestone.status}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="changeorders" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between gap-1 mb-6 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold">Change Orders</h3>
                    <p className="text-sm text-muted-foreground mt-1">Review and approve project changes</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    {changeOrders.filter((co: any) => co.status === 'Pending Client Approval').length} Pending
                  </Badge>
                </div>

                {changeOrdersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : changeOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <GitPullRequest className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No change orders submitted yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {changeOrders.map((changeOrder: any) => (
                      <Card key={changeOrder.id} className="p-4" data-testid={`change-order-${changeOrder.id}`}>
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <div>
                            <h4 className="font-semibold">{changeOrder.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Cost: {formatCurrency(changeOrder.cost_impact)} Schedule: {changeOrder.schedule_impact_days || 0} days
                            </p>
                          </div>
                          <Badge className={statusColors[changeOrder.status] || statusColors["Planning"]}>
                            {changeOrder.status}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {previewDoc && (
        <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}