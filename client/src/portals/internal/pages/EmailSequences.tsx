import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mail, Users } from "lucide-react";

export default function EmailSequences() {
  const { data: sequences, isLoading } = useQuery<any[]>({ queryKey: ["/api/email-sequences"] });

  return (
    <div>
      <PageHeader title="Email Sequences" subtitle="Manage automated email outreach sequences" />

      {isLoading ? <TableSkeleton /> : (!sequences || sequences.length === 0) ? (
        <EmptyState icon={Mail} title="No sequences" description="Create email sequences for automated outreach" />
      ) : (
        <div className="space-y-3">
          {sequences.map((seq: any) => (
            <Card key={seq.id} className="hover-elevate" data-testid={`sequence-card-${seq.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{seq.name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{seq.prospect_count || 0} prospects</span>
                    <span>{(seq.steps as any[])?.length || 0} steps</span>
                  </div>
                </div>
                <Badge variant={seq.active ? "default" : "secondary"}>{seq.active ? "Active" : "Inactive"}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
