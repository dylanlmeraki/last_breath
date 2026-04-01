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
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus, Loader2 } from "lucide-react";

export default function ICPSettings() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industries, setIndustries] = useState("");
  const [companySize, setCompanySize] = useState("");

  const { data: settings, isLoading } = useQuery<any[]>({ queryKey: ["/api/icp-settings"] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/icp-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/icp-settings"] });
      setDialogOpen(false);
      setName("");
      setDescription("");
      setIndustries("");
      setCompanySize("");
      toast({ title: "ICP profile created" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  return (
    <div>
      <PageHeader
        title="ICP Settings"
        subtitle="Define your ideal customer profiles for targeted outreach"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-icp"><Plus className="h-4 w-4 mr-1" /> New Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create ICP Profile</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enterprise SaaS" data-testid="input-icp-name" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the ideal customer..." data-testid="input-icp-description" />
                </div>
                <div className="space-y-2">
                  <Label>Target Industries</Label>
                  <Input value={industries} onChange={(e) => setIndustries(e.target.value)} placeholder="Construction, Real Estate, etc." data-testid="input-icp-industries" />
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Input value={companySize} onChange={(e) => setCompanySize(e.target.value)} placeholder="50-200 employees" data-testid="input-icp-size" />
                </div>
                <Button
                  className="w-full"
                  onClick={() => createMutation.mutate({ name, description, industries: industries.split(",").map((s) => s.trim()), company_size: companySize })}
                  disabled={createMutation.isPending || !name}
                  data-testid="button-save-icp"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Profile
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? <TableSkeleton /> : (!settings || settings.length === 0) ? (
        <EmptyState icon={Target} title="No ICP profiles" description="Create ideal customer profiles to guide your outreach" action={{ label: "New Profile", onClick: () => setDialogOpen(true) }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.map((s: any) => (
            <Card key={s.id} className="hover-elevate" data-testid={`icp-card-${s.id}`}>
              <CardHeader><CardTitle className="text-base">{s.name}</CardTitle></CardHeader>
              <CardContent>
                {s.description && <p className="text-sm text-muted-foreground mb-3">{s.description}</p>}
                <div className="space-y-2 text-sm">
                  {s.industries && <div><span className="font-medium">Industries:</span> <span className="text-muted-foreground">{Array.isArray(s.industries) ? s.industries.join(", ") : s.industries}</span></div>}
                  {s.company_size && <div><span className="font-medium">Company Size:</span> <span className="text-muted-foreground">{s.company_size}</span></div>}
                  {s.revenue_range && <div><span className="font-medium">Revenue:</span> <span className="text-muted-foreground">{s.revenue_range}</span></div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
