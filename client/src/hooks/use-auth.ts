import { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  account_type: string | null;
  company_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  department: string | null;
  title: string | null;
  email_verified: boolean | null;
  twofa_enabled: boolean | null;
  status: string | null;
  permissions: any;
  notification_preferences: any;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInternalUser: boolean;
  isClient: boolean;
  loginMutation: ReturnType<typeof useMutation>;
  registerMutation: ReturnType<typeof useMutation>;
  logoutMutation: ReturnType<typeof useMutation>;
  verify2faMutation: ReturnType<typeof useMutation>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function useAuthProvider() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: Infinity,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.requires_2fa) {
        return;
      }
      queryClient.setQueryData(["/api/auth/me"], data);
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; full_name: string; invite_token: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
    onSuccess: (userData: AuthUser) => {
      queryClient.setQueryData(["/api/auth/me"], userData);
      queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
    },
  });

  const verify2faMutation = useMutation({
    mutationFn: async (params: { code: string; type?: "totp" | "backup" }) => {
      const endpoint = params.type === "backup" ? "/api/auth/verify-backup-code" : "/api/auth/verify-2fa";
      const res = await apiRequest("POST", endpoint, { code: params.code });
      return res.json();
    },
    onSuccess: (userData: AuthUser) => {
      queryClient.setQueryData(["/api/auth/me"], userData);
      queryClient.invalidateQueries();
    },
  });

  const currentUser = user ?? null;

  return {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
    isInternalUser: currentUser?.account_type === "internal",
    isClient: currentUser?.account_type === "client",
    loginMutation,
    registerMutation,
    logoutMutation,
    verify2faMutation,
  };
}
