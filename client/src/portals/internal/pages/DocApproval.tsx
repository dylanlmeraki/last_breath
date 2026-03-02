import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, FileText, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DocApproval() {
  const { data: documents, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-documents"] });

  const pendingDocs = (documents || []).filter((d) => d.status === "Review" || d.status === "Draft");

  return (
    <div>
      <PageHeader title="Document Approval" subtitle={`${pendingDocs.length} document${pendingDocs.length !== 1 ? "s" : ""} pending review`} />

      {isLoading ? <TableSkeleton /> : pendingDocs.length === 0 ? (
        <EmptyState icon={ListChecks} title="All caught up" description="No documents pending approval" />
      ) : (
        <div className="space-y-3">
          {pendingDocs.map((doc: any) => (
            <Card key={doc.id} className="hover-elevate" data-testid={`doc-approval-${doc.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{doc.document_name}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{doc.document_type}</span>
                      <span>Uploaded {formatDate(doc.created_date, "short")}</span>
                      {doc.uploaded_by_name && <span>By: {doc.uploaded_by_name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={doc.status} />
                  {doc.file_url && (
                    <Button variant="ghost" size="sm" asChild data-testid={`button-view-doc-${doc.id}`}>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
