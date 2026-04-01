import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building,
  MessageSquare,
  Users,
  FolderKanban,
  FileText,
  BarChart3,
  Loader2,
  Mail,
  X,
} from "lucide-react";

const STEPS = [
  { title: "Welcome", icon: Building },
  { title: "Preferences", icon: MessageSquare },
  { title: "Team", icon: Users },
  { title: "Get Started", icon: FolderKanban },
];

interface ClientOnboardingProps {
  open: boolean;
  onComplete: () => void;
}

export default function ClientOnboarding({ open, onComplete }: ClientOnboardingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState(user?.company_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [industry, setIndustry] = useState("");
  const [teamEmails, setTeamEmails] = useState<string[]>([""]);
  const [notifyProjects, setNotifyProjects] = useState(true);
  const [notifyDocuments, setNotifyDocuments] = useState(true);
  const [notifyInvoices, setNotifyInvoices] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleComplete = async () => {
    setSaving(true);
    try {
      await apiRequest("PUT", `/api/auth/me`, {
        company_name: companyName,
        phone,
        onboarding_complete: true,
      });

      const validEmails = teamEmails.filter((e) => e.trim() && e.includes("@"));
      for (const email of validEmails) {
        try {
          await apiRequest("POST", "/api/client-team-members", {
            email: email.trim(),
            role: "viewer",
            status: "pending",
            invited_by: user?.email,
            client_company: companyName || user?.company_name,
            created_by: user?.email,
          });
        } catch {}
      }

      const prefEvents = [
        { type: "project_update", enabled: notifyProjects },
        { type: "document_approval", enabled: notifyDocuments },
        { type: "invoice_reminder", enabled: notifyInvoices },
        { type: "new_message", enabled: notifyMessages },
      ];
      for (const pref of prefEvents) {
        try {
          await apiRequest("POST", "/api/notification-preferences", {
            user_email: user?.email,
            event_type: pref.type,
            channel_email: pref.enabled,
            channel_in_app: true,
            created_by: user?.email || "system",
          });
        } catch {}
      }

      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Welcome aboard!", description: "Your portal is ready to use." });
      onComplete();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Setup error", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addTeamEmail = () => setTeamEmails([...teamEmails, ""]);
  const updateTeamEmail = (idx: number, val: string) => {
    const updated = [...teamEmails];
    updated[idx] = val;
    setTeamEmails(updated);
  };
  const removeTeamEmail = (idx: number) => setTeamEmails(teamEmails.filter((_, i) => i !== idx));

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" data-testid="text-onboarding-title">
            <Building className="h-5 w-5 text-primary" />
            {STEPS[step].title}
          </DialogTitle>
          <DialogDescription>Step {step + 1} of {STEPS.length}</DialogDescription>
        </DialogHeader>

        <Progress value={progress} className="h-1.5 mb-4" data-testid="progress-onboarding" />

        <div className="flex gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-colors ${
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle2 className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4" data-testid="step-welcome">
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Welcome to Pacific Engineering</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Let's get your portal set up. This takes about 2 minutes.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                  data-testid="input-company-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  data-testid="input-phone"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-10 rounded-md border px-3 text-sm bg-background"
                  data-testid="select-industry"
                >
                  <option value="">Select your industry</option>
                  <option value="construction">Construction</option>
                  <option value="engineering">Engineering</option>
                  <option value="environmental">Environmental Services</option>
                  <option value="inspections">Inspections & Testing</option>
                  <option value="real-estate">Real Estate Development</option>
                  <option value="government">Government / Municipal</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4" data-testid="step-preferences">
            <p className="text-sm text-muted-foreground">Choose which notifications you'd like to receive:</p>
            {[
              { label: "Project Updates", desc: "Status changes, milestone completions", checked: notifyProjects, set: setNotifyProjects, icon: FolderKanban },
              { label: "Document Approvals", desc: "New documents requiring your review", checked: notifyDocuments, set: setNotifyDocuments, icon: FileText },
              { label: "Invoice Reminders", desc: "Payment due dates and receipts", checked: notifyInvoices, set: setNotifyInvoices, icon: BarChart3 },
              { label: "New Messages", desc: "Messages from your project team", checked: notifyMessages, set: setNotifyMessages, icon: MessageSquare },
            ].map((item) => (
              <Card
                key={item.label}
                className={`p-3 cursor-pointer border-2 transition-colors ${item.checked ? "border-primary bg-primary/5" : "border-transparent"}`}
                onClick={() => item.set(!item.checked)}
                data-testid={`toggle-notify-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.checked ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {item.checked && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4" data-testid="step-team">
            <p className="text-sm text-muted-foreground">
              Invite team members to collaborate on your projects. You can always do this later.
            </p>
            <div className="space-y-2">
              {teamEmails.map((email, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={email}
                    onChange={(e) => updateTeamEmail(idx, e.target.value)}
                    placeholder="colleague@company.com"
                    type="email"
                    data-testid={`input-team-email-${idx}`}
                  />
                  {teamEmails.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeTeamEmail(idx)} data-testid={`button-remove-email-${idx}`}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addTeamEmail} data-testid="button-add-team-email">
              <Mail className="h-4 w-4 mr-2" /> Add another
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4" data-testid="step-get-started">
            <div className="text-center py-2">
              <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold">You're All Set!</h3>
              <p className="text-sm text-muted-foreground mt-2">Here's what you can do in your portal:</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FolderKanban, title: "Projects", desc: "Track progress & milestones" },
                { icon: FileText, title: "Documents", desc: "Review & approve documents" },
                { icon: MessageSquare, title: "Messages", desc: "Communicate with your team" },
                { icon: BarChart3, title: "Reports", desc: "Analytics & insights" },
              ].map((item) => (
                <Card key={item.title} className="p-3 text-center">
                  <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} data-testid="button-back">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onComplete} data-testid="button-skip">
              Skip for now
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} data-testid="button-next">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={saving} data-testid="button-complete-onboarding">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Get Started
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
