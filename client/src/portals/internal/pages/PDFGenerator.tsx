import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Loader2 } from "lucide-react";

export default function PDFGenerator() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("proposal");
  const [selectedId, setSelectedId] = useState("");

  const { data: proposals, isLoading: lp } = useQuery<any[]>({ queryKey: ["/api/proposals"] });
  const { data: invoices, isLoading: li } = useQuery<any[]>({ queryKey: ["/api/invoices"] });

  const generateMutation = useMutation({
    mutationFn: async (params: { type: string; id: string }) => {
      const res = await apiRequest("POST", `/api/functions/generateProjectReport`, { project_id: params.id, report_type: params.type });
      return res.json();
    },
    onSuccess: () => toast({ title: "PDF generated successfully" }),
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const items = selectedType === "proposal" ? (proposals || []) : (invoices || []);
  const isLoading = lp || li;

  return (
    <div>
      <PageHeader title="PDF Generator" subtitle="Generate PDF documents for proposals and invoices" />

      <Card className="mb-6">
        <CardHeader><CardTitle>Generate Document</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setSelectedId(""); }}>
                <SelectTrigger data-testid="select-pdf-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select {selectedType === "proposal" ? "Proposal" : "Invoice"}</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger data-testid="select-pdf-item"><SelectValue placeholder={`Select ${selectedType}`} /></SelectTrigger>
                <SelectContent>
                  {items.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {selectedType === "proposal" ? (item.title || item.proposal_number || item.id) : (item.invoice_number || item.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                className="w-full"
                onClick={() => generateMutation.mutate({ type: selectedType, id: selectedId })}
                disabled={generateMutation.isPending || !selectedId}
                data-testid="button-generate-pdf"
              >
                {generateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Generate PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Available Documents</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton rows={3} /> : items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No {selectedType}s available</p>
          ) : (
            <div className="space-y-2">
              {items.slice(0, 10).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`pdf-item-${item.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm font-medium truncate">
                      {selectedType === "proposal" ? (item.title || item.proposal_number) : item.invoice_number}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedId(item.id); generateMutation.mutate({ type: selectedType, id: item.id }); }}
                    disabled={generateMutation.isPending}
                    data-testid={`button-gen-${item.id}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
