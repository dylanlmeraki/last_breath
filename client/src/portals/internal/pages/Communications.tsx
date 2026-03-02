import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton, CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mail, FileText, Send } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function Communications() {
  const { data: messages, isLoading: lm } = useQuery<any[]>({ queryKey: ["/api/project-messages"] });
  const { data: templates, isLoading: lt } = useQuery<any[]>({ queryKey: ["/api/email-templates"] });

  const isLoading = lm || lt;

  return (
    <div>
      <PageHeader title="Communications" subtitle="Overview of messages and email templates" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard icon={MessageSquare} label="Total Messages" value={(messages || []).length} />
            <StatCard icon={Mail} label="Email Templates" value={(templates || []).length} />
            <StatCard icon={Send} label="Recent (7d)" value={(messages || []).filter((m) => { const d = new Date(m.created_date); return (Date.now() - d.getTime()) < 7 * 86400000; }).length} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Messages</CardTitle></CardHeader>
          <CardContent>
            {lm ? <TableSkeleton rows={3} /> : (!messages || messages.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 8).map((msg: any) => (
                  <div key={msg.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`comm-message-${msg.id}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{msg.subject || "No subject"}</p>
                      <p className="text-xs text-muted-foreground">{msg.sender_email || msg.sender_name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{formatRelativeTime(msg.created_date)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Email Templates</CardTitle></CardHeader>
          <CardContent>
            {lt ? <TableSkeleton rows={3} /> : (!templates || templates.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No templates created</p>
            ) : (
              <div className="space-y-3">
                {templates.slice(0, 8).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30" data-testid={`comm-template-${t.id}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.subject || "No subject"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
