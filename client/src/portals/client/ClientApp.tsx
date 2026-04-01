import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "./layout/ClientLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";

const ClientAuth = lazy(() => import("./pages/ClientAuth"));
const PortalRegister = lazy(() => import("./pages/PortalRegister"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const ClientProjects = lazy(() => import("./pages/ClientProjects"));
const ClientDocuments = lazy(() => import("./pages/ClientDocuments"));
const ClientProposals = lazy(() => import("./pages/ClientProposals"));
const ClientInvoices = lazy(() => import("./pages/ClientInvoices"));
const ClientMessages = lazy(() => import("./pages/ClientMessages"));
const ClientReports = lazy(() => import("./pages/ClientReports"));
const ClientRFIs = lazy(() => import("./pages/ClientRFIs"));
const ClientSettings = lazy(() => import("./pages/ClientSettings"));

function Fallback() { return <PageSkeleton />; }

export default function ClientApp() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="auth" element={<ClientAuth />} />
        <Route path="register" element={<PortalRegister />} />
        <Route path="register/:token" element={<PortalRegister />} />
        <Route
          path="*"
          element={
            <ProtectedRoute loginPath="auth">
              <ClientLayout>
                <Suspense fallback={<Fallback />}>
                  <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="projects" element={<ClientProjects />} />
                    <Route path="projects/:id" element={<ClientProjects />} />
                    <Route path="documents" element={<ClientDocuments />} />
                    <Route path="proposals" element={<ClientProposals />} />
                    <Route path="invoices" element={<ClientInvoices />} />
                    <Route path="messages" element={<ClientMessages />} />
                    <Route path="reports" element={<ClientReports />} />
                    <Route path="rfis" element={<ClientRFIs />} />
                    <Route path="settings" element={<ClientSettings />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </Suspense>
              </ClientLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
