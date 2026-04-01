import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  FileText, Download, Loader2, Eye, CheckCircle2,
  Clock, AlertCircle, Search,
} from "lucide-react";

interface DownloadRecord {
  id: string;
  type: string;
  label: string;
  timestamp: Date;
  status: "success" | "error";
}

export default function PDFGenerator() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("proposal");
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>([]);

  const { data: proposals, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/proposals"] });
  const { data: invoices, isLoading: li } = useQuery<any[]>({ queryKey: ["/api/invoices"] });

  const generateMutation = useMutation({
    mutationFn: async (params: { type: string; id: string; label: string }) => {
      const res = await apiRequest("POST", `/api/functions/generateProjectReport`, { project_id: params.id, report_type: params.type });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      toast({ title: "PDF generated successfully" });
      setDownloadHistory((prev) => [
        { id: crypto.randomUUID(), type: variables.type, label: variables.label, timestamp: new Date(), status: "success" },
        ...prev,
      ]);
    },
    onError: (e: any, variables) => {
      toast({ variant: "destructive", title: "Generation failed", description: e.message });
      setDownloadHistory((prev) => [
        { id: crypto.randomUUID(), type: variables.type, label: variables.label, timestamp: new Date(), status: "error" },
        ...prev,
      ]);
    },
  });

  const items = selectedType === "proposal" ? (proposals || []) : (invoices || []);
  const isLoading = lp || li;

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item: any) => {
      const label = selectedType === "proposal"
        ? (item.title || item.proposal_number || "")
        : (item.invoice_number || "");
      return label.toLowerCase().includes(q)
        || (item.client_name || "").toLowerCase().includes(q)
        || (item.status || "").toLowerCase().includes(q);
    });
  }, [items, searchQuery, selectedType]);

  const getItemLabel = (item: any) => {
    return selectedType === "proposal"
      ? (item.title || item.proposal_number || `Proposal #${item.id}`)
      : (item.invoice_number || `Invoice #${item.id}`);
  };

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((i: any) => String(i.id) === String(selectedId));
  }, [items, selectedId]);

  return (
    <div>
      <PageHeader title="PDF Generator" subtitle="Generate and download PDF documents for proposals and invoices" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-4 space-y-0">
              <CardTitle className="text-base">Select Document</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-end gap-3 flex-wrap mb-4">
                <div className="space-y-1">
                  <Label className="text-xs">Document Type</Label>
                  <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setSelectedId(""); setPreviewItem(null); }}>
                    <SelectTrigger className="w-36" data-testid="select-pdf-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={`Search ${selectedType}s...`}
                    data-testid="input-pdf-search"
                  />
                </div>
              </div>

              {isLoading ? <TableSkeleton rows={4} /> : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">{searchQuery ? "No matching documents" : `No ${selectedType}s available`}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredItems.map((item: any) => {
                    const label = getItemLabel(item);
                    const isSelected = String(item.id) === String(selectedId);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-md cursor-pointer transition-colors ${isSelected ? "bg-primary/10 border border-primary/20" : "bg-muted/30 hover-elevate"}`}
                        onClick={() => { setSelectedId(String(item.id)); setPreviewItem(item); }}
                        data-testid={`pdf-item-${item.id}`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{label}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.client_name && <span className="text-xs text-muted-foreground">{item.client_name}</span>}
                              {item.status && <Badge variant="secondary" className="text-xs">{item.status}</Badge>}
                              {selectedType === "invoice" && item.amount != null && (
                                <span className="text-xs text-muted-foreground">{formatCurrency(item.amount)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); generateMutation.mutate({ type: selectedType, id: String(item.id), label }); }}
                          disabled={generateMutation.isPending}
                          data-testid={`button-gen-${item.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="p-4 space-y-0">
              <CardTitle className="text-base">Preview & Generate</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {previewItem ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-sm">{getItemLabel(previewItem)}</p>
                    </div>
                    {previewItem.client_name && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Client:</span> {previewItem.client_name}
                      </div>
                    )}
                    {previewItem.status && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Status:</span> {previewItem.status}
                      </div>
                    )}
                    {selectedType === "proposal" && previewItem.total_amount != null && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Amount:</span> {formatCurrency(previewItem.total_amount)}
                      </div>
                    )}
                    {selectedType === "invoice" && previewItem.amount != null && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Amount:</span> {formatCurrency(previewItem.amount)}
                      </div>
                    )}
                    {previewItem.due_date && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Due:</span> {formatDate(previewItem.due_date)}
                      </div>
                    )}
                    {previewItem.description && (
                      <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded-md max-h-32 overflow-y-auto">
                        {previewItem.description}
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => generateMutation.mutate({ type: selectedType, id: String(previewItem.id), label: getItemLabel(previewItem) })}
                    disabled={generateMutation.isPending}
                    data-testid="button-generate-pdf"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate PDF
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Select a document to preview</p>
                </div>
              )}
            </CardContent>
          </Card>

          {generateMutation.isPending && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium">Generating PDF</p>
                  <p className="text-xs text-muted-foreground">This may take a moment...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {downloadHistory.length > 0 && (
        <Card>
          <CardHeader className="p-4 space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Download History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {downloadHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/30" data-testid={`history-item-${record.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {record.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{record.label}</p>
                      <p className="text-xs text-muted-foreground">{record.type} - {formatDate(record.timestamp)}</p>
                    </div>
                  </div>
                  <Badge variant={record.status === "success" ? "secondary" : "destructive"}>
                    {record.status === "success" ? "Generated" : "Failed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
