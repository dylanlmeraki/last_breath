import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { listEntities, createEntity } from "@/lib/apiClient";
import { queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Plus, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientRFIs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [priority, setPriority] = useState("medium");

  const { data: rfis, isLoading } = useQuery<any[]>({
    queryKey: ["/api/rfis"],
    queryFn: () => listEntities("Rfi"),
  });

  const myRfis = (rfis || []).filter(
    (r) => r.submitted_by === user?.email || r.client_email === user?.email
  );

  const createMutation = useMutation({
    mutationFn: (data: Record<string, any>) => createEntity("Rfi", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rfis"] });
      setOpen(false);
      setSubject("");
      setQuestion("");
      setPriority("medium");
      toast({ title: "RFI submitted", description: "Your RFI has been submitted successfully." });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const handleSubmit = () => {
    if (!subject.trim() || !question.trim()) return;
    createMutation.mutate({
      subject,
      question,
      priority,
      submitted_by: user?.email,
      client_email: user?.email,
      status: "open",
      created_date: new Date().toISOString(),
    });
  };

  return (
    <div>
      <PageHeader
        title="RFIs"
        subtitle="Request for Information"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-rfi">
                <Plus className="h-4 w-4 mr-1" /> New RFI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit New RFI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="rfi-subject">Subject</Label>
                  <Input
                    id="rfi-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief subject line"
                    data-testid="input-rfi-subject"
                  />
                </div>
                <div>
                  <Label htmlFor="rfi-question">Question</Label>
                  <Textarea
                    id="rfi-question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Describe your question in detail"
                    rows={4}
                    data-testid="input-rfi-question"
                  />
                </div>
                <div>
                  <Label htmlFor="rfi-priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger data-testid="select-rfi-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || !subject.trim() || !question.trim()}
                  className="w-full"
                  data-testid="button-submit-rfi"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Submit RFI
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <TableSkeleton />
      ) : myRfis.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No RFIs"
          description="Submit a Request for Information to get answers from the engineering team"
          action={{ label: "New RFI", onClick: () => setOpen(true) }}
        />
      ) : (
        <div className="space-y-3">
          {myRfis.map((rfi: any) => (
            <Card key={rfi.id} className="hover-elevate" data-testid={`rfi-${rfi.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{rfi.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{rfi.question}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span>Priority: {rfi.priority || "medium"}</span>
                      <span>{formatDate(rfi.created_date, "short")}</span>
                    </div>
                    {rfi.answer && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Response</p>
                        <p className="text-sm">{rfi.answer}</p>
                      </div>
                    )}
                  </div>
                  <StatusBadge status={rfi.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
