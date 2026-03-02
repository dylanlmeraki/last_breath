import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Shield, Key } from "lucide-react";

export default function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    full_name: user?.full_name || "",
    department: user?.department || "",
    title: user?.title || "",
    phone: user?.phone || "",
  });

  const [twoFaStep, setTwoFaStep] = useState<"idle" | "setup" | "verify">("idle");
  const [qrCode, setQrCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  const saveMutation = useMutation({
    mutationFn: async (data: typeof profile) => {
      const res = await apiRequest("PUT", "/api/auth/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profile updated" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const setup2faMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/setup-2fa");
      return res.json();
    },
    onSuccess: (data: any) => {
      setQrCode(data.qr_code || data.otpauth_url || "");
      setTwoFaStep("verify");
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const verify2faMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/auth/confirm-2fa", { code });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setTwoFaStep("idle");
      setVerifyCode("");
      toast({ title: "Two-factor authentication enabled" });
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Invalid code", description: e.message }),
  });

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your account settings and security preferences" />

      <div className="max-w-2xl">
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile" data-testid="tab-profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    data-testid="input-full-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled className="bg-muted" data-testid="input-email" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    placeholder="Engineering, Sales, etc."
                    data-testid="input-department"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="Project Manager, Engineer, etc."
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    data-testid="input-phone"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={() => saveMutation.mutate(profile)} disabled={saveMutation.isPending} data-testid="button-save-profile">
                    {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Two-Factor Authentication</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {user?.twofa_enabled ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">2FA is enabled</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Your account is protected with two-factor authentication.</p>
                    </div>
                  </div>
                ) : twoFaStep === "idle" ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security by enabling two-factor authentication using an authenticator app.</p>
                    <Button onClick={() => setup2faMutation.mutate()} disabled={setup2faMutation.isPending} data-testid="button-setup-2fa">
                      {setup2faMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                      Set Up 2FA
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Scan this QR code with your authenticator app, then enter the verification code below.</p>
                    {qrCode && (
                      <div className="flex justify-center p-4 bg-white rounded-lg">
                        <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" data-testid="img-qr-code" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Verification Code</Label>
                      <Input
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        data-testid="input-2fa-code"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => verify2faMutation.mutate(verifyCode)} disabled={verify2faMutation.isPending || verifyCode.length < 6} data-testid="button-verify-2fa">
                        {verify2faMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Verify & Enable
                      </Button>
                      <Button variant="outline" onClick={() => setTwoFaStep("idle")} data-testid="button-cancel-2fa">Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
