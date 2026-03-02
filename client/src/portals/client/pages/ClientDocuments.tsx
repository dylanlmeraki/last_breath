import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ClientDocuments() {
  const { user } = useAuth();
  const { data: documents, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-documents"] });

  return (
    <div>
      <PageHeader title="Documents" subtitle="View and download project documents" />

      {isLoading ? <TableSkeleton /> : (!documents || documents.length === 0) ? (
        <EmptyState icon={FileText} title="No documents" description="Documents shared by the team will appear here" />
      ) : (
        <div className="space-y-3">
          {documents.map((d: any) => (
            <Card key={d.id} className="hover-elevate" data-testid={`document-${d.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{d.document_name}</p>
                    <p className="text-xs text-muted-foreground">{d.document_type} • {formatDate(d.created_date, "short")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={d.status} />
                  {d.file_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={d.file_url} target="_blank" rel="noopener noreferrer" data-testid={`link-download-${d.id}`}><ExternalLink className="h-4 w-4" /></a>
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
