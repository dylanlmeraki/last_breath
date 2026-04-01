import { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useClientProjects, useClientMessages, useSendMessage } from "@/portals/client/lib/useClientData";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchInput } from "@/components/shared/SearchInput";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  MessageSquare, Send, Loader2, Plus, Paperclip,
  Circle, FolderOpen, Search, ChevronRight, Clock
} from "lucide-react";
import { formatRelativeTime, getInitials, cn } from "@/lib/utils";

export default function ClientMessages() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: projects, isLoading: projectsLoading } = useClientProjects();
  const myProjects = projects || [];
  const projectIds = useMemo(() => myProjects.map((p: any) => p.id), [myProjects]);
  const { data: allMessages, isLoading: messagesLoading } = useClientMessages(projectIds);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeProjectId, setComposeProjectId] = useState("");
  const [composeMessage, setComposeMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = useSendMessage();

  const publicMessages = useMemo(() => {
    return (allMessages || []).filter((m: any) => !m.is_internal);
  }, [allMessages]);

  const projectMessageCounts = useMemo(() => {
    const counts: Record<string, { total: number; unread: number }> = {};
    publicMessages.forEach((m: any) => {
      const pid = m.project_id;
      if (!counts[pid]) counts[pid] = { total: 0, unread: 0 };
      counts[pid].total++;
      const readBy = Array.isArray(m.read_by) ? m.read_by : [];
      if (!readBy.includes(user?.email)) {
        counts[pid].unread++;
      }
    });
    return counts;
  }, [publicMessages, user?.email]);

  const totalUnread = useMemo(() => {
    return Object.values(projectMessageCounts).reduce((acc, c) => acc + c.unread, 0);
  }, [projectMessageCounts]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return myProjects;
    const q = searchQuery.toLowerCase();
    return myProjects.filter((p: any) =>
      p.project_name?.toLowerCase().includes(q) ||
      p.project_number?.toLowerCase().includes(q)
    );
  }, [myProjects, searchQuery]);

  const threadMessages = useMemo(() => {
    if (!selectedProjectId) return [];
    return publicMessages
      .filter((m: any) => m.project_id === selectedProjectId)
      .sort((a: any, b: any) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
  }, [publicMessages, selectedProjectId]);

  const selectedProject = useMemo(() => {
    return myProjects.find((p: any) => p.id === selectedProjectId);
  }, [myProjects, selectedProjectId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [threadMessages.length]);

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedProjectId) return;
    sendMessage.mutate(
      {
        project_id: selectedProjectId,
        message: replyText.trim(),
        sender_email: user?.email || "",
        sender_name: user?.full_name || "",
        message_type: "client",
      },
      {
        onSuccess: () => {
          setReplyText("");
          toast({ title: "Message sent", description: "Your reply has been sent." });
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message || "Failed to send message" });
        },
      }
    );
  };

  const handleComposeSubmit = () => {
    if (!composeMessage.trim() || !composeProjectId) return;
    sendMessage.mutate(
      {
        project_id: composeProjectId,
        message: composeMessage.trim(),
        sender_email: user?.email || "",
        sender_name: user?.full_name || "",
        message_type: "client",
      },
      {
        onSuccess: () => {
          setComposeMessage("");
          setComposeProjectId("");
          setComposeOpen(false);
          setSelectedProjectId(composeProjectId);
          toast({ title: "Message sent", description: "Your message has been sent." });
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message || "Failed to send message" });
        },
      }
    );
  };

  const isLoading = projectsLoading || messagesLoading;

  const isOwnMessage = (msg: any) => msg.sender_email === user?.email;

  const getLastMessage = (projectId: string) => {
    const msgs = publicMessages
      .filter((m: any) => m.project_id === projectId)
      .sort((a: any, b: any) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
    return msgs[0] || null;
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Messages" subtitle="Communication with the Pacific Engineering team" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div data-testid="page-messages">
      <PageHeader
        title="Messages"
        subtitle="Communication with the Pacific Engineering team"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {totalUnread > 0 && (
              <Badge variant="secondary" data-testid="badge-unread-count">
                {totalUnread} unread
              </Badge>
            )}
            <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-compose-message">
                  <Plus className="h-4 w-4 mr-1" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="compose-project">Project</Label>
                    <Select value={composeProjectId} onValueChange={setComposeProjectId}>
                      <SelectTrigger data-testid="select-compose-project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {myProjects.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="compose-message">Message</Label>
                    <Textarea
                      id="compose-message"
                      value={composeMessage}
                      onChange={(e) => setComposeMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={4}
                      data-testid="input-compose-message"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setComposeOpen(false)}
                      data-testid="button-cancel-compose"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleComposeSubmit}
                      disabled={sendMessage.isPending || !composeMessage.trim() || !composeProjectId}
                      data-testid="button-send-compose"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-1" />
                      )}
                      Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {myProjects.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No projects yet"
          description="Messages will appear here once you have active projects."
        />
      ) : (
        <div className="flex gap-4 h-[calc(100vh-14rem)]">
          <Card className="w-80 flex-shrink-0 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
            </CardHeader>
            <div className="px-4 pb-2">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search projects..."
              />
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4" data-testid="text-no-projects-found">
                    No projects found
                  </p>
                ) : (
                  filteredProjects.map((project: any) => {
                    const counts = projectMessageCounts[project.id];
                    const lastMsg = getLastMessage(project.id);
                    const isSelected = selectedProjectId === project.id;
                    const unread = counts?.unread || 0;

                    return (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                        className={cn(
                          "w-full text-left rounded-md p-3 mb-1 transition-colors",
                          isSelected
                            ? "bg-accent"
                            : "hover-elevate"
                        )}
                        data-testid={`button-project-thread-${project.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {unread > 0 && (
                                <Circle className="h-2 w-2 fill-blue-500 text-blue-500 flex-shrink-0" />
                              )}
                              <span className={cn(
                                "text-sm truncate block",
                                unread > 0 ? "font-semibold" : "font-medium"
                              )}>
                                {project.project_name}
                              </span>
                            </div>
                            {lastMsg && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {lastMsg.sender_name ? `${lastMsg.sender_name}: ` : ""}
                                {lastMsg.message}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {lastMsg && (
                              <span className="text-[10px] text-muted-foreground">
                                {formatRelativeTime(lastMsg.created_date)}
                              </span>
                            )}
                            {unread > 0 && (
                              <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                {unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Card>

          <Card className="flex-1 flex flex-col min-w-0">
            {!selectedProjectId ? (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={MessageSquare}
                  title="Select a project"
                  description="Choose a project from the sidebar to view messages"
                />
              </div>
            ) : (
              <>
                <CardHeader className="flex-shrink-0 border-b">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <CardTitle className="text-base truncate" data-testid="text-thread-project-name">
                          {selectedProject?.project_name}
                        </CardTitle>
                        {selectedProject?.project_number && (
                          <p className="text-xs text-muted-foreground" data-testid="text-thread-project-number">
                            {selectedProject.project_number}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" data-testid="badge-message-count">
                      {threadMessages.length} message{threadMessages.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {threadMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground" data-testid="text-no-messages">
                          No messages yet. Start the conversation below.
                        </p>
                      </div>
                    ) : (
                      threadMessages.map((msg: any) => {
                        const own = isOwnMessage(msg);
                        const hasAttachments = msg.attachments && (
                          Array.isArray(msg.attachments) ? msg.attachments.length > 0 : Object.keys(msg.attachments).length > 0
                        );

                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-3",
                              own ? "flex-row-reverse" : "flex-row"
                            )}
                            data-testid={`message-${msg.id}`}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {getInitials(msg.sender_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                              "max-w-[70%] min-w-0",
                              own ? "items-end" : "items-start"
                            )}>
                              <div className={cn(
                                "flex items-center gap-2 mb-1 flex-wrap",
                                own ? "justify-end" : "justify-start"
                              )}>
                                <span className="text-xs font-medium" data-testid={`text-sender-${msg.id}`}>
                                  {own ? "You" : (msg.sender_name || msg.sender_email)}
                                </span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatRelativeTime(msg.created_date)}
                                </span>
                              </div>
                              <div className={cn(
                                "rounded-md p-3 text-sm",
                                own
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}>
                                <p className="whitespace-pre-wrap break-words" data-testid={`text-message-body-${msg.id}`}>
                                  {msg.message}
                                </p>
                              </div>
                              {hasAttachments && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                  <Paperclip className="h-3 w-3" />
                                  <span data-testid={`text-attachments-${msg.id}`}>
                                    {Array.isArray(msg.attachments) ? msg.attachments.length : 1} attachment{Array.isArray(msg.attachments) && msg.attachments.length !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <Separator />
                <div className="p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={2}
                      className="resize-none flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      data-testid="input-reply-message"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendReply}
                      disabled={sendMessage.isPending || !replyText.trim()}
                      data-testid="button-send-reply"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
