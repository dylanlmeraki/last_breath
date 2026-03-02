import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import InternalLayout from "./layout/InternalLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";

const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectManager = lazy(() => import("./pages/ProjectManager"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ContactManager = lazy(() => import("./pages/ContactManager"));
const SalesDashboard = lazy(() => import("./pages/SalesDashboard"));
const ProposalDashboard = lazy(() => import("./pages/ProposalDashboard"));
const InvoiceManagement = lazy(() => import("./pages/InvoiceManagement"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const RFIs = lazy(() => import("./pages/RFIs"));
const WorkflowBuilder = lazy(() => import("./pages/WorkflowBuilder"));
const EmailSequences = lazy(() => import("./pages/EmailSequences"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const DocApproval = lazy(() => import("./pages/DocApproval"));
const GenericPage = lazy(() => import("./pages/GenericPage"));

function Fallback() {
  return <PageSkeleton />;
}

export default function InternalApp() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route
          path="*"
          element={
            <ProtectedRoute loginPath="auth">
              <InternalLayout>
                <Suspense fallback={<Fallback />}>
                  <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="projects" element={<ProjectManager />} />
                    <Route path="projects/:id" element={<ProjectDetail />} />
                    <Route path="contacts" element={<ContactManager />} />
                    <Route path="sales" element={<SalesDashboard />} />
                    <Route path="proposals" element={<ProposalDashboard />} />
                    <Route path="invoices" element={<InvoiceManagement />} />
                    <Route path="blog" element={<BlogEditor />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="rfis" element={<RFIs />} />
                    <Route path="workflows" element={<WorkflowBuilder />} />
                    <Route path="email-sequences" element={<EmailSequences />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="doc-approval" element={<DocApproval />} />
                    <Route path="outreach" element={<GenericPage title="Outreach Queue" description="Manage your sales outreach queue" icon="Send" />} />
                    <Route path="content" element={<GenericPage title="Content Manager" description="Manage website content" icon="Layers" />} />
                    <Route path="page-builder" element={<GenericPage title="Page Builder" description="Build custom landing pages" icon="Palette" />} />
                    <Route path="seo" element={<GenericPage title="SEO Assistant" description="Optimize your search engine presence" icon="Search" />} />
                    <Route path="client-invites" element={<GenericPage title="Client Invites" description="Manage client portal invitations" icon="UserPlus" />} />
                    <Route path="admin" element={<GenericPage title="Admin Console" description="System administration and configuration" icon="Shield" />} />
                    <Route path="form-submissions" element={<GenericPage title="Form Submissions" description="View submissions from the marketing website" icon="InboxIcon" />} />
                    <Route path="email-settings" element={<GenericPage title="Email Settings" description="Configure email notification preferences" icon="Settings" />} />
                    <Route path="icp-settings" element={<GenericPage title="ICP Settings" description="Define your ideal customer profiles" icon="Building2" />} />
                    <Route path="calendar-settings" element={<GenericPage title="Calendar Settings" description="Configure calendar integrations" icon="Calendar" />} />
                    <Route path="monitoring" element={<GenericPage title="Website Monitoring" description="Monitor your website performance" icon="Monitor" />} />
                    <Route path="project-requests" element={<GenericPage title="Project Requests" description="Review incoming project requests from clients" icon="ClipboardList" />} />
                    <Route path="profile" element={<GenericPage title="Profile" description="Manage your account settings" icon="User" />} />
                    <Route path="*" element={<GenericPage title="Page Not Found" description="The page you're looking for doesn't exist" icon="AlertTriangle" />} />
                  </Routes>
                </Suspense>
              </InternalLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
