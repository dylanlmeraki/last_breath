import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const logoPath = "/Logo.jpeg";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ClientAuth() {
  const { loginMutation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [view, setView] = useState<"login" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";
  const from = (location.state as any)?.from?.pathname || basePath + "/dashboard";

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => navigate(from, { replace: true }),
      onError: (e: any) =>
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: e.message || "Invalid email or password. Please try again.",
        }),
    });
  };

  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setResetLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", { email: values.email });
      setResetSent(true);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: e.message || "Unable to send reset link. Please try again.",
      });
    } finally {
      setResetLoading(false);
    }
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

        {view === "login" && (
          <Card>
            <CardHeader className="text-center gap-1">
              <CardTitle className="text-xl" data-testid="text-auth-title">
                Welcome back
              </CardTitle>
              <CardDescription>Sign in to access your projects and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="you@company.com"
                              className="pl-9"
                              {...field}
                              data-testid="input-email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <FormLabel>Password</FormLabel>
                          <button
                            type="button"
                            onClick={() => setView("forgot")}
                            className="text-xs text-primary hover:underline"
                            data-testid="link-forgot-password"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              className="pl-9"
                              {...field}
                              data-testid="input-password"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {loginMutation.isError && (
                    <p className="text-sm text-destructive" data-testid="text-login-error">
                      {(loginMutation.error as any)?.message || "Invalid credentials. Please try again."}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                    data-testid="button-login"
                  >
                    {loginMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="justify-center flex-wrap gap-1">
              <p className="text-sm text-muted-foreground">
                Have an invite?{" "}
                <Link
                  to={basePath + "/register"}
                  className="text-primary hover:underline font-medium"
                  data-testid="link-register"
                >
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}

        {view === "forgot" && (
          <Card>
            <CardHeader className="text-center gap-1">
              <CardTitle className="text-xl" data-testid="text-forgot-title">
                {resetSent ? "Check your email" : "Reset your password"}
              </CardTitle>
              <CardDescription>
                {resetSent
                  ? "If an account exists with that email, we've sent a password reset link."
                  : "Enter your email and we'll send you a link to reset your password."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resetSent ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500" data-testid="icon-reset-sent" />
                  <p className="text-sm text-muted-foreground text-center" data-testid="text-reset-confirmation">
                    The link will expire in 1 hour. Be sure to check your spam folder.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setView("login");
                      setResetSent(false);
                      forgotForm.reset();
                    }}
                    data-testid="button-back-to-login"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to sign in
                  </Button>
                </div>
              ) : (
                <Form {...forgotForm}>
                  <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                    <FormField
                      control={forgotForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="email"
                                placeholder="you@company.com"
                                className="pl-9"
                                {...field}
                                data-testid="input-reset-email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={resetLoading}
                      data-testid="button-send-reset"
                    >
                      {resetLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Send Reset Link
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            {!resetSent && (
              <CardFooter className="justify-center flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  data-testid="button-back-login"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to sign in
                </button>
              </CardFooter>
            )}
          </Card>
        )}

        <p className="text-xs text-center text-muted-foreground" data-testid="text-copyright">
          Pacific Engineering &amp; Construction SF Inc.
        </p>
      </div>
    </div>
  );
}
