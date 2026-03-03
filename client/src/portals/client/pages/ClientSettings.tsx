import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FeedbackForm } from "../components/FeedbackForm";
import { useMutation } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useClientTeamMembers,
  useNotificationPreferences,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from "../lib/useClientData";
import {
  Loader2,
  User,
  Users,
  Bell,
  Settings,
  Plus,
  Trash2,
  Mail,
  Shield,
  Lock,
  Eye,
  UserPlus,
  Save,
  AlertTriangle,
  Check,
  HelpCircle,
} from "lucide-react";

const NOTIFICATION_EVENTS = [
  { key: "project_update", label: "Project Updates", description: "When project status or progress changes" },
  { key: "document_upload", label: "Document Uploads", description: "When new documents are uploaded" },
  { key: "document_approval", label: "Document Approvals", description: "When documents need your approval" },
  { key: "invoice_created", label: "New Invoices", description: "When new invoices are created" },
  { key: "invoice_overdue", label: "Overdue Invoices", description: "When invoices become overdue" },
  { key: "proposal_sent", label: "New Proposals", description: "When proposals are sent for review" },
  { key: "milestone_complete", label: "Milestone Completion", description: "When milestones are completed" },
  { key: "message_received", label: "New Messages", description: "When you receive new messages" },
  { key: "change_order", label: "Change Orders", description: "When change orders need approval" },
  { key: "rfi_update", label: "RFI Updates", description: "When RFIs are answered or updated" },
];

const TEAM_ROLES = [
  { value: "viewer", label: "Viewer", description: "Can view projects, documents, and invoices" },
  { value: "collaborator", label: "Collaborator", description: "Can view and comment on projects and documents" },
  { value: "manager", label: "Manager", description: "Full access including approvals and team management" },
];

export default function ClientSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, team, and preferences" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList data-testid="settings-tabs">
          <TabsTrigger value="account" data-testid="tab-account">
            <User className="h-4 w-4 mr-1.5" />
            Account
          </TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team">
            <Users className="h-4 w-4 mr-1.5" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="h-4 w-4 mr-1.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="workflow" data-testid="tab-workflow">
            <Settings className="h-4 w-4 mr-1.5" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="feedback" data-testid="tab-feedback">
            <HelpCircle className="h-4 w-4 mr-1.5" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettingsTab />
        </TabsContent>
        <TabsContent value="team">
          <TeamManagementTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="workflow">
          <WorkflowTab />
        </TabsContent>
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Send Feedback</CardTitle>
              <CardDescription>Help us improve your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AccountSettingsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      setCompanyName(user.company_name || "");
      setTitle(user.title || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await apiRequest("PUT", "/api/auth/me", data);
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      toast({ title: "Profile updated", description: "Your profile has been saved." });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      const res = await apiRequest("PUT", "/api/auth/change-password", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Password changed", description: "Your password has been updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      full_name: fullName,
      phone,
      company_name: companyName,
      title,
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      toast({ variant: "destructive", title: "Error", description: "Password must be at least 8 characters." });
      return;
    }
    changePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal and company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              value={user?.email || ""}
              disabled
              data-testid="input-settings-email"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-name">Full Name</Label>
              <Input
                id="settings-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                data-testid="input-settings-name"
              />
            </div>
            <div>
              <Label htmlFor="settings-title">Title / Role</Label>
              <Input
                id="settings-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Project Manager"
                data-testid="input-settings-title"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-phone">Phone</Label>
              <Input
                id="settings-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                data-testid="input-settings-phone"
              />
            </div>
            <div>
              <Label htmlFor="settings-company">Company</Label>
              <Input
                id="settings-company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name"
                data-testid="input-settings-company"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={updateProfileMutation.isPending}
            data-testid="button-save-profile"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              data-testid="input-current-password"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                data-testid="input-new-password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                data-testid="input-confirm-password"
              />
            </div>
          </div>
          {newPassword && newPassword.length < 8 && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Password must be at least 8 characters
            </p>
          )}
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Passwords do not match
            </p>
          )}
          <Button
            onClick={handleChangePassword}
            disabled={
              changePasswordMutation.isPending ||
              !currentPassword ||
              !newPassword ||
              newPassword !== confirmPassword ||
              newPassword.length < 8
            }
            variant="outline"
            data-testid="button-change-password"
          >
            {changePasswordMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamManagementTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: teamMembers, isLoading } = useClientTeamMembers();
  const createMember = useCreateEntity("client-team-members");
  const updateMember = useUpdateEntity("client-team-members");
  const deleteMember = useDeleteEntity("client-team-members");

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");

  const handleInvite = () => {
    if (!inviteEmail) return;
    createMember.mutate(
      {
        email: inviteEmail,
        name: inviteName || inviteEmail,
        role: inviteRole,
        status: "invited",
        invited_by: user?.email,
        client_company: user?.company_name || "",
        permissions: getDefaultPermissions(inviteRole),
      },
      {
        onSuccess: () => {
          toast({ title: "Invite sent", description: `Invitation sent to ${inviteEmail}` });
          setShowInviteDialog(false);
          setInviteEmail("");
          setInviteName("");
          setInviteRole("viewer");
          queryClient.invalidateQueries({ queryKey: ["/api/client-team-members"] });
        },
        onError: (e: any) => {
          toast({ variant: "destructive", title: "Error", description: e.message });
        },
      }
    );
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    updateMember.mutate(
      { id: memberId, data: { role: newRole, permissions: getDefaultPermissions(newRole) } },
      {
        onSuccess: () => {
          toast({ title: "Role updated" });
          queryClient.invalidateQueries({ queryKey: ["/api/client-team-members"] });
        },
      }
    );
  };

  const handleRevoke = (memberId: string) => {
    deleteMember.mutate(memberId, {
      onSuccess: () => {
        toast({ title: "Access revoked" });
        queryClient.invalidateQueries({ queryKey: ["/api/client-team-members"] });
      },
    });
  };

  function getDefaultPermissions(role: string) {
    switch (role) {
      case "viewer":
        return { view_projects: true, view_documents: true, view_invoices: true, approve: false, manage_team: false };
      case "collaborator":
        return { view_projects: true, view_documents: true, view_invoices: true, approve: false, manage_team: false, comment: true };
      case "manager":
        return { view_projects: true, view_documents: true, view_invoices: true, approve: true, manage_team: true, comment: true };
      default:
        return { view_projects: true };
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-10 w-40" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </CardTitle>
            <CardDescription>Manage who has access to your portal</CardDescription>
          </div>
          <Button onClick={() => setShowInviteDialog(true)} data-testid="button-invite-member">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          {(!teamMembers || teamMembers.length === 0) ? (
            <EmptyState
              icon={Users}
              title="No team members yet"
              description="Invite team members to collaborate on projects and share access to your portal."
              action={{ label: "Invite Member", onClick: () => setShowInviteDialog(true) }}
            />
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-md border flex-wrap"
                  data-testid={`team-member-${member.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate" data-testid={`text-member-name-${member.id}`}>
                        {member.name || member.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" data-testid={`text-member-email-${member.id}`}>
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={member.status} />
                    <Select
                      value={member.role || "viewer"}
                      onValueChange={(val) => handleRoleChange(member.id, val)}
                    >
                      <SelectTrigger className="w-[140px]" data-testid={`select-role-${member.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEAM_ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRevoke(member.id)}
                      data-testid={`button-revoke-${member.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role Permissions
          </CardTitle>
          <CardDescription>Overview of what each role can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TEAM_ROLES.map((role) => (
              <div key={role.value} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">{role.label}</Badge>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                data-testid="input-invite-email"
              />
            </div>
            <div>
              <Label htmlFor="invite-name">Name (optional)</Label>
              <Input
                id="invite-name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Full name"
                data-testid="input-invite-name"
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger data-testid="select-invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div>
                        <span className="font-medium">{r.label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{r.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)} data-testid="button-cancel-invite">
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail || createMember.isPending}
              data-testid="button-send-invite"
            >
              {createMember.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NotificationsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: preferences, isLoading } = useNotificationPreferences();
  const createPref = useCreateEntity("notification-preferences");
  const updatePref = useUpdateEntity("notification-preferences");

  const [localPrefs, setLocalPrefs] = useState<Record<string, { email: boolean; in_app: boolean; id?: string }>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (preferences) {
      const map: Record<string, { email: boolean; in_app: boolean; id?: string }> = {};
      NOTIFICATION_EVENTS.forEach((evt) => {
        const existing = preferences.find((p: any) => p.event_type === evt.key);
        if (existing) {
          map[evt.key] = {
            email: existing.email_enabled !== false,
            in_app: existing.in_app_enabled !== false,
            id: existing.id,
          };
        } else {
          map[evt.key] = { email: true, in_app: true };
        }
      });
      setLocalPrefs(map);
    }
  }, [preferences]);

  const togglePref = (eventKey: string, channel: "email" | "in_app") => {
    setLocalPrefs((prev) => ({
      ...prev,
      [eventKey]: {
        ...prev[eventKey],
        [channel]: !prev[eventKey]?.[channel],
      },
    }));
    setHasChanges(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const promises = Object.entries(localPrefs).map(async ([eventKey, pref]) => {
        const payload = {
          user_email: user?.email,
          event_type: eventKey,
          channel: "all",
          email_enabled: pref.email,
          in_app_enabled: pref.in_app,
          enabled: pref.email || pref.in_app,
        };
        if (pref.id) {
          const res = await apiRequest("PUT", `/api/notification-preferences/${pref.id}`, payload);
          return res.json();
        } else {
          const res = await apiRequest("POST", "/api/notification-preferences", payload);
          return res.json();
        }
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({ title: "Preferences saved", description: "Your notification preferences have been updated." });
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/notification-preferences"] });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose how you want to be notified about different events</CardDescription>
          </div>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!hasChanges || saveMutation.isPending}
            data-testid="button-save-notifications"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Preferences
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b">
              <span className="text-sm font-medium">Event</span>
              <div className="flex items-center gap-6">
                <span className="text-xs font-medium text-muted-foreground w-14 text-center">Email</span>
                <span className="text-xs font-medium text-muted-foreground w-14 text-center">In-App</span>
              </div>
            </div>
            {NOTIFICATION_EVENTS.map((evt) => {
              const pref = localPrefs[evt.key] || { email: true, in_app: true };
              return (
                <div
                  key={evt.key}
                  className="flex items-center justify-between gap-4 py-3"
                  data-testid={`notification-row-${evt.key}`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{evt.label}</p>
                    <p className="text-xs text-muted-foreground">{evt.description}</p>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="w-14 flex justify-center">
                      <Switch
                        checked={pref.email}
                        onCheckedChange={() => togglePref(evt.key, "email")}
                        data-testid={`switch-email-${evt.key}`}
                      />
                    </div>
                    <div className="w-14 flex justify-center">
                      <Switch
                        checked={pref.in_app}
                        onCheckedChange={() => togglePref(evt.key, "in_app")}
                        data-testid={`switch-inapp-${evt.key}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WorkflowTab() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [autoApproveThreshold, setAutoApproveThreshold] = useState("0");
  const [autoApproveDocuments, setAutoApproveDocuments] = useState(false);
  const [escalationDays, setEscalationDays] = useState("3");
  const [autoReminderInvoices, setAutoReminderInvoices] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState("3");

  useEffect(() => {
    if (user?.notification_preferences) {
      const prefs = user.notification_preferences as any;
      if (prefs.auto_approve_threshold) setAutoApproveThreshold(String(prefs.auto_approve_threshold));
      if (prefs.auto_approve_documents != null) setAutoApproveDocuments(prefs.auto_approve_documents);
      if (prefs.escalation_days) setEscalationDays(String(prefs.escalation_days));
      if (prefs.auto_reminder_invoices != null) setAutoReminderInvoices(prefs.auto_reminder_invoices);
      if (prefs.reminder_days_before) setReminderDaysBefore(String(prefs.reminder_days_before));
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const existingPrefs = (user?.notification_preferences as any) || {};
      const res = await apiRequest("PUT", "/api/auth/me", {
        notification_preferences: {
          ...existingPrefs,
          auto_approve_threshold: parseFloat(autoApproveThreshold) || 0,
          auto_approve_documents: autoApproveDocuments,
          escalation_days: parseInt(escalationDays) || 3,
          auto_reminder_invoices: autoReminderInvoices,
          reminder_days_before: parseInt(reminderDaysBefore) || 3,
        },
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      toast({ title: "Workflow settings saved", description: "Your automation preferences have been updated." });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Auto-Approval Settings
          </CardTitle>
          <CardDescription>Configure automatic approval thresholds to streamline your workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="auto-approve-threshold">Change Order Auto-Approve Threshold ($)</Label>
            <Input
              id="auto-approve-threshold"
              type="number"
              min="0"
              value={autoApproveThreshold}
              onChange={(e) => setAutoApproveThreshold(e.target.value)}
              placeholder="0 = disabled"
              data-testid="input-auto-approve-threshold"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Change orders below this amount will be auto-approved. Set to 0 to disable.
            </p>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Auto-Approve Documents</p>
              <p className="text-xs text-muted-foreground">Automatically approve documents that don't require review</p>
            </div>
            <Switch
              checked={autoApproveDocuments}
              onCheckedChange={setAutoApproveDocuments}
              data-testid="switch-auto-approve-docs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Escalation Rules
          </CardTitle>
          <CardDescription>Set up automatic escalation for pending items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="escalation-days">Escalation After (days)</Label>
            <Input
              id="escalation-days"
              type="number"
              min="1"
              max="30"
              value={escalationDays}
              onChange={(e) => setEscalationDays(e.target.value)}
              data-testid="input-escalation-days"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Items pending approval for longer than this will trigger an escalation notification.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Invoice Reminders
          </CardTitle>
          <CardDescription>Manage invoice payment reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Automatic Reminders</p>
              <p className="text-xs text-muted-foreground">Get reminded about upcoming invoice due dates</p>
            </div>
            <Switch
              checked={autoReminderInvoices}
              onCheckedChange={setAutoReminderInvoices}
              data-testid="switch-auto-reminder-invoices"
            />
          </div>
          {autoReminderInvoices && (
            <div>
              <Label htmlFor="reminder-days">Remind Before Due Date (days)</Label>
              <Input
                id="reminder-days"
                type="number"
                min="1"
                max="14"
                value={reminderDaysBefore}
                onChange={(e) => setReminderDaysBefore(e.target.value)}
                data-testid="input-reminder-days"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        data-testid="button-save-workflow"
      >
        {saveMutation.isPending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Workflow Settings
      </Button>
    </div>
  );
}
