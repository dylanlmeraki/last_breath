import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Mail, Lock, User, Building2, CheckCircle2, XCircle, Minus } from "lucide-react";

const logoPath = "/Logo.jpeg";

const registerSchema = z
  .object({
    full_name: z.string().min(2, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    company_name: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.acceptTerms === true, {
    message: "You must accept the terms to continue",
    path: ["acceptTerms"],
  });

function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(() => {
    return [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Lowercase letter", met: /[a-z]/.test(password) },
      { label: "Number", met: /[0-9]/.test(password) },
    ];
  }, [password]);

  const strength = checks.filter((c) => c.met).length;

  const strengthLabel = strength === 0 ? "" : strength <= 1 ? "Weak" : strength <= 2 ? "Fair" : strength <= 3 ? "Good" : "Strong";
  const strengthColor =
    strength <= 1
      ? "bg-red-500"
      : strength <= 2
        ? "bg-amber-500"
        : strength <= 3
          ? "bg-blue-500"
          : "bg-green-500";

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2" data-testid="password-strength">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : "bg-muted"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground" data-testid="text-strength-label">
          {strengthLabel}
        </span>
      </div>
      <ul className="space-y-1">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-1.5 text-xs">
            {check.met ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : password.length > 0 ? (
              <XCircle className="h-3 w-3 text-muted-foreground" />
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={check.met ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PortalRegister() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const [inviteData, setInviteData] = useState<{ email: string; company_name: string } | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [validating, setValidating] = useState(!!token);
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      company_name: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const watchPassword = form.watch("password");

  useEffect(() => {
    if (token) {
      setValidating(true);
      fetch(`/api/client-invites/validate/${token}`, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error("This invite link is invalid or has expired. Please contact your project manager for a new invitation."))))
        .then((data) => {
          setInviteData(data);
          form.setValue("email", data.email);
          if (data.company_name) {
            form.setValue("company_name", data.company_name);
          }
        })
        .catch((err) => setInviteError(err.message))
        .finally(() => setValidating(false));
    }
  }, [token]);

  const handleRegister = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(
      {
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        invite_token: token || "",
      } as any,
      {
        onSuccess: () => navigate(basePath + "/dashboard", { replace: true }),
        onError: (e: any) =>
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: e.message || "Unable to create your account. Please try again or contact support.",
          }),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 dark:bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logoPath}
            alt="Pacific Engineering Construction"
            className="h-14 w-14 rounded-md object-cover"
            data-testid="img-logo"
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold" data-testid="text-brand-name">
              Pacific Engineering
            </h1>
            <p className="text-sm text-muted-foreground">Client Portal</p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center gap-1">
            <CardTitle className="text-xl" data-testid="text-register-title">
              Create your account
            </CardTitle>
            <CardDescription>
              {inviteData
                ? `You've been invited to join ${inviteData.company_name || "Pacific Engineering"}`
                : "Set up your client portal access"}
            </CardDescription>
            {inviteData && (
              <div className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md bg-green-50 dark:bg-green-900/20 px-3 py-1.5 text-xs text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                <span data-testid="text-invite-verified">Invite verified for {inviteData.email}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {validating ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground" data-testid="text-validating">
                  Validating your invitation...
                </span>
              </div>
            ) : inviteError ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <AlertTriangle className="h-10 w-10 text-destructive" />
                <p className="text-sm text-destructive font-medium text-center" data-testid="text-invite-error">
                  {inviteError}
                </p>
                <Link
                  to={basePath + "/auth"}
                  className="text-sm text-primary hover:underline mt-2"
                  data-testid="link-back-login"
                >
                  Back to sign in
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Your full name"
                              className="pl-9"
                              data-testid="input-full-name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              {...field}
                              disabled={!!inviteData}
                              placeholder="you@company.com"
                              className="pl-9"
                              data-testid="input-email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              disabled={!!inviteData?.company_name}
                              placeholder="Your company"
                              className="pl-9"
                              data-testid="input-company-name"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              {...field}
                              placeholder="Create a password"
                              className="pl-9"
                              data-testid="input-password"
                            />
                          </div>
                        </FormControl>
                        <PasswordStrength password={watchPassword} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              {...field}
                              placeholder="Confirm your password"
                              className="pl-9"
                              data-testid="input-confirm"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-terms"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            I agree to the{" "}
                            <span className="text-primary underline">Terms of Service</span>{" "}
                            and{" "}
                            <span className="text-primary underline">Privacy Policy</span>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {registerMutation.isError && (
                    <p className="text-sm text-destructive" data-testid="text-register-error">
                      {(registerMutation.error as any)?.message || "Registration failed. Please try again."}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          {!inviteError && (
            <CardFooter className="justify-center flex-wrap gap-1">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={basePath + "/auth"}
                  className="text-primary hover:underline font-medium"
                  data-testid="link-login"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>

        <p className="text-xs text-center text-muted-foreground" data-testid="text-copyright">
          Pacific Engineering &amp; Construction SF Inc.
        </p>
      </div>
    </div>
  );
}
