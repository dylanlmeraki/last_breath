import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Plus, Loader2, Send } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function ClientCommunications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const { data: messages, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-messages"] });

  const sendMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/project-messages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-messages"] });
      setDialogOpen(false);
      setSubject("");
      setMessage("");
      setRecipientEmail("");
      toast({ title: "Message sent" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  return (
    <div>
      <PageHeader
        title="Client Communications"
        subtitle="Manage project messages and client conversations"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-message"><Plus className="h-4 w-4 mr-1" /> New Message</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Compose Message</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="client@company.com" data-testid="input-recipient" />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Message subject" data-testid="input-subject" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={5} data-testid="input-message-body" />
                </div>
                <Button
                  className="w-full"
                  onClick={() => sendMutation.mutate({ subject, message, sender_email: user?.email, recipient_email: recipientEmail, direction: "outbound" })}
                  disabled={sendMutation.isPending || !message || !recipientEmail}
                  data-testid="button-send-message"
                >
                  {sendMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? <TableSkeleton /> : (!messages || messages.length === 0) ? (
        <EmptyState icon={MessageSquare} title="No messages" description="Client messages will appear here" action={{ label: "Compose", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <Card key={msg.id} className="hover-elevate" data-testid={`message-card-${msg.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{msg.subject || "No subject"}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                      <span>{msg.sender_email || msg.sender_name}</span>
                      <span>{formatRelativeTime(msg.created_date)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
