import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientMessages() {
  const { user } = useAuth();
  const { data: messages, isLoading } = useQuery<any[]>({ queryKey: ["/api/project-messages"] });

  const publicMessages = (messages || []).filter((m) => !m.is_internal);

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communication with the Pacific Engineering team" />

      {isLoading ? <TableSkeleton /> : publicMessages.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages" description="Messages from the PE team will appear here" />
      ) : (
        <div className="space-y-3">
          {publicMessages.map((m: any) => (
            <Card key={m.id} data-testid={`message-${m.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">{m.sender_name || m.sender_email}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(m.created_date, "short")}</span>
                </div>
                <p className="text-sm">{m.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
