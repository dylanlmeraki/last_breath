import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function ClientAuth() {
  const { loginMutation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";
  const from = (location.state as any)?.from?.pathname || basePath + "/dashboard";

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => navigate(from, { replace: true }),
      onError: (e: any) => toast({ variant: "destructive", title: "Login failed", description: e.message }),
    });
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
          <CardTitle className="text-2xl" data-testid="text-auth-title">Client Portal</CardTitle>
          <CardDescription>Pacific Engineering Construction</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@company.com" {...field} data-testid="input-email" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Enter your password" {...field} data-testid="input-password" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-login">
                {loginMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Have an invite?{" "}
            <Link to={basePath + "/register"} className="text-primary hover:underline" data-testid="link-register">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
