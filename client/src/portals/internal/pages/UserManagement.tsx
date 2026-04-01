import { useState } from "react";
import { listEntities, createEntity, updateEntity } from "@/lib/apiClient";
import { sendEmail } from "@/lib/integrationsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Activity,
  UserX,
  Copy,
  Building2,
  Clock,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuth();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [revokeUser, setRevokeUser] = useState<any>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [showInviteClientDialog, setShowInviteClientDialog] = useState(false);
  const [clientInviteEmail, setClientInviteEmail] = useState("");
  const [clientCompanyName, setClientCompanyName] = useState("");
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => listEntities('User', '-created_date', 100),
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => listEntities('AuditLog', '-created_date', 200),
  });

  const { data: clientInvites = [] } = useQuery({
    queryKey: ['client-invites-all'],
    queryFn: () => listEntities('ClientInvite', '-created_date', 100),
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      return await updateEntity('User', userId, updates);
    },
    onSuccess: async (updatedUser: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      
      await createEntity('AuditLog', {
        actor_email: currentUser?.email,
        actor_name: currentUser?.full_name,
        action: variables.updates.role ? "role_changed" : "user_updated",
        resource_type: "User",
        resource_id: variables.userId,
        resource_name: updatedUser.full_name,
        details: variables.updates.role ? `Changed role to ${variables.updates.role}` : "User updated"
      });
      
      setShowEditDialog(false);
      setEditingUser(null);
    }
  });

  const inviteUserMutation = useMutation({
    mutationFn: async ({ email, name, role }: { email: string; name: string; role: string }) => {
      const inviteLink = `${window.location.origin}/internal/auth?invite=true&email=${encodeURIComponent(email)}`;
      
      await sendEmail({
        to: email,
        from_name: "Pacific Engineering",
        subject: "You've been invited to Pacific Engineering Portal",
        body: `
          <h2>Welcome to Pacific Engineering</h2>
          <p>Hi ${name},</p>
          <p>You've been invited to join the Pacific Engineering internal portal.</p>
          <p><strong>Your Role:</strong> ${role}</p>
          <p><a href="${inviteLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a></p>
          <p>This link will allow you to create your account and access the portal.</p>
        `
      });

      return { email, name, role };
    },
    onSuccess: async (data) => {
      await createEntity('AuditLog', {
        actor_email: currentUser?.email,
        actor_name: currentUser?.full_name,
        action: "user_created",
        resource_type: "User",
        resource_name: data.name,
        details: `Invited ${data.email} with role ${data.role}`
      });

      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      setShowInviteDialog(false);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("user");
    }
  });

  const inviteClientMutation = useMutation({
    mutationFn: async ({ email, companyName }: { email: string; companyName: string }) => {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      
      const invite = await createEntity('ClientInvite', {
        invite_token: token,
        email: email.toLowerCase(),
        company_name: companyName,
        invited_by_email: currentUser?.email,
        invited_by_name: currentUser?.full_name,
        expires_at: expiresAt,
        used: false
      });

      const inviteUrl = `${window.location.origin}/portal/register?token=${token}`;
      
      await sendEmail({
        to: email,
        from_name: "Pacific Engineering",
        subject: "You're invited to Pacific Engineering Client Portal",
        body: `
          <h2>Welcome to Pacific Engineering Client Portal</h2>
          <p>Hello,</p>
          <p>You've been invited to join the Pacific Engineering Client Portal.</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><a href="${inviteUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Create Your Account</a></p>
          <p>This invitation expires in 72 hours.</p>
          <p>Best regards,<br>Pacific Engineering Team</p>
        `
      });

      return invite;
    },
    onSuccess: async (invite: any) => {
      await createEntity('AuditLog', {
        actor_email: currentUser?.email,
        actor_name: currentUser?.full_name,
        action: "user_created",
        resource_type: "ClientInvite",
        resource_name: invite.email,
        details: `Sent client portal invitation to ${invite.email} for ${invite.company_name}`
      });

      queryClient.invalidateQueries({ queryKey: ['client-invites-all'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      setShowInviteClientDialog(false);
      setClientInviteEmail("");
      setClientCompanyName("");
    }
  });

  const revokeAccessMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      await updateEntity('User', userId, { role: "revoked" });
      return { userId, reason };
    },
    onSuccess: async (data) => {
      const revokedUser = users.find((u: any) => u.id === data.userId);
      
      await createEntity('AuditLog', {
        actor_email: currentUser?.email,
        actor_name: currentUser?.full_name,
        action: "user_deleted",
        resource_type: "User",
        resource_id: data.userId,
        resource_name: revokedUser?.full_name,
        details: `Access revoked. Reason: ${data.reason}`
      });

      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      setShowRevokeDialog(false);
      setRevokeUser(null);
      setRevokeReason("");
    }
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    const adminCount = users.filter((u: any) => u.role === "admin").length;
    const targetUser = users.find((u: any) => u.id === userId);
    
    if (targetUser?.role === "admin" && newRole !== "admin" && adminCount === 1) {
      alert("Cannot change the role of the last admin user.");
      return;
    }

    updateUserMutation.mutate({ userId, updates: { role: newRole } });
  };

  const filteredUsers = users.filter((user: any) => {
    if (user.role === "revoked") return false;
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  const filteredAuditLogs = auditLogs.filter((log: any) => {
    const query = searchQuery.toLowerCase();
    return (
      log.actor_name?.toLowerCase().includes(query) ||
      log.action?.toLowerCase().includes(query) ||
      log.resource_name?.toLowerCase().includes(query)
    );
  });

  const copyInviteLink = (invite: any) => {
    const link = `${window.location.origin}/portal/register?token=${invite.invite_token}`;
    navigator.clipboard.writeText(link);
  };

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    staff: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    user: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  };

  return (
    <div className="py-6 lg:py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3" data-testid="text-user-management-title">
              <Users className="w-10 h-10 text-blue-600" />
              User Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage user accounts, roles, permissions, and client access
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setShowInviteClientDialog(true)}
              data-testid="button-invite-client"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Invite Client
            </Button>
            <Button
              onClick={() => setShowInviteDialog(true)}
              data-testid="button-invite-user"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-4" data-testid="stat-total-users">
          <div className="text-2xl font-bold">{filteredUsers.length}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">
            {users.filter((u: any) => u.role === "admin").length}
          </div>
          <div className="text-sm text-muted-foreground">Admins</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {users.filter((u: any) => u.role === "user").length}
          </div>
          <div className="text-sm text-muted-foreground">Regular Users</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {clientInvites.filter((i: any) => i.used).length}
          </div>
          <div className="text-sm text-muted-foreground">Client Accounts</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {users.filter((u: any) => u.created_date && 
              new Date(u.created_date) > new Date(Date.now() - 7*24*60*60*1000)).length}
          </div>
          <div className="text-sm text-muted-foreground">New (7 days)</div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="users" data-testid="tab-users">Internal Users</TabsTrigger>
          <TabsTrigger value="clients" data-testid="tab-clients">Client Portal Accounts</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-users"
                />
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-accent/50 transition-colors" data-testid={`user-row-${user.id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.full_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={roleColors[user.role] || roleColors.user}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">
                          {formatDate(user.created_date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUser(user);
                                setShowEditDialog(true);
                              }}
                              data-testid={`button-edit-user-${user.id}`}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRevokeUser(user);
                                setShowRevokeDialog(true);
                              }}
                              data-testid={`button-revoke-user-${user.id}`}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Revoke
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Client Portal Invitations</h3>
            {clientInvites.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No client invitations sent yet
              </div>
            ) : (
              <div className="space-y-3">
                {clientInvites.map((invite: any) => (
                  <div key={invite.id} className="border rounded-lg p-4 flex items-center justify-between gap-1 flex-wrap" data-testid={`client-invite-${invite.id}`}>
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-muted-foreground">{invite.company_name}</p>
                      <p className="text-xs text-muted-foreground">Invited by {invite.invited_by_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={invite.used ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}>
                        {invite.used ? "Accepted" : "Pending"}
                      </Badge>
                      {!invite.used && (
                        <Button size="sm" variant="outline" onClick={() => copyInviteLink(invite)} data-testid={`button-copy-link-${invite.id}`}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Link
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search activity logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-activity"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredAuditLogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No activity logs found
                </div>
              ) : (
                filteredAuditLogs.slice(0, 50).map((log: any) => (
                  <div key={log.id} className="bg-muted/50 p-4 rounded-lg" data-testid={`audit-log-${log.id}`}>
                    <div className="flex items-start justify-between gap-1 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">{log.actor_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.action?.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm mb-1">
                          {log.resource_type}: <strong>{log.resource_name}</strong>
                        </p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground">{log.details}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(log.created_date)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showInviteClientDialog} onOpenChange={setShowInviteClientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New Client</DialogTitle>
            <DialogDescription>
              Send an invitation to join the client portal
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-sm">
                <strong>Client Portal Access:</strong> This invitation grants access to the client portal where they can view their projects, documents, and communications.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Client Email</label>
              <Input
                type="email"
                value={clientInviteEmail}
                onChange={(e) => setClientInviteEmail(e.target.value)}
                placeholder="client@example.com"
                data-testid="input-client-email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={clientCompanyName}
                onChange={(e) => setClientCompanyName(e.target.value)}
                placeholder="Company Inc."
                data-testid="input-client-company"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowInviteClientDialog(false)} data-testid="button-cancel-client-invite">
                Cancel
              </Button>
              <Button
                onClick={() => inviteClientMutation.mutate({ email: clientInviteEmail, companyName: clientCompanyName })}
                disabled={inviteClientMutation.isPending || !clientInviteEmail || !clientCompanyName}
                data-testid="button-send-client-invite"
              >
                {inviteClientMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                ) : (
                  <><Mail className="w-4 h-4 mr-2" />Send Client Invitation</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to join the internal portal
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="John Doe"
                data-testid="input-invite-name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="john@example.com"
                data-testid="input-invite-email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger data-testid="select-invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin - Full Access</SelectItem>
                  <SelectItem value="user">User - Limited Access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)} data-testid="button-cancel-invite">
                Cancel
              </Button>
              <Button
                onClick={() => inviteUserMutation.mutate({ email: inviteEmail, name: inviteName, role: inviteRole })}
                disabled={inviteUserMutation.isPending || !inviteEmail || !inviteName}
                data-testid="button-send-invite"
              >
                {inviteUserMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                ) : (
                  <><Mail className="w-4 h-4 mr-2" />Send Invitation</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke User Access</DialogTitle>
            <DialogDescription>
              This will immediately revoke access for {revokeUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          {revokeUser && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-400">Warning: This action is immediate</p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      The user will be logged out and will not be able to access the portal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Revocation</label>
                <Textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Enter reason for audit trail..."
                  data-testid="input-revoke-reason"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowRevokeDialog(false)} data-testid="button-cancel-revoke">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => revokeAccessMutation.mutate({ userId: revokeUser.id, reason: revokeReason })}
                  disabled={revokeAccessMutation.isPending || !revokeReason.trim()}
                  data-testid="button-confirm-revoke"
                >
                  {revokeAccessMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Revoking...</>
                  ) : (
                    <><UserX className="w-4 h-4 mr-2" />Revoke Access</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Configure role for {editingUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Role</label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger data-testid="select-edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full Access (All Permissions)</SelectItem>
                    <SelectItem value="user">User - Custom Permissions</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Admin role automatically grants all permissions.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEditDialog(false)} data-testid="button-cancel-edit">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    updateUserMutation.mutate({ 
                      userId: editingUser.id, 
                      updates: { role: editingUser.role } 
                    });
                  }}
                  disabled={updateUserMutation.isPending}
                  data-testid="button-save-edit"
                >
                  {updateUserMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4 mr-2" />Save Changes</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}