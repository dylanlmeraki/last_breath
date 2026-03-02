import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { createEntity } from "@/lib/apiClient";
import { queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const { data: messages, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-messages"] });
  const { data: projects } = useQuery<any[]>({ queryKey: ["/api/projects"] });

  const myProjects = (projects || []).filter((p) => p.client_email === user?.email);
  const publicMessages = (messages || []).filter((m) => !m.is_internal);

  const grouped: Record<string, any[]> = {};
  publicMessages.forEach((m) => {
    const key = m.project_id || "general";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  const getProjectName = (projectId: string) => {
    const proj = myProjects.find((p) => p.id === projectId);
    return proj?.project_name || "General";
  };

  const sendMutation = useMutation({
    mutationFn: (data: Record<string, any>) => createEntity("ProjectMessage", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-messages"] });
      setMessage("");
      toast({ title: "Message sent", description: "Your message has been sent to the team." });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({
      project_id: selectedProject || undefined,
      message: message.trim(),
      sender_email: user?.email,
      sender_name: user?.full_name,
      is_internal: false,
      created_date: new Date().toISOString(),
    });
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communication with the Pacific Engineering team" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">New Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myProjects.length > 0 && (
            <div>
              <Label htmlFor="msg-project">Project (optional)</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger data-testid="select-message-project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific project</SelectItem>
                  {myProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            data-testid="input-message"
          />
          <Button
            onClick={handleSend}
            disabled={sendMutation.isPending || !message.trim()}
            data-testid="button-send-message"
          >
            {sendMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
            Send Message
          </Button>
        </CardContent>
      </Card>

      {isLoading ? <TableSkeleton /> : publicMessages.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages" description="Messages from the PE team will appear here" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([projectId, msgs]) => (
            <div key={projectId}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {projectId === "general" ? "General" : getProjectName(projectId)}
              </h3>
              <div className="space-y-3">
                {msgs.map((m: any) => (
                  <Card key={m.id} data-testid={`message-${m.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-medium">{m.sender_name || m.sender_email}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(m.created_date, "short")}</span>
                      </div>
                      <p className="text-sm">{m.message}</p>
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
