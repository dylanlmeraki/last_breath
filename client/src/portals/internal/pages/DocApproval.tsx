import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ListChecks,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Clock,
  Loader2,
  FileImage,
  FileSpreadsheet,
  File,
  CheckSquare
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

function getFileIcon(docType: string | undefined) {
  if (!docType) return File;
  const t = docType.toLowerCase();
  if (t.includes("image") || t.includes("photo") || t.includes("drawing")) return FileImage;
  if (t.includes("spreadsheet") || t.includes("excel") || t.includes("csv")) return FileSpreadsheet;
  return FileText;
}

function DocumentPreviewPanel({ doc, onClose }: { doc: any; onClose: () => void }) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ status, reviewComment }: { status: string; reviewComment?: string }) => {
      const res = await apiRequest("PUT", `/api/project-documents/${doc.id}`, {
        status,
        review_comment: reviewComment,
        reviewed_date: new Date().toISOString()
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-documents"] });
      toast({ title: "Document updated" });
      onClose();
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const timeline = [
    { label: "Uploaded", date: doc.created_date, status: "complete" },
    { label: "Under Review", date: doc.status === "Review" || doc.status === "Approved" || doc.status === "Rejected" ? doc.created_date : null, status: doc.status === "Review" || doc.status === "Approved" || doc.status === "Rejected" ? "complete" : "pending" },
    { label: "Decision", date: doc.reviewed_date || null, status: doc.status === "Approved" || doc.status === "Rejected" ? "complete" : "pending" },
  ];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              {(() => { const Icon = getFileIcon(doc.document_type); return <Icon className="w-6 h-6 text-blue-600" />; })()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg" data-testid="text-doc-preview-name">{doc.document_name}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                <Badge variant="outline">{doc.document_type}</Badge>
                {doc.version && <span>v{doc.version}</span>}
                <span>Uploaded {formatDate(doc.created_date)}</span>
              </div>
              {doc.uploaded_by_name && (
                <p className="text-sm text-muted-foreground mt-1">By: {doc.uploaded_by_name}</p>
              )}
            </div>
            <StatusBadge status={doc.status} size="md" />
          </div>

          {doc.file_url && (
            <div className="border rounded-lg bg-muted/30 p-6 text-center">
              <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground mb-3">Document file available</p>
              <Button variant="outline" asChild data-testid="button-open-document">
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Document
                </a>
              </Button>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-3">Approval Timeline</h4>
            <div className="space-y-0">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.status === "complete" ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                      {step.status === "complete" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`w-0.5 h-6 ${step.status === "complete" ? "bg-green-300 dark:bg-green-700" : "bg-gray-200 dark:bg-gray-700"}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{step.label}</p>
                    {step.date && <p className="text-xs text-muted-foreground">{formatRelativeTime(step.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(doc.status === "Review" || doc.status === "Draft") && (
            <div className="space-y-3 border-t pt-4">
              <Label>Review Comment (optional)</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment about this document..."
                rows={3}
                data-testid="input-review-comment"
              />
              <div className="flex gap-2 justify-end flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => updateMutation.mutate({ status: "Rejected", reviewComment: comment })}
                  disabled={updateMutation.isPending}
                  data-testid="button-reject-doc"
                >
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                  Reject
                </Button>
                <Button
                  onClick={() => updateMutation.mutate({ status: "Approved", reviewComment: comment })}
                  disabled={updateMutation.isPending}
                  data-testid="button-approve-doc"
                >
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Approve
                </Button>
              </div>
            </div>
          )}

          {doc.review_comment && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Review Comment</span>
              </div>
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{doc.review_comment}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DocApproval() {
  const { data: documents, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-documents"] });
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const pendingDocs = (documents || []).filter((d) => d.status === "Review" || d.status === "Draft");
  const allDocs = documents || [];

  const batchApproveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map((id) =>
          apiRequest("PUT", `/api/project-documents/${id}`, {
            status: "Approved",
            reviewed_date: new Date().toISOString()
          })
        )
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-documents"] });
      setSelectedIds(new Set());
      toast({ title: "Documents approved" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Batch approval failed", description: e.message }),
  });

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === pendingDocs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingDocs.map((d: any) => d.id)));
    }
  };

  return (
    <div>
      <PageHeader
        title="Document Approval"
        subtitle={`${pendingDocs.length} document${pendingDocs.length !== 1 ? "s" : ""} pending review`}
        actions={
          selectedIds.size > 0 ? (
            <Button
              onClick={() => batchApproveMutation.mutate(Array.from(selectedIds))}
              disabled={batchApproveMutation.isPending}
              data-testid="button-batch-approve"
            >
              {batchApproveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckSquare className="w-4 h-4 mr-2" />
              )}
              Approve {selectedIds.size} Selected
            </Button>
          ) : undefined
        }
      />

      {isLoading ? <TableSkeleton /> : pendingDocs.length === 0 ? (
        <EmptyState icon={ListChecks} title="All caught up" description="No documents pending approval" />
      ) : (
        <div className="space-y-3">
          {pendingDocs.length > 1 && (
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                checked={selectedIds.size === pendingDocs.length}
                onCheckedChange={toggleAll}
                data-testid="checkbox-select-all"
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </div>
          )}
          {pendingDocs.map((doc: any) => {
            const DocIcon = getFileIcon(doc.document_type);
            return (
              <Card key={doc.id} className="hover-elevate" data-testid={`doc-approval-${doc.id}`}>
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Checkbox
                      checked={selectedIds.has(doc.id)}
                      onCheckedChange={() => toggleSelection(doc.id)}
                      data-testid={`checkbox-doc-${doc.id}`}
                    />
                  </div>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DocIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.document_name}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span>{doc.document_type}</span>
                        <span>Uploaded {formatDate(doc.created_date, "short")}</span>
                        {doc.uploaded_by_name && <span>By: {doc.uploaded_by_name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={doc.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                      data-testid={`button-review-doc-${doc.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    {doc.file_url && (
                      <Button variant="ghost" size="icon" asChild data-testid={`button-view-doc-${doc.id}`}>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedDoc && (
        <DocumentPreviewPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}