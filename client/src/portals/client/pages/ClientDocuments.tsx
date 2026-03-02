import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Upload } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientDocuments() {
  const { user } = useAuth();
  const { data: documents, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-documents"] });
  const { data: projects } = useQuery<any[]>({ queryKey: ["/api/projects"] });

  const myProjects = (projects || []).filter((p) => p.client_email === user?.email);
  const myProjectIds = new Set(myProjects.map((p) => p.id));

  const myDocs = (documents || []).filter((d) => myProjectIds.has(d.project_id));

  const grouped: Record<string, any[]> = {};
  myDocs.forEach((d) => {
    const key = d.project_id || "unassigned";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  });

  const getProjectName = (projectId: string) => {
    const proj = myProjects.find((p) => p.id === projectId);
    return proj?.project_name || "Other";
  };

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="View and download project documents"
        actions={
          <Button variant="outline" disabled data-testid="button-upload-document">
            <Upload className="h-4 w-4 mr-1" /> Upload
          </Button>
        }
      />

      {isLoading ? <TableSkeleton /> : myDocs.length === 0 ? (
        <EmptyState icon={FileText} title="No documents" description="Documents shared by the team will appear here" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([projectId, docs]) => (
            <div key={projectId}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {projectId === "unassigned" ? "Other Documents" : getProjectName(projectId)}
              </h3>
              <div className="space-y-3">
                {docs.map((d: any) => (
                  <Card key={d.id} className="hover-elevate" data-testid={`document-${d.id}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{d.document_name}</p>
                          <p className="text-xs text-muted-foreground">{d.document_type} {d.created_date ? `\u00B7 ${formatDate(d.created_date, "short")}` : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={d.status} />
                        {d.file_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={d.file_url} target="_blank" rel="noopener noreferrer" data-testid={`link-download-${d.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
