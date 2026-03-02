import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import InternalLayout from "./layout/InternalLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/use-auth";

function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "admin") return <Navigate to="dashboard" replace />;
  return <>{children}</>;
}

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
const AdminConsole = lazy(() => import("./pages/AdminConsole"));
const ClientCommunications = lazy(() => import("./pages/ClientCommunications"));
const ClientInvites = lazy(() => import("./pages/ClientInvites"));
const EmailTemplates = lazy(() => import("./pages/EmailTemplates"));
const SalesBotControl = lazy(() => import("./pages/SalesBotControl"));
const PageBuilder = lazy(() => import("./pages/PageBuilder"));
const SEOAssistant = lazy(() => import("./pages/SEOAssistant"));
const ContentManager = lazy(() => import("./pages/ContentManager"));
const Communications = lazy(() => import("./pages/Communications"));
const CRMSearch = lazy(() => import("./pages/CRMSearch"));
const OutreachQueue = lazy(() => import("./pages/OutreachQueue"));
const FormSubmissions = lazy(() => import("./pages/FormSubmissions"));
const ICPSettings = lazy(() => import("./pages/ICPSettings"));
const ProjectRequests = lazy(() => import("./pages/ProjectRequests"));
const WebsiteMonitoring = lazy(() => import("./pages/WebsiteMonitoring"));
const ProjectDashboard = lazy(() => import("./pages/ProjectDashboard"));
const QAQC = lazy(() => import("./pages/QAQC"));
const SequenceOptimization = lazy(() => import("./pages/SequenceOptimization"));
const TemplateBuilder = lazy(() => import("./pages/TemplateBuilder"));
const PDFGenerator = lazy(() => import("./pages/PDFGenerator"));
const AISalesAssistant = lazy(() => import("./pages/AISalesAssistant"));
const AdminEmailSettings = lazy(() => import("./pages/AdminEmailSettings"));
const ProjectsManager = lazy(() => import("./pages/ProjectsManager"));
const ClientRFIs = lazy(() => import("./pages/ClientRFIs"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

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
                    <Route path="project-dashboard" element={<ProjectDashboard />} />
                    <Route path="projects-manager" element={<ProjectsManager />} />
                    <Route path="project-requests" element={<ProjectRequests />} />
                    <Route path="contacts" element={<ContactManager />} />
                    <Route path="sales" element={<SalesDashboard />} />
                    <Route path="crm-search" element={<CRMSearch />} />
                    <Route path="proposals" element={<ProposalDashboard />} />
                    <Route path="invoices" element={<InvoiceManagement />} />
                    <Route path="rfis" element={<RFIs />} />
                    <Route path="client-rfis" element={<ClientRFIs />} />
                    <Route path="doc-approval" element={<DocApproval />} />
                    <Route path="blog" element={<BlogEditor />} />
                    <Route path="content" element={<ContentManager />} />
                    <Route path="page-builder" element={<PageBuilder />} />
                    <Route path="seo" element={<SEOAssistant />} />
                    <Route path="template-builder" element={<TemplateBuilder />} />
                    <Route path="pdf-generator" element={<PDFGenerator />} />
                    <Route path="outreach" element={<OutreachQueue />} />
                    <Route path="email-sequences" element={<EmailSequences />} />
                    <Route path="sequence-optimization" element={<SequenceOptimization />} />
                    <Route path="sales-bot" element={<SalesBotControl />} />
                    <Route path="ai-sales" element={<AISalesAssistant />} />
                    <Route path="workflows" element={<WorkflowBuilder />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="communications" element={<Communications />} />
                    <Route path="client-communications" element={<ClientCommunications />} />
                    <Route path="email-templates" element={<EmailTemplates />} />
                    <Route path="users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                    <Route path="client-invites" element={<AdminRoute><ClientInvites /></AdminRoute>} />
                    <Route path="admin" element={<AdminRoute><AdminConsole /></AdminRoute>} />
                    <Route path="form-submissions" element={<FormSubmissions />} />
                    <Route path="email-settings" element={<AdminRoute><AdminEmailSettings /></AdminRoute>} />
                    <Route path="icp-settings" element={<AdminRoute><ICPSettings /></AdminRoute>} />
                    <Route path="monitoring" element={<WebsiteMonitoring />} />
                    <Route path="qaqc" element={<QAQC />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
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
