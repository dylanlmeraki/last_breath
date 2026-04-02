import * as React from "react";
import { lazy, Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./portals/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AuthContext, useAuthProvider } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const InternalApp = lazy(() => import("@/portals/internal/InternalApp"));
const ClientApp = lazy(() => import("@/portals/client/ClientApp"));
const MarketingApp = lazy(() => import("@/portals/marketing/MarketingApp"));

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading Pacific Engineering...</p>
      </div>
    </div>
  );
}

type PortalMode = "internal" | "client" | "marketing" | "route-prefix";

function detectPortal(): PortalMode {
  const hostname = window.location.hostname;
  if (hostname.startsWith("internal.")) return "internal";
  if (hostname.startsWith("portal.")) return "client";
  if (!hostname.includes(".replit") && !hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
    return "marketing";
  }
  return "route-prefix";
}

function AppRouter() {
  const portalMode = useMemo(() => detectPortal(), []);

  if (portalMode === "internal") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route
            path="/*"
            element={
              <AuthProviderBoundary>
                <InternalApp />
              </AuthProviderBoundary>
            }
          />
        </Routes>
      </Suspense>
    );
  }

  if (portalMode === "client") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route
            path="/*"
            element={
              <AuthProviderBoundary>
                <ClientApp />
              </AuthProviderBoundary>
            }
          />
        </Routes>
      </Suspense>
    );
  }

  if (portalMode === "marketing") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/*" element={<MarketingApp />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          path="/internal/*"
          element={
            <AuthProviderBoundary>
              <InternalApp />
            </AuthProviderBoundary>
          }
        />
        <Route
          path="/portal/*"
          element={
            <AuthProviderBoundary>
              <ClientApp />
            </AuthProviderBoundary>
          }
        />
        <Route path="/*" element={<MarketingApp />} />
      </Routes>
    </Suspense>
  );
}

function AuthProviderBoundary({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <AppRouter />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
