import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2, AlertTriangle } from "lucide-react";

const registerSchema = z.object({
  full_name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

export default function PortalRegister() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const [inviteData, setInviteData] = useState<{ email: string; company_name: string } | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (token) {
      fetch(`/api/client-invites/validate/${token}`, { credentials: "include" })
        .then((res) => res.ok ? res.json() : Promise.reject(new Error("Invalid or expired invite")))
        .then((data) => { setInviteData(data); form.setValue("email", data.email); })
        .catch((err) => setInviteError(err.message));
    }
  }, [token]);

  const handleRegister = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(
      { email: values.email, password: values.password, full_name: values.full_name, role: "client" },
      {
        onSuccess: () => navigate(basePath + "/dashboard", { replace: true }),
        onError: (e: any) => toast({ variant: "destructive", title: "Registration failed", description: e.message }),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Client Registration</CardTitle>
          <CardDescription>
            {inviteData ? `Join ${inviteData.company_name || "Pacific Engineering"}` : "Create your client portal account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inviteError ? (
            <div className="text-center py-4">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive font-medium">{inviteError}</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                <FormField control={form.control} name="full_name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} data-testid="input-full-name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={!!inviteData} data-testid="input-email" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} data-testid="input-password" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} data-testid="input-confirm" /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={registerMutation.isPending} data-testid="button-register">
                  {registerMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
