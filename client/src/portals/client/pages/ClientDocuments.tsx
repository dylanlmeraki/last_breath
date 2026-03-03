import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchInput } from "@/components/shared/SearchInput";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText, Download, Upload, CheckCircle, XCircle,
  File, FileImage, FileSpreadsheet, FileCode, FolderOpen,
  Clock, Shield, AlertCircle, Eye
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  useClientProjects,
  useClientDocuments,
  useClientDocumentApprovals,
  useCreateEntity,
  useUpdateEntity,
} from "../lib/useClientData";
import { apiRequest, queryClient } from "@/lib/queryClient";

function getDocTypeIcon(docType: string | null | undefined) {
  if (!docType) return File;
  const t = docType.toLowerCase();
  if (t.includes("image") || t.includes("photo") || t.includes("png") || t.includes("jpg")) return FileImage;
  if (t.includes("spreadsheet") || t.includes("excel") || t.includes("csv")) return FileSpreadsheet;
  if (t.includes("code") || t.includes("cad") || t.includes("dwg")) return FileCode;
  if (t.includes("contract") || t.includes("legal")) return Shield;
  return FileText;
}

type FilterStatus = "all" | "draft" | "pending" | "approved" | "rejected";
type FilterType = "all" | string;

export default function ClientDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("documents");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [approvalDialog, setApprovalDialog] = useState<{ doc: any; action: "approved" | "rejected" } | null>(null);
  const [approvalComment, setApprovalComment] = useState("");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadProject, setUploadProject] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);

  const { data: projects, isLoading: projectsLoading } = useClientProjects();
  const myProjects = projects || [];
  const projectIds = useMemo(() => myProjects.map((p: any) => p.id), [myProjects]);

  const { data: documents, isLoading: docsLoading } = useClientDocuments(projectIds);
  const myDocs = documents || [];

  const documentIds = useMemo(() => myDocs.map((d: any) => d.id), [myDocs]);
  const { data: approvals } = useClientDocumentApprovals(documentIds);
  const allApprovals = approvals || [];

  const createApproval = useCreateEntity("document-approvals");
  const updateDocument = useUpdateEntity("project-documents");

  const docTypes = useMemo(() => {
    const types = new Set<string>();
    myDocs.forEach((d: any) => { if (d.document_type) types.add(d.document_type); });
    return Array.from(types).sort();
  }, [myDocs]);

  const filteredDocs = useMemo(() => {
    return myDocs.filter((d: any) => {
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = (d.document_name || "").toLowerCase().includes(q);
        const typeMatch = (d.document_type || "").toLowerCase().includes(q);
        if (!nameMatch && !typeMatch) return false;
      }
      if (statusFilter !== "all" && (d.status || "").toLowerCase() !== statusFilter) return false;
      if (typeFilter !== "all" && d.document_type !== typeFilter) return false;
      if (projectFilter !== "all" && d.project_id !== projectFilter) return false;
      return true;
    });
  }, [myDocs, search, statusFilter, typeFilter, projectFilter]);

  const pendingApprovalDocs = useMemo(() => {
    return myDocs.filter((d: any) => {
      const s = (d.status || "").toLowerCase();
      return s === "pending" || s === "pending client approval" || s === "pending_client_approval";
    });
  }, [myDocs]);

  const grouped = useMemo(() => {
    const g: Record<string, any[]> = {};
    filteredDocs.forEach((d: any) => {
      const key = d.project_id || "unassigned";
      if (!g[key]) g[key] = [];
      g[key].push(d);
    });
    return g;
  }, [filteredDocs]);

  const getProjectName = (projectId: string) => {
    const proj = myProjects.find((p: any) => p.id === projectId);
    return proj?.project_name || "Other Documents";
  };

  const getDocApprovals = (docId: string) => {
    return allApprovals.filter((a: any) => a.document_id === docId);
  };

  const handleDownload = async (doc: any) => {
    try {
      await apiRequest("POST", "/api/audit-logs", {
        actor_email: user?.email || "",
        actor_name: user?.full_name || "",
        action: "download",
        resource_type: "project_document",
        resource_id: doc.id,
        resource_name: doc.document_name,
        details: `Downloaded document: ${doc.document_name}`,
        created_by: user?.email || "system",
      });
    } catch {}
    if (doc.file_url) {
      window.open(doc.file_url, "_blank", "noopener,noreferrer");
    }
    toast({ title: "Download started", description: doc.document_name });
  };

  const handleApprovalSubmit = async () => {
    if (!approvalDialog) return;
    try {
      await createApproval.mutateAsync({
        document_id: approvalDialog.doc.id,
        reviewer_email: user?.email || "",
        reviewer_name: user?.full_name || "",
        status: approvalDialog.action,
        comments: approvalComment || null,
        reviewed_at: new Date().toISOString(),
        created_by: user?.email || "system",
      });

      await updateDocument.mutateAsync({
        id: approvalDialog.doc.id,
        data: {
          status: approvalDialog.action === "approved" ? "Approved" : "Rejected",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["/api/project-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/document-approvals"] });

      toast({
        title: approvalDialog.action === "approved" ? "Document approved" : "Document rejected",
        description: approvalDialog.doc.document_name,
      });
      setApprovalDialog(null);
      setApprovalComment("");
    } catch {
      toast({ title: "Error", description: "Failed to submit approval", variant: "destructive" });
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadProject || !uploadName) {
      toast({ title: "Missing fields", description: "Please fill in project and document name", variant: "destructive" });
      return;
    }
    try {
      await apiRequest("POST", "/api/project-documents", {
        project_id: uploadProject,
        document_name: uploadName,
        document_type: uploadCategory || "General",
        file_url: "#",
        uploaded_by: user?.email || "",
        uploaded_by_name: user?.full_name || "",
        status: "Draft",
        created_by: user?.email || "system",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/project-documents"] });
      toast({ title: "Document uploaded", description: uploadName });
      setUploadDialog(false);
      setUploadProject("");
      setUploadCategory("");
      setUploadName("");
    } catch {
      toast({ title: "Error", description: "Failed to upload document", variant: "destructive" });
    }
  };

  const isLoading = projectsLoading || docsLoading;

  const statCounts = useMemo(() => {
    const total = myDocs.length;
    const pending = pendingApprovalDocs.length;
    const approved = myDocs.filter((d: any) => (d.status || "").toLowerCase() === "approved").length;
    const draft = myDocs.filter((d: any) => (d.status || "").toLowerCase() === "draft").length;
    return { total, pending, approved, draft };
  }, [myDocs, pendingApprovalDocs]);

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="View, download, and manage project documents"
        actions={
          <Button onClick={() => setUploadDialog(true)} data-testid="button-upload-document">
            <Upload className="h-4 w-4 mr-1" /> Upload Document
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card data-testid="stat-total-documents">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <FolderOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-count">{statCounts.total}</p>
                <p className="text-xs text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-pending-documents">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-pending-count">{statCounts.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-approved-documents">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-approved-count">{statCounts.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-draft-documents">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-draft-count">{statCounts.draft}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="documents" data-testid="tab-documents">
            All Documents
          </TabsTrigger>
          <TabsTrigger value="approvals" data-testid="tab-approvals">
            Pending Approvals
            {statCounts.pending > 0 && (
              <Badge variant="destructive" className="ml-2">{statCounts.pending}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search documents..."
              className="w-64"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
              <SelectTrigger className="w-40" data-testid="select-type-filter">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {docTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={(v) => setProjectFilter(v)}>
              <SelectTrigger className="w-48" data-testid="select-project-filter">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {myProjects.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : filteredDocs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents found"
              description={search || statusFilter !== "all" || typeFilter !== "all" || projectFilter !== "all"
                ? "Try adjusting your filters"
                : "Documents shared by the team will appear here"}
            />
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([projectId, docs]) => (
                <div key={projectId}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3" data-testid={`text-project-group-${projectId}`}>
                    {projectId === "unassigned" ? "Other Documents" : getProjectName(projectId)}
                    <Badge variant="secondary" className="ml-2">{docs.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {docs.map((d: any) => {
                      const DocIcon = getDocTypeIcon(d.document_type);
                      const docApprovals = getDocApprovals(d.id);
                      return (
                        <Card key={d.id} className="hover-elevate" data-testid={`document-${d.id}`}>
                          <CardContent className="p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="p-2 rounded-md bg-muted flex-shrink-0">
                                <DocIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate" data-testid={`text-doc-name-${d.id}`}>{d.document_name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                  {d.document_type && <span data-testid={`text-doc-type-${d.id}`}>{d.document_type}</span>}
                                  {d.created_date && (
                                    <>
                                      <span>·</span>
                                      <span data-testid={`text-doc-date-${d.id}`}>{formatDate(d.created_date, "short")}</span>
                                    </>
                                  )}
                                  {d.uploaded_by_name && (
                                    <>
                                      <span>·</span>
                                      <span>by {d.uploaded_by_name}</span>
                                    </>
                                  )}
                                  {d.version && (
                                    <>
                                      <span>·</span>
                                      <span>v{d.version}</span>
                                    </>
                                  )}
                                  {docApprovals.length > 0 && (
                                    <>
                                      <span>·</span>
                                      <span>{docApprovals.length} review(s)</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                              <StatusBadge status={d.status} />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingDoc(d)}
                                data-testid={`button-view-${d.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {d.file_url && d.file_url !== "#" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(d)}
                                  data-testid={`button-download-${d.id}`}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {((d.status || "").toLowerCase().includes("pending")) && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => { setApprovalDialog({ doc: d, action: "approved" }); setApprovalComment(""); }}
                                    data-testid={`button-approve-${d.id}`}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setApprovalDialog({ doc: d, action: "rejected" }); setApprovalComment(""); }}
                                    data-testid={`button-reject-${d.id}`}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approvals">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : pendingApprovalDocs.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="No pending approvals"
              description="All documents have been reviewed. You're all caught up!"
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground" data-testid="text-pending-info">
                  {pendingApprovalDocs.length} document{pendingApprovalDocs.length !== 1 ? "s" : ""} require your review
                </p>
              </div>
              {pendingApprovalDocs.map((d: any) => {
                const DocIcon = getDocTypeIcon(d.document_type);
                return (
                  <Card key={d.id} data-testid={`approval-card-${d.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-md bg-muted flex-shrink-0 mt-0.5">
                            <DocIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium" data-testid={`text-approval-name-${d.id}`}>{d.document_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getProjectName(d.project_id)}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                              {d.document_type && <span>{d.document_type}</span>}
                              {d.created_date && (
                                <>
                                  <span>·</span>
                                  <span>Uploaded {formatRelativeTime(d.created_date)}</span>
                                </>
                              )}
                              {d.uploaded_by_name && (
                                <>
                                  <span>·</span>
                                  <span>by {d.uploaded_by_name}</span>
                                </>
                              )}
                            </div>
                            {d.description && (
                              <p className="text-sm mt-2">{d.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {d.file_url && d.file_url !== "#" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(d)}
                              data-testid={`button-download-approval-${d.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => { setApprovalDialog({ doc: d, action: "approved" }); setApprovalComment(""); }}
                            data-testid={`button-approve-pending-${d.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setApprovalDialog({ doc: d, action: "rejected" }); setApprovalComment(""); }}
                            data-testid={`button-reject-pending-${d.id}`}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!approvalDialog} onOpenChange={(open) => { if (!open) setApprovalDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="text-approval-dialog-title">
              {approvalDialog?.action === "approved" ? "Approve Document" : "Reject Document"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium" data-testid="text-approval-doc-name">{approvalDialog?.doc?.document_name}</p>
              <p className="text-xs text-muted-foreground">{approvalDialog?.doc?.document_type}</p>
            </div>
            <div>
              <Label htmlFor="approval-comments">Comments {approvalDialog?.action === "rejected" ? "(recommended)" : "(optional)"}</Label>
              <Textarea
                id="approval-comments"
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder={approvalDialog?.action === "rejected"
                  ? "Please explain why this document is being rejected..."
                  : "Add any comments about this approval..."}
                className="mt-1"
                data-testid="input-approval-comments"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog(null)} data-testid="button-cancel-approval">
              Cancel
            </Button>
            <Button
              onClick={handleApprovalSubmit}
              disabled={createApproval.isPending || updateDocument.isPending}
              variant={approvalDialog?.action === "approved" ? "default" : "destructive"}
              data-testid="button-confirm-approval"
            >
              {createApproval.isPending || updateDocument.isPending
                ? "Submitting..."
                : approvalDialog?.action === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="text-upload-dialog-title">Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="upload-name">Document Name</Label>
              <Input
                id="upload-name"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="e.g., Site Plan Rev 3"
                className="mt-1"
                data-testid="input-upload-name"
              />
            </div>
            <div>
              <Label htmlFor="upload-project">Project</Label>
              <Select value={uploadProject} onValueChange={setUploadProject}>
                <SelectTrigger className="mt-1" data-testid="select-upload-project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {myProjects.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="upload-category">Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger className="mt-1" data-testid="select-upload-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Drawing">Drawing</SelectItem>
                  <SelectItem value="Specification">Specification</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Permit">Permit</SelectItem>
                  <SelectItem value="Photo">Photo</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialog(false)} data-testid="button-cancel-upload">
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} data-testid="button-confirm-upload">
              <Upload className="h-4 w-4 mr-1" /> Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingDoc} onOpenChange={(open) => { if (!open) setViewingDoc(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle data-testid="text-view-dialog-title">Document Details</DialogTitle>
          </DialogHeader>
          {viewingDoc && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-muted flex-shrink-0">
                  {(() => { const Icon = getDocTypeIcon(viewingDoc.document_type); return <Icon className="h-6 w-6 text-muted-foreground" />; })()}
                </div>
                <div>
                  <p className="font-semibold text-lg" data-testid="text-view-doc-name">{viewingDoc.document_name}</p>
                  <StatusBadge status={viewingDoc.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p data-testid="text-view-doc-type">{viewingDoc.document_type || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p data-testid="text-view-doc-version">{viewingDoc.version || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Project</p>
                  <p data-testid="text-view-doc-project">{getProjectName(viewingDoc.project_id)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p data-testid="text-view-doc-uploaded">{formatDate(viewingDoc.created_date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded By</p>
                  <p>{viewingDoc.uploaded_by_name || viewingDoc.uploaded_by || "—"}</p>
                </div>
                {viewingDoc.file_size && (
                  <div>
                    <p className="text-muted-foreground">File Size</p>
                    <p>{(viewingDoc.file_size / 1024).toFixed(1)} KB</p>
                  </div>
                )}
              </div>
              {viewingDoc.description && (
                <div>
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p className="text-sm mt-1">{viewingDoc.description}</p>
                </div>
              )}
              {getDocApprovals(viewingDoc.id).length > 0 && (
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Review History</p>
                  <div className="space-y-2">
                    {getDocApprovals(viewingDoc.id).map((a: any) => (
                      <div key={a.id} className="flex items-start gap-2 text-sm">
                        {a.status === "approved" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p>
                            <span className="font-medium">{a.reviewer_name || a.reviewer_email}</span>
                            {" "}{a.status} · {formatRelativeTime(a.reviewed_at || a.created_date)}
                          </p>
                          {a.comments && <p className="text-muted-foreground">{a.comments}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {viewingDoc?.file_url && viewingDoc.file_url !== "#" && (
              <Button onClick={() => handleDownload(viewingDoc)} data-testid="button-download-view">
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewingDoc(null)} data-testid="button-close-view">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
